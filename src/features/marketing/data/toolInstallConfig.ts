/**
 * Per-tool install metadata for the Install modal.
 *
 * Download availability is resolved at runtime from the tools' GitHub
 * releases (see useToolRelease). The asset maps below describe the expected
 * artifact name per platform so download URLs and terminal commands stay
 * correct even before the network request resolves; the modal only enables a
 * combination once the release API confirms the asset exists.
 *
 * commandTemplates may contain {url} and {bin} placeholders that are expanded
 * at runtime.
 */

export type ToolInstallKey = 'anansi' | 'jabari' | 'toha3ee' | 'shaka' | 'nzinga' | 'aksum';
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

export const TOOL_INSTALL_CONFIG: Record<ToolInstallKey, ToolInstallConfig> = {
  anansi: {
    bin: 'anansi',
    displayName: 'anansi',
    repo: 'QYVORA/qyvora-anansi',
    releaseBase: 'https://github.com/QYVORA/qyvora-anansi/releases/latest/download',
    assets: {
      linux: { amd64: 'anansi-linux-amd64', arm64: 'anansi-linux-arm64' },
      darwin: { amd64: 'anansi-macos-amd64', arm64: 'anansi-macos-arm64' },
      windows: { amd64: 'anansi-windows-amd64.exe' },
    },
    commandTemplates: {
      linux: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-anansi/main/install.sh | bash',
      darwin: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-anansi/main/install.sh | bash',
      windows: 'curl.exe -fsSL -o anansi.exe {url}',
    },
    note: 'Single static binary. The installer auto-detects your OS, CPU and shell.',
  },
  jabari: {
    bin: 'jabari',
    displayName: 'jabari',
    repo: 'QYVORA/qyvora-jabari',
    releaseBase: 'https://github.com/QYVORA/qyvora-jabari/releases/latest/download',
    assets: {
      linux: { amd64: 'jabari-linux-amd64', arm64: 'jabari-linux-arm64' },
      darwin: { amd64: 'jabari-darwin-amd64', arm64: 'jabari-darwin-arm64' },
      windows: { amd64: 'jabari-windows-amd64.exe', arm64: 'jabari-windows-arm64.exe' },
    },
    commandTemplates: {
      linux: 'curl -fsSL -o {bin} {url} && chmod +x {bin} && sudo install -m 0755 {bin} /usr/local/bin/{bin}',
      darwin: 'curl -fsSL -o {bin} {url} && chmod +x {bin} && sudo install -m 0755 {bin} /usr/local/bin/{bin}',
      windows: 'Invoke-WebRequest -Uri "{url}" -OutFile {bin}.exe',
    },
    note: 'Downloaded as a raw binary from the latest release.',
  },
  toha3ee: {
    bin: 'toha3ee',
    displayName: 'toha3ee',
    repo: 'QYVORA/qyvora-toha3ee',
    releaseBase: 'https://github.com/QYVORA/qyvora-toha3ee/releases/latest/download',
    assets: {
      linux: { amd64: 'toha3ee_linux_amd64.tar.gz', arm64: 'toha3ee_linux_arm64.tar.gz' },
      darwin: { amd64: 'toha3ee_darwin_amd64.tar.gz', arm64: 'toha3ee_darwin_arm64.tar.gz' },
      windows: { amd64: 'toha3ee_windows_amd64.zip' },
    },
    commandTemplates: {
      linux: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-toha3ee/main/scripts/install.sh | sh',
      darwin: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-toha3ee/main/scripts/install.sh | sh',
      windows: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-toha3ee/main/scripts/install.ps1 | iex',
    },
    note: 'Distributed as an archive. The installer unpacks the binary and wires up cleanup handlers.',
  },
  aksum: {
    bin: 'aksum',
    displayName: 'aksum',
    repo: 'QYVORA/qyvora-aksum',
    releaseBase: 'https://github.com/QYVORA/qyvora-aksum/releases/latest/download',
    assets: {
      linux: { amd64: 'aksum-linux-amd64', arm64: 'aksum-linux-arm64' },
      darwin: { amd64: 'aksum-darwin-amd64', arm64: 'aksum-darwin-arm64' },
      windows: { amd64: 'aksum-windows-amd64.exe', arm64: 'aksum-windows-arm64.exe' },
    },
    commandTemplates: {
      linux: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-aksum/main/install.sh | bash',
      darwin: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-aksum/main/install.sh | bash',
      windows: 'Invoke-WebRequest -Uri "{url}" -OutFile {bin}.exe',
    },
    note: 'Single static binary. The installer verifies SHA-256 against the published checksums.',
  },
  shaka: {
    bin: 'shaka',
    displayName: 'shaka',
    repo: 'QYVORA/qyvora-shaka',
    releaseBase: 'https://github.com/QYVORA/qyvora-shaka/releases/latest/download',
    assets: {
      linux: { amd64: 'shaka-linux-amd64', arm64: 'shaka-linux-arm64' },
      darwin: { amd64: 'shaka-darwin-amd64', arm64: 'shaka-darwin-arm64' },
      windows: { amd64: 'shaka-windows-amd64.exe', arm64: 'shaka-windows-arm64.exe' },
    },
    commandTemplates: {
      linux: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-shaka/main/install.sh | bash',
      darwin: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-shaka/main/install.sh | bash',
      windows: 'Invoke-WebRequest -Uri "{url}" -OutFile {bin}.exe',
    },
    note: 'Single static binary. The installer auto-detects your platform and installs the icon and desktop entry.',
  },
  nzinga: {
    bin: 'nzinga',
    displayName: 'nzinga',
    repo: 'QYVORA/qyvora-nzinga',
    releaseBase: 'https://github.com/QYVORA/qyvora-nzinga/releases/latest/download',
    assets: {
      linux: { amd64: 'nzinga-linux-amd64', arm64: 'nzinga-linux-arm64' },
      darwin: { amd64: 'nzinga-darwin-amd64', arm64: 'nzinga-darwin-arm64' },
      windows: { amd64: 'nzinga-windows-amd64.exe', arm64: 'nzinga-windows-arm64.exe' },
    },
    commandTemplates: {
      linux: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-nzinga/main/install.sh | bash',
      darwin: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-nzinga/main/install.sh | bash',
      windows: 'Invoke-WebRequest -Uri "{url}" -OutFile {bin}.exe',
    },
    note: 'Single static binary. The installer auto-detects your platform and installs the icon and desktop entry.',
  },
};
