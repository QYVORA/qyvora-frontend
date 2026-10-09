/**
 * Fluid sizing helper shared by the certificate components.
 *
 * Every dimension on a certificate is expressed as `max(<floor>px, <n>cqw)` —
 * the value scales with the certificate's own width (container query unit) so
 * the layout keeps identical proportions at admin-preview size, on mobile and
 * in print, with a px floor so small previews stay legible. Because the
 * certificate box and all of its children scale from the same unit, long
 * recipient names can never spill out of the certificate container.
 */
export const fluid = (minPx: number, cqw: number) => `max(${minPx}px, ${cqw}cqw)`;
