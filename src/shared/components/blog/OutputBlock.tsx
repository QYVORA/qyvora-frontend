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
    <div className="relative bg-[#0a0e0a] border border-[#1a3a1a]/40 rounded-xl overflow-hidden my-8 group shadow-2xl shadow-black/50">
      {/* ── Title Bar ── */}
      <div className="relative bg-[#0d120d] border-b border-[#1a3a1a]/30 px-4 sm:px-6 py-3 flex items-center gap-2.5 select-none">
        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        <span className="ml-3 text-[10px] font-mono text-[#3a6a3a]/60 uppercase tracking-[0.15em]">{title}</span>
      </div>

      {/* ── Output Body ── */}
      <div
        ref={wrapperRef}
        className="relative overflow-x-hidden overflow-y-auto max-h-[70vh] custom-scrollbar"
      >
        {/* CRT Scanline Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(102, 184, 112, 0.08) 1px,
              rgba(102, 184, 112, 0.08) 2px
            )`
          }}
        />

        {/* CRT Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.4) 100%)`
          }}
        />

        {/* Content */}
        <div style={{ height: scale < 1 ? `${100 / scale}%` : undefined }}>
          <pre
            ref={preRef}
            className="p-4 sm:p-6 md:p-8 font-mono leading-relaxed whitespace-pre text-[#a0b8a0]"
            style={{
              fontSize: '0.8rem',
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              width: scale < 1 ? `${(1 / scale) * 100}%` : undefined,
              textShadow: '0 0 3px rgba(160, 184, 160, 0.08)',
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
