import { useEffect, useRef, useState } from 'react';
import { resolveImg } from '@/shared/utils/resolveImg';
import { getAccessToken } from '@/core/services/api';

const AUTH_PATHS = ['/uploads/bootcamps/', '/uploads/cp-products/'];

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
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(resolved, {
          headers,
          credentials: 'include',
        });
        if (!res.ok) throw new Error(`${res.status}`);

        const blob = await res.blob();
        if (cancelled) return;

        const url = URL.createObjectURL(blob);
        blobRef.current = url;
        setObjectUrl(url);
      } catch {
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
