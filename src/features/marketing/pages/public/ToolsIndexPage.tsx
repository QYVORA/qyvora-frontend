import React, { useMemo, useRef, useState } from 'react';
import { ArrowRight, Library, Search } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import SEO from '@/shared/components/SEO';
import {
  TOOLS as TOOL_REGISTRY,
  TOOL_DOMAIN_LABELS,
  TOOL_DOMAIN_ORDER,
  type ToolDomain,
} from '@/features/marketing/data/tools/registry';

interface ToolCard {
  path: string;
  name: string;
  logo?: string;
  title: string;
  category: ToolDomain;
  desc: string;
}

/**
 * The index is a projection of the tool registry, never a second hand-written
 * list. Registry entries own the name, logo and one-line summary, so a card can
 * never advertise a description that has drifted from the tool's own page — and
 * a tool that gains a registry entry (with a route, a doc page and a sitemap
 * entry) appears here automatically.
 *
 * Categories use `TOOL_DOMAIN_LABELS` so the chips match the grouping used by
 * the tool sidebar, instead of a second, finer taxonomy that only existed here.
 */
const TOOLS: ToolCard[] = TOOL_REGISTRY.map((tool) => ({
  path: tool.path,
  name: tool.name,
  logo: tool.logo,
  title: tool.displayName,
  category: tool.domain,
  desc: tool.summary,
}));


/**
 * ToolsIndexPage — calm index of the open-source tool docs. One compact card
 * per tool, whole card links to the documentation page. Category chips + search
 * filter the grid the same way the blogs page does.
 */
const ToolsIndexPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolDomain | ''>('');
  const resultsRef = useRef<HTMLDivElement>(null);

  // Registry order, so the chips read in the same order as the tool sidebar.
  const allCategories = useMemo(
    () => TOOL_DOMAIN_ORDER.filter((domain) => TOOLS.some((t) => t.category === domain)),
    [],
  );

  const filtered = useMemo(() => {
    let result = TOOLS;
    if (activeCategory) result = result.filter((t) => t.category === activeCategory);
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q),
      );
    }
    return result;
  }, [activeCategory, query]);

  const chooseCategory = (category: ToolDomain | '') => {
    setActiveCategory(category);
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return (
    <div className="w-full bg-canvas">
      <SEO
        title={"Tools | QYVORA"}
        description={"Open-source offensive security tools, documented for operators."}
      />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker={"Open-source tooling"}
          title={"Combat-ready tools, documented end to end."}

          description={`${TOOLS.length} open-source offensive security tools, built and documented for operators. Each tool has full documentation, install guides, and walkthroughs.`}
        />

        <div className="mt-10 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => chooseCategory('')}
              aria-pressed={!activeCategory}
              className={`inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-xl px-3 text-xs font-black uppercase tracking-widest transition-colors ${
                !activeCategory ? 'bg-accent text-on-accent' : 'border border-border bg-surface-raised text-text-muted hover:border-accent/50 hover:text-accent'
              }`}
            >
              All
            </button>
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => chooseCategory(category)}
                aria-pressed={activeCategory === category}
                className={`inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-xl px-3 text-xs font-black uppercase tracking-widest transition-colors ${
                  activeCategory === category ? 'bg-accent text-on-accent' : 'border border-border bg-surface-raised text-text-muted hover:border-accent/50 hover:text-accent'
                }`}
              >
                {TOOL_DOMAIN_LABELS[category]}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools..."
              aria-label="Search tools"
              className="w-full rounded-xl border border-border-subtle bg-surface py-3 pl-10 pr-3 text-sm text-text-primary transition-colors outline-none focus:border-accent"
            />
          </div>
          <p className="type-meta" role="status" aria-live="polite">
            {filtered.length === TOOLS.length
              ? `${TOOLS.length} tools`
              : `${filtered.length} of ${TOOLS.length} tools${activeCategory ? ` · ${TOOL_DOMAIN_LABELS[activeCategory]}` : ''}`}
          </p>
        </div>

        <div ref={resultsRef} className="mt-8 scroll-mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" tabIndex={-1}>
          {filtered.map((tool) => (
            <Card key={tool.path} to={tool.path} interactive className="flex h-full flex-col gap-5 p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-canvas p-2">
                  {tool.logo ? (
                    <img
                      src={tool.logo}
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Library className="h-7 w-7 text-accent" aria-hidden="true" />
                  )}
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-black uppercase tracking-tight text-text-primary">
                    {tool.title}
                  </h3>
                  <span className="type-meta text-text-tertiary">{tool.name}</span>
                </div>
              </div>

              <p className="type-body-sm flex-1 line-clamp-3">{tool.desc}</p>

              <span className="flex items-center gap-1.5 pt-1 text-sm font-bold text-accent">
                {"Read the docs"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Card>
          ))}
        </div>
      </PublicContainer>
    </div>
  );
};

export default ToolsIndexPage;