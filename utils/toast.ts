import * as mod from '@/sonner';
const rawToast = mod.toast as any;

type AnyRecord = Record<string, any>;

// Queue pending toast calls if Toaster isn't ready yet
const _queue: Array<{ method: string; args: any[] }> = [];
let _flushTimer: NodeJS.Timeout | null = null;

const METHODS_WITH_ACTION = new Set([
  'message',
  'success',
  'error',
  'warning',
  'info',
  'loading',
]);

function applyDefaults(method: string, incomingArgs: any[]): { args: any[]; getIdRef?: (id: any) => void } {
  // Add a per-toast Cancel/Dismiss button by default and support a "header" option
  try {
    if (!METHODS_WITH_ACTION.has(method)) {
      return { args: incomingArgs };
    }

    if (!incomingArgs || incomingArgs.length === 0) {
      return { args: incomingArgs };
    }

    const first = incomingArgs[0];
    // Only enhance simple (title, options) signatures. Do not alter custom renderers
    if (typeof first !== 'string') {
      return { args: incomingArgs };
    }

    const originalOptions: AnyRecord = (incomingArgs[1] && typeof incomingArgs[1] === 'object') ? (incomingArgs[1] as AnyRecord) : {};

    // Header support: if "header" is provided, use it as the title and move the original title to description (if not already set)
    let title = first as string;
    const header = originalOptions.header as string | undefined;
    const description = originalOptions.description as string | undefined;
    if (header && !description) {
      // Move current title to description and use header as the main title
      originalOptions.description = title;
      title = header;
      // cleanup header so unknown libs don't warn
      delete originalOptions.header;
    }

    // Build a cancel action that dismisses ONLY this toast
    let idRef: any = originalOptions.id;
    const dismissThis = () => {
      try {
        if (rawToast && typeof rawToast.dismiss === 'function') {
          rawToast.dismiss(idRef);
        }
      } catch { /* ignore */ }
    };

    const cancelLabel = originalOptions.cancelLabel || 'Cancel';
    const userAction = originalOptions.action;
    const action = userAction || { label: cancelLabel, onPress: dismissThis, onClick: dismissThis };
    // Remove our custom-only option key to avoid passing unknown prop
    delete originalOptions.cancelLabel;

    const enhancedOptions = { ...originalOptions, action };
    const enhancedArgs = [title, enhancedOptions];
    return { args: enhancedArgs, getIdRef: (id: any) => { idRef = id; } };
  } catch {
    return { args: incomingArgs };
  }
}

function tryFlushQueue() {
  if (_queue.length === 0) return;
  if (!_flushTimer) {
    _flushTimer = setInterval(() => {
      if (_queue.length === 0) {
        if (_flushTimer) { clearInterval(_flushTimer); _flushTimer = null; }
        return;
      }

      // Attempt to call each queued toast
      for (let i = 0; i < _queue.length; ) {
        const item = _queue[i];
        const fn = rawToast && (rawToast as any)[item.method];
        if (typeof fn === 'function') {
          try {
            fn(...item.args);
            // remove item
            _queue.splice(i, 1);
            continue; // don't increment i
          } catch (e) {
            // If it still fails, keep it in queue for next try
            i++;
          }
        } else {
          // Can't call - drop it
          _queue.splice(i, 1);
        }
      }

      if (_queue.length === 0 && _flushTimer) {
        clearInterval(_flushTimer);
        _flushTimer = null;
      }
    }, 500);
  }
}

export const toast = new Proxy(rawToast, {
  get(target, prop) {
    if (typeof target[prop] === 'function') {
      return (...incoming: any[]) => {
        const method = String(prop);
        try {
          const { args, getIdRef } = applyDefaults(method, incoming);
          const id = target[prop](...args);
          if (getIdRef) getIdRef(id);
          return id;
        } catch (e) {
          // If Toaster not initialized yet, queue the call so it will show once Toaster mounts
          try {
            const { args } = applyDefaults(method, incoming);
            _queue.push({ method, args });
            tryFlushQueue();
          } catch (queueErr) {
            // eslint-disable-next-line no-console
            console.warn('Toast not ready, queued call failed:', method, incoming, queueErr);
          }
        }
      };
    }
    return target[prop];
  }
});

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';
export default toast;
