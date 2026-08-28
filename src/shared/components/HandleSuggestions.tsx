import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, RefreshCw } from 'lucide-react';
import { IconCheck } from '@/shared/components/icons';
import api from '@/core/services/api';

interface HandleSuggestionsProps {
  name: string;
  email?: string;
  onSelect: (handle: string) => void;
  selectedHandle?: string;
}

const HandleSuggestions = ({ name, email, onSelect, selectedHandle }: HandleSuggestionsProps) => {
  const { t } = useTranslation();
  const [debouncedName, setDebouncedName] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedHandleRef = useRef(selectedHandle);
  selectedHandleRef.current = selectedHandle;

  const fetchSuggestions = useCallback(async (fullName: string) => {
    if (!fullName || fullName.trim().length < 2) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/suggest-handles', { name: fullName, email: email || '' });
      const list: string[] = res.data?.suggestions || [];
      setSuggestions(list.filter((h: string) => h !== selectedHandleRef.current).slice(0, 4));
    } catch {
      setError(t('components.handleSuggestions.error'));
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [email, t]);

  useEffect(() => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setDebouncedName('');
      return;
    }
    const timer = setTimeout(() => setDebouncedName(trimmed), 300);
    return () => clearTimeout(timer);
  }, [name]);

  useEffect(() => {
    if (debouncedName.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      setError('');
      return;
    }
    fetchSuggestions(debouncedName);
  }, [debouncedName, fetchSuggestions]);

  if (!debouncedName) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Sparkles className="w-3 h-3 text-accent" />
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
          {t('components.handleSuggestions.label')}
        </span>
        {suggestions.length > 0 && (
          <button
            type="button"
            onClick={() => fetchSuggestions(debouncedName)}
            disabled={loading}
            className="ml-auto text-[10px] text-accent hover:text-accent/80 font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      <div className="min-h-8">
        {loading ? (
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-8 w-24 rounded-lg bg-bg-card border border-border animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-[10px] text-danger">{error}</p>
        ) : suggestions.length > 0 ? (
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
                  <IconCheck size={12} className="ml-0.5" />
                )}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HandleSuggestions;
