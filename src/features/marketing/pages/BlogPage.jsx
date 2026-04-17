import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, Tag, ArrowRight } from 'lucide-react'
import { useSEO } from '@/core/utils/useSEO'
import api from '@/core/services/api'

const DEFAULT_BLOG_IMG = '/images/how-it-works-section/Engagements-4Completed.webp'
const SITE_URL = 'https://hsocietyoffsec.netlify.app'

const toSlug = (value = '') =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

function PostCard({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="card group flex flex-col hover:border-accent/50 hover:-translate-y-1 transition-all duration-200">
      <div className="relative h-44 overflow-hidden border-b border-[var(--border)]">
        <img src={post.img} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3 px-2 py-0.5 border border-accent/40 bg-black/70 text-accent font-mono text-[10px] uppercase tracking-widest">
          {post.category}
        </div>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h2 className="font-mono font-bold text-base text-[var(--text-primary)] leading-snug">{post.title}</h2>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed flex-1">{post.excerpt}</p>
        <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)]">
          <span className="flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)]"><Clock size={10} /> {post.readTime}</span>
          <span className="flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)]"><Tag size={10} /> {new Date(post.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <span className="ml-auto text-[10px] font-mono text-accent group-hover:gap-2 flex items-center gap-1">Read <ArrowRight size={10} /></span>
        </div>
      </div>
    </Link>
  )
}

function BlogPost({ slug, posts }) {
  const post = posts.find((p) => p.slug === slug)
  useSEO(post ? {
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: `${SITE_URL}${post.img}`,
  } : { title: 'Post Not Found', path: '/blog' })
  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
      <p className="font-mono text-[var(--text-muted)] text-sm">Post not found.</p>
      <Link to="/blog" className="btn-primary text-sm inline-flex items-center gap-2"><ArrowLeft size={14} /> Back to Blog</Link>
    </div>
  )
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero image */}
      <div className="relative h-64 sm:h-80 overflow-hidden border-b border-[var(--border)]">
        <img src={post.img} alt={post.title} className="w-full h-full object-cover" style={{ filter: 'brightness(0.35)' }} loading="eager" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-4 sm:px-6 pb-8">
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent border border-accent/40 px-2 py-0.5 bg-black/60">{post.category}</span>
          <h1 className="font-mono font-black text-2xl sm:text-4xl text-white mt-3 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1 text-xs font-mono text-white/50"><Clock size={11} /> {post.readTime}</span>
            <span className="flex items-center gap-1 text-xs font-mono text-white/50"><Tag size={11} /> {new Date(post.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-accent transition-colors mb-8">
          <ArrowLeft size={12} /> Back to Blog
        </Link>
        <div className="card p-6 sm:p-8">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{post.excerpt}</p>
          <div className="mt-6 pt-6 border-t border-[var(--border)]">
            <p className="text-xs font-mono text-[var(--text-muted)] italic">Full article coming soon. Check back or follow us on social media for updates.</p>
          </div>
        </div>

        {/* Related posts */}
        <div className="mt-12">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] mb-6">// more posts</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {posts.filter((p) => p.slug !== slug).slice(0, 2).map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BlogPage() {
  const { slug } = useParams()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const loadPosts = async () => {
      try {
        const res = await api.get('/public/blog-posts')
        const source = Array.isArray(res.data?.posts) ? res.data.posts : []
        if (!mounted) return
        const normalized = source
          .map((post, index) => {
            const title = String(post?.title || '').trim()
            const summary = String(post?.summary || '').trim()
            if (!title || !summary) return null
            const baseSlug = toSlug(post?.slug || title) || `post-${index + 1}`
            return {
              id: String(post?.id || index + 1),
              slug: baseSlug,
              title,
              excerpt: summary,
              category: String(post?.category || 'Insights').trim() || 'Insights',
              date: String(post?.date || new Date().toISOString()).trim(),
              readTime: String(post?.readTime || '3 min read').trim() || '3 min read',
              img: String(post?.image || post?.img || DEFAULT_BLOG_IMG).trim() || DEFAULT_BLOG_IMG,
            }
          })
          .filter(Boolean)
        setPosts(normalized)
      } catch {
        if (!mounted) return
        setPosts([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadPosts()
    return () => { mounted = false }
  }, [])

  const activePost = useMemo(() => posts.find((p) => p.slug === slug), [posts, slug])

  useSEO({
    title: activePost?.title || 'Blog — Operator Guides & Security Insights',
    description: activePost?.excerpt || 'Offensive security guides, platform updates, and intel drops from the HSOCIETY OFFSEC team.',
    path: slug ? `/blog/${slug}` : '/blog',
  })
  if (slug) return <BlogPost slug={slug} posts={posts} />

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero */}
      <section className="relative py-28 px-4 sm:px-6 border-b border-[var(--border)] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-accent/6 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-3">// intel drop</p>
          <h1 className="font-mono font-black text-4xl md:text-6xl text-[var(--text-primary)] mb-4 leading-tight">The Blog</h1>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed">
            Operator guides, platform updates, and offensive security insights from the HSOCIETY team.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-16 px-4 sm:px-6">
        {loading ? (
          <div className="max-w-6xl mx-auto text-sm text-[var(--text-secondary)]">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="max-w-6xl mx-auto card p-6 text-sm text-[var(--text-secondary)]">
            No blog posts published yet.
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </section>
    </div>
  )
}
