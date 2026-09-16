import React, { useId } from 'react';
import { cn } from '@/shared/utils/cn';

interface FormFieldProps {
  /** Field id — required. Automatically connected to label, hint and error. */
  id?: string;
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  /** Extra classes for the wrapping <div>. */
  className?: string;
  children: React.ReactElement<{ id?: string }>;
}

/**
 * Accessible field wrapper: connects a label, optional help text and inline
 * error to its control via ids (htmlFor / aria-describedby / aria-invalid).
 * Also stamps the control with a generated id when the caller omits one.
 */
const FormField: React.FC<FormFieldProps> = ({
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
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="type-label text-text-secondary">
        {label}
        {required && <span className="ml-1 text-accent" aria-hidden="true">*</span>}
      </label>
      {control}
      {hint && !error && (
        <p id={`${id}-hint`} className="type-meta">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="type-meta text-semantic-danger">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;