/**
 * Patterns that match internal/technical error messages which should NOT be
 * shown to the user. These are system-level details that provide no useful
 * feedback (e.g., stack traces, leaked paths).
 *
 * IMPORTANT: Keep these patterns SPECIFIC. Overly broad patterns like `/token/i`
 * will block legitimate user-facing errors such as "Invalid or expired token"
 * or "Refresh token is required".
 */
const TECHNICAL_PATTERNS = [
  /internal server error/i,
  /stack trace/i,
  /\.at\s|\(.+?\)/,
  /^\[\w+\s\w+\]/,
  /^error:/i,
  /unexpected token/i,
  /unexpected identifier/i,
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
  // Log the actual error for debugging — never swallowed silently
  if (typeof err === 'object' && err !== null) {
    const axiosError = err as {
      response?: { data?: { error?: string }; status?: number };
      request?: unknown;
      message?: string;
      name?: string;
    };
    console.error(
      `[sanitizeError][${context}] Raw error:`,
      {
        name: axiosError.name || typeof err,
        message: axiosError.message || '(no message)',
        status: axiosError.response?.status || '(no response)',
        body: axiosError.response?.data || '(no body)',
        hasRequest: !!axiosError.request,
      },
    );
  }

  // Extract the error message from the Axios response body
  const raw: string =
    (typeof err === 'object' && err !== null
      ? String(
          (err as { response?: { data?: { error?: string } } }).response?.data?.error || '',
        )
      : '') || '';

  // If there's no server-provided message, or it matches a technical pattern,
  // fall back to a user-safe generic message.
  if (!raw || TECHNICAL_PATTERNS.some((re) => re.test(raw))) {
    return GENERIC_FALLBACKS[context] || GENERIC_FALLBACKS.default;
  }

  return raw;
};
