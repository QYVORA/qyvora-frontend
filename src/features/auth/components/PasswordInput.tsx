import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const INPUT_BASE = 'w-full bg-bg-card border border-border rounded-lg py-4 pl-12 pr-12 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-mono text-base';

interface PasswordInputProps {
  id?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  shake?: boolean;
  onAnimationEnd?: () => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  name,
  placeholder = '••••••••',
  required = true,
  shake = false,
  onAnimationEnd,
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
        className={`${INPUT_BASE}${shake ? ' input-error' : ''}`}
      />
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        aria-label={show ? 'Hide password' : 'Show password'}
        aria-pressed={show}
      >
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default PasswordInput;
