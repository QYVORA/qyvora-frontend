import { useMemo } from 'react';
import { toSvg } from 'jdenticon';

interface IdenticonProps {
  value: string | number;
  size?: number;
  className?: string;
}

const Identicon = ({ value, size = 40, className }: IdenticonProps) => {
  const svg = useMemo(() => {
    const raw = toSvg(value, size);
    return raw
      .replace(`viewBox="0 0 ${size} ${size}"`, `viewBox="0 0 ${size} ${size}"`)
      .replace(/width="\d+"/, 'width="100%"')
      .replace(/height="\d+"/, 'height="100%"');
  }, [value, size]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: svg }}
      className={className}
    />
  );
};

export default Identicon;
