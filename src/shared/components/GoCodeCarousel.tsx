import { Code2 } from 'lucide-react';
import { Carousel } from '@/shared/components/carousel';

export interface GoCodeExample {
  id: string;
  filename: string;
  label: string;
  description: string;
  code: string;
}

const GoCodeCarousel = ({ examples }: { examples: GoCodeExample[] }) => (
  <Carousel
    slides={examples}
    autoPlayInterval={9000}
    className="w-full"
    renderCard={(example) => (
      <article className="flex h-[460px] flex-col bg-bg-card p-5 sm:h-auto sm:min-h-[360px] sm:p-6">
        <div className="flex items-start gap-3 pb-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10"><Code2 className="h-5 w-5 text-accent" /></span>
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-widest text-accent">Go source example</p>
            <h3 className="mt-1 text-base font-black text-text-primary">{example.label}</h3>
            <p className="mt-1 text-xs leading-relaxed text-text-muted">{example.description}</p>
          </div>
        </div>
        <div className="mt-4 min-h-0 flex-1 overflow-y-auto rounded-xl border border-border/50 bg-bg p-4">
          <p className="mb-3 font-mono text-[10px] text-text-muted">{example.filename}</p>
          <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-text-secondary sm:text-xs"><code>{example.code}</code></pre>
        </div>
      </article>
    )}
  />
);

export default GoCodeCarousel;
