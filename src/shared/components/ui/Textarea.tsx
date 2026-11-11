import React from 'react';
import { cn } from '@/shared/utils/cn';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string | boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, ...props }, ref) => (
    <div className="relative w-full">
      <textarea
        ref={ref}
        aria-invalid={Boolean(error)}
        className={cn(
          'qy-input w-full min-h-[120px] resize-y bg-surface border rounded-lg px-4 py-3 text-body-sm text-text-primary',
          error ? 'border-semantic-danger' : 'border-border-subtle focus:border-accent',
          'placeholder:text-text-tertiary outline-none transition-[border-color,box-shadow]',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          'disabled:bg-surface-raised disabled:text-text-muted disabled:cursor-not-allowed',
          className,
        )}
        {...props}
      />
      {typeof error === 'string' && (
        <p className="mt-1.5 type-meta text-semantic-danger" role="alert">{error}</p>
      )}
    </div>
  ),
);

Textarea.displayName = 'Textarea';

export default Textarea;
