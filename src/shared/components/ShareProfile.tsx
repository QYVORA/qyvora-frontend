import { useState, useCallback } from 'react';
import { Share2, X, Linkedin, MessageCircle, Mail } from 'lucide-react';
import { BrandXIcon, IconCheck } from '@/shared/components/icons';
import { Dialog, DialogContent } from '@/shared/components/ui/Dialog';

const PLATFORMS = [
  {
    id: 'x',
    name: 'X',
    icon: <BrandXIcon className="w-5 h-5" />,
    color: 'hover:bg-black hover:text-white border-black/20',
    getUrl: (url: string, text: string) =>
      `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <Linkedin className="w-5 h-5" />,
    color: 'hover:bg-[#0A66C2] hover:text-white border-[#0A66C2]/20',
    getUrl: (url: string, text: string) =>
      `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: <MessageCircle className="w-5 h-5" />,
    color: 'hover:bg-[#25D366] hover:text-black border-[#25D366]/20',
    getUrl: (url: string, text: string) =>
      `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
  },
  {
    id: 'email',
    name: 'Email',
    icon: <Mail className="w-5 h-5" />,
    color: 'hover:bg-accent hover:text-bg border-accent/20',
    getUrl: (url: string, text: string) =>
      `mailto:?subject=${encodeURIComponent('QYVORA Profile')}&body=${encodeURIComponent(text + '\n' + url)}`,
  },
  {
    id: 'copy',
    name: 'Copy Link',
    icon: <Share2 className="w-5 h-5" />,
    color: 'hover:bg-accent hover:text-bg border-accent/20',
    getUrl: () => '',
  },
];

const ShareProfile = ({ handle }: { handle: string }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const profileUrl = `${window.location.origin}/@${encodeURIComponent(handle)}`;
  const shareText = `Check out ${handle}'s cybersecurity operator profile on QYVORA`;

  const handleShare = async (id: string) => {
    if (id === 'copy') {
      try {
        await navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch { /* fallback */ }
      return;
    }

    const platform = PLATFORMS.find((p) => p.id === id);
    if (!platform) return;

    const url = platform.getUrl(profileUrl, shareText);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
    }
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-bg border border-border hover:border-accent/50 rounded-xl text-xs font-black uppercase tracking-widest text-text-muted transition-all active:scale-95"
        aria-label="Share profile"
      >
        <Share2 className="w-3.5 h-3.5" />
        Share
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title="Share Profile" maxWidth="max-w-md">
          <div className="space-y-5" onKeyDown={handleKeyDown}>
            <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
              <p className="text-xs text-text-secondary leading-relaxed">
                {shareText}
              </p>
              <p className="text-xs text-text-muted font-mono mt-2 truncate">
                {profileUrl}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                Choose Platform
              </p>
              <div className="grid grid-cols-2 gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      handleShare(p.id);
                      if (p.id !== 'copy') setOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-border text-xs font-bold text-text-primary transition-all ${p.color}`}
                  >
                    {p.id === 'copy' && copied ? <IconCheck size={20} className="text-accent" /> : p.icon}
                    {copied && p.id === 'copy' ? 'Copied!' : p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareProfile;