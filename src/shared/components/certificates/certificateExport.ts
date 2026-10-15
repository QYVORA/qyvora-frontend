/**
 * certificateExport.ts
 *
 * Raster + PDF export for the certificate renderer.
 *
 * The certificate is exported *from its own rendered DOM node*, never from the
 * downscaled preview: `html-to-image` clones the certificate at its native
 * US-Letter size and rasterises it into a canvas, independent of the size the
 * preview happens to be displayed at. PDF is the same raster embedded into a
 * single exact-trim US-Letter page via `jspdf`.
 *
 * All three formats therefore share one source of truth — the certificate data
 * and template — and stay pixel-identical to the preview.
 */
import { toJpeg, toPng } from 'html-to-image';
import type { Options as HtmlToImageOptions } from 'html-to-image/lib/types';
import { jsPDF } from 'jspdf';
import type { CertificateOrientation, CertificateProgram } from './CertificateRenderer';

export type CertificateFormat = 'pdf' | 'png' | 'jpeg';

export interface CertificateExportOptions {
  format: CertificateFormat;
  orientation: CertificateOrientation;
  program: CertificateProgram;
  /** Included (shortened) in the filename — never the full recipient record. */
  credentialId?: string;
}

/**
 * US-Letter trim in inches. PDF pages use this exact size so the export is a
 * print-ready, exact-trim certificate at the platform's standard format.
 */
const PAGE_INCHES: Record<CertificateOrientation, [number, number]> = {
  landscape: [11, 8.5],
  portrait: [8.5, 11],
};

/**
 * Rasterise at 3× the native CSS size. Native landscape is 1100 px wide, so the
 * exported image is ~3300 px wide — roughly 300 dpi at US Letter, sharp enough
 * for print and professional sharing. Deliberately independent of preview size.
 */
const PIXEL_RATIO = 3;

const PAPER = '#ffffff';

const DOWNLOAD_EXTENSION: Record<CertificateFormat, string> = {
  pdf: 'pdf',
  png: 'png',
  jpeg: 'jpg',
};

/**
 * `QYVORA-{PROGRAM}-Certificate-{shortid}.{ext}` — identifies the programme and
 * a truncated credential reference without exposing a full personal record.
 */
export function buildCertificateFilename(
  format: CertificateFormat,
  program: CertificateProgram,
  credentialId?: string,
): string {
  const shortId = (credentialId ?? '').replace(/[^A-Za-z0-9]/g, '').slice(0, 12) || 'credential';
  return `QYVORA-${program}-Certificate-${shortId}.${DOWNLOAD_EXTENSION[format]}`;
}

/**
 * Waits for webfonts and the certificate's images (logos) to be ready before
 * rasterising. Without this the canvas can bake in fallback font metrics or a
 * blank logo.
 */
async function waitForAssets(node: HTMLElement): Promise<void> {
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* Font Loading API unavailable — proceed with whatever is rendered. */
    }
  }

  const images = Array.from(node.querySelectorAll('img'));
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) return resolve();
          img.addEventListener('load', () => resolve(), { once: true });
          img.addEventListener('error', () => resolve(), { once: true });
        }),
    ),
  );
}

function triggerDownload(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Exports the certificate node in the requested format and triggers a download.
 * Throws if rasterisation fails so the caller can surface an error instead of
 * silently producing a broken file.
 */
export async function exportCertificate(
  node: HTMLElement,
  options: CertificateExportOptions,
): Promise<void> {
  const { format, orientation, program, credentialId } = options;

  await waitForAssets(node);

  const rasterOptions: HtmlToImageOptions = {
    width: node.offsetWidth,
    height: node.offsetHeight,
    pixelRatio: PIXEL_RATIO,
    backgroundColor: PAPER,
    cacheBust: true,
  };

  const filename = buildCertificateFilename(format, program, credentialId);

  if (format === 'png') {
    triggerDownload(await toPng(node, rasterOptions), filename);
    return;
  }

  if (format === 'jpeg') {
    // JPEG has no alpha — the explicit paper background prevents black gaps.
    triggerDownload(await toJpeg(node, { ...rasterOptions, quality: 0.95 }), filename);
    return;
  }

  // PDF embeds the same high-resolution raster in a single exact-trim page.
  const dataUrl = await toPng(node, rasterOptions);
  const [width, height] = PAGE_INCHES[orientation];
  const pdf = new jsPDF({ orientation, unit: 'in', format: [width, height], compress: true });
  pdf.addImage(dataUrl, 'PNG', 0, 0, width, height, undefined, 'FAST');
  pdf.save(filename);
}
