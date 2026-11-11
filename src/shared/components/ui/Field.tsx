import React, { useId } from 'react';
import { cn } from '@/shared/utils/cn';

export interface FieldProps {
  id?: string;
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  className?: string;
  children: React.ReactElement<{ id?: string }>;
}

/**
 * App form field: label above control, optional required marker, hint and
 * inline error. Connects label / hint / error to the control with ids.
 */
const Field: React.FC<FieldProps> = ({
  id: idProp,
  label,
  hint,
  error,
  required,
  className,
  children,
}) => {
  const generatedId = useId();
  const id = idProp || generatedId;
  const describedBy = [hint ? `${id}-hint` : '', error ? `${id}-error` : '']
    .filter(Boolean)
    .join(' ') || undefined;

  const control = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        id: (children.props as { id?: string }).id || id,
        'aria-invalid': Boolean(error),
        'aria-describedby': describedBy,
        error: Boolean(error),
      })
    : children;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="text-sm font-medium text-text-primary">
        {label}
        {required && <span className="ml-1 text-danger" aria-hidden="true">*</span>}
      </label>
      {control}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-[13px] text-text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
};

export const FieldGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('grid gap-x-6 gap-y-6 md:grid-cols-2', className)}>{children}</div>
);

export default Field;
