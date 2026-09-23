import { useMemo, useRef, useState } from 'react';
import { Search, FileText } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import EmptyState from '@/shared/components/ui/EmptyState';
import { BLOG_POSTS } from '@/features/marketing/pages/BlogsPage/blogContent';
import BlogCard from './cards/BlogCard';

const BlogsPage = () => {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    BLOG_POSTS.forEach((p) => p.tags?.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, []);

  const filtered = useMemo(() => {
    let result = BLOG_POSTS;
    if (activeTag) result = result.filter((p) => p.tags?.includes(activeTag));
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((p) => p.title?.toLowerCase().includes(q) || p.excerpt?.toLowerCase().includes(q));
    }
    return result;
  }, [activeTag, query]);

  const chooseTag = (tag: string) => {
    setActiveTag(tag);
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return (
    <div className="min-h-full w-full bg-canvas">
      <SEO title="Blogs - QYVORA" description="Security research, tutorials, and updates from the QYVORA team." />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker={"QYVORA · Intelligence"}
          title="Intelligence Reports"
          description="Security research, walkthroughs, and platform updates from the QYVORA team."
          metadata={
            <span className="type-meta inline-flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              <span className="font-bold text-text-primary">{BLOG_POSTS.length}</span>
              {"Articles"}
            </span>
          }
        />

        <div className="mt-10">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => chooseTag('')}
                aria-pressed={!activeTag}
                className={`inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-xl px-3 text-xs font-black uppercase tracking-widest transition-colors ${
                  !activeTag ? 'bg-accent text-on-accent' : 'border border-border bg-surface-raised text-text-muted hover:border-accent/50 hover:text-accent'
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => chooseTag(tag)}
                  aria-pressed={activeTag === tag}
                  className={`inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-xl px-3 text-xs font-black uppercase tracking-widest transition-colors ${
                    activeTag === tag ? 'bg-accent text-on-accent' : 'border border-border bg-surface-raised text-text-muted hover:border-accent/50 hover:text-accent'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles..."
                aria-label="Search articles"
                className="w-full rounded-xl border border-border-subtle bg-surface py-3 pl-10 pr-3 text-sm text-text-primary transition-colors outline-none focus:border-accent"
              />
            </div>
            <p className="type-meta" role="status" aria-live="polite">
              {filtered.length === BLOG_POSTS.length
                ? `${BLOG_POSTS.length} articles`
                : `${filtered.length} of ${BLOG_POSTS.length} articles${activeTag ? ` · ${activeTag}` : ''}`}
            </p>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-6 w-6" />}
              title={"No articles found."}
              className="mt-8"
            />
          ) : (
            <div ref={resultsRef} className="mt-8 scroll-mt-24 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-4 items-stretch" tabIndex={-1}>
              {filtered.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </PublicContainer>
    </div>
  );
};

export default BlogsPage;