import { useEffect, useRef, useState } from 'react';
import { resolveImg } from '@/shared/utils/resolveImg';
import { getAccessToken } from '@/core/services/api';

export const AUTH_PATHS = ['/uploads/bootcamps/', '/uploads/cp-products/'];

const inFlight = new Map<string, Promise<Blob>>();

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
        const token = getAccessToken();

        if (!token) {
          // Unauthenticated visitor: the backend 401s protected uploads, and
          // the resulting 401 bursts from public pages take the deployment
          // down. Skip the request and render the fallback directly.
          if (!cancelled) setObjectUrl(resolveImg(fallback, ''));
          return;
        }

        const headers: Record<string, string> = { Authorization: `Bearer ${token}` };

        const key = `${token}:${resolved}`;
        let request = inFlight.get(key);
        if (!request) {
          request = fetch(resolved, {
            headers,
            credentials: 'include',
          }).then(async (res) => {
            if (!res.ok) throw new Error(`${res.status}`);
            return res.blob();
          });
          inFlight.set(key, request);
        }

        const blob = await request;
        if (cancelled) return;

        const url = URL.createObjectURL(blob);
        blobRef.current = url;
        setObjectUrl(url);
      } catch {
        inFlight.delete(`${getAccessToken()}:${resolved}`);
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
