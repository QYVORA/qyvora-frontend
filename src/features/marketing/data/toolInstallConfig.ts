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

export type ToolInstallKey =
  | 'anansi' | 'jabari' | 'toha3ee' | 'shaka' | 'nzinga' | 'aksum' | 'sekhmet' | 'mansa'
  | 'amanirenas' | 'sundiata' | 'timbuktu' | 'kush' | 'imhotep';
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
      windows: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-anansi/main/install.ps1 | iex',
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
      darwin: { amd64: 'jabari-macos-amd64', arm64: 'jabari-macos-arm64' },
      windows: { amd64: 'jabari-windows-amd64.exe', arm64: 'jabari-windows-arm64.exe' },
    },
    commandTemplates: {
      linux: 'curl -fsSL -o {bin} {url} && chmod +x {bin} && sudo install -m 0755 {bin} /usr/local/bin/{bin}',
      darwin: 'curl -fsSL -o {bin} {url} && chmod +x {bin} && sudo install -m 0755 {bin} /usr/local/bin/{bin}',
      windows: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-jabari/main/install.ps1 | iex',
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
      darwin: { amd64: 'aksum-macos-amd64', arm64: 'aksum-macos-arm64' },
      windows: { amd64: 'aksum-windows-amd64.exe', arm64: 'aksum-windows-arm64.exe' },
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
      linux: { amd64: 'shaka-linux-amd64', arm64: 'shaka-linux-arm64' },
      darwin: { amd64: 'shaka-macos-amd64', arm64: 'shaka-macos-arm64' },
windows: { amd64: 'shaka-windows-amd64.exe', arm64: 'shaka-windows-arm64.exe' },
    },
    commandTemplates: {
      linux: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-shaka/master/install.sh | bash',
      darwin: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-shaka/master/install.sh | bash',
      windows: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-shaka/master/install.ps1 | iex',
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
      darwin: { amd64: 'nzinga-macos-amd64', arm64: 'nzinga-macos-arm64' },
      windows: { amd64: 'nzinga-windows-amd64.exe', arm64: 'nzinga-windows-arm64.exe' },
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
    repo: 'QYVORA/qyvora-sekhmet',
    releaseBase: 'https://github.com/QYVORA/qyvora-sekhmet/releases/latest/download',
    assets: {
      linux: { amd64: 'sekhmet-linux-amd64', arm64: 'sekhmet-linux-arm64' },
      darwin: { amd64: 'sekhmet-macos-amd64', arm64: 'sekhmet-macos-arm64' },
      windows: { amd64: 'sekhmet-windows-amd64.exe', arm64: 'sekhmet-windows-arm64.exe' },
    },
    commandTemplates: {
      linux: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-sekhmet/main/install.sh | bash',
      darwin: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-sekhmet/main/install.sh | bash',
      windows: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-sekhmet/main/install.ps1 | iex',
    },
    note: 'Single static binary. The installer auto-detects your platform, verifies SHA-256 and installs the icon and desktop entry.',
  },
  mansa: {
    bin: 'mansa',
    displayName: 'mansa',
    repo: 'QYVORA/qyvora-mansa',
    releaseBase: 'https://github.com/QYVORA/qyvora-mansa/releases/latest/download',
    assets: {
      linux: { amd64: 'mansa-linux-amd64', arm64: 'mansa-linux-arm64' },
      darwin: { amd64: 'mansa-macos-amd64', arm64: 'mansa-macos-arm64' },
      windows: { amd64: 'mansa-windows-amd64.exe', arm64: 'mansa-windows-arm64.exe' },
    },
    commandTemplates: {
      linux: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-mansa/main/install.sh | bash',
      darwin: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-mansa/main/install.sh | bash',
      windows: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-mansa/main/install.ps1 | iex',
    },
    note: 'Single static binary. The installer auto-detects your OS, CPU and shell, installs to ~/.local/bin and verifies SHA-256 against the published checksums.',
  },
  amanirenas: {
    bin: 'amanirenas',
    displayName: 'amanirenas',
    repo: 'QYVORA/qyvora-amanirenas',
    releaseBase: 'https://github.com/QYVORA/qyvora-amanirenas/releases/latest/download',
    assets: {
      linux: { amd64: 'amanirenas-linux-amd64', arm64: 'amanirenas-linux-arm64' },
      darwin: { amd64: 'amanirenas-macos-amd64', arm64: 'amanirenas-macos-arm64' },
      windows: { amd64: 'amanirenas-windows-amd64.exe', arm64: 'amanirenas-windows-arm64.exe' },
    },
    commandTemplates: {
      linux: 'git clone --depth 1 https://github.com/QYVORA/qyvora-amanirenas /tmp/qyvora-amanirenas && cd /tmp/qyvora-amanirenas && sudo make install',
      darwin: 'git clone --depth 1 https://github.com/QYVORA/qyvora-amanirenas /tmp/qyvora-amanirenas && cd /tmp/qyvora-amanirenas && sudo make install',
      windows: 'git clone --depth 1 https://github.com/QYVORA/qyvora-amanirenas %TEMP%\\qyvora-amanirenas && cd %TEMP%\\qyvora-amanirenas && go build -o {bin}.exe ./cmd/amanirenas',
    },
    note: 'Build from source with Go 1.26+; make install ships the binary, icon and desktop entry. No release is published yet; the asset map resolves automatically once one exists.',
  },
  sundiata: {
    bin: 'sundiata',
    displayName: 'sundiata',
    repo: 'QYVORA/qyvora-sundiata',
    releaseBase: 'https://github.com/QYVORA/qyvora-sundiata/releases/latest/download',
    assets: {
      linux: { amd64: 'sundiata-linux-amd64', arm64: 'sundiata-linux-arm64' },
      darwin: { amd64: 'sundiata-macos-amd64', arm64: 'sundiata-macos-arm64' },
      windows: { amd64: 'sundiata-windows-amd64.exe', arm64: 'sundiata-windows-arm64.exe' },
    },
    commandTemplates: {
      linux: 'git clone --depth 1 https://github.com/QYVORA/qyvora-sundiata /tmp/qyvora-sundiata && cd /tmp/qyvora-sundiata && sudo make install',
      darwin: 'git clone --depth 1 https://github.com/QYVORA/qyvora-sundiata /tmp/qyvora-sundiata && cd /tmp/qyvora-sundiata && sudo make install',
      windows: 'git clone --depth 1 https://github.com/QYVORA/qyvora-sundiata %TEMP%\\qyvora-sundiata && cd %TEMP%\\qyvora-sundiata && go build -o {bin}.exe ./cmd/sundiata',
    },
    note: 'Build from source with Go 1.26+; make install ships the binary, icon and desktop entry. No release is published yet; the asset map resolves automatically once one exists.',
  },
  timbuktu: {
    bin: 'timbuktu',
    displayName: 'timbuktu',
    repo: 'QYVORA/qyvora-timbuktu',
    releaseBase: 'https://github.com/QYVORA/qyvora-timbuktu/releases/latest/download',
    assets: {
      linux: { amd64: 'timbuktu-linux-amd64', arm64: 'timbuktu-linux-arm64' },
      darwin: { amd64: 'timbuktu-macos-amd64', arm64: 'timbuktu-macos-arm64' },
      windows: { amd64: 'timbuktu-windows-amd64.exe', arm64: 'timbuktu-windows-arm64.exe' },
    },
    commandTemplates: {
      linux: 'git clone --depth 1 https://github.com/QYVORA/qyvora-timbuktu /tmp/qyvora-timbuktu && cd /tmp/qyvora-timbuktu && sudo make install',
      darwin: 'git clone --depth 1 https://github.com/QYVORA/qyvora-timbuktu /tmp/qyvora-timbuktu && cd /tmp/qyvora-timbuktu && sudo make install',
      windows: 'git clone --depth 1 https://github.com/QYVORA/qyvora-timbuktu %TEMP%\\qyvora-timbuktu && cd %TEMP%\\qyvora-timbuktu && go build -o {bin}.exe ./cmd/timbuktu',
    },
    note: 'Build from source with Go 1.26+; make install ships the binary, icon and desktop entry. No release is published yet; the asset map resolves automatically once one exists.',
  },
  kush: {
    bin: 'kush',
    displayName: 'kush',
    repo: 'QYVORA/qyvora-kush',
    releaseBase: 'https://github.com/QYVORA/qyvora-kush/releases/latest/download',
    assets: {
      linux: { amd64: 'kush-linux-amd64', arm64: 'kush-linux-arm64' },
      darwin: { amd64: 'kush-macos-amd64', arm64: 'kush-macos-arm64' },
      windows: { amd64: 'kush-windows-amd64.exe', arm64: 'kush-windows-arm64.exe' },
    },
    commandTemplates: {
      linux: 'git clone --depth 1 https://github.com/QYVORA/qyvora-kush /tmp/qyvora-kush && cd /tmp/qyvora-kush && sudo make install',
      darwin: 'git clone --depth 1 https://github.com/QYVORA/qyvora-kush /tmp/qyvora-kush && cd /tmp/qyvora-kush && sudo make install',
      windows: 'git clone --depth 1 https://github.com/QYVORA/qyvora-kush %TEMP%\\qyvora-kush && cd %TEMP%\\qyvora-kush && go build -o {bin}.exe ./cmd/kush',
    },
    note: 'Build from source with Go 1.26+; make install ships the binary, icon and desktop entry. No release is published yet; the asset map resolves automatically once one exists.',
  },
  imhotep: {
    bin: 'imhotep',
    displayName: 'imhotep',
    repo: 'QYVORA/qyvora-imhotep',
    releaseBase: 'https://github.com/QYVORA/qyvora-imhotep/releases/latest/download',
    assets: {
      linux: { amd64: 'imhotep-linux-amd64', arm64: 'imhotep-linux-arm64' },
      darwin: { amd64: 'imhotep-macos-amd64', arm64: 'imhotep-macos-arm64' },
      windows: { amd64: 'imhotep-windows-amd64.exe', arm64: 'imhotep-windows-arm64.exe' },
    },
    commandTemplates: {
      linux: 'git clone --depth 1 https://github.com/QYVORA/qyvora-imhotep /tmp/qyvora-imhotep && cd /tmp/qyvora-imhotep && sudo make install',
      darwin: 'git clone --depth 1 https://github.com/QYVORA/qyvora-imhotep /tmp/qyvora-imhotep && cd /tmp/qyvora-imhotep && sudo make install',
      windows: 'git clone --depth 1 https://github.com/QYVORA/qyvora-imhotep %TEMP%\\qyvora-imhotep && cd %TEMP%\\qyvora-imhotep && go build -o {bin}.exe ./cmd/imhotep',
    },
    note: 'Build from source with Go 1.26+; make install ships the binary, icon and desktop entry. No release is published yet; the asset map resolves automatically once one exists.',
  },
};
