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
    <div className="relative bg-[#0a0e0a] border border-[#1a3a1a]/60 rounded-xl overflow-hidden my-8 group shadow-2xl shadow-black/50">
      {/* ── Title Bar ── */}
      <div className="relative bg-[#0d120d] border-b border-[#1a3a1a]/40 px-4 sm:px-6 py-3 flex items-center gap-2.5 select-none">
        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        <span className="ml-3 text-[10px] font-mono text-[#3a6a3a]/70 uppercase tracking-[0.15em]">{title}</span>
      </div>

      {/* ── Terminal Body ── */}
      <div
        ref={wrapperRef}
        className="relative overflow-x-hidden overflow-y-auto max-h-[70vh] custom-scrollbar"
      >
        {/* CRT Scanline Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(102, 184, 112, 0.12) 1px,
              rgba(102, 184, 112, 0.12) 2px
            )`
          }}
        />

        {/* CRT Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%)`
          }}
        />

        {/* Content */}
        <div style={{ height: scale < 1 ? `${100 / scale}%` : undefined }}>
          <pre
            ref={preRef}
            className="p-4 sm:p-6 md:p-8 font-mono leading-relaxed whitespace-pre text-[#4ade80]"
            style={{
              fontSize: '0.8rem',
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              width: scale < 1 ? `${(1 / scale) * 100}%` : undefined,
              textShadow: '0 0 4px rgba(74, 222, 128, 0.12), 0 0 1px rgba(74, 222, 128, 0.25)',
            }}
          >
            <code>
              {code.split('\n').map((line, i, arr) => (
                <React.Fragment key={i}>
                  <span>{line || ' '}</span>
                  {i === arr.length - 1 && (
                    <span
                      className="inline-block w-[0.55em] h-[1.05em] bg-[#4ade80]/90 ml-[1px] animate-pulse"
                      style={{
                        boxShadow: '0 0 6px rgba(74, 222, 128, 0.5), 0 0 12px rgba(74, 222, 128, 0.2)',
                        verticalAlign: 'text-bottom',
                        marginBottom: '1px',
                      }}
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
