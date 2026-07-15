import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Map, Swords, Globe } from 'lucide-react';
import { IconSearch, IconX } from '@/shared/components/icons';
import { BOOTCAMP_CONFIG } from '../../constants/bootcampConfig';
import { COURSES } from '../../data/courses/courseData';
import api from '@/core/services/api';

const SEARCHABLE_PAGES = [
  { label: 'Competitive', path: '/dashboard/competitive', icon: Swords },
  { label: 'Networks', path: '/dashboard/networks', icon: Globe },
  { label: 'Learning Paths', path: '/dashboard/bootcamps', icon: Map },
];

interface SearchBarProps {
  onSearch?: () => void;
  compact?: boolean;
  onClose?: () => void;
}

const SearchBar = ({ onSearch, compact, onClose }: SearchBarProps) => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIdx, setSelectedSuggestionIdx] = useState(-1);
  const [bootcamps, setBootcamps] = useState<any[]>([]);

  const searchRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get('/public/bootcamps').then(res => {
      if (Array.isArray(res?.data?.items)) setBootcamps(res.data.items);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 150);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setSelectedSuggestionIdx(-1);
  }, [searchQuery]);

  const allRooms = useMemo(() => BOOTCAMP_CONFIG.phases.flatMap(p => p.rooms.map(r => ({ ...r, phase: p }))), []);

  const suggestions = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q || q.length < 1) return [];

    const items: { id: string; label: string; type: 'room' | 'course' | 'bootcamp' | 'page'; path: string; icon: React.ComponentType<{ className?: string }> }[] = [];

    for (const room of allRooms) {
      if (items.length >= 8) break;
      const stepMatch = room.steps.some(s => s.title.toLowerCase().includes(q) || s.instruction.toLowerCase().includes(q));
      if (room.title.toLowerCase().includes(q) || room.overview.toLowerCase().includes(q) || stepMatch) {
        items.push({ id: room.id, label: room.title, type: 'room', path: `/dashboard/bootcamps/bc_1775270338500/phases/${room.phase.id}/rooms/${room.id}`, icon: BookOpen });
      }
    }

    for (const course of COURSES) {
      if (items.length >= 12) break;
      if (course.title.toLowerCase().includes(q) || course.description.toLowerCase().includes(q)) {
        items.push({ id: course.id, label: course.title, type: 'course', path: `/dashboard/courses/${course.id}`, icon: BookOpen });
      }
    }

    for (const page of SEARCHABLE_PAGES) {
      if (items.length >= 14) break;
      if (page.label.toLowerCase().includes(q)) {
        items.push({ id: page.path, label: page.label, type: 'page', path: page.path, icon: page.icon });
      }
    }

    return items;
  }, [debouncedQuery, allRooms]);

  useEffect(() => {
    if (!showSuggestions) return;
    const handler = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) &&
          searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showSuggestions]);

  const handleSuggestionClick = useCallback((path: string) => {
    setSearchQuery('');
    setShowSuggestions(false);
    navigate(path);
    onSearch?.();
    onClose?.();
  }, [navigate, onSearch, onClose]);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    if (selectedSuggestionIdx >= 0 && suggestions[selectedSuggestionIdx]) {
      handleSuggestionClick(suggestions[selectedSuggestionIdx].path);
      return;
    }
    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0].path);
      return;
    }
  }, [searchQuery, selectedSuggestionIdx, suggestions, handleSuggestionClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'ArrowDown') setShowSuggestions(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIdx(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIdx(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && selectedSuggestionIdx >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedSuggestionIdx].path);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  }, [showSuggestions, suggestions, selectedSuggestionIdx, handleSuggestionClick]);

  if (compact) {
    return (
      <div className="relative w-full">
        <form onSubmit={handleFormSubmit} className="relative" onKeyDown={handleKeyDown}>
          <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => { if (searchQuery.trim()) setShowSuggestions(true); }}
            placeholder="Search rooms, paths, topics..."
            className="w-full bg-bg-elevated border border-border rounded-xl py-2.5 pl-10 pr-10 text-sm text-text-primary placeholder:text-text-muted/50 font-mono outline-none focus:border-accent transition-all"
            autoComplete="off"
            role="combobox"
            aria-expanded={showSuggestions}
            aria-controls="search-suggestions"
            aria-activedescendant={selectedSuggestionIdx >= 0 ? `suggestion-${selectedSuggestionIdx}` : undefined}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setShowSuggestions(false); searchRef.current?.focus(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-text-muted hover:text-text-primary transition-colors"
              aria-label="Clear search"
            >
              <IconX size={16} />
            </button>
          )}
        </form>
        {showSuggestions && debouncedQuery.trim() && suggestions.length > 0 && (
          <div
            id="search-suggestions"
            ref={suggestionsRef}
            role="listbox"
            className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border border-border/40 bg-bg-card shadow-2xl overflow-hidden"
          >
            {suggestions.map((s, i) => {
              const Icon = s.icon;
              return (
                <button
                  key={`${s.type}-${s.id}`}
                  id={`suggestion-${i}`}
                  role="option"
                  aria-selected={i === selectedSuggestionIdx}
                  type="button"
                  onMouseDown={e => { e.preventDefault(); handleSuggestionClick(s.path); }}
                  onMouseEnter={() => setSelectedSuggestionIdx(i)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                    i === selectedSuggestionIdx ? 'bg-accent/10 text-accent' : 'text-text-primary hover:bg-accent-dim/10'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-accent/70" />
                  <span className="flex-1 min-w-0 truncate font-medium">{s.label}</span>
                  <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-text-muted">
                    {s.type === 'room' ? 'Room' : s.type === 'course' ? 'Course' : 'Page'}
                  </span>
                </button>
              );
            })}
            <div className="border-t border-border/20 px-4 py-2 text-[9px] font-mono text-text-muted/50 text-center">
              {suggestions.length} result{suggestions.length !== 1 ? 's' : ''} — use ↑↓ to navigate, Enter to open
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleFormSubmit} className="relative" onKeyDown={handleKeyDown}>
        <input
          ref={searchRef}
          type="text"
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
          onFocus={() => { if (searchQuery.trim()) setShowSuggestions(true); }}
          placeholder="Search rooms, bootcamps, courses..."
          className="w-full bg-bg-card border border-border/40 rounded-2xl pl-4 pr-16 py-3.5 text-sm font-mono text-text-primary placeholder:text-text-muted/30 outline-none focus:border-accent/40 transition-all caret-accent"
          autoComplete="off"
          role="combobox"
          aria-expanded={showSuggestions}
          aria-controls="search-suggestions"
          aria-activedescendant={selectedSuggestionIdx >= 0 ? `suggestion-${selectedSuggestionIdx}` : undefined}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => { setSearchQuery(''); setShowSuggestions(false); searchRef.current?.focus(); }}
            className="absolute right-12 top-1/2 -translate-y-1/2 p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-accent-dim/30 transition-colors"
            aria-label="Clear search"
          >
            <IconX size={16} />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-text-muted hover:text-accent transition-colors"
          aria-label="Search"
        >
          <IconSearch size={16} />
        </button>
      </form>
      {showSuggestions && debouncedQuery.trim() && suggestions.length > 0 && (
        <div
          id="search-suggestions"
          ref={suggestionsRef}
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border border-border/40 bg-bg-card shadow-2xl overflow-hidden"
        >
          {suggestions.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={`${s.type}-${s.id}`}
                id={`suggestion-${i}`}
                role="option"
                aria-selected={i === selectedSuggestionIdx}
                type="button"
                onMouseDown={e => { e.preventDefault(); handleSuggestionClick(s.path); }}
                onMouseEnter={() => setSelectedSuggestionIdx(i)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                  i === selectedSuggestionIdx ? 'bg-accent/10 text-accent' : 'text-text-primary hover:bg-accent-dim/10'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0 text-accent/70" />
                <span className="flex-1 min-w-0 truncate font-medium">{s.label}</span>
                <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-text-muted">
                  {s.type === 'room' ? 'Room' : s.type === 'course' ? 'Course' : s.type === 'page' ? 'Page' : 'Bootcamp'}
                </span>
              </button>
            );
          })}
          <div className="border-t border-border/20 px-4 py-2 text-[9px] font-mono text-text-muted/50 text-center">
            {suggestions.length} result{suggestions.length !== 1 ? 's' : ''} — use ↑↓ to navigate, Enter to open
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
