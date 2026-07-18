import { useState, useCallback } from 'react';
import { Globe, ArrowLeft, ArrowRight, RotateCcw, Lock, Cookie, Code, Eye } from 'lucide-react';
import type { BrowserPage } from './types';
import { useSimulation } from './SimulationContext';

interface BrowserSimProps {
  pages: BrowserPage[];
  defaultUrl?: string;
}

export function BrowserSimulation({ pages, defaultUrl }: BrowserSimProps) {
  const { browser: browserSim } = useSimulation();
  const { browser, setBrowserUrl, addBrowserPage } = browserSim;
  const [urlInput, setUrlInput] = useState(defaultUrl || browser.url);
  const [showSource, setShowSource] = useState(false);
  const [showHeaders, setShowHeaders] = useState(false);
  const [showCookies, setShowCookies] = useState(false);

  const currentPage = pages.find(p => p.url === browser.url) || pages[0];

  const navigate = useCallback((url: string) => {
    setBrowserUrl(url);
    setUrlInput(url);
    const page = pages.find(p => p.url === url);
    if (page) addBrowserPage(page);
  }, [pages, setBrowserUrl, addBrowserPage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(urlInput);
  };

  const goBack = () => {
    if (browser.historyIndex > 0) {
      const newIndex = browser.historyIndex - 1;
      const url = browser.history[newIndex];
      setBrowserUrl(url);
      setUrlInput(url);
    }
  };

  const goForward = () => {
    if (browser.historyIndex < browser.history.length - 1) {
      const newIndex = browser.historyIndex + 1;
      const url = browser.history[newIndex];
      setBrowserUrl(url);
      setUrlInput(url);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
      {/* Browser Chrome */}
      <div className="flex items-center gap-2 px-3 py-2 bg-bg-elevated border-b border-border/20">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <div className="w-3 h-3 rounded-full bg-green-400/80" />
        </div>

        <div className="flex items-center gap-1 ml-2">
          <button onClick={goBack} disabled={browser.historyIndex <= 0}
            aria-label="Go back" className="p-1 rounded hover:bg-white/5 text-text-muted disabled:opacity-30">
            <ArrowLeft size={14} />
          </button>
          <button onClick={goForward} disabled={browser.historyIndex >= browser.history.length - 1}
            aria-label="Go forward" className="p-1 rounded hover:bg-white/5 text-text-muted disabled:opacity-30">
            <ArrowRight size={14} />
          </button>
          <button onClick={() => navigate(browser.url)}
            aria-label="Refresh page" className="p-1 rounded hover:bg-white/5 text-text-muted">
            <RotateCcw size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 mx-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg border border-border/30">
            <label htmlFor="browser-url-input" className="contents">
              {currentPage?.url.startsWith('https') ? (
                <Lock size={12} className="text-green-400 shrink-0" />
              ) : (
                <Globe size={12} className="text-text-muted shrink-0" />
              )}
            </label>
            <input
              id="browser-url-input"
              type="text"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              className="flex-1 bg-transparent text-[11px] font-mono text-text-primary outline-none"
              placeholder="Enter URL..."
            />
          </div>
        </form>

        <div className="flex items-center gap-1">
          <button onClick={() => setShowSource(!showSource)}
            aria-label="View source" className={`p-1.5 rounded text-[9px] font-black uppercase tracking-wider ${showSource ? 'bg-accent/20 text-accent' : 'hover:bg-white/5 text-text-muted'}`}>
            <Code size={14} />
          </button>
          <button onClick={() => setShowHeaders(!showHeaders)}
            aria-label="Preview" className={`p-1.5 rounded text-[9px] font-black uppercase tracking-wider ${showHeaders ? 'bg-accent/20 text-accent' : 'hover:bg-white/5 text-text-muted'}`}>
            <Eye size={14} />
          </button>
          <button onClick={() => setShowCookies(!showCookies)}
            aria-label="View cookies" className={`p-1.5 rounded text-[9px] font-black uppercase tracking-wider ${showCookies ? 'bg-accent/20 text-accent' : 'hover:bg-white/5 text-text-muted'}`}>
            <Cookie size={14} />
          </button>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 min-h-0 flex flex-col">
        {/* Source / Headers / Cookies panels */}
        {showSource && currentPage && (
          <div className="max-h-[200px] overflow-auto border-b border-border/20 bg-black/40 p-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-2">Page Source</p>
            <pre className="text-[10px] font-mono text-text-muted whitespace-pre-wrap break-all">
              {currentPage.html}
            </pre>
          </div>
        )}
        {showHeaders && currentPage && (
          <div className="max-h-[200px] overflow-auto border-b border-border/20 bg-black/40 p-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-2">Response Headers</p>
            {Object.entries(currentPage.headers).map(([k, v]) => (
              <div key={k} className="text-[10px] font-mono">
                <span className="text-accent">{k}:</span>{' '}
                <span className="text-text-muted">{v}</span>
              </div>
            ))}
          </div>
        )}
        {showCookies && currentPage && (
          <div className="max-h-[200px] overflow-auto border-b border-border/20 bg-black/40 p-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-2">Cookies</p>
            {currentPage.cookies.length === 0 ? (
              <p className="text-[10px] font-mono text-text-muted/50">No cookies</p>
            ) : (
              currentPage.cookies.map((c, i) => (
                <div key={i} className="text-[10px] font-mono text-text-muted mb-1">
                  <span className="text-accent">{c.name}</span> = <span className="text-text-primary">{c.value}</span>
                  {c.httpOnly && <span className="ml-2 text-yellow-400">[HttpOnly]</span>}
                  {c.secure && <span className="ml-2 text-green-400">[Secure]</span>}
                </div>
              ))
            )}
          </div>
        )}

        {/* Rendered page */}
        <div className="flex-1 overflow-auto bg-white">
          {currentPage ? (
            <div dangerouslySetInnerHTML={{ __html: currentPage.html }} className="p-4 text-xs text-black" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              <p>No page loaded. Enter a URL above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
