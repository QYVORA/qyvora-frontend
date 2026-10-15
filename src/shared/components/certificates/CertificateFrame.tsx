import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import CertificateRenderer, { CertificateRendererProps } from './CertificateRenderer';
import { cn } from '@/shared/utils/cn';

export interface CertificateFrameProps {
  data: CertificateRendererProps['data'];
  config?: CertificateRendererProps['config'];
  /** Extra classes on the measuring wrapper (e.g. a width constraint). */
  className?: string;
}

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
 * transform to fit the available width, while the wrapper height is measured
 * and applied so the frame never overflows or clips. Admin preview, "both"
 * mode, the student view dialog and the public verify result therefore stay
 * pixel-identical in proportion across breakpoints.
 *
 * The ref exposes the certificate's *native, unscaled* node so exporters can
 * rasterise it at full resolution regardless of the preview size.
 */
const CertificateFrame = forwardRef<HTMLDivElement, CertificateFrameProps>(
  ({ data, config = {}, className }, ref) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const certRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0);
    const [certHeight, setCertHeight] = useState(0);

    useImperativeHandle(ref, () => certRef.current as HTMLDivElement, []);

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

    const ready = scale > 0 && certHeight > 0;

    return (
      <div
        ref={wrapperRef}
        className={cn('relative w-full', className)}
        style={{
          height: ready ? Math.ceil(certHeight * scale) : 0,
          overflow: 'hidden',
          opacity: ready ? 1 : 0,
        }}
      >
        <div
          style={{
            width: nativeWidth,
            transform: `scale(${ready ? scale : 0})`,
            transformOrigin: 'top left',
          }}
        >
          <div ref={certRef}>
            <CertificateRenderer data={data} config={config} />
          </div>
        </div>
      </div>
    );
  },
);

CertificateFrame.displayName = 'CertificateFrame';

export default CertificateFrame;
