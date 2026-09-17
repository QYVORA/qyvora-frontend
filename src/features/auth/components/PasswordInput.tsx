import React, { useState } from 'react';
import { IconLock, IconEye, IconEyeOff } from '@/shared/components/icons';
import { cn } from '@/shared/utils/cn';

const INPUT_BASE =
  'w-full min-h-[44px] bg-surface border border-border-subtle rounded-lg pl-11 pr-12 text-body-sm text-text-primary placeholder:text-text-tertiary focus:border-accent outline-none transition-colors duration-[var(--dur-base)] ease-[var(--ease-smooth)]';

interface PasswordInputProps {
  id?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  shake?: boolean;
  onAnimationEnd?: () => void;
  autoComplete?: string;
  className?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  name,
  placeholder = '••••••••',
  required = true,
  shake = false,
  onAnimationEnd,
  autoComplete,
  className,
}) => {
  const [show, setShow] = useState(false);
  return (
    <div
      className={`relative${shake ? ' animate-shake-x' : ''}`}
      onAnimationEnd={onAnimationEnd}
    >
      <input
        id={id}
        type={show ? 'text' : 'password'}
        name={name}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(INPUT_BASE, className, shake && 'input-error')}
      />
      <IconLock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-text-muted hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
      >
        {show ? <IconEyeOff size={20} /> : <IconEye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;
