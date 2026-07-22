import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, type LanguageCode } from '@/i18n';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  inverted?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ inverted = false }) => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  const grouped = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.native.toLowerCase().includes(search.toLowerCase())
  ).reduce(
    (acc, lang) => {
      (acc[lang.region] ||= []).push(lang);
      return acc;
    },
    {} as Record<string, typeof LANGUAGES[number][]>
  );

  const regions = ['West Africa', 'East Africa', 'Southern Africa', 'Central Africa', 'Global'].filter(
    (r) => grouped[r]?.length
  );

  const select = (code: LanguageCode) => {
    localStorage.setItem('qyvora-lang', code);
    document.documentElement.lang = code;
    const lang = LANGUAGES.find((l) => l.code === code);
    const dir = (lang && 'dir' in lang ? lang.dir : 'ltr') as string;
    document.documentElement.dir = dir;
    i18n.changeLanguage(code).then(() => {
      window.location.reload();
    });
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all ${
          inverted
            ? 'border-bg/30 text-bg hover:bg-bg/10'
            : 'border-border text-text-muted hover:text-accent hover:border-accent/40'
        }`}
        aria-label="Change language"
      >
        <Globe size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 max-h-[420px] bg-bg-card border border-border rounded-2xl shadow-2xl z-[80] overflow-hidden flex flex-col">
          <div className="p-3 border-b border-border">
            <input
              ref={inputRef}
              type="text"
              placeholder={t('components.language.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-bg border border-border text-text-primary text-sm font-mono placeholder:text-text-muted/50 focus:border-accent outline-none"
            />
          </div>

          <div className="overflow-y-auto flex-1 p-2">
            {regions.map((region) => (
              <div key={region} className="mb-2">
                <div className="px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.25em] text-text-muted/60">
                  {region}
                </div>
                {grouped[region]?.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => select(lang.code)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                      i18n.language === lang.code
                        ? 'bg-accent/10 text-accent'
                        : 'text-text-primary hover:bg-accent-dim/50 hover:text-accent'
                    }`}
                  >
                    <span className="text-sm font-mono min-w-[20px]">{lang.code.toUpperCase()}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate">{lang.native}</div>
                      <div className="text-[10px] text-text-muted truncate">{lang.name}</div>
                    </div>
                    {i18n.language === lang.code && (
                      <span className="text-accent text-lg">&#10003;</span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
