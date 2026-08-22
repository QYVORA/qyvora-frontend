import { Globe, FileCode, Cpu, Users, GitBranch, type LucideIcon } from 'lucide-react';
import { IconSearch, IconLock, IconShield, IconWarning } from '@/shared/components/icons';
import type { ToolSourceExample } from '../components/tools/ToolSourceSection';

export interface AnansiPhase {
  id: string;
  name: string;
  icon: LucideIcon | React.FC<{ size?: number | string; className?: string }>;
  desc: string;
}

export const PHASES: AnansiPhase[] = [
  { id: '01', name: 'DISCOVERY', icon: IconSearch, desc: 'Subdomains via crt.sh CT logs + DNS brute-force wordlist' },
  { id: '02', name: 'PROBE', icon: Globe, desc: 'Live HTTP/HTTPS hosts — status codes, servers, redirect chains, titles' },
  { id: '03', name: 'TLS', icon: IconLock, desc: 'Certificate expiry, SANs, protocol version, cipher, self-signed detection' },
  { id: '04', name: 'HEADERS', icon: IconShield, desc: 'Missing security headers and CORS misconfigurations' },
  { id: '05', name: 'PATHS', icon: FileCode, desc: 'Exposed files (.env, .git), configs, admin panels, backups, API docs' },
  { id: '06', name: 'TECH-STACK', icon: Cpu, desc: 'Deep audit of detected platforms — version detection, WordPress plugins/themes, XML-RPC, user enumeration, config backups, known-vulnerable version matching' },
  { id: '07', name: 'TAKEOVER', icon: IconWarning, desc: 'Dangling CNAMEs pointing to unclaimed cloud services' },
  { id: '08', name: 'OSINT', icon: Users, desc: 'Emails, phone numbers, employees, WHOIS registrant data' },
  { id: '09', name: 'CHAIN', icon: GitBranch, desc: 'Assembles findings into multi-step exploit paths (low → high → critical) with per-step exploitation techniques' },
];

export interface AnansiRelease {
  id: string;
  label: string;
  arch: string;
  file: string;
}

const BASE = 'https://github.com/QYVORA/qyvora-anansi-cli/releases/latest/download';

export const RELEASES: AnansiRelease[] = [
  { id: 'linux-amd64', label: 'Linux', arch: 'x86_64', file: 'anansi-linux-amd64' },
  { id: 'linux-arm64', label: 'Linux', arch: 'ARM64', file: 'anansi-linux-arm64' },
  { id: 'macos-amd64', label: 'macOS', arch: 'Intel', file: 'anansi-macos-amd64' },
  { id: 'macos-arm64', label: 'macOS', arch: 'Apple Silicon', file: 'anansi-macos-arm64' },
  { id: 'windows-amd64', label: 'Windows', arch: 'x86_64', file: 'anansi-windows-amd64.exe' },
];

export const ONE_LINER = 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-anansi-cli/main/install.sh | bash';

export const BUILD_FROM_SOURCE = {
  requirements: 'Go 1.22+ and an active internet connection.',
  steps: [
    { cmd: 'git clone https://github.com/QYVORA/qyvora-anansi-cli' },
    { cmd: 'cd qyvora-anansi-cli' },
    { cmd: './install.sh', note: 'Auto-detects your OS/arch, downloads the checksum-verified binary, or falls back to building from source. Installs to ~/.local/bin and adds it to your shell config.' },
  ],
};

export const USAGE_EXAMPLES = [
  'anansi target.com',
  'anansi target.com --deep',
  'anansi target.com -v',
  'anansi target.com --modules discovery,tls,takeover',
  'anansi target.com --out json > results.json',
];

