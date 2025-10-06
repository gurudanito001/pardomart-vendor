
import * as mod from 'sonner-native';
const rawToast = mod.toast as any;

export const toast = new Proxy(rawToast, {
	get(target, prop) {
		if (typeof target[prop] === 'function') {
			return (...args: any[]) => {
				try {
					return target[prop](...args);
				} catch (e) {
					// Silently ignore if ToastContext is not initialized
				}
			};
		}
		return target[prop];
	}
});

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';
export default toast;
