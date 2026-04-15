import { useEffect, useState, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

// Static list — files live in public/gallery/ and are served as-is.
// Using static URLs instead of import.meta.glob avoids filename/space issues.
const GALLERY_IMAGES = [
  { src: '/gallery/gallery-01.jpeg', name: 'gallery-01' },
  { src: '/gallery/gallery-02.jpeg', name: 'gallery-02' },
  { src: '/gallery/gallery-03.jpeg', name: 'gallery-03' },
  { src: '/gallery/gallery-04.jpeg', name: 'gallery-04' },
  { src: '/gallery/gallery-05.jpeg', name: 'gallery-05' },
  { src: '/gallery/gallery-06.png',  name: 'gallery-06' },
]

export function GallerySection() {
  const images = GALLERY_IMAGES
  const [selected, setSelected] = useState(null)

  const open = (idx) => setSelected(idx)
  const close = () => setSelected(null)

  const prev = useCallback(() => {
    if (selected === null) return
    setSelected((s) => (s - 1 + images.length) % images.length)
  }, [selected, images.length])

  const next = useCallback(() => {
    if (selected === null) return
    setSelected((s) => (s + 1) % images.length)
  }, [selected, images.length])

  useEffect(() => {
    if (selected === null) return
    const handler = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selected, prev, next])

  if (images.length === 0) return null

  return (
    <section className="border-t border-[var(--border)] py-16 px-4 sm:px-6 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-2">// gallery</p>
          <h2 className="font-mono font-black text-3xl text-[var(--text-primary)]">From the Field</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-2">Events, operators, and moments from the HSOCIETY community.</p>
        </div>

        {/*
          CSS columns masonry — images fill columns top-to-bottom naturally.
          No fixed aspect ratios, no empty grid cells, no uneven bottom gaps.
        */}
        <div
          style={{
            columns: 'var(--gallery-cols, 3)',
            columnGap: '4px',
          }}
          className="[--gallery-cols:2] sm:[--gallery-cols:3] lg:[--gallery-cols:4]"
        >
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => open(i)}
              className="group relative block w-full overflow-hidden border border-[var(--border)] hover:border-accent/50 focus:outline-none focus:border-accent transition-colors duration-200"
              style={{
                breakInside: 'avoid',
                marginBottom: '4px',
                display: 'block',
                animation: `gallery-in 0.45s ${Math.min(i * 50, 400)}ms cubic-bezier(0.22,1,0.36,1) both`,
              }}
              aria-label={`View ${img.name}`}
            >
              <img
                src={img.src}
                alt={img.name}
                className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn
                  size={22}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/94 flex items-center justify-center"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 w-10 h-10 border border-white/20 text-white flex items-center justify-center hover:border-accent/60 hover:text-accent transition-all z-10"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-white/20 text-white flex items-center justify-center hover:border-accent/60 hover:text-accent transition-all z-10"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          <div
            className="relative max-w-5xl max-h-[88vh] w-full mx-16 flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              key={selected}
              src={images[selected].src}
              alt={images[selected].name}
              className="max-w-full max-h-[82vh] w-auto h-auto object-contain border border-white/10"
              style={{ animation: 'lightbox-in 0.25s cubic-bezier(0.22,1,0.36,1) both' }}
            />
            <div className="w-full px-2 py-2 bg-black/50 border-t border-white/10 mt-0">
              <p className="font-mono text-xs text-white/40 text-center">
                {selected + 1} / {images.length}
              </p>
            </div>
          </div>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-white/20 text-white flex items-center justify-center hover:border-accent/60 hover:text-accent transition-all z-10"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      )}

      <style>{`
        @keyframes gallery-in {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes lightbox-in {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  )
}
