import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Clock, User } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import { Footer } from '@/shared/components/layout';
import { BLOG_POSTS } from '@/features/marketing/content/blogContent';

const BlogsPage: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full bg-bg">
      <SEO
        title="Blogs"
        description="Read about cybersecurity, offensive security tooling, and Africa's growing security ecosystem."
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Blogs', item: '/blogs' },
        ]}
      />

      {/* ── Hero Section ── */}
      <section className="relative w-full bg-bg overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex-1 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-8">
                <BookOpen className="w-4 h-4 text-accent" />
                <span className="text-accent font-mono text-[10px] font-black uppercase tracking-[0.3em]">
                  The QYVORA Blog
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-[1.05] mb-6">
                Intelligence <span className="text-accent">Reports</span>
              </h1>
              <p className="text-lg md:text-xl text-text-secondary font-mono leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Field notes, tool philosophy, and the thinking behind Africa's offensive security ecosystem.
              </p>
            </motion.div>


          </div>
        </div>
      </section>

      {/* ── Blog Cards Grid ── */}
      <section className="relative w-full pb-32 md:pb-40">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {BLOG_POSTS.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="h-full"
              >
                <Link
                  to={`/blogs/${post.slug}`}
                  className="group flex flex-col terminal-card rounded-2xl border border-border bg-bg-card overflow-hidden transition-all duration-500 hover:border-accent/40 hover:shadow-[0_0_40px_rgba(102,184,112,0.06)] h-full"
                  style={{ boxShadow: 'var(--card-shimmer)' }}
                >
                  {/* Image */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-accent/5 shrink-0">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/10 to-transparent" />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-bg/80 backdrop-blur-sm border border-accent/20 rounded-full text-accent"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                      {post.title}
                    </h2>
                    <p className="text-sm font-bold uppercase tracking-widest text-accent/80 mb-3">
                      {post.subtitle}
                    </p>
                    <p className="text-text-secondary font-mono text-sm leading-relaxed mb-6 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50 shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <div className="text-[11px] font-black uppercase tracking-widest text-text-primary">
                            {post.author.name}
                          </div>
                          <div className="text-[9px] font-mono text-text-muted">
                            {post.author.handle}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-mono text-text-muted">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> {post.readTime}
                        </span>
                        <span className="flex items-center gap-1.5 text-accent group-hover:gap-2 transition-all">
                          Read <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogsPage;
