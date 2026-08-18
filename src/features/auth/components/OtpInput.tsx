import React, { useState, useRef, useCallback } from 'react';

const OTP_LENGTH = 6;

interface OtpInputProps {
  onComplete: (otp: string) => void;
  disabled?: boolean;
  error?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({ onComplete, disabled = false, error = false }) => {
  const [digits, setDigits] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && index === OTP_LENGTH - 1) {
      const otp = newDigits.join('');
      if (otp.length === OTP_LENGTH) {
        onComplete(otp);
      }
    }
  }, [digits, onComplete]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [digits]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;

    const newDigits = new Array(OTP_LENGTH).fill('');
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);

    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();

    if (pasted.length === OTP_LENGTH) {
      onComplete(pasted);
    }
  }, [onComplete]);

  const borderColor = error ? 'border-red-500/50' : 'border-border/40';
  const focusBorder = error ? 'focus:border-red-500' : 'focus:border-accent';
  const focusRing = error ? 'focus:ring-red-500/30' : 'focus:ring-accent/30';

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const otp = digits.join('');
        if (otp.length === OTP_LENGTH) onComplete(otp);
      }}
    >
      <div className="flex justify-center gap-2 sm:gap-3 mb-6">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            disabled={disabled}
            className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-xl font-black font-mono
              bg-bg-elevated border ${borderColor} rounded-xl
              text-text-primary outline-none
              ${focusBorder} ${focusRing} focus:ring-1
              disabled:opacity-50 transition-colors`}
            aria-label={`Digit ${i + 1}`}
          />
        ))}
      </div>
    </form>
  );
};

export default OtpInput;
