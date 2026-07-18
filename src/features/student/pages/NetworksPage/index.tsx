import { useState } from 'react';
import {
  Globe, Monitor, Server, Wifi, Shield,
  Network, Router, HardDrive, Terminal,
} from 'lucide-react';
import SEO from '@/shared/components/SEO';
import { SimulatedTerminal } from '@/features/student/components/SimulatedTerminal';
import {
  NETWORK_CONFIG, DEVICES, STUDENT_IP, STUDENT_MAC, STUDENT_HOSTNAME,
  getHiddenIps,
} from '@/features/student/data/fakeNetwork';
import { useSimulation } from '@/features/student/components/simulations';
import LearningOverviewCard from '@/features/student/components/learning/LearningOverviewCard';

const SubnetBadge = () => (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent-dim/20 text-accent text-xs font-mono font-bold">
    <Network className="w-3.5 h-3.5" />
    {NETWORK_CONFIG.subnet}/{NETWORK_CONFIG.cidr}
  </div>
);

const InfoCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-border/30 bg-bg-card">
    <div className="w-8 h-8 rounded-lg bg-accent-dim/30 flex items-center justify-center text-accent shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">{label}</p>
      <p className="text-sm font-mono font-bold text-text-primary truncate">{value}</p>
    </div>
  </div>
);

const OSIcon = ({ os }: { os: string }) => {
  if (os.toLowerCase().includes('windows')) return <Monitor className="w-3.5 h-3.5 text-blue-400" />;
  if (os.toLowerCase().includes('ubuntu') || os.toLowerCase().includes('debian') || os.toLowerCase().includes('fedora') || os.toLowerCase().includes('linux')) return <Server className="w-3.5 h-3.5 text-accent" />;
  if (os.toLowerCase().includes('cisco')) return <Router className="w-3.5 h-3.5 text-amber-400" />;
  if (os.toLowerCase().includes('embedded')) return <HardDrive className="w-3.5 h-3.5 text-purple-400" />;
  return <Monitor className="w-3.5 h-3.5 text-text-muted" />;
};

const DeviceRow = ({ device, index, discovered }: { device: typeof DEVICES[0]; index: number; discovered: boolean }) => (
  <div className={`grid grid-cols-[24px_1fr_auto] md:grid-cols-[24px_1fr_140px] gap-2 md:gap-4 px-4 py-3 rounded-2xl border transition-all items-center ${
    discovered ? 'border-border/30 bg-bg-card hover:border-accent/20' : 'border-border/10 bg-bg-card/50 opacity-50'
  }`}>
    <span className="text-[10px] font-mono font-bold text-text-muted/40">{index + 1}</span>
    <div className="flex items-center gap-2 min-w-0">
      <OSIcon os={device.os} />
      <div className="min-w-0">
        <p className="text-xs font-bold text-text-primary truncate">{discovered ? device.hostname : 'Unknown Device'}</p>
        <p className="text-[9px] font-mono text-text-muted truncate">{discovered ? device.vendor : '???'}</p>
      </div>
    </div>
    <p className="text-xs font-mono font-bold text-text-primary text-right md:text-left">
      {discovered ? device.ip : '?.?.?.?'}
    </p>
  </div>
);

