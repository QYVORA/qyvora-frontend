# Error Handling

## Error Boundary

**Source:** `src/shared/components/ErrorBoundary.tsx`

Catches JavaScript errors in the component tree. Each boundary has a `scope` prop for identifying where errors occur:

```tsx
<ErrorBoundary scope="App">
  <AppRouter />
</ErrorBoundary>
```

When an error is caught:
1. Logs the error with scope to console
2. Renders a fallback UI with "Something went wrong" message
3. Offers a "Reload page" button

## Toast Notifications

**Source:** `src/core/contexts/ToastContext.tsx`

User-facing errors are displayed via toast notifications:

```tsx
const { addToast } = useToast();
addToast('Failed to save changes', 'error');
addToast('Profile updated', 'success');
```

Toast types: `success`, `error`, `info`, `warning`.

## API Error Handling

### Interceptor-Level

The Axios response interceptor handles:
- **401:** Silent token refresh + retry
- **403:** CSRF token recovery + retry
- **Other errors:** Passed through to caller

### Component-Level

Components catch API errors and surface them via toasts:

```tsx
try {
  const res = await api.get('/student/overview');
  setData(res.data);
} catch {
  addToast('Failed to load dashboard data', 'error');
}
```

### Form Validation

Backend validation errors return 400 with field-specific messages:

```json
{
  "error": "Validation failed",
  "details": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

## HTTP Status Code Mapping

| Status | Handling |
|--------|----------|
| 200 | Success |
| 400 | Validation error → toast with message |
| 401 | Token refresh → retry |
| 403 | CSRF recovery → retry |
| 404 | Not found → redirect to 404 page |
| 409 | Conflict → toast with specific message |
| 429 | Rate limited → toast "Too many requests" |
| 500 | Server error → toast "Something went wrong" |

## 404 Handling

The catch-all `*` route renders `NotFoundPage`:
- Styled 404 message
- Link back to dashboard (if authenticated) or landing page

## Graceful Degradation

- **Image loading failures:** Fallback to placeholder or default avatar
- **API unavailability:** Cached data where available, error toast otherwise
- **Feature toggles:** Missing features gracefully hidden
- **Offline:** Service worker serves cached assets for PWA
