import { useEffect, useState } from 'react';
import {
  TOOL_INSTALL_CONFIG,
  ToolArch,
  ToolInstallKey,
  ToolPlatform,
} from '../data/toolInstallConfig';

/**
 * Runtime release resolution for the install modal.
 *
 * Availability is derived from the actual GitHub release assets so the UI can
 * never advertise a download that does not exist (wrong arch, missing OS, or
 * no release published yet). All three repositories are public, so no token
 * is involved and no backend proxy is required.
 */

export type ReleaseStatus = 'loading' | 'ready' | 'unavailable';

interface GithubAsset {
  name: string;
  size: number;
  browser_download_url: string;
}

interface GithubRelease {
  tag_name?: string;
  published_at?: string;
  assets?: GithubAsset[];
  draft?: boolean;
  prerelease?: boolean;
}

export interface ToolRelease {
  status: ReleaseStatus;
  /** Release tag, e.g. "v1.4.2". Empty until ready. */
  version: string;
  publishedAt: string;
  /** Download URL for an expected asset name; empty when absent. */
  assetUrl: (assetName: string) => string;
  /** Size in bytes for an expected asset name; undefined when absent. */
  assetSize: (assetName: string) => number | undefined;
  /** Whether a platform/arch combination exists in the real release. */
  hasDownload: (platform: ToolPlatform, arch: ToolArch) => boolean;
}

const UNAVAILABLE: ToolRelease = Object.freeze({
  status: 'unavailable',
  version: '',
  publishedAt: '',
  assetUrl: () => '',
  assetSize: () => undefined,
  hasDownload: () => false,
});

// Module-level cache: several components may ask for the same tool and
// GitHub's unauthenticated rate limit makes refetching wasteful.
const cache = new Map<ToolInstallKey, Promise<ToolRelease>>();

function fetchRelease(tool: ToolInstallKey): Promise<ToolRelease> {
  const repo = TOOL_INSTALL_CONFIG[tool].repo;
  return fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
    headers: { Accept: 'application/vnd.github+json' },
  })
    .then(async (res) => {
      // 404 = repository exists but has no releases yet. Anything else that
      // is not ok (rate limit, network failure upstream) also degrades to
      // "unavailable" rather than showing fake download buttons.
      if (!res.ok) return UNAVAILABLE;
      const data = (await res.json()) as GithubRelease;
      if (!data || data.draft || !Array.isArray(data.assets)) return UNAVAILABLE;

      const assets = new Map(data.assets.map((a) => [a.name, a]));
      const ready: ToolRelease = {
        status: 'ready',
        version: data.tag_name ?? '',
        publishedAt: data.published_at ?? '',
        assetUrl: (name) => assets.get(name)?.browser_download_url ?? '',
        assetSize: (name) => assets.get(name)?.size,
        hasDownload: (platform, arch) =>
          Boolean(
            assets.has(TOOL_INSTALL_CONFIG[tool].assets[platform]?.[arch] ?? ''),
          ),
      };
      return ready;
    })
    .catch(() => UNAVAILABLE);
}

export function useToolRelease(tool: ToolInstallKey): ToolRelease {
  const [release, setRelease] = useState<ToolRelease>({
    ...UNAVAILABLE,
    status: 'loading',
  });

  useEffect(() => {
    let active = true;
    let entry = cache.get(tool);
    if (!entry) {
      entry = fetchRelease(tool);
      cache.set(tool, entry);
    }
    entry.then((r) => {
      if (active) setRelease(r);
    });
    return () => {
      active = false;
    };
  }, [tool]);

  return release;
}
