import { useState } from 'react';

/**
 * Transparent PNG/WebP from public/. If the file is missing, the image hides (no broken icon).
 */
export default function OptionalDecorImage({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    <img
      src={src}
      alt=""
      role="presentation"
      loading="lazy"
      decoding="async"
      className={className}
      onError={() => setOk(false)}
    />
  );
}
