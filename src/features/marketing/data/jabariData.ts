import { Radar, ListChecks, ScanSearch, TestTube2, FileSearch, Gauge, FileText, ShieldAlert, type LucideIcon } from 'lucide-react';
import type { ToolSourceExample } from '../components/tools/ToolSourceSection';

export interface JabariStage {
  id: string;
  name: string;
  icon: LucideIcon;
  desc: string;
}

export const STAGES: JabariStage[] = [
  { id: '01', name: 'DISCOVERY', icon: Radar, desc: 'ADB device enumeration: manufacturer, model, build, patch level, kernel, root indicators' },
  { id: '02', name: 'ENUMERATION', icon: ListChecks, desc: 'Package inventory, system properties and posture facts gathered from the device' },
  { id: '03', name: 'ANALYSIS', icon: ScanSearch, desc: 'Rule engine evaluates posture. AND-001..007 detect debuggable, rooted, outdated or exposed devices' },
  { id: '04', name: 'VALIDATION', icon: TestTube2, desc: 'Non-destructive confirmation of findings with honest low-confidence attribution' },
  { id: '05', name: 'EVIDENCE', icon: FileSearch, desc: 'SHA-256-hashed evidence store ties every finding to a reproducible artifact' },
  { id: '06', name: 'RISK', icon: Gauge, desc: 'Severity × confidence scoring ranks what to fix first' },
  { id: '07', name: 'REPORTING', icon: FileText, desc: 'Offline re-renderable sessions: table, JSON, YAML, text, Markdown or HTML' },
];

export interface JabariRule {
  id: string;
  title: string;
  desc: string;
}

export const RULES: JabariRule[] = [
  { id: 'AND-001', title: 'Debuggable production device', desc: 'ro.debuggable=1 on a non-userdebug, non-eng build' },
  { id: 'AND-002', title: 'Outdated security patch', desc: 'security patch level older than a reference threshold' },
  { id: 'AND-003', title: 'Insecure USB connection', desc: 'ro.adb.secure=0' },
  { id: 'AND-004', title: 'Rooted / userdebug build', desc: 'ro.debuggable plus root indicators' },
  { id: 'AND-005', title: 'User-visible build type', desc: 'ro.build.type = userdebug / eng on a release device' },
  { id: 'AND-006', title: 'Emulator detected', desc: 'ro.kernel.qemu=1 (informational)' },
  { id: 'AND-007', title: 'ADB over TCP enabled', desc: 'ADB network mode active (informational)' },
];

export const PROFILES: string[] = ['quick', 'standard', 'deep', 'application', 'device', 'network', 'compliance', 'research'];

export const GITHUB_URL = 'https://github.com/QYVORA/qyvora-jabari';

export const BUILD_FROM_SOURCE = {
  requirements: 'Go 1.21+ and Android platform-tools (adb) on PATH.',
  steps: [
    { cmd: 'git clone https://github.com/QYVORA/qyvora-jabari' },
    { cmd: 'cd qyvora-jabari' },
    { cmd: 'make build', note: 'Produces bin/jabari and the androidsec alias symlink' },
    { cmd: 'make install-user', note: 'Installs ~/.local/bin/jabari with desktop entry + logo. System-wide: sudo make install' },
  ],
};

export const QUICK_START = [
  'jabari assess usb',
  'jabari assess usb <serial>',
  'jabari assess ip 192.168.1.50',
  'jabari assess ip 192.168.1.50 -p deep -y',
  'jabari report --list',
  'jabari report sess-abc123 -f html',
];

export const AUTHORIZED_WARNING = {
  icon: ShieldAlert,
  title: 'Authorized',
  accent: 'Devices Only',
  description:
    'JABARI requires explicit authorization for every assessment, an interactive gate on a TTY, or -y / authorized config for non-interactive runs. It assesses only the device you point it at, never the surrounding network.',
};

export const SOURCE_EXAMPLES: ToolSourceExample[] = [
  {
    id: 'entry',
    filename: 'cmd/jabari/main.go',
    label: 'CLI entry point',
    description: 'The binary hands control to the CLI layer and exits with its status code. The same binary is also published under the androidsec alias.',
    code: 'package main\n\nimport (\n\t"os"\n\n\t"github.com/QYVORA/qyvora-jabari/internal/cli"\n)\n\nfunc main() {\n\tos.Exit(cli.Execute())\n}',
  },
  {
    id: 'stage',
    filename: 'internal/core/core.go',
    label: 'Stage + environment',
    description: 'Every pipeline stage receives the shared environment instead of reaching into a device directly.',
    code: 'type Env struct {\n\tTarget    *models.Target\n\tSession   *models.Session\n\tTransport transport.Transport\n\tRules     *rules.Registry\n\tEvidence  *evidence.Store\n\tLog       *logger.Logger\n\tConfig    *viper.Viper\n\tApps      []models.Application\n}\n\ntype Stage interface {\n\tName() string\n\tRun(ctx context.Context, env *Env) error\n}',
  },
  {
    id: 'transport',
    filename: 'internal/transport/transport.go',
    label: 'Transport interface',
    description: 'USB and specified-network Android targets implement the same connection boundary, so the pipeline never needs to know how it reaches the device.',
    code: 'type Transport interface {\n\tConnect(ctx context.Context) error\n\tDisconnect() error\n\tInfo(ctx context.Context) (*models.DeviceInfo, error)\n\tExecute(ctx context.Context, req models.Request) (models.Response, error)\n\tString() string\n}',
  },
  {
    id: 'authorization',
    filename: 'internal/cli/authorization.go',
    label: 'Authorization gate',
    description: 'Every assessment passes through the gate: the --authorized flag, the QYVORA_AUTHORIZED env var, or an interactive [y/N] prompt on a TTY.',
    code: 'func authorize(cmd *cobra.Command, t *models.Target) (*models.Target, error) {\n\tswitch {\n\tcase authorizationFlags.authorized || cfg.GetBool("authorized"):\n\t\tt.Auth = granted(t)\n\t\treturn t, nil\n\tcase strings.EqualFold(os.Getenv("QYVORA_AUTHORIZED"), "true"):\n\t\tt.Auth = granted(t)\n\t\treturn t, nil\n\t}\n\n\tif isTTY(os.Stdin) {\n\t\tfmt.Fprintf(os.Stderr, "Confirm authorization? [y/N] ")\n\t\tanswer, err := bufio.NewReader(os.Stdin).ReadString(\'\\n\')\n\t\tif err == nil && strings.EqualFold(strings.TrimSpace(answer), "y") {\n\t\t\tt.Auth = granted(t)\n\t\t\treturn t, nil\n\t\t}\n\t\treturn nil, errs.NewExitError(3, "authorization declined; assessment aborted")\n\t}\n\n\treturn nil, errs.NewExitError(3,\n\t\t"target authorization required; re-run with --authorized to confirm scope non-interactively")\n}',
  },
];
