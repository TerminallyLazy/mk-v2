"use client";

import { useEffect, useRef } from 'react';

interface UseFocusTrapProps {
  isActive: boolean;
  onEscape?: () => void;
}

export function useFocusTrap({ isActive, onEscape }: UseFocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onEscape) {
        onEscape();
        return;
      }

      if (event.key === 'Tab') {
        if (event.shiftKey) {
          // If shift + tab and on first element, move to last
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // If tab and on last element, move to first
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    // Focus first element when trap becomes active
    firstElement?.focus();

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onEscape]);

  return containerRef;
} 