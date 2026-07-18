import { useState, useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react';
import { IconChevronRight, IconSearch } from '@/shared/components/icons';
import { Skeleton } from '@/shared/components/ui';

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  sortable?: boolean;
  hideOnMobile?: boolean;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  pageSize?: number;
  emptyIcon?: ReactNode;
  emptyTitle?: string;
  emptyAction?: ReactNode;
  mobileCard?: (item: T) => ReactNode;
  minWidth?: string;
}

function DataTable<T>({
  data, columns, keyExtractor, loading, searchable, searchPlaceholder,
  searchFilter, pageSize: initialPageSize = 25, emptyIcon, emptyTitle, emptyAction,
  mobileCard, minWidth = 'min-w-[640px]',
}: DataTableProps<T>) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    if (!query.trim() || !searchFilter) return data;
    const q = query.toLowerCase();
    return data.filter((item) => searchFilter(item, q));
  }, [data, query, searchFilter]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a: any, b: any) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (va == null) return 1;
      if (vb == null) return -1;
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-14 rounded-xl bg-bg-card border border-border animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {(searchable || searchFilter) && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xs">
            <IconSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder={searchPlaceholder ?? t('components.dataTable.searchPlaceholder')}
              className="w-full bg-bg border border-border/60 rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-all"
            />
          </div>
          <span className="text-xs text-text-muted font-mono">{t('components.dataTable.resultsCount', { count: sorted.length })}</span>
        </div>
      )}

      {paginated.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border py-12 text-center">
          {emptyIcon && <div className="mx-auto mb-3 opacity-30">{emptyIcon}</div>}
          <p className="text-sm text-text-muted font-bold">{emptyTitle ?? t('components.dataTable.noData')}</p>
          {emptyAction}
        </div>
      ) : (
        <>
          {/* Mobile card view */}
          {mobileCard && (
            <div className="md:hidden space-y-4">
              {paginated.map((item) => (
                <div key={keyExtractor(item)}>{mobileCard(item)}</div>
              ))}
            </div>
          )}

          {/* Desktop table view */}
          <div className="hidden md:block bg-transparent overflow-hidden">
            <div className="overflow-x-auto">
              <table className={`w-full text-left ${minWidth}`}>
                <thead className="bg-bg-elevated/50 backdrop-blur-sm">
                  <tr>
                    {columns
                      .filter((c) => !c.hideOnMobile)
                      .map((col) => (
                        <th
                          key={col.key}
                          className={`px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-text-muted/60 ${col.sortable ? 'cursor-pointer hover:text-accent select-none' : ''} ${col.headerClassName ?? ''}`}
                          onClick={() => col.sortable && handleSort(col.key)}
                        >
                          <span className="flex items-center gap-2">
                            {col.header}
                            {sortKey === col.key && (
                              <span className="text-accent text-[8px]">{sortDir === 'asc' ? '▲' : '▼'}</span>
                            )}
                          </span>
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {paginated.map((item) => (
                    <tr key={keyExtractor(item)} className="hover:bg-accent-dim/5 transition-colors group">
                      {columns
                        .filter((c) => !c.hideOnMobile)
                        .map((col) => (
                          <td key={col.key} className={`px-6 py-6 ${col.className ?? ''}`}>
                            {col.render(item)}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                  className="bg-bg-elevated rounded-lg px-3 py-2 text-[10px] font-black text-text-primary outline-none cursor-pointer"
                >
                  {[10, 25, 50, 100].map((n) => (
                    <option key={n} value={n}>{t('components.dataTable.itemsPerPage', { n })}</option>
                  ))}
                </select>
                <span className="text-[10px] font-mono text-text-muted">
                  {t('components.dataTable.pageOf', { page: safePage, total: totalPages })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-bg-elevated text-text-muted disabled:opacity-50 hover:text-accent transition-all active:scale-90 shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-bg-elevated text-text-muted disabled:opacity-50 hover:text-accent transition-all active:scale-90 shadow-sm"
                >
                  <IconChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export { Skeleton as TableSkeleton };
export default DataTable;
