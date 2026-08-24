import React, { useEffect, useMemo, useState } from 'react';
import { Apple, Check, Download, Loader2, Terminal, TriangleAlert } from 'lucide-react';
import {
  TOOL_INSTALL_CONFIG,
  ToolArch,
  ToolInstallKey,
  ToolPlatform,
} from '../data/toolInstallConfig';
import { useToolRelease } from '../hooks/useToolRelease';
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

function formatSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

const ToolInstallModalHost: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [tool, setTool] = useState<ToolInstallKey>('anansi');
  const [platform, setPlatform] = useState<ToolPlatform>('linux');
  const [arch, setArch] = useState<ToolArch>('amd64');
  const release = useToolRelease(tool);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.tool && TOOL_INSTALL_CONFIG[detail.tool as ToolInstallKey]) {
        setTool(detail.tool as ToolInstallKey);
      }
      setPlatform(detectPlatform());
      setArch(detectArch());
      setOpen(true);
    };
    window.addEventListener(TOOL_INSTALL_EVENT, handleOpen);
    return () => window.removeEventListener(TOOL_INSTALL_EVENT, handleOpen);
  }, []);

  const cfg = TOOL_INSTALL_CONFIG[tool];

  // Only platform/arch combinations that actually exist in the published
  // release are selectable. While the release is still loading every known
  // combination stays visible but inert.
  const availablePlatforms = useMemo(
    () =>
      PLATFORMS.filter(({ key }) =>
        release.status !== 'ready' ? true : (['amd64', 'arm64'] as ToolArch[]).some((a) => release.hasDownload(key, a)),
      ),
    [release],
  );
  const supportsArch =
    release.status !== 'ready'
      ? Boolean(cfg.assets[platform]?.arm64)
      : release.hasDownload(platform, 'arm64');
  const archChoices: ToolArch[] = supportsArch ? ['amd64', 'arm64'] : ['amd64'];
  const activeArch: ToolArch = supportsArch ? arch : 'amd64';

  const assetName = cfg.assets[platform]?.[activeArch];
  const assetUrl = release.status === 'ready' && assetName ? release.assetUrl(assetName) : '';
  const assetSize = release.status === 'ready' && assetName ? release.assetSize(assetName) : undefined;
  const canDownload = release.status === 'ready' && Boolean(assetUrl);

  const command = cfg.commandTemplates[platform]
    .replaceAll('{url}', assetName ? `${cfg.releaseBase}/${assetName}` : '')
    .replaceAll('{bin}', cfg.bin);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent title={`Install ${cfg.displayName}`} maxWidth="max-w-lg">
        <div className="space-y-5">
          {release.status === 'loading' && (
            <div className="flex items-center gap-2 rounded-xl border border-border/20 bg-bg-alt px-4 py-3">
              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-accent" />
              <p className="text-[11px] text-text-muted">Checking the latest release…</p>
            </div>
          )}
          {release.status === 'unavailable' && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3">
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
              <p className="text-[11px] leading-relaxed text-text-secondary">
                No published release could be reached for this tool yet. The download
                buttons are disabled until a release is available, build from source
                or use the terminal commands below once a release exists.
              </p>
            </div>
          )}
          {release.status === 'ready' && release.version && (
            <div className="flex items-center justify-between rounded-xl border border-border bg-accent/5 px-4 py-2.5">
              <p className="text-[11px] text-text-secondary">{cfg.note}</p>
              <span className="ml-3 shrink-0 font-mono text-[11px] font-bold text-accent">
                {release.version}
              </span>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
              Operating System
            </p>
            <div className="grid grid-cols-3 gap-2">
              {PLATFORMS.map((p) => {
                const enabled = availablePlatforms.some(({ key }) => key === p.key);
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setPlatform(p.key)}
                    disabled={!enabled}
                    title={enabled ? undefined : 'No build published for this operating system'}
                    className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors ${
                      platform === p.key
                        ? 'border-accent/50 bg-accent/10 text-accent'
                        : enabled
                          ? 'border-border/30 text-text-muted hover:border-accent/40 hover:text-accent'
                          : 'cursor-not-allowed border-border/15 text-text-muted/40'
                    }`}
                  >
                    {p.icon}
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {supportsArch && (
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                Architecture
              </p>
              <div className="grid grid-cols-2 gap-2">
                {archChoices.map((a) => (
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
                {assetName ?? 'Unavailable for this platform'}
                {assetSize ? <span className="ml-2 text-text-muted">{formatSize(assetSize)}</span> : null}
              </span>
              <button
                type="button"
                disabled={!canDownload}
                onClick={() => {
                  if (!assetUrl) return;
                  const anchor = document.createElement('a');
                  anchor.href = assetUrl;
                  anchor.rel = 'noopener noreferrer';
                  document.body.appendChild(anchor);
                  anchor.click();
                  document.body.removeChild(anchor);
                }}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-accent/40 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
              Or install from the terminal
            </p>
            <CodeBlock code={command} lang="sh" copyable />
          </div>

          {release.status === 'ready' && (
            <div className="flex items-center gap-2 rounded-xl border border-border/20 bg-bg-alt px-4 py-3">
              {canDownload ? (
                <>
                  <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  <p className="text-[11px] text-text-muted leading-snug">
                    Download resolved from the latest GitHub release.
                  </p>
                </>
              ) : (
                <>
                  <TriangleAlert className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                  <p className="text-[11px] text-text-muted leading-snug">
                    This build was not found in the latest release.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ToolInstallModalHost;
