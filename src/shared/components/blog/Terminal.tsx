import React, { useRef, useState, useEffect } from 'react';

const Terminal: React.FC<{
  code: string;
  title?: string;
}> = ({ code, title = 'terminal' }) => {
  const preRef = useRef<HTMLPreElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const pre = preRef.current;
    const wrapper = wrapperRef.current;
    if (!pre || !wrapper) return;

    const updateScale = () => {
      const ww = wrapper.clientWidth;
      const contentWidth = pre.scrollWidth;
      setScale(contentWidth > ww ? ww / contentWidth : 1);
    };

    requestAnimationFrame(updateScale);
    const observer = new ResizeObserver(updateScale);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [code]);

  return (
    <div className="relative border border-white/10 bg-bg-card/70 rounded-xl overflow-hidden my-8">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-3 select-none">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </div>
        <span className="text-[10px] font-mono text-text-muted uppercase tracking-[0.15em]">{title}</span>
      </div>

      <div
        ref={wrapperRef}
        className="relative overflow-x-hidden overflow-y-auto max-h-[70vh] custom-scrollbar"
      >
        <div style={{ height: scale < 1 ? `${100 / scale}%` : undefined }}>
          <pre
            ref={preRef}
            className="p-4 sm:p-6 md:p-8 font-mono leading-relaxed whitespace-pre text-text-secondary"
            style={{
              fontSize: '0.8rem',
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              width: scale < 1 ? `${(1 / scale) * 100}%` : undefined,
            }}
          >
            <code>
              {code.split('\n').map((line, i, arr) => (
                <React.Fragment key={i}>
                  <span>{line || ' '}</span>
                  {i === arr.length - 1 && (
                    <span
                      className="inline-block w-[0.55em] h-[1.05em] bg-accent/90 ml-[1px] animate-pulse"
                      style={{ verticalAlign: 'text-bottom', marginBottom: '1px' }}
                    />
                  )}
                  {i < arr.length - 1 && '\n'}
                </React.Fragment>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
export { Terminal };