export const SOURCE_EXAMPLES: ToolSourceExample[] = [
  {
    id: 'entry',
    filename: 'main.go',
    label: 'CLI entry point',
    description: 'The binary stays intentionally thin and hands control to the Cobra command layer.',
    code: 'package main\n\nimport "github.com/QYVORA/qyvora-anansi-cli/cmd"\n\nfunc main() {\n\tcmd.Execute()\n}',
  },
  {
    id: 'transport',
    filename: 'internal/httpclient/httpclient.go',
    label: 'Shared HTTP transport',
    description: 'One process-wide transport reuses keep-alive connections across every phase of a scan.',
    code: 'var sharedTransport = &http.Transport{\n\tTLSClientConfig:       &tls.Config{InsecureSkipVerify: true},\n\tMaxIdleConns:          1024,\n\tMaxIdleConnsPerHost:   64,\n\tIdleConnTimeout:       90 * time.Second,\n\tTLSHandshakeTimeout:   10 * time.Second,\n\tForceAttemptHTTP2:     true,\n}\n\nfunc New(timeoutSec int, maxRedirects int) *http.Client {\n\ttimeout := time.Duration(timeoutSec) * time.Second\n\tclient := &http.Client{\n\t\tTimeout:   timeout,\n\t\tTransport: sharedTransport,\n\t}\n\tif maxRedirects >= 0 {\n\t\tclient.CheckRedirect = func(_ *http.Request, via []*http.Request) error {\n\t\t\tif len(via) > maxRedirects {\n\t\t\t\treturn http.ErrUseLastResponse\n\t\t\t}\n\t\t\treturn nil\n\t\t}\n\t}\n\treturn client\n}',
  },
  {
    id: 'discovery',
    filename: 'internal/discovery/discovery.go',
    label: 'CT-log discovery',
    description: 'Subdomain candidates are pulled from crt.sh Certificate Transparency logs, then deduplicated.',
    code: 'var resolver = dnscache.New(dnsResolver, 60*time.Second, 20000)\n\nfunc fetchCrtSh(target string, timeout int) ([]string, error) {\n\tctx, cancel := context.WithTimeout(context.Background(), time.Duration(timeout*2)*time.Second)\n\tdefer cancel()\n\tclient := httpclient.NewFollowRedirects(timeout)\n\turl := fmt.Sprintf("https://crt.sh/?q=%%25.%s&output=json", target)\n\treq, err := http.NewRequestWithContext(ctx, "GET", url, nil)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\tresp, err := client.Do(req)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\tdefer resp.Body.Close()\n\n\tvar entries []crtEntry\n\tif err := json.NewDecoder(resp.Body).Decode(&entries); err != nil {\n\t\treturn nil, fmt.Errorf("json decode error: %w", err)\n\t}\n\n\tseen := map[string]struct{}{}\n\tvar results []string\n\tfor _, e := range entries {\n\t\tfor _, name := range strings.Split(e.NameValue, "\\n") {\n\t\t\tclean := strings.ToLower(strings.TrimSpace(name))\n\t\t\tclean = strings.TrimPrefix(clean, "*.")\n\t\t\tif strings.HasSuffix(clean, "."+target) || clean == target {\n\t\t\t\tif _, exists := seen[clean]; !exists {\n\t\t\t\t\tseen[clean] = struct{}{}\n\t\t\t\t\tresults = append(results, clean)\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\treturn results, nil\n}',
  },
  {
    id: 'resolver',
    filename: 'internal/discovery/discovery.go',
    label: 'Dead-CNAME detection',
    description: 'Unresolvable CNAMEs are kept as flagged hosts — the subdomain takeover signal.',
    code: 'func resolveHost(ctx context.Context, fqdn string) ([]string, []string) {\n\tips, err := resolver.LookupHost(ctx, fqdn)\n\tif err != nil {\n\t\tcname, cerr := resolver.LookupCNAME(ctx, fqdn)\n\t\tif cerr == nil && cname != fqdn+"." {\n\t\t\treturn nil, []string{strings.TrimSuffix(cname, ".")}\n\t\t}\n\t\treturn nil, nil\n\t}\n\n\tvar publicIPs []string\n\tfor _, ip := range ips {\n\t\tparsed := net.ParseIP(ip)\n\t\tif parsed != nil && !parsed.IsPrivate() && !parsed.IsLoopback() {\n\t\t\tpublicIPs = append(publicIPs, ip)\n\t\t}\n\t}\n\treturn publicIPs, nil\n}',
  },
];

export const SCAN_OUTPUT: { label: string; text: string }[] = [
  { label: 'discovery', text: '312 subdomains resolved via crt.sh + brute-force' },
  { label: 'probe', text: '48 live hosts — status codes and titles extracted' },
  { label: 'tls', text: '3 SANs mapped · weak protocol flagged' },
  { label: 'headers', text: '12 security header misconfigurations found' },
  { label: 'paths', text: '.env exposed · backup archive discoverable' },
  { label: 'tech', text: 'WordPress 6.x detected · known-vulnerable plugin flagged' },
  { label: 'takeover', text: '1 dangling CNAME pointing to AWS S3' },
  { label: 'chain', text: '2 exploit paths assembled · Critical: 3 · High: 7' },
];
