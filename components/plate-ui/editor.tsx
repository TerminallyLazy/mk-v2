'use client';

import React from 'react';
import { PlateContent } from '@udecode/plate-common/react';

import { cn } from '@/lib/utils';

export function Editor({
  className,
  disabled,
  variant = 'default',
  readOnly = false,
}: {
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'aiChat';
  readOnly?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative',
        disabled && 'cursor-not-allowed',
        variant === 'default' ? 'min-h-[200px]' : 'min-h-[100px]',
        className
      )}
    >
      <PlateContent
        className={cn(
          'prose prose-slate dark:prose-invert max-w-none',
          'focus:outline-none',
          disabled && 'cursor-not-allowed',
          variant === 'default'
            ? 'p-[15px]'
            : 'px-2 py-1'
        )}
        disableDefaultStyles
        readOnly={disabled || readOnly}
      />
    </div>
  );
} 