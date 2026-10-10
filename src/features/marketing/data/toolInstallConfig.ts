/**
 * Per-tool install metadata for the Install modal.
 *
 * Download availability is resolved at runtime from the tools' GitHub
 * releases (see useToolRelease). The asset maps below describe the expected
 * artifact name per platform so download URLs and terminal commands stay
 * correct; the modal only enables a combination once the release API confirms
 * the asset exists.
 *
 * Release asset names embed the version — the contract every QYVORA tool
 * publishes is:
 *
 *   {tool}_{version}_{os}_{arch}.tar.gz      (os: linux | macos; arch: amd64 | arm64)
 *   {tool}_{version}_{windows}_{arch}.zip     (Windows ships a .zip)
 *
 * The `{ver}` placeholder below is substituted with the resolved release
 * version at runtime (see `resolveAssetName`), so the modal matches the real
 * published assets without hard-coding a version that goes stale on the next
 * release. Go's `darwin` is published under the `macos` token.
 *
 * `commandTemplates` may contain {url} and {bin} placeholders that are expanded
 * at runtime. The canonical install path for every tool is the repository's
 * root `install.sh` (POSIX), piped to `bash` — matching the one-liner each
 * repository's README advertises.
 */

export type ToolInstallKey =
  | 'anansi' | 'jabari' | 'toha3ee' | 'shaka' | 'nzinga' | 'aksum' | 'sekhmet' | 'mansa'
  | 'amanirenas' | 'sundiata' | 'timbuktu' | 'kush' | 'imhotep' | 'amina';
export type ToolPlatform = 'linux' | 'darwin' | 'windows';
export type ToolArch = 'amd64' | 'arm64';

export interface ToolInstallConfig {
  bin: string;
  displayName: string;
  /** GitHub owner/repo used to resolve release metadata. */
  repo: string;
  releaseBase: string;
  assets: Record<ToolPlatform, Partial<Record<ToolArch, string>>>;
  commandTemplates: Record<ToolPlatform, string>;
  note: string;
}

/** Substitute the resolved release version into an asset-name template. */
export function resolveAssetName(template: string, version: string): string {
  return template.replace('{ver}', version.replace(/^v/, ''));
}

