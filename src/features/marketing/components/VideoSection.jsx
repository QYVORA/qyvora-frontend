import { useState } from 'react'
import { Play, X } from 'lucide-react'

// Replace this with your actual YouTube/Vimeo video ID when ready
const VIDEO_ID = 'dQw4w9WgXcQ'
const THUMBNAIL = `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`

export function VideoSection() {
  const [playing, setPlaying] = useState(false)

  return (
    <section className="py-24 px-4 sm:px-6 relative border-t border-accent/10 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-accent/6 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-3">// inside the platform</p>
          <h2 className="font-mono font-black text-3xl sm:text-4xl text-[var(--text-primary)]">See It in Action</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-3 max-w-lg mx-auto leading-relaxed">
            Watch how operators train, earn CP, and move through the pipeline — from first module to zero-day research.
          </p>
        </div>

        {/* Video card */}
        <div className="relative group cursor-pointer" onClick={() => setPlaying(true)}>
          {/* Thumbnail */}
          <div className="relative overflow-hidden border border-accent/20 aspect-video bg-[var(--bg-secondary)]">
            <img
              src={THUMBNAIL}
              alt="HSOCIETY platform walkthrough"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Pulse ring */}
                <div className="absolute inset-0 rounded-full bg-accent/30 animate-ping" />
                <div className="relative w-20 h-20 rounded-full bg-accent flex items-center justify-center shadow-2xl shadow-accent/40 group-hover:scale-110 transition-transform duration-300">
                  <Play size={28} className="text-[var(--bg-primary)] ml-1" fill="currentColor" />
                </div>
              </div>
            </div>

            {/* Bottom label */}
            <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="font-mono text-xs text-white/60 uppercase tracking-widest">HSOCIETY OFFSEC — Platform Walkthrough</p>
            </div>
          </div>

          {/* Accent border glow on hover */}
          <div className="absolute inset-0 border border-accent/0 group-hover:border-accent/40 transition-colors duration-300 pointer-events-none" />
        </div>

      </div>

      {/* Lightbox player */}
      {playing && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setPlaying(false)}
        >
          <button
            type="button"
            onClick={() => setPlaying(false)}
            className="absolute top-4 right-4 w-10 h-10 border border-white/20 text-white flex items-center justify-center hover:border-accent/60 hover:text-accent transition-all z-10"
            aria-label="Close video"
          >
            <X size={18} />
          </button>
          <div
            className="w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
              title="HSOCIETY Platform Walkthrough"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border border-accent/20"
            />
          </div>
        </div>
      )}
    </section>
  )
}
