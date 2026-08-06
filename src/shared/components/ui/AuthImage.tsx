import { useEffect, useRef, useState } from 'react';
import { resolveImg } from '@/shared/utils/resolveImg';
import api, { hasAuthSessionHint } from '@/core/services/api';

export const AUTH_PATHS = ['/uploads/bootcamps/', '/uploads/cp-products/'];

const inFlight = new Map<string, Promise<Blob>>();

const toAbsoluteUrl = (url: string): string => {
  try {
    return new URL(url, window.location.origin).href;
  } catch {
    return url;
  }
};

interface AuthImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallback?: string;
}

export const AuthImage: React.FC<AuthImageProps> = ({
  src,
  fallback = '',
  className = '',
  style,
  ...imgProps
}) => {
  const [objectUrl, setObjectUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const blobRef = useRef('');

  useEffect(() => {
    const resolved = resolveImg(src, fallback);

    if (
      !resolved ||
      /^(blob:|data:)/i.test(resolved) ||
      !AUTH_PATHS.some((p) => resolved.includes(p))
    ) {
      setObjectUrl(resolved);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchImage = async () => {
      try {
        setLoading(true);

        // Guest visitor (no token, no session hint): the backend 401s
        // protected uploads, and the resulting 401 bursts from public pages
        // take the deployment down. Skip the request and render the fallback.
        // On a cold start (e.g. installed PWA launch) the token may still be
        // restoring — then the axios interceptor refreshes and retries for us.
        if (!hasAuthSessionHint()) {
          if (!cancelled) setObjectUrl(resolveImg(fallback, ''));
          return;
        }

        const key = resolved;
        let request = inFlight.get(key);
        if (!request) {
          // Route through the shared axios client so protected uploads get the
          // current Bearer token AND an automatic refresh + retry on 401.
          // This matters on cold starts (e.g. an installed PWA launch) where
          // silent session restore is still in flight: the first request fires
          // without a token, 401s, the interceptor refreshes it, and the retry
          // succeeds — otherwise every protected image would render the fallback.
          request = api
            .get(toAbsoluteUrl(resolved), { responseType: 'blob' })
            .then((res) => res.data as Blob);
          inFlight.set(key, request);
        }

        const blob = await request;
        if (cancelled) return;

        const url = URL.createObjectURL(blob);
        blobRef.current = url;
        setObjectUrl(url);
      } catch {
        inFlight.delete(resolved);
        if (!cancelled) setObjectUrl(resolveImg(fallback, ''));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchImage();

    return () => {
      cancelled = true;
      if (blobRef.current) {
        URL.revokeObjectURL(blobRef.current);
        blobRef.current = '';
      }
    };
  }, [src, fallback]);

  if (loading) {
    return (
      <div
        className={`animate-pulse bg-border/30 ${className}`}
        style={style}
      />
    );
  }

  return <img src={objectUrl} className={className} style={style} {...imgProps} />;
};
