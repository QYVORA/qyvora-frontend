import { defaultSchema } from 'rehype-sanitize';

// Base: the rehype-sanitize default schema (blocks `script`/`iframe`, strips
// `on*`/`style` event handlers and unknown attributes). We tighten URL
// protocols and restrict attributes to keep the Markdown surface small.
export const SANITIZE_SCHEMA = {
  ...defaultSchema,
  protocols: {
    ...defaultSchema.protocols,
    href: ['http', 'https', 'mailto'],
    src: ['http', 'https'],
  },
  attributes: {
    ...defaultSchema.attributes,
    a: ['href', 'title', ['ariaLabel', 'aria-label']],
    img: ['src', 'alt', 'title'],
    code: [['className', /^language-[\w-]+$/]],
  },
};

// Belt-and-suspenders: refuse dangerous URL schemes even if the sanitise schema
// ever lets one through.
export function isSafeUrl(value: string | undefined | null): boolean {
  if (!value) return false;
  try {
    const protocol = new URL(value, 'https://qyvora.invalid').protocol.toLowerCase();
    return protocol === 'http:' || protocol === 'https:' || protocol === 'mailto:';
  } catch {
    return false;
  }
}