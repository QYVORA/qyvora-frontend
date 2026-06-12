import { useEffect, useState } from 'react';
import { ImageOff, Loader2, Maximize2 } from 'lucide-react';
import ImageLightbox from './ImageLightbox';

interface Props {
  src: string;
  alt: string;
  stepNum: number;
}

const StepImage: React.FC<Props> = ({ src, alt, stepNum }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => { setStatus('loading'); }, [src]);

  return (
    <>
      <div
        className={`group mt-4 w-full overflow-hidden rounded-xl bg-transparent relative
          ${status === 'loaded' ? '' : 'min-h-[180px] sm:min-h-[220px]'}
        `}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`
            block w-full h-auto
            max-h-[56vw] sm:max-h-[420px] lg:max-h-[520px]
            object-contain rounded-xl
            transition-opacity duration-300
            ${status === 'loaded' ? 'opacity-100 group-hover:opacity-90' : 'opacity-0 absolute inset-0'}
          `}
        />

        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg-card rounded-xl">
            <Loader2 className="h-6 w-6 animate-spin text-accent opacity-50" />
          </div>
        )}

        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-bg-card rounded-xl">
            <ImageOff className="h-6 w-6 text-text-muted opacity-25" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted opacity-40">
              Step {stepNum} image not available
            </span>
          </div>
        )}

        {status === 'loaded' && (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute inset-0 w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl"
            aria-label={`Expand step ${stepNum} image`}
          >
            <div className="absolute inset-0 flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="flex items-center gap-1.5 rounded-lg bg-black/60 backdrop-blur-sm px-3 py-1.5 border border-white/10">
                <Maximize2 className="h-3.5 w-3.5 text-white" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">Expand</span>
              </div>
            </div>
          </button>
        )}
      </div>

      {lightboxOpen && (
        <ImageLightbox src={src} alt={alt} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
};

export default StepImage;
