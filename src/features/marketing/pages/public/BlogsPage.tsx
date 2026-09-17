import { useMemo, useState } from 'react';
import { Search, FileText } from 'lucide-react';
import { ScrollReveal } from '@/shared/components';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import EmptyState from '@/shared/components/ui/EmptyState';
import { BLOG_POSTS } from '@/features/marketing/pages/BlogsPage/blogContent';
import { BatchPagination } from '@/shared/components/ui';
import { CardCollection, ViewToggle, type ViewMode } from '@/shared/components/card-collection';
import BlogCard from './cards/BlogCard';

const BlogsPage = () => {
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

        <div className="mt-10 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="scroll-x no-scrollbar flex w-full min-w-0 flex-1 flex-nowrap items-center gap-1.5 sm:w-auto">
              <button
                onClick={() => handleTagChange('')}
                aria-pressed={!activeTag}
                className={`min-h-[44px] shrink-0 whitespace-nowrap rounded-xl px-3 text-xs font-black uppercase tracking-widest transition-colors ${
                  !activeTag ? 'bg-accent text-on-accent' : 'border border-border bg-surface-raised text-text-muted hover:border-accent/50 hover:text-accent'
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagChange(tag)}
                  aria-pressed={activeTag === tag}
                  className={`min-h-[44px] shrink-0 whitespace-nowrap rounded-xl px-3 text-xs font-black uppercase tracking-widest transition-colors ${
                    activeTag === tag ? 'bg-accent text-on-accent' : 'border border-border bg-surface-raised text-text-muted hover:border-accent/50 hover:text-accent'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="Search articles..."
                  aria-label="Search articles"
                  className="w-full rounded-xl border border-border-subtle bg-surface py-3 pl-10 pr-3 text-sm text-text-primary transition-colors outline-none focus:border-accent"
                />
              </div>
              <ViewToggle value={view} onChange={setView} label="Blog view mode" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-6 w-6" />}
              title={"No articles found."}
            />
          ) : (
            <div className="space-y-6">
              <CardCollection
                view={view}
                items={currentBatch}
                keyOf={(post) => post.slug}
                gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4 items-stretch"
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
      </PublicContainer>
    </div>
  );
};

export default BlogsPage;