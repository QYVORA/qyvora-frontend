import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, User, Tag, ArrowRight } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import { Footer } from '@/shared/components/layout';
import { BLOG_POSTS } from '@/features/marketing/content/blogContent';
import { HackerProtocolBookBlog } from './blog/HackerProtocolBookBlog';
import { AnansiCliBlog } from './blog/AnansiCliBlog';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="relative min-h-screen w-full bg-bg flex items-center justify-center pt-32">
        <div className="text-center">
          <h1 className="text-4xl font-black uppercase tracking-tight mb-4">Blog Not Found</h1>
          <Link to="/blogs" className="text-accent font-mono text-sm underline hover:no-underline">
            ← Back to blogs
          </Link>
        </div>
      </div>
    );
  }

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== slug);

  const renderContent = () => {
    switch (post.slug) {
      case 'hacker-protocol-book':
        return <HackerProtocolBookBlog />;
      case 'anansi-cli':
        return <AnansiCliBlog />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-bg">
      <SEO
        title={post.title}
        description={post.excerpt}
        image={post.image}
        article
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Blogs', item: '/blogs' },
          { name: post.title, item: `/blogs/${post.slug}` },
        ]}
      />

      {/* ── Top Navigation Bar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-bg/90 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-[1200px] mx-auto px-4 h-full flex items-center justify-between">
          <Link
            to="/blogs"
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blogs
          </Link>
          <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
            {post.readTime}
          </span>
        </div>
      </div>

      {/* ── Article Header ── */}
      <header className="pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-accent/10 border border-accent/20 rounded-full text-accent"
                >
                  <Tag className="w-3 h-3" /> {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.05] mb-6">
              {post.title}
            </h1>

            <p className="text-lg md:text-xl text-accent font-bold uppercase tracking-widest mb-8">
              {post.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-[11px] font-mono text-text-muted uppercase tracking-widest pb-8 border-b border-border/50">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-accent" /> {post.author.name}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" /> {post.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" /> {post.readTime}
              </span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── Featured Image ── */}
      <div className="max-w-[1200px] mx-auto px-4 mb-12 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-border/50"
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/5 to-transparent" />
        </motion.div>
      </div>

      {/* ── Article Body ── */}
      <div className="max-w-[1200px] mx-auto px-4 pb-32">
        <article className="prose-custom max-w-none">
          {renderContent()}
        </article>

        {/* ── Footer Nav ── */}
        <div className="mt-20 pt-10 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Link
            to="/blogs"
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all blogs
          </Link>
          <span className="text-[10px] font-mono text-text-muted">
            QYVORA // {post.date}
          </span>
        </div>
      </div>

      {/* ── Read Next ── */}
      {otherPosts.length > 0 && (
        <section className="border-t border-border/50">
          <div className="max-w-[1200px] mx-auto px-4 py-16 md:py-24">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-10 text-center">
              Keep Reading 📖
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {otherPosts.map((other) => (
                <Link
                  key={other.id}
                  to={`/blogs/${other.slug}`}
                  className="group block terminal-card rounded-2xl border border-border bg-bg-card overflow-hidden transition-all duration-500 hover:border-accent/40"
                  style={{ boxShadow: 'var(--card-shimmer)' }}
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-accent/5">
                    <img
                      src={other.image}
                      alt={other.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/10 to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      {other.tags.map((tag) => (
                        <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-accent">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-text-primary mb-2 group-hover:text-accent transition-colors">
                      {other.title}
                    </h3>
                    <p className="text-xs font-mono text-text-secondary leading-relaxed line-clamp-2">
                      {other.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent group-hover:gap-2.5 transition-all">
                      Read <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogPostPage;
