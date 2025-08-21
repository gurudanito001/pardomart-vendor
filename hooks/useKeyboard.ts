import { useState, useEffect, useRef } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

interface KeyboardInfo {
  isVisible: boolean;
  height: number;
  duration: number;
  easing: string;
}

/**
 * Hook to track keyboard visibility and height
 * @returns Object with keyboard information and utilities
 */
export function useKeyboard() {
  const [keyboardInfo, setKeyboardInfo] = useState<KeyboardInfo>({
    isVisible: false,
    height: 0,
    duration: 0,
    easing: '',
  });

  const keyboardShowListener = useRef<any>();
  const keyboardHideListener = useRef<any>();

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onKeyboardShow = (event: KeyboardEvent) => {
      setKeyboardInfo({
        isVisible: true,
        height: event.endCoordinates.height,
        duration: event.duration,
        easing: event.easing || '',
      });
    };

    const onKeyboardHide = (event: KeyboardEvent) => {
      setKeyboardInfo({
        isVisible: false,
        height: 0,
        duration: event.duration,
        easing: event.easing || '',
      });
    };

    keyboardShowListener.current = Keyboard.addListener(showEvent, onKeyboardShow);
    keyboardHideListener.current = Keyboard.addListener(hideEvent, onKeyboardHide);

    return () => {
      keyboardShowListener.current?.remove();
      keyboardHideListener.current?.remove();
    };
  }, []);

  const dismiss = () => {
    Keyboard.dismiss();
  };

  return {
    ...keyboardInfo,
    dismiss,
  };
}

/**
 * Hook to handle keyboard-aware scrolling
 * @param extraScrollHeight Additional height to scroll beyond the focused input
 * @returns Object with scroll utilities
 */
export function useKeyboardAwareScroll(extraScrollHeight: number = 0) {
  const scrollViewRef = useRef<any>(null);
  const { isVisible, height } = useKeyboard();

  const scrollToInput = (inputRef: any) => {
    if (scrollViewRef.current && inputRef?.current && isVisible) {
      inputRef.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
        const scrollY = pageY - height + extraScrollHeight;
        scrollViewRef.current.scrollTo({ y: Math.max(0, scrollY), animated: true });
      });
    }
  };

  const scrollToBottom = () => {
    if (scrollViewRef.current && isVisible) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  return {
    scrollViewRef,
    scrollToInput,
    scrollToBottom,
    keyboardHeight: height,
    isKeyboardVisible: isVisible,
  };
}

/**
 * Hook to adjust view padding based on keyboard visibility
 * @param defaultPadding Default padding when keyboard is hidden
 * @returns Current padding value
 */
export function useKeyboardPadding(defaultPadding: number = 0) {
  const { isVisible, height } = useKeyboard();
  
  return isVisible ? height : defaultPadding;
}

/**
 * Hook to handle keyboard avoiding behavior
 * @param enabled Whether keyboard avoiding is enabled
 * @returns Object with keyboard avoiding utilities
 */
export function useKeyboardAvoidance(enabled: boolean = true) {
  const { isVisible, height, duration } = useKeyboard();
  const [bottomPadding, setBottomPadding] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    if (isVisible) {
      setBottomPadding(height);
    } else {
      setBottomPadding(0);
    }
  }, [isVisible, height, enabled]);

  return {
    bottomPadding,
    isKeyboardVisible: isVisible,
    keyboardHeight: height,
    animationDuration: duration,
  };
}

/**
 * Hook to track which input is currently focused
 * @returns Object with focus utilities
 */
export function useInputFocus() {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const inputRefs = useRef<Record<string, any>>({});

  const registerInput = (name: string, ref: any) => {
    inputRefs.current[name] = ref;
  };

  const focusInput = (name: string) => {
    const inputRef = inputRefs.current[name];
    if (inputRef?.current) {
      inputRef.current.focus();
      setFocusedInput(name);
    }
  };

  const blurInput = (name: string) => {
    const inputRef = inputRefs.current[name];
    if (inputRef?.current) {
      inputRef.current.blur();
      if (focusedInput === name) {
        setFocusedInput(null);
      }
    }
  };

  const blurAll = () => {
    Object.values(inputRefs.current).forEach(ref => {
      if (ref?.current) {
        ref.current.blur();
      }
    });
    setFocusedInput(null);
    Keyboard.dismiss();
  };

  const nextInput = () => {
    const inputNames = Object.keys(inputRefs.current);
    const currentIndex = focusedInput ? inputNames.indexOf(focusedInput) : -1;
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < inputNames.length) {
      focusInput(inputNames[nextIndex]);
    } else {
      blurAll();
    }
  };

  const previousInput = () => {
    const inputNames = Object.keys(inputRefs.current);
    const currentIndex = focusedInput ? inputNames.indexOf(focusedInput) : -1;
    const previousIndex = currentIndex - 1;
    
    if (previousIndex >= 0) {
      focusInput(inputNames[previousIndex]);
    }
  };

  return {
    focusedInput,
    registerInput,
    focusInput,
    blurInput,
    blurAll,
    nextInput,
    previousInput,
  };
}

/**
 * Hook for handling keyboard shortcuts (useful for development/testing)
 * @param shortcuts Object mapping key combinations to callbacks
 */
export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const modifiers = [];
      
      if (event.ctrlKey) modifiers.push('ctrl');
      if (event.altKey) modifiers.push('alt');
      if (event.shiftKey) modifiers.push('shift');
      if (event.metaKey) modifiers.push('meta');
      
      const combination = [...modifiers, key].join('+');
      
      if (shortcuts[combination]) {
        event.preventDefault();
        shortcuts[combination]();
      }
    };

    // Only works on web platform
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', handleKeyDown as any);
      return () => document.removeEventListener('keydown', handleKeyDown as any);
    }
  }, [shortcuts]);
}

/**
 * Hook to detect if keyboard is opening or closing
 * @returns Object with transition states
 */
export function useKeyboardTransition() {
  const [isOpening, setIsOpening] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const previousHeight = useRef(0);
  const { height, isVisible } = useKeyboard();

  useEffect(() => {
    if (height > previousHeight.current) {
      setIsOpening(true);
      setIsClosing(false);
      
      // Reset opening state after animation
      const timer = setTimeout(() => setIsOpening(false), 300);
      return () => clearTimeout(timer);
    } else if (height < previousHeight.current) {
      setIsClosing(true);
      setIsOpening(false);
      
      // Reset closing state after animation
      const timer = setTimeout(() => setIsClosing(false), 300);
      return () => clearTimeout(timer);
    }
    
    previousHeight.current = height;
  }, [height]);

  return {
    isOpening,
    isClosing,
    isTransitioning: isOpening || isClosing,
    isVisible,
    height,
  };
}