export const TOOL_INSTALL_CONFIG: Record<ToolInstallKey, ToolInstallConfig> = {
  anansi: {
    bin: 'anansi',
    displayName: 'anansi',
    repo: 'QYVORA/qyvora-anansi',
    releaseBase: 'https://github.com/QYVORA/qyvora-anansi/releases/latest/download',
    assets: {
      linux: { amd64: 'anansi_{ver}_linux_amd64.tar.gz', arm64: 'anansi_{ver}_linux_arm64.tar.gz' },
      darwin: { amd64: 'anansi_{ver}_macos_amd64.tar.gz', arm64: 'anansi_{ver}_macos_arm64.tar.gz' },
      windows: { amd64: 'anansi_{ver}_windows_amd64.zip', arm64: 'anansi_{ver}_windows_arm64.zip' },
    },
    commandTemplates: {
      linux: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-anansi/main/install.sh | bash',
      darwin: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-anansi/main/install.sh | bash',
      windows: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-anansi/main/install.ps1 | iex',
    },
    note: 'Single static binary. The installer auto-detects your OS, CPU and shell, and verifies SHA-256 against the published checksums.',
  },
  jabari: {
    bin: 'jabari',
    displayName: 'jabari',
    repo: 'QYVORA/qyvora-jabari',
    releaseBase: 'https://github.com/QYVORA/qyvora-jabari/releases/latest/download',
    assets: {
      linux: { amd64: 'jabari_{ver}_linux_amd64.tar.gz', arm64: 'jabari_{ver}_linux_arm64.tar.gz' },
      darwin: { amd64: 'jabari_{ver}_macos_amd64.tar.gz', arm64: 'jabari_{ver}_macos_arm64.tar.gz' },
      windows: { amd64: 'jabari_{ver}_windows_amd64.zip', arm64: 'jabari_{ver}_windows_arm64.zip' },
    },
    commandTemplates: {
      linux: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-jabari/main/install.sh | bash',
      darwin: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-jabari/main/install.sh | bash',
      windows: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-jabari/main/install.ps1 | iex',
    },
    note: 'Distributed as an archive. The installer unpacks the checksum-verified binary and wires up the icon and desktop entry; USB and network targets also need the Android platform-tools.',
  },
  toha3ee: {
    bin: 'toha3ee',
    displayName: 'toha3ee',
    repo: 'QYVORA/qyvora-toha3ee',
    releaseBase: 'https://github.com/QYVORA/qyvora-toha3ee/releases/latest/download',
    assets: {
      linux: { amd64: 'toha3ee_{ver}_linux_amd64.tar.gz' },
      darwin: {},
      windows: {},
    },
    commandTemplates: {
      linux: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-toha3ee/main/install.sh | bash',
      darwin: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-toha3ee/main/install.sh | bash',
      windows: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-toha3ee/main/install.ps1 | iex',
    },
    note: 'Linux x86_64 only: it links libpcap (cgo), so the published prebuilt is linux/amd64 and Apple silicon or arm64 Linux falls back to a local source build.',
  },
  aksum: {
    bin: 'aksum',
    displayName: 'aksum',
    repo: 'QYVORA/qyvora-aksum',
    releaseBase: 'https://github.com/QYVORA/qyvora-aksum/releases/latest/download',
    assets: {
      linux: { amd64: 'aksum_{ver}_linux_amd64.tar.gz', arm64: 'aksum_{ver}_linux_arm64.tar.gz' },
      darwin: { amd64: 'aksum_{ver}_macos_amd64.tar.gz', arm64: 'aksum_{ver}_macos_arm64.tar.gz' },
      windows: { amd64: 'aksum_{ver}_windows_amd64.zip', arm64: 'aksum_{ver}_windows_arm64.zip' },
    },
    commandTemplates: {
      linux: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-aksum/main/install.sh | bash',
      darwin: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-aksum/main/install.sh | bash',
      windows: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-aksum/main/install.ps1 | iex',
    },
    note: 'Single static binary. The installer verifies SHA-256 against the published checksums.',
  },
  shaka: {
    bin: 'shaka',
    displayName: 'shaka',
    repo: 'QYVORA/qyvora-shaka',
    releaseBase: 'https://github.com/QYVORA/qyvora-shaka/releases/latest/download',
    assets: {
      linux: { amd64: 'shaka_{ver}_linux_amd64.tar.gz', arm64: 'shaka_{ver}_linux_arm64.tar.gz' },
      darwin: { amd64: 'shaka_{ver}_macos_amd64.tar.gz', arm64: 'shaka_{ver}_macos_arm64.tar.gz' },
      windows: { amd64: 'shaka_{ver}_windows_amd64.zip', arm64: 'shaka_{ver}_windows_arm64.zip' },
    },
    commandTemplates: {
      linux: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-shaka/main/install.sh | bash',
      darwin: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-shaka/main/install.sh | bash',
      windows: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-shaka/main/install.ps1 | iex',
    },
    note: 'Single static binary. The installer auto-detects your platform and installs the icon and desktop entry.',
  },
  nzinga: {
    bin: 'nzinga',
    displayName: 'nzinga',
    repo: 'QYVORA/qyvora-nzinga',
    releaseBase: 'https://github.com/QYVORA/qyvora-nzinga/releases/latest/download',
    assets: {
      linux: { amd64: 'nzinga_{ver}_linux_amd64.tar.gz', arm64: 'nzinga_{ver}_linux_arm64.tar.gz' },
      darwin: { amd64: 'nzinga_{ver}_macos_amd64.tar.gz', arm64: 'nzinga_{ver}_macos_arm64.tar.gz' },
      windows: { amd64: 'nzinga_{ver}_windows_amd64.zip', arm64: 'nzinga_{ver}_windows_arm64.zip' },
    },
    commandTemplates: {
      linux: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-nzinga/main/install.sh | bash',
      darwin: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-nzinga/main/install.sh | bash',
      windows: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-nzinga/main/install.ps1 | iex',
    },
    note: 'Single static binary. The installer auto-detects your platform and installs the icon and desktop entry.',
  },
  sekhmet: {
    bin: 'sekhmet',
    displayName: 'sekhmet',
    repo: 'QYVORA/qyvora-Sekhmet',
    releaseBase: 'https://github.com/QYVORA/qyvora-Sekhmet/releases/latest/download',
    assets: {
      linux: { amd64: 'sekhmet_{ver}_linux_amd64.tar.gz', arm64: 'sekhmet_{ver}_linux_arm64.tar.gz' },
      darwin: { amd64: 'sekhmet_{ver}_macos_amd64.tar.gz', arm64: 'sekhmet_{ver}_macos_arm64.tar.gz' },
      windows: { amd64: 'sekhmet_{ver}_windows_amd64.zip', arm64: 'sekhmet_{ver}_windows_arm64.zip' },
    },
    commandTemplates: {
      linux: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-Sekhmet/main/install.sh | bash',
      darwin: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-Sekhmet/main/install.sh | bash',
      windows: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-Sekhmet/main/install.ps1 | iex',
    },
    note: 'Single static binary. The installer auto-detects your platform, verifies SHA-256 and installs the icon and desktop entry.',
  },
  mansa: {
    bin: 'mansa',
    displayName: 'mansa',
    repo: 'QYVORA/qyvora-mansa',
    releaseBase: 'https://github.com/QYVORA/qyvora-mansa/releases/latest/download',
    assets: {
      linux: { amd64: 'mansa_{ver}_linux_amd64.tar.gz', arm64: 'mansa_{ver}_linux_arm64.tar.gz' },
      darwin: {},
      windows: {},
    },
    commandTemplates: {
      linux: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-mansa/main/install.sh | bash',
      darwin: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-mansa/main/install.sh | bash',
      windows: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-mansa/main/install.ps1 | iex',
    },
    note: 'Linux only (amd64 and arm64): live capture shells out to `iw`. The installer verifies SHA-256 against the published checksums.',
  },
  amanirenas: {
    bin: 'amanirenas',
    displayName: 'amanirenas',
    repo: 'QYVORA/qyvora-amanirenas',
    releaseBase: 'https://github.com/QYVORA/qyvora-amanirenas/releases/latest/download',
    assets: {
      linux: { amd64: 'amanirenas_{ver}_linux_amd64.tar.gz', arm64: 'amanirenas_{ver}_linux_arm64.tar.gz' },
      darwin: { amd64: 'amanirenas_{ver}_macos_amd64.tar.gz', arm64: 'amanirenas_{ver}_macos_arm64.tar.gz' },
      windows: { amd64: 'amanirenas_{ver}_windows_amd64.zip', arm64: 'amanirenas_{ver}_windows_arm64.zip' },
    },
    commandTemplates: {
      linux: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-amanirenas/main/install.sh | bash',
      darwin: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-amanirenas/main/install.sh | bash',
      windows: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-amanirenas/main/install.ps1 | iex',
    },
    note: 'Distributed as an archive. The installer unpacks the checksum-verified binary and installs the icon and desktop entry. A source build with Go 1.26+ is available where no prebuilt exists.',
  },
  sundiata: {
    bin: 'sundiata',
    displayName: 'sundiata',
    repo: 'QYVORA/qyvora-sundiata',
    releaseBase: 'https://github.com/QYVORA/qyvora-sundiata/releases/latest/download',
    assets: {
      linux: { amd64: 'sundiata_{ver}_linux_amd64.tar.gz', arm64: 'sundiata_{ver}_linux_arm64.tar.gz' },
      darwin: { amd64: 'sundiata_{ver}_macos_amd64.tar.gz', arm64: 'sundiata_{ver}_macos_arm64.tar.gz' },
      windows: { amd64: 'sundiata_{ver}_windows_amd64.zip', arm64: 'sundiata_{ver}_windows_arm64.zip' },
    },
    commandTemplates: {
      linux: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-sundiata/main/install.sh | bash',
      darwin: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-sundiata/main/install.sh | bash',
      windows: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-sundiata/main/install.ps1 | iex',
    },
    note: 'Distributed as an archive. The installer unpacks the checksum-verified binary and installs the icon and desktop entry. A source build with Go 1.26+ is available where no prebuilt exists.',
  },
  timbuktu: {
    bin: 'timbuktu',
    displayName: 'timbuktu',
    repo: 'QYVORA/qyvora-timbuktu',
    releaseBase: 'https://github.com/QYVORA/qyvora-timbuktu/releases/latest/download',
    assets: {
      linux: { amd64: 'timbuktu_{ver}_linux_amd64.tar.gz', arm64: 'timbuktu_{ver}_linux_arm64.tar.gz' },
      darwin: { amd64: 'timbuktu_{ver}_macos_amd64.tar.gz', arm64: 'timbuktu_{ver}_macos_arm64.tar.gz' },
      windows: { amd64: 'timbuktu_{ver}_windows_amd64.zip', arm64: 'timbuktu_{ver}_windows_arm64.zip' },
    },
    commandTemplates: {
      linux: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-timbuktu/main/install.sh | bash',
      darwin: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-timbuktu/main/install.sh | bash',
      windows: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-timbuktu/main/install.ps1 | iex',
    },
    note: 'Distributed as an archive. The installer unpacks the checksum-verified binary and installs the icon and desktop entry. A source build with Go 1.26+ is available where no prebuilt exists.',
  },
  kush: {
    bin: 'kush',
    displayName: 'kush',
    repo: 'QYVORA/qyvora-kush',
    releaseBase: 'https://github.com/QYVORA/qyvora-kush/releases/latest/download',
    assets: {
      linux: { amd64: 'kush_{ver}_linux_amd64.tar.gz', arm64: 'kush_{ver}_linux_arm64.tar.gz' },
      darwin: { amd64: 'kush_{ver}_macos_amd64.tar.gz', arm64: 'kush_{ver}_macos_arm64.tar.gz' },
      windows: { amd64: 'kush_{ver}_windows_amd64.zip', arm64: 'kush_{ver}_windows_arm64.zip' },
    },
    commandTemplates: {
      linux: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-kush/main/install.sh | bash',
      darwin: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-kush/main/install.sh | bash',
      windows: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-kush/main/install.ps1 | iex',
    },
    note: 'Distributed as an archive. The installer unpacks the checksum-verified binary and installs the icon and desktop entry. A source build with Go 1.26+ is available where no prebuilt exists.',
  },
  imhotep: {
    bin: 'imhotep',
    displayName: 'imhotep',
    repo: 'QYVORA/qyvora-imhotep',
    releaseBase: 'https://github.com/QYVORA/qyvora-imhotep/releases/latest/download',
    assets: {
      linux: { amd64: 'imhotep_{ver}_linux_amd64.tar.gz', arm64: 'imhotep_{ver}_linux_arm64.tar.gz' },
      darwin: { amd64: 'imhotep_{ver}_macos_amd64.tar.gz', arm64: 'imhotep_{ver}_macos_arm64.tar.gz' },
      windows: { amd64: 'imhotep_{ver}_windows_amd64.zip', arm64: 'imhotep_{ver}_windows_arm64.zip' },
    },
    commandTemplates: {
      linux: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-imhotep/main/install.sh | bash',
      darwin: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-imhotep/main/install.sh | bash',
      windows: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-imhotep/main/install.ps1 | iex',
    },
    note: 'Distributed as an archive. The installer unpacks the checksum-verified binary and installs the icon and desktop entry. A source build with Go 1.26+ is available where no prebuilt exists.',
  },
  amina: {
    bin: 'amina',
    displayName: 'amina',
    repo: 'QYVORA/qyvora-amina',
    releaseBase: 'https://github.com/QYVORA/qyvora-amina/releases/latest/download',
    assets: {
      linux: { amd64: 'amina_{ver}_linux_amd64.tar.gz', arm64: 'amina_{ver}_linux_arm64.tar.gz' },
      darwin: { amd64: 'amina_{ver}_macos_amd64.tar.gz', arm64: 'amina_{ver}_macos_arm64.tar.gz' },
      windows: { amd64: 'amina_{ver}_windows_amd64.zip', arm64: 'amina_{ver}_windows_arm64.zip' },
    },
    commandTemplates: {
      linux: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-amina/main/install.sh | bash',
      darwin: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-amina/main/install.sh | bash',
      windows: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-amina/main/install.ps1 | iex',
    },
    note: 'Single static binary. The installer auto-detects your OS, CPU and shell, verifies SHA-256 and installs the icon and desktop entry.',
  },
};
