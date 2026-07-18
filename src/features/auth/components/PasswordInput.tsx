import React, { useState } from 'react';
import { IconLock, IconEye, IconEyeOff } from '@/shared/components/icons';

const INPUT_BASE = 'w-full bg-bg border border-bg rounded-xl py-3 pl-12 pr-12 text-text-primary placeholder:text-text-muted focus:border-accent outline-none transition-all font-mono text-sm';

interface PasswordInputProps {
  id?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  shake?: boolean;
  onAnimationEnd?: () => void;
  autoComplete?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  name,
  placeholder = '••••••••',
  required = true,
  shake = false,
  onAnimationEnd,
  autoComplete,
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
        className={`${INPUT_BASE}${shake ? ' input-error' : ''}`}
      />
      <IconLock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        aria-label={show ? 'Hide password' : 'Show password'}
        aria-pressed={show}
      >
        {show ? <IconEyeOff size={20} /> : <IconEye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;
