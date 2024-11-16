"use client";

import { useEffect, useCallback, useRef } from 'react';

interface UseFocusTrapOptions {
  initialFocus?: boolean;
  returnFocus?: boolean;
  escapeDeactivates?: boolean;
  onEscape?: () => void;
}

export function useFocusTrap(
  ref: React.RefObject<HTMLElement>,
  isActive: boolean = true,
  options: UseFocusTrapOptions = {}
) {
  const {
    initialFocus = true,
    returnFocus = true,
    escapeDeactivates = true,
    onEscape,
  } = options;

  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!ref.current) return [];
    
    return Array.from(
      ref.current.querySelectorAll<HTMLElement>(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
      )
    ).filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
  }, [ref]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!ref.current) return;

    if (event.key === 'Escape' && escapeDeactivates) {
      onEscape?.();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement as HTMLElement;

    // If no element is focused, focus the first element
    if (!ref.current.contains(activeElement)) {
      event.preventDefault();
      firstElement.focus();
      return;
    }

    if (event.shiftKey) {
      // Shift + Tab
      if (activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }, [ref, escapeDeactivates, onEscape, getFocusableElements]);

  // Set up the focus trap
  useEffect(() => {
    if (!isActive) return;

    const element = ref.current;
    if (!element) return;

    // Store the last focused element
    lastFocusedElementRef.current = document.activeElement as HTMLElement;

    // Set initial focus
    if (initialFocus) {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        requestAnimationFrame(() => {
          focusableElements[0].focus();
        });
      }
    }

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);

    // Prevent scrolling on mount
    const scrollY = window.scrollY;
    element.style.top = `-${scrollY}px`;

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Restore focus when the trap is deactivated
      if (returnFocus && lastFocusedElementRef.current) {
        requestAnimationFrame(() => {
          lastFocusedElementRef.current?.focus();
        });
      }

      // Restore scrolling
      element.style.top = '';
    };
  }, [isActive, initialFocus, returnFocus, handleKeyDown, getFocusableElements, ref]);

  // Prevent focus from leaving the trap
  useEffect(() => {
    if (!isActive) return;

    const handleFocusIn = (event: FocusEvent) => {
      if (!ref.current) return;
      
      const target = event.target as HTMLElement;
      if (!ref.current.contains(target)) {
        event.preventDefault();
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, [isActive, ref, getFocusableElements]);

  return {
    getFocusableElements,
  };
}
