import { useState } from 'react';
import { Share2, Check, X, Linkedin } from 'lucide-react';
import { BrandXIcon } from '@/shared/components/icons';

const PLATFORMS = [
  {
    id: 'x',
    name: 'X',
    color: 'hover:bg-black hover:text-white border-black/20',
    getUrl: (url: string, text: string) =>
      `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    color: 'hover:bg-[#0A66C2] hover:text-white border-[#0A66C2]/20',
    getUrl: (url: string, text: string) =>
      `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    id: 'copy',
    name: 'Copy Link',
    color: 'hover:bg-accent hover:text-bg border-accent/20',
    getUrl: (_url: string) => '',
  },
];

const ShareProfile = ({ handle }: { handle: string }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const profileUrl = `${window.location.origin}/${encodeURIComponent(handle)}`;
  const shareText = `Check out ${handle}'s cybersecurity operator profile on QYVORA`;

  const handleShare = async (id: string) => {
    if (id === 'copy') {
      try {
        await navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch { /* fallback — user can copy manually */ }
      return;
    }

    const platform = PLATFORMS.find((p) => p.id === id);
    if (!platform) return;

    const url = platform.getUrl(profileUrl, shareText);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-bg border border-border hover:border-accent/50 rounded-xl text-xs font-black uppercase tracking-widest text-text-muted transition-all active:scale-95"
      >
        <Share2 className="w-3.5 h-3.5" />
        Share
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 min-w-[180px] bg-bg-card border border-border rounded-2xl p-2 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/40 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Share</span>
              <button onClick={() => setOpen(false)} className="text-text-muted hover:text-text-primary transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleShare(p.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-text-primary transition-all ${p.color}`}
                >
                  {p.id === 'x' ? (
                    <BrandXIcon className="w-4 h-4" />
                  ) : p.id === 'linkedin' ? (
                    <Linkedin className="w-4 h-4" />
                  ) : copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                  {copied && p.id === 'copy' ? 'Copied!' : p.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareProfile;
