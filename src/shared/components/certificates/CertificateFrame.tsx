import React, { useEffect, useRef, useState } from 'react';
import CertificateRenderer, { CertificateRendererProps } from './CertificateRenderer';
import { cn } from '@/shared/utils/cn';
import './certificate-print.css';

export interface CertificateFrameProps {
  data: CertificateRendererProps['data'];
  config?: CertificateRendererProps['config'];
  /** Extra classes on the measuring wrapper (e.g. a width constraint). */
  className?: string;
  /**
   * Marks this frame as the one exported by the admin "Download PDF" action.
   * Only ever one frame per page may be printable.
   */
  printable?: boolean;
}

/**
 * Print trigger event — dispatched by the admin Certificates page. Only the
 * printable frame listens, so "Both" mode still exports exactly one cert.
 */
export const CERTIFICATE_PRINT_EVENT = 'qy:certificate-print';

/**
 * Native render size — US Letter at 100 CSS px per inch. The certificate is
 * always laid out at this fixed width (so container-query sizing is fully
 * deterministic) and then uniformly scaled down to fit its container. The
 * result is the exact same certificate proportions on every screen, with no
 * reflow and nothing clipped.
 */
const NATIVE_WIDTH = { landscape: 1100, portrait: 850 } as const;

/**
 * Responsive certificate preview frame.
 *
 * Renders the certificate at its fixed native Letter size and scales it with a
 * transform to fit the available width. Height is measured and applied to the
 * wrapper so the frame never overflows or clips its certificate — admin
 * preview, "both" mode and the public verify result all stay pixel-identical
 * in proportion across breakpoints.
 *
 * PDF export: when `printable` and the {@link CERTIFICATE_PRINT_EVENT} fires,
 * the frame detaches as a self-contained clone at the end of `<body>` and
 * prints full-bleed. The rest of the app is `display: none` in print, so the
 * export is exactly one page — no duplicate certificates, no blank trailing
 * pages, and every element (including the bottom-right seal) prints.
 */
const CertificateFrame: React.FC<CertificateFrameProps> = ({
  data,
  config = {},
  className,
  printable = false,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const certRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [certHeight, setCertHeight] = useState(0);

  const orientation = config.orientation || 'landscape';
  const nativeWidth = NATIVE_WIDTH[orientation];

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const cert = certRef.current;
    if (!wrapper || !cert) return;

    const update = () => {
      const width = wrapper.clientWidth;
      if (width > 0) setScale(width / nativeWidth);
      setCertHeight(cert.offsetHeight);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(wrapper);
    observer.observe(cert);
    return () => observer.disconnect();
  }, [nativeWidth]);

  useEffect(() => {
    if (!printable) return;

    const onPrint = () => {
      const frame = wrapperRef.current;
      if (!frame) return;

      const clone = frame.cloneNode(true) as HTMLElement;
      clone.classList.remove('cert-export-frame');
      clone.classList.add('cert-print-clone');
      document.body.appendChild(clone);

      let cleaned = false;
      const cleanup = () => {
        if (cleaned) return;
        cleaned = true;
        clone.remove();
        window.removeEventListener('afterprint', cleanup);
      };

      window.addEventListener('afterprint', cleanup);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        window.print();
        cleanup();
      }));
    };

    window.addEventListener(CERTIFICATE_PRINT_EVENT, onPrint);
    return () => window.removeEventListener(CERTIFICATE_PRINT_EVENT, onPrint);
  }, [printable]);

  const ready = scale > 0 && certHeight > 0;

  return (
    <div
      ref={wrapperRef}
      className={cn('relative w-full', printable && 'cert-export-frame', className)}
      style={{
        height: ready ? Math.ceil(certHeight * scale) : 0,
        overflow: 'hidden',
        opacity: ready ? 1 : 0,
      }}
    >
      <div
        className="cert-export-scale"
        style={{
          width: nativeWidth,
          transform: `scale(${ready ? scale : 0})`,
          transformOrigin: 'top left',
        }}
      >
        <div ref={certRef}>
          <CertificateRenderer
            data={data}
            config={config}
            id={printable ? 'certificate-render' : undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default CertificateFrame;
