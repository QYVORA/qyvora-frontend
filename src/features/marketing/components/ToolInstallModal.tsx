import React, { useEffect, useRef, useState } from 'react';
import { Apple, Check, Copy, Download, Loader2, Terminal } from 'lucide-react';
import {
  TOOL_INSTALL_CONFIG,
  ToolArch,
  ToolInstallKey,
  ToolPlatform,
} from '../data/toolInstallConfig';
import { Dialog, DialogContent } from '../../../shared/components/ui/Dialog';
import CodeBlock from '../../../shared/components/CodeBlock';

const TOOL_INSTALL_EVENT = 'qyvora:open-tool-install';

export function openToolInstall(tool: ToolInstallKey) {
  window.dispatchEvent(new CustomEvent(TOOL_INSTALL_EVENT, { detail: { tool } }));
}

const PLATFORMS: { key: ToolPlatform; label: string; icon: React.ReactNode }[] = [
  { key: 'linux', label: 'Linux', icon: <Terminal className="h-3.5 w-3.5" /> },
  { key: 'darwin', label: 'macOS', icon: <Apple className="h-3.5 w-3.5" /> },
  { key: 'windows', label: 'Windows', icon: <Terminal className="h-3.5 w-3.5" /> },
];

function detectPlatform(): ToolPlatform {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('win')) return 'windows';
  if (ua.includes('mac') || ua.includes('darwin') || ua.includes('iphone')) return 'darwin';
  return 'linux';
}

function detectArch(): ToolArch {
  const uaData = (navigator as Navigator & { userAgentData?: { architecture?: string } })
    .userAgentData;
  const arch = (uaData?.architecture ?? navigator.userAgent).toLowerCase();
  if (arch.includes('arm') || arch.includes('aarch')) return 'arm64';
  return 'amd64';
}

const ToolInstallModalHost: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [tool, setTool] = useState<ToolInstallKey>('anansi');
  const [platform, setPlatform] = useState<ToolPlatform>('linux');
  const [arch, setArch] = useState<ToolArch>('amd64');
  const [downloaded, setDownloaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const downloadedRef = useRef(false);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.tool && TOOL_INSTALL_CONFIG[detail.tool as ToolInstallKey]) {
        setTool(detail.tool as ToolInstallKey);
      }
      setPlatform(detectPlatform());
      setArch(detectArch());
      downloadedRef.current = false;
      setDownloaded(false);
      setOpen(true);
    };
    window.addEventListener(TOOL_INSTALL_EVENT, handleOpen);
    return () => window.removeEventListener(TOOL_INSTALL_EVENT, handleOpen);
  }, []);

  useEffect(() => {
    if (!open) {
      setCopied(false);
    }
  }, [open]);

  const cfg = TOOL_INSTALL_CONFIG[tool];
  const platformAssets = cfg.assets[platform];
  const asset =
    platformAssets?.[arch] ?? platformAssets?.amd64 ?? Object.values(platformAssets ?? {})[0];
  const assetUrl = asset ? `${cfg.releaseBase}/${asset}` : '';
  const supportsArch = Boolean(platformAssets?.arm64);
  const activeArch: ToolArch = supportsArch ? arch : 'amd64';

  // Auto-download the detected binary as soon as the modal opens.
  useEffect(() => {
    if (!open || !assetUrl || downloadedRef.current) return;
    downloadedRef.current = true;
    const timer = window.setTimeout(() => {
      const anchor = document.createElement('a');
      anchor.href = assetUrl;
      anchor.rel = 'noopener noreferrer';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      setDownloaded(true);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [open, assetUrl]);

  const command = cfg.commandTemplates[platform]
    .replaceAll('{url}', assetUrl)
    .replaceAll('{bin}', cfg.bin);

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable — ignore.
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent title={`Install ${cfg.displayName}`} maxWidth="max-w-lg">
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-accent/5 p-4">
            <p className="text-xs text-text-secondary leading-relaxed">{cfg.note}</p>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
              Operating System
            </p>
            <div className="grid grid-cols-3 gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPlatform(p.key)}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors ${
                    platform === p.key
                      ? 'border-accent/50 bg-accent/10 text-accent'
                      : 'border-border/30 text-text-muted hover:border-accent/40 hover:text-accent'
                  }`}
                >
                  {p.icon}
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {supportsArch && (
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                Architecture
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(['amd64', 'arm64'] as ToolArch[]).map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setArch(a)}
                    className={`rounded-xl border px-2 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors ${
                      activeArch === a
                        ? 'border-accent/50 bg-accent/10 text-accent'
                        : 'border-border/30 text-text-muted hover:border-accent/40 hover:text-accent'
                    }`}
                  >
                    {a === 'arm64' ? 'arm64' : 'x86_64'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
              Binary
            </p>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/30 bg-bg px-4 py-3">
              <span className="min-w-0 truncate font-mono text-[11px] text-text-secondary">
                {asset ?? 'Unavailable for this platform'}
              </span>
              <button
                type="button"
                disabled={!assetUrl}
                onClick={() => {
                  const anchor = document.createElement('a');
                  anchor.href = assetUrl;
                  anchor.rel = 'noopener noreferrer';
                  document.body.appendChild(anchor);
                  anchor.click();
                  document.body.removeChild(anchor);
                  setDownloaded(true);
                }}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-accent/40 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
              >
                {downloaded ? <Check className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
                {downloaded ? 'Downloaded' : 'Download'}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
              Or install from the terminal
            </p>
            <CodeBlock code={command} lang="sh" copyable />
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border/20 bg-bg-alt px-4 py-3">
            <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-accent" />
            <p className="text-[11px] text-text-muted leading-snug">
              {copied
                ? 'Command copied to clipboard.'
                : 'Your download should start automatically — check your browser downloads.'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ToolInstallModalHost;
