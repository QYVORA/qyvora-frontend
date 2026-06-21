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
    <div className="bg-[#050505] border border-white/10 rounded-xl overflow-hidden my-8">
      <div className="bg-[#121212] border-b border-white/5 px-4 sm:px-6 py-4 flex items-center gap-2.5">
        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        <span className="ml-4 text-[9px] font-mono text-white/30 uppercase tracking-widest">{title}</span>
      </div>
      <div
        ref={wrapperRef}
        className="overflow-x-hidden overflow-y-auto max-h-[70vh] custom-scrollbar"
      >
        <div style={{ height: scale < 1 ? `${100 / scale}%` : undefined }}>
          <pre
            ref={preRef}
            className="p-4 sm:p-6 md:p-8 font-mono leading-relaxed whitespace-pre text-white/80"
            style={{
              fontSize: '0.875rem',
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
