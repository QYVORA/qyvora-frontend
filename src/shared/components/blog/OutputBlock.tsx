import React, { useRef, useState, useEffect } from 'react';

const OutputBlock: React.FC<{
  text: string;
  title?: string;
}> = ({ text, title = 'output' }) => {
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
  }, [text]);

  return (
    <div className="relative border border-border/50 bg-bg-card rounded-xl overflow-hidden my-8">
      <div className="flex items-center justify-between border-b border-border/50 bg-bg-elevated px-5 py-3 select-none">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-text-muted/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-text-muted/20" />
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
            className="p-4 sm:p-6 md:p-8 font-mono leading-relaxed whitespace-pre text-text-muted"
            style={{
              fontSize: '0.8rem',
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              width: scale < 1 ? `${(1 / scale) * 100}%` : undefined,
            }}
          >
            <code>{text}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default OutputBlock;
export { OutputBlock };