const NetworksPage = () => {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const { discovery } = useSimulation();

  const knownDevices = DEVICES.filter(d => d.discoverable && !d.hidden);
  const hiddenCount = getHiddenIps().length;
  const discoveredCount = knownDevices.filter(d => discovery.discoveredIps.includes(d.ip)).length;

  return (
    <div className="bg-bg min-h-full">
      <SEO title="Network Lab" description="Simulated corporate network environment for terminal practice." noindex />

      <div className=" px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-6">
        {/* Header */}
        <LearningOverviewCard
          icon={<Network className="w-6 h-6 text-bg" />}
          title="Network Lab"
          description="Simulated corporate network environment for terminal practice"
          stats={[{ label: 'Subnet', value: `${NETWORK_CONFIG.subnet}/${NETWORK_CONFIG.cidr}` }]}
          action={{
            label: 'Open Terminal',
            onClick: () => setTerminalOpen(true),
            icon: <Terminal className="w-4 h-4" />,
          }}
        />

        {/* Simulation notice */}
        <div className="flex items-start gap-3 px-5 py-4 rounded-2xl border border-yellow-400/20 bg-yellow-400/5">
          <Shield className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-yellow-400">Simulated Environment</p>
            <p className="text-xs text-text-muted mt-0.5">
              This is a fully simulated network. All devices, IPs, ports, and services are fictional.
              The environment is designed for learning network scanning, enumeration, and basic penetration testing techniques.
              No actual network traffic is generated.
            </p>
          </div>
        </div>

        {/* Network info cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <InfoCard icon={<Globe className="w-4 h-4" />} label="Subnet" value={`${NETWORK_CONFIG.subnet}/${NETWORK_CONFIG.cidr}`} />
          <InfoCard icon={<Router className="w-4 h-4" />} label="Gateway" value={NETWORK_CONFIG.gateway} />
          <InfoCard icon={<Wifi className="w-4 h-4" />} label="DNS" value={NETWORK_CONFIG.dns.join(', ')} />
          <InfoCard icon={<Network className="w-4 h-4" />} label="Netmask" value={NETWORK_CONFIG.netmask} />
        </div>

        {/* Your machine card */}
        <div className="rounded-2xl border border-accent/30 bg-accent-dim/10 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Monitor className="w-4 h-4 text-accent" />
            <span className="text-[9px] font-black uppercase tracking-widest text-accent">Your Machine (Kali)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block">IP Address</span>
              <span className="font-mono font-bold text-text-primary">{STUDENT_IP}</span>
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block">MAC</span>
              <span className="font-mono font-bold text-text-primary">{STUDENT_MAC}</span>
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block">Hostname</span>
              <span className="font-mono font-bold text-text-primary">{STUDENT_HOSTNAME}</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="text-text-muted">Discovered ({discoveredCount}/{knownDevices.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-text-muted/30" />
            <span className="text-text-muted">Undiscovered ({knownDevices.length - discoveredCount})</span>
          </div>
          {hiddenCount > 0 && (
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-red-400" />
              <span className="text-text-muted">{hiddenCount} hidden — use <span className="text-accent">nmap</span> to discover</span>
            </div>
          )}
        </div>

        {/* Device list header */}
        <div className="hidden md:grid grid-cols-[24px_1fr_140px] gap-4 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-text-muted/50 border-b border-border/40">
          <span>#</span>
          <span>Hostname</span>
          <span className="text-right">IP</span>
        </div>

        {/* Device rows — only show discovered devices */}
        <div className="space-y-1.5">
          {discoveredCount === 0 ? (
            <div className="px-4 py-6 text-center text-xs text-text-muted font-mono border border-dashed border-border/40 rounded-xl">
              No hosts discovered yet. Open the terminal and run <span className="text-accent">nmap -sn 10.0.0.0/24</span> to start scanning.
            </div>
          ) : (
            knownDevices
              .filter(d => discovery.discoveredIps.includes(d.ip))
              .map((device, idx) => (
                <DeviceRow key={device.ip} device={device} index={idx} discovered={true} />
              ))
          )}
          {/* Show placeholders for undiscovered */}
          {discoveredCount > 0 && discoveredCount < knownDevices.length && (
            <div className="px-4 py-3 text-center text-[10px] text-text-muted/50 font-mono border border-dashed border-border/20 rounded-xl">
              {knownDevices.length - discoveredCount} more device(s) to discover
            </div>
          )}
        </div>

        {/* Tip box */}
        <div className="rounded-2xl border border-accent/20 bg-accent-dim/5 p-5">
          <div className="flex items-start gap-3">
            <Terminal className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-accent">Try it yourself</p>
              <p className="text-xs text-text-muted mt-1 space-y-1">
                Open the terminal and practice network scanning techniques:
              </p>
              <ul className="text-xs text-text-muted mt-2 space-y-1 list-disc list-inside font-mono">
                <li><span className="text-accent">ping 10.0.0.1</span> - Check if gateway is alive</li>
                <li><span className="text-accent">nmap -sn 10.0.0.0/24</span> - Discover live hosts on the subnet</li>
                <li><span className="text-accent">nmap -sV 10.0.0.5</span> - Service scan a web server</li>
                <li><span className="text-accent">nmap -O 10.0.0.10</span> - OS detection on file server</li>
                <li><span className="text-accent">nmap -p- 10.0.0.5</span> - Scan all 65535 ports</li>
                <li><span className="text-accent">arp</span> - View discovered hosts in ARP table</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Terminal */}
      <SimulatedTerminal
        open={terminalOpen}
        onOpenChange={setTerminalOpen}
        context={{ type: 'dashboard' }}
        mode="modal"
        title="network-lab"
      />
    </div>
  );
};

export default NetworksPage;
