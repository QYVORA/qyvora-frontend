const TECHNICAL_PATTERNS = [
  /csrf/i, /token/i, /x-csrf/i, /authorization/i, /bearer/i,
  /invalid csrf/i, /missing csrf/i, /internal server error/i,
  /stack trace/i, /\.at\s|\(.+?\)/,
];

const GENERIC_FALLBACKS: Record<string, string> = {
  login: 'Authentication failed. Check your credentials.',
  register: 'Registration failed. Please try again.',
  verify: 'Verification failed. Please try again.',
  password: 'Password change failed. Please try again.',
  reset: 'Password reset failed. Please try again.',
  purchase: 'Purchase failed. Please try again.',
  default: 'Something went wrong. Please try again.',
};

export const sanitizeError = (
  err: unknown,
  context: keyof typeof GENERIC_FALLBACKS = 'default',
): string => {
  const raw =
    (typeof err === 'object' && err !== null
      ? String((err as { response?: { data?: { error?: string } } }).response?.data?.error || '')
      : '') || '';

  if (!raw || TECHNICAL_PATTERNS.some((re) => re.test(raw)) || raw.length > 120) {
    return GENERIC_FALLBACKS[context] || GENERIC_FALLBACKS.default;
  }
  return raw;
};
