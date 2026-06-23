import { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, RefreshCw, Check } from 'lucide-react';
import api from '@/core/services/api';

interface HandleSuggestionsProps {
  name: string;
  email?: string;
  onSelect: (handle: string) => void;
  selectedHandle?: string;
}

const HandleSuggestions = ({ name, email, onSelect, selectedHandle }: HandleSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(async (fullName: string) => {
    if (!fullName || fullName.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/suggest-handles', { name: fullName, email: email || '' });
      const list: string[] = res.data?.suggestions || [];
      setSuggestions(list.filter((h: string) => h !== selectedHandle).slice(0, 4));
    } catch {
      setError('Could not load suggestions.');
    } finally {
      setLoading(false);
    }
  }, [email, selectedHandle]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!name || name.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(() => fetchSuggestions(name), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [name, fetchSuggestions]);

  if (!name || name.trim().length < 2) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Sparkles className="w-3 h-3 text-accent" />
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
          Suggested handles
        </span>
        {suggestions.length > 0 && (
          <button
            type="button"
            onClick={() => fetchSuggestions(name)}
            disabled={loading}
            className="ml-auto text-[10px] text-accent hover:text-accent/80 font-bold uppercase tracking-wider transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {loading && suggestions.length === 0 && (
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-8 w-24 rounded-lg bg-bg-card border border-border animate-pulse"
            />
          ))}
        </div>
      )}

      {error && (
        <p className="text-[10px] text-red-400">{error}</p>
      )}

      {suggestions.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {suggestions.map((handle) => (
            <button
              key={handle}
              type="button"
              onClick={() => onSelect(handle)}
              className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all active:scale-95 ${
                selectedHandle === handle
                  ? 'bg-accent/15 border-accent text-accent'
                  : 'bg-bg-card border-border text-text-primary hover:border-accent/50 hover:bg-accent/5'
              }`}
            >
              <span className="text-text-muted group-hover:text-accent/60 transition-colors">@</span>
              {handle}
              {selectedHandle === handle && (
                <Check className="w-3 h-3 ml-0.5" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HandleSuggestions;
