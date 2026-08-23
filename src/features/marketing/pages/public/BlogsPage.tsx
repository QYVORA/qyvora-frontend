import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { ScrollReveal } from '@/shared/components';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import PublicSnapSection from '@/shared/components/PublicSnapSection';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { BLOG_POSTS } from '@/features/marketing/pages/BlogsPage/blogContent';
import { BatchPagination } from '@/shared/components/ui';
import { CardCollection, ViewToggle, type ViewMode } from '@/shared/components/card-collection';
import BlogCard from './cards/BlogCard';

const BlogsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [page, setPage] = useState(0);
  const [view, setView] = useState<ViewMode>('grid');
  const BATCH_SIZE = 3;

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    BLOG_POSTS.forEach((p) => p.tags?.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, []);

  const handleTagChange = (tag: string) => {
    setActiveTag(tag);
    setPage(0);
  };

  const handleQueryChange = (q: string) => {
    setQuery(q);
    setPage(0);
  };

  const filtered = useMemo(() => {
    let result = BLOG_POSTS;
    if (activeTag) result = result.filter((p) => p.tags?.includes(activeTag));
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((p) => p.title?.toLowerCase().includes(q) || p.excerpt?.toLowerCase().includes(q));
    }
    return result;
  }, [activeTag, query]);

  const totalPages = Math.ceil(filtered.length / BATCH_SIZE);
  const currentBatch = filtered.slice(page * BATCH_SIZE, (page + 1) * BATCH_SIZE);

  return (
    <div className="bg-bg min-h-full">
      <SEO title="Blogs - QYVORA" description="Security research, tutorials, and updates from the QYVORA team." />
      <PublicSnapLayout>
        <section className="relative w-full min-h-dvh snap-section bg-bg">
        <StudentHeroSection
          title="Intelligence"
          accentWord="Reports"
          titleClassName={PUBLIC_HERO_TITLE_CLASS}
          showGlobe
          typewrite
          description="Security research, walkthroughs, and platform updates from the QYVORA team."
          stats={[{ label: 'Articles', value: BLOG_POSTS.length }]}
        />
        </section>

        <PublicSnapSection>
          <div className="flex flex-col justify-between flex-1 min-h-0 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 items-start sm:items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-nowrap shrink-0 min-w-0">
                <button
                  onClick={() => handleTagChange('')}
                  className={`px-2.5 py-1 shrink-0 whitespace-nowrap rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                    !activeTag ? 'bg-accent text-on-accent' : 'bg-bg-card border border-border text-text-muted hover:border-accent/30 hover:text-accent'
                  }`}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagChange(tag)}
                    className={`px-2.5 py-1 shrink-0 whitespace-nowrap rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                      activeTag === tag ? 'bg-accent text-on-accent' : 'bg-bg-card border border-border text-text-muted hover:border-accent/30 hover:text-accent'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-52">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full rounded-xl border border-border/40 bg-bg-card py-2.5 pl-9 pr-3 text-xs text-text-primary focus:border-accent outline-none transition-all"
                  />
                </div>
                <ViewToggle value={view} onChange={setView} label="Blog view mode" />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16 flex-1 flex flex-col justify-center">
                <p className="text-text-muted text-sm">No articles found.</p>
              </div>
            ) : (
              <div className="flex flex-col justify-between flex-1 min-h-0">
                <CardCollection
                  view={view}
                  items={currentBatch}
                  keyOf={(post) => post.slug}
                  gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 flex-1 items-stretch"
                  renderItem={(post) => (
                    <ScrollReveal amount={0.05} className="h-full">
                      <BlogCard post={post} view={view} />
                    </ScrollReveal>
                  )}
                />
                <BatchPagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </div>
        </PublicSnapSection>
        <section className="relative w-full min-h-dvh snap-section bg-bg-alt">
          <LandingFinalCtaSection user={user} />
        </section>

        <section className="w-full bg-bg pt-10 md:pt-0 snap-section">
          <Footer />
        </section>
      </PublicSnapLayout>
    </div>
  );
};

export default BlogsPage;
