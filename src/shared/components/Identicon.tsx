import { useEffect, useState } from 'react';
import { cn } from '../utils/cn';

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
        .replace(/width="\d+"/g, 'width="100%"')
        .replace(/height="\d+"/g, 'height="100%"')
        .replace('<svg', '<svg preserveAspectRatio="xMidYMid slice" style="display:block;width:100%;height:100%;aspect-ratio:1"');
      setSvg(DOMPurify.default.sanitize(cleaned, { USE_PROFILES: { svg: true } }));
    });
    return () => { cancelled = true; };
  }, [value, size]);

  if (!svg) return null;

  return (
    <div
      dangerouslySetInnerHTML={{ __html: svg }}
      className={cn('overflow-hidden bg-black aspect-square', className)}
    />
  );
};

export default Identicon;
