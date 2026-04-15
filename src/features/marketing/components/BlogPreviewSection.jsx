import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Tag } from 'lucide-react'
import { BLOG_POSTS } from '@/features/marketing/data/teamData'

export function BlogPreviewSection() {
  const posts = BLOG_POSTS.slice(0, 3)
  return (
    <section className="py-24 px-4 sm:px-6 border-t border-accent/10" id="blog">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="font-mono text-accent text-xs uppercase tracking-widest mb-2">// intel drop</p>
            <h2 className="font-mono font-black text-3xl sm:text-4xl text-[var(--text-primary)]">Latest from the Blog</h2>
            <p className="text-[var(--text-secondary)] text-sm mt-2 max-w-md leading-relaxed">
              Operator guides, platform updates, and offensive security insights.
            </p>
          </div>
          <Link to="/blog" className="btn-secondary inline-flex items-center gap-2 text-sm shrink-0 self-start sm:self-auto">
            All Posts <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {posts.map(post => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="card group flex flex-col hover:border-accent/50 hover:-translate-y-1 transition-all duration-200">
              <div className="relative h-40 overflow-hidden border-b border-[var(--border)]">
                <img src={post.img} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 left-3 px-2 py-0.5 border border-accent/40 bg-black/70 text-accent font-mono text-[10px] uppercase tracking-widest">
                  {post.category}
                </div>
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <h3 className="font-mono font-bold text-sm text-[var(--text-primary)] leading-snug">{post.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed flex-1">{post.excerpt}</p>
                <div className="flex items-center gap-3 pt-2 border-t border-[var(--border)]">
                  <span className="flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)]">
                    <Clock size={10} /> {post.readTime}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)]">
                    <Tag size={10} /> {new Date(post.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
