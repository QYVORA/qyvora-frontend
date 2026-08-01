import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { User, Search } from 'lucide-react';
import { IconArrowRight, IconClock } from '@/shared/components/icons';
import { ScrollReveal } from '@/shared/components';
import SEO from '@/shared/components/SEO';
import StudentHeroSection from '@/shared/components/StudentHeroSection';
import { BLOG_POSTS } from '@/features/marketing/pages/BlogsPage/blogContent';

const BlogsPage = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    BLOG_POSTS.forEach((p) => p.tags?.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, []);

  const [activeTag, setActiveTag] = useState('');

  const filtered = useMemo(() => {
    let result = BLOG_POSTS;
    if (activeTag) result = result.filter((p) => p.tags?.includes(activeTag));
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((p) => p.title?.toLowerCase().includes(q) || p.excerpt?.toLowerCase().includes(q));
    }
    return result;
  }, [activeTag, query]);

  return (
    <div className="bg-bg min-h-full">
      <SEO title="Blogs - QYVORA" description="Security research, tutorials, and updates from the QYVORA team." />
      <div className="px-3 md:px-4 lg:px-6">
        <StudentHeroSection
          title="Intelligence"
          accentWord="Reports"
          description="Security research, walkthroughs, and platform updates from the QYVORA team."
          stats={[{ label: 'Articles', value: BLOG_POSTS.length }]}
        />

        <div className="min-h-dvh flex flex-col justify-center py-16 md:py-20">
          <div className="space-y-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTag('')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                !activeTag ? 'bg-accent text-bg' : 'bg-bg-card border border-border text-text-muted hover:border-accent/30 hover:text-accent'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTag === tag ? 'bg-accent text-bg' : 'bg-bg-card border border-border text-text-muted hover:border-accent/30 hover:text-accent'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-xl border border-border/40 bg-bg-card py-2.5 pl-9 pr-3 text-xs text-text-primary focus:border-accent outline-none transition-all"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-muted text-sm">No articles found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filtered.map((post) => (
              <ScrollReveal key={post.slug} amount={0.05}>
                <Link
                  to={`/blogs/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-border/30 bg-bg-card overflow-hidden transition-all duration-300 hover:border-accent/30 h-full"
                >
                  {post.image && (
                    <div className="aspect-[16/9] overflow-hidden bg-accent/5">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-2 p-4 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.tags?.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-lg bg-accent/10 text-[9px] font-black uppercase tracking-widest text-accent border border-accent/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-text-primary group-hover:text-accent transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-2 text-[10px] text-text-muted font-mono">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {post.author?.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconClock className="w-3 h-3" /> {post.readTime}
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
