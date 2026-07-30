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
        .replace(/width="\d+"/g, '')
        .replace(/height="\d+"/g, '')
        .replace('<svg', '<svg preserveAspectRatio="xMidYMid meet" style="display:block;width:100%;height:100%"');
      setSvg(DOMPurify.default.sanitize(cleaned, { USE_PROFILES: { svg: true } }));
    });
    return () => { cancelled = true; };
  }, [value, size]);

  if (!svg) return null;

  return (
    <div
      dangerouslySetInnerHTML={{ __html: svg }}
      className={cn('rounded-xl overflow-hidden', className)}
    />
  );
};

export default Identicon;
