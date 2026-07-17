import { useEffect, useState } from 'react';

interface IdenticonProps {
  value: string | number;
  size?: number;
  className?: string;
}

const Identicon = ({ value, size = 40, className }: IdenticonProps) => {
  const [svg, setSvg] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      import('jdenticon'),
      import('dompurify'),
    ]).then(([jdenticon, DOMPurify]) => {
      if (cancelled) return;
      const raw = jdenticon.toSvg(value, size);
      const cleaned = raw
        .replace(`viewBox="0 0 ${size} ${size}"`, `viewBox="0 0 ${size} ${size}"`)
        .replace(/width="\d+"/, 'width="100%"')
        .replace(/height="\d+"/, 'height="100%"');
      setSvg(DOMPurify.default.sanitize(cleaned, { USE_PROFILES: { svg: true } }));
    });
    return () => { cancelled = true; };
  }, [value, size]);

  if (!svg) return null;

  return (
    <div
      dangerouslySetInnerHTML={{ __html: svg }}
      className={className}
    />
  );
};

export default Identicon;
