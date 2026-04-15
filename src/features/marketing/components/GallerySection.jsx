import { useEffect, useState, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

// Reads all images from /gallery/ — add your images there and list them here.
// When you add images to public/gallery/, add their filenames to this array.
const GALLERY_FILES = [
  // e.g. 'event-1.webp', 'team-photo.jpg'
  // populated automatically once files are added to public/gallery/
]

function useGalleryImages() {
  // Dynamically discover images via Vite's import.meta.glob
  const [images, setImages] = useState([])
  useEffect(() => {
    // Vite glob — picks up any image added to public/gallery at build time
    const modules = import.meta.glob('/public/gallery/*.{jpg,jpeg,png,webp,avif,gif}', { eager: true, as: 'url' })
    const urls = Object.entries(modules).map(([path, url]) => ({
      src: url,
      name: path.split('/').pop(),
    }))
    // Fallback: if no images found via glob, use GALLERY_FILES list
    if (urls.length === 0 && GALLERY_FILES.length > 0) {
      setImages(GALLERY_FILES.map(f => ({ src: `/gallery/${f}`, name: f })))
    } else {
      setImages(urls)
    }
  }, [])
  return images
}

export function GallerySection() {
  const images = useGalleryImages()
  const [selected, setSelected] = useState(null)
  const [loaded, setLoaded] = useState({})

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

  // Don't render if no images
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

        {/* Masonry-style animated grid */}
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
        >
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => open(i)}
              className="group relative overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-accent/50 transition-all duration-300 focus:outline-none focus:border-accent"
              style={{
                aspectRatio: i % 5 === 0 ? '16/9' : i % 3 === 0 ? '1/1' : '4/3',
                gridColumn: i % 7 === 0 ? 'span 2' : 'span 1',
                animation: `gallery-in 0.5s ${i * 60}ms cubic-bezier(0.22,1,0.36,1) both`,
              }}
              aria-label={`View ${img.name}`}
            >
              {!loaded[i] && (
                <div className="absolute inset-0 bg-[var(--bg-secondary)] animate-pulse" />
              )}
              <img
                src={img.src}
                alt={img.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded(l => ({ ...l, [i]: true }))}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn size={22} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox modal */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/92 flex items-center justify-center"
          onClick={close}
        >
          {/* Close */}
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 w-10 h-10 border border-white/20 text-white flex items-center justify-center hover:border-accent/60 hover:text-accent transition-all z-10"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Prev */}
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

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full mx-16 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              key={selected}
              src={images[selected].src}
              alt={images[selected].name}
              className="max-w-full max-h-[85vh] object-contain border border-white/10"
              style={{ animation: 'lightbox-in 0.3s cubic-bezier(0.22,1,0.36,1) both' }}
            />
            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-black/60 border-t border-white/10">
              <p className="font-mono text-xs text-white/50 text-center">
                {selected + 1} / {images.length} — {images[selected].name}
              </p>
            </div>
          </div>

          {/* Next */}
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
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes lightbox-in {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  )
}
