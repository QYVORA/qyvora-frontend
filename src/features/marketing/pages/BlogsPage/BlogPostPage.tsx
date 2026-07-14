import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, Tag } from 'lucide-react';
import { IconArrowLeft, IconArrowRight, IconClock } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { BLOG_POSTS } from './blogContent';
import { HackerProtocolBookBlog } from './HackerProtocolBookBlog';
import { AnansiCliBlog } from './AnansiCliBlog';
import { AfricaCybersecurityEcosystemBlog } from './AfricaCybersecurityEcosystemBlog';
import { AttackersDiscoverCompaniesBlog } from './AttackersDiscoverCompaniesBlog';
import { AfricaNeedsCybersecurityProfessionalsBlog } from './AfricaNeedsCybersecurityProfessionalsBlog';
import { MappingAttackSurfacesBlog } from './MappingAttackSurfacesBlog';
import { FutureCybersecurityAfricaBlog } from './FutureCybersecurityAfricaBlog';
import { Hpb2026CaseStudy } from './Hpb2026CaseStudy';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
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
      case 'africa-cybersecurity-ecosystem':
        return <AfricaCybersecurityEcosystemBlog />;
      case 'attackers-discover-companies':
        return <AttackersDiscoverCompaniesBlog />;
      case 'africa-needs-cybersecurity-professionals':
        return <AfricaNeedsCybersecurityProfessionalsBlog />;
      case 'mapping-attack-surfaces':
        return <MappingAttackSurfacesBlog />;
      case 'future-cybersecurity-africa':
        return <FutureCybersecurityAfricaBlog />;
      case 'hpb-2026-cohort-case-study':
        return <Hpb2026CaseStudy />;
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

      {/* ── Article Header ── */}
      <header className="pt-[120px] pb-12 md:pt-[136px] md:pb-16">
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

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.05] mb-6 break-words">
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
                <IconClock size={16} className="text-accent" /> {post.readTime}
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
          className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden border border-border/50"
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
      <div className="w-full px-3 sm:px-6 md:px-10 lg:px-16 xl:px-20 pb-32">
        <article className="prose-custom max-w-none">
          {renderContent()}
        </article>

        {/* ── Footer Nav ── */}
        <div className="mt-24 pt-10 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Link
            to="/blogs"
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-accent transition-colors"
          >
            <IconArrowLeft size={16} /> Back to all blogs
          </Link>
          <span className="text-[10px] font-mono text-text-muted">
            QYVORA // {post.date}
          </span>
        </div>
      </div>

      {/* ── Read Next ── */}
      {otherPosts.length > 0 && (
        <section className="border-t border-border/50">
          <div className="w-full px-3 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-16 md:py-24">
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
                    <div className="flex items-center gap-2 mb-3 overflow-hidden">
                      {other.tags.map((tag) => (
                        <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-accent">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-text-primary mb-2 break-words">
                      {other.title}
                    </h3>
                    <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent group-hover:gap-2.5 transition-all">
                      Read <IconArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="relative w-full min-h-dvh md:h-dvh md:overflow-hidden">
        <LandingFinalCtaSection user={user} />
      </section>
    </div>
  );
};

export default BlogPostPage;
