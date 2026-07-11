import { useState, useCallback, useMemo } from 'react';
import {
  Activity, ArrowLeft, CheckCircle,
  Search, Filter, Play, Wifi, Globe, Server,
} from 'lucide-react';
import { TRAFFIC_CHALLENGES } from '@/features/student/data/simulations/traffic-data';
import SEO from '@/shared/components/SEO';
import { verifyLabFlag } from '../../../services/lab.service';

interface TrafficChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  packets: PcapPacket[];
  analysisTasks: TrafficTask[];
  filterCommands: TrafficFilter[];
  cpReward: number;
}

interface PcapPacket {
  number: number;
  time: string;
  source: string;
  destination: string;
  protocol: string;
  length: number;
  info: string;
  srcPort?: number;
  dstPort?: number;
  flags?: string;
  payload?: string;
}

interface TrafficTask { question: string; hint: string; answer: string; }
interface TrafficFilter { filter: string; description: string; }

const DIFFICULTY_STYLES: Record<string, { bg: string; text: string }> = {
  beginner: { bg: 'bg-accent/10', text: 'text-accent' },
  intermediate: { bg: 'bg-yellow-400/10', text: 'text-yellow-400' },
  advanced: { bg: 'bg-red-400/10', text: 'text-red-400' },
};

const PROTOCOL_COLORS: Record<string, string> = {
  TCP: 'bg-blue-400/10 hover:bg-blue-400/15',
  UDP: 'bg-purple-400/10 hover:bg-purple-400/15',
  HTTP: 'bg-green-400/10 hover:bg-green-400/15',
  DNS: 'bg-yellow-400/10 hover:bg-yellow-400/15',
  ARP: 'bg-orange-400/10 hover:bg-orange-400/15',
};

const PROTOCOL_TEXT_COLORS: Record<string, string> = {
  TCP: 'text-blue-400',
  UDP: 'text-purple-400',
  HTTP: 'text-green-400',
  DNS: 'text-yellow-400',
  ARP: 'text-orange-400',
};

function matchFilter(packet: PcapPacket, filter: string): boolean {
  if (!filter.trim()) return true;
  const f = filter.trim().toLowerCase();
  if (f.startsWith('tcp')) return packet.protocol === 'TCP';
  if (f.startsWith('udp')) return packet.protocol === 'UDP';
  if (f.startsWith('http')) return packet.protocol === 'HTTP';
  if (f.startsWith('dns')) return packet.protocol === 'DNS';
  if (f.startsWith('arp')) return packet.protocol === 'ARP';
  if (f.startsWith('ip.addr ==')) {
    const addr = f.replace('ip.addr ==', '').trim();
    return packet.source.includes(addr) || packet.destination.includes(addr);
  }
  if (f.startsWith('src ==') || f.startsWith('ip.src ==')) {
    const addr = f.replace(/^(src|ip\.src)\s*==\s*/, '').trim();
    return packet.source.includes(addr);
  }
  if (f.startsWith('dst ==') || f.startsWith('ip.dst ==')) {
    const addr = f.replace(/^(dst|ip\.dst)\s*==\s*/, '').trim();
    return packet.destination.includes(addr);
  }
  if (f.startsWith('frame.len') || f.startsWith('len')) {
    const num = parseInt(f.replace(/^(frame\.len|len)\s*==\s*/, '').trim());
    if (!isNaN(num)) return packet.length === num;
  }
  return packet.source.toLowerCase().includes(f)
    || packet.destination.toLowerCase().includes(f)
    || packet.info.toLowerCase().includes(f)
    || packet.protocol.toLowerCase().includes(f);
}

function toHexDump(text: string): string {
  const lines: string[] = [];
  for (let i = 0; i < text.length; i += 16) {
    const chunk = text.slice(i, i + 16);
    const hex = chunk.split('').map((c) => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
    const ascii = chunk.split('').map((c) => {
      const code = c.charCodeAt(0);
      return code >= 32 && code <= 126 ? c : '.';
    }).join('');
    lines.push(`${i.toString(16).padStart(8, '0')}  ${hex.padEnd(48)}  ${ascii}`);
  }
  return lines.join('\n');
}

const ChallengeCard = ({ challenge, onClick }: { challenge: TrafficChallenge; onClick: () => void }) => {
  const difficulty = DIFFICULTY_STYLES[challenge.difficulty];
  const packetCount = challenge.packets.length;

  return (
    <button
      onClick={onClick}
      className="group flex flex-col h-full rounded-2xl border border-border/30 bg-bg-card p-5 hover:border-accent/30 transition-all duration-300 text-left w-full"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
          <Activity className="w-5 h-5 text-accent" />
        </div>
        <h3 className="text-sm font-black text-text-primary group-hover:text-accent transition-colors leading-snug">
          {challenge.title}
        </h3>
      </div>

      <p className="text-xs text-text-muted/70 font-mono leading-relaxed mb-4 flex-1 line-clamp-2">
        {challenge.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${difficulty.bg} ${difficulty.text}`}>
          {challenge.difficulty}
        </span>
        <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-blue-400/10 text-blue-400">
          {packetCount} packets
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/20">
        <span className="text-[10px] font-black uppercase tracking-widest text-accent">
          {challenge.cpReward} CP
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-accent transition-colors">
          Start Lab
        </span>
      </div>
    </button>
  );
};

const PacketDetailPanel = ({ packet }: { packet: PcapPacket }) => {
  const protocolColor = PROTOCOL_TEXT_COLORS[packet.protocol] || 'text-text-muted';

  return (
    <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/20">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-accent" />
          <span className="text-[9px] font-black uppercase tracking-widest text-accent">
            Packet #{packet.number} Detail
          </span>
        </div>
        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-bg-elevated ${protocolColor}`}>
          {packet.protocol}
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {[
            ['No.', String(packet.number)],
            ['Time', packet.time],
            ['Source', packet.source],
            ['Destination', packet.destination],
            ['Protocol', packet.protocol],
            ['Length', `${packet.length} bytes`],
          ].map(([label, value]) => (
            <div key={label} className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">{label}</p>
              <p className="text-xs font-mono text-text-primary break-all">{value}</p>
            </div>
          ))}
        </div>

        {packet.srcPort !== undefined && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Source Port</p>
              <p className="text-xs font-mono text-text-primary">{packet.srcPort}</p>
            </div>
            {packet.dstPort !== undefined && (
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Dest Port</p>
                <p className="text-xs font-mono text-text-primary">{packet.dstPort}</p>
              </div>
            )}
          </div>
        )}

        {packet.flags && (
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Flags</p>
            <p className="text-xs font-mono text-accent">{packet.flags}</p>
          </div>
        )}

        <div className="space-y-1">
          <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Info</p>
          <p className="text-xs font-mono text-text-primary leading-relaxed">{packet.info}</p>
        </div>

        {packet.payload && (
          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Payload (Hex Dump)</p>
            <div className="bg-bg-card rounded-xl p-4 max-h-48 overflow-y-auto">
              <pre className="font-mono text-[10px] text-accent/70 whitespace-pre leading-relaxed">
                {toHexDump(packet.payload)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TrafficLab = () => {
  const [activeChallenge, setActiveChallenge] = useState<TrafficChallenge | null>(null);
  const [selectedPacket, setSelectedPacket] = useState<PcapPacket | null>(null);
  const [filterText, setFilterText] = useState('');
  const [taskAnswers, setTaskAnswers] = useState<Record<number, string>>({});
  const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set());
  const [flagInput, setFlagInput] = useState('');
  const [flagStatus, setFlagStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [flagLoading, setFlagLoading] = useState(false);

  const filteredPackets = useMemo(() => {
    if (!activeChallenge) return [];
    return activeChallenge.packets.filter((p) => matchFilter(p, filterText));
  }, [activeChallenge, filterText]);

  const score = useMemo(() => {
    if (!activeChallenge) return 0;
    let correct = 0;
    for (let i = 0; i < activeChallenge.analysisTasks.length; i++) {
      const userAnswer = (taskAnswers[i] || '').trim().toLowerCase();
      const correctAnswer = activeChallenge.analysisTasks[i].answer.trim().toLowerCase();
      if (userAnswer && (userAnswer === correctAnswer || correctAnswer.includes(userAnswer) || userAnswer.includes(correctAnswer))) {
        correct++;
      }
    }
    return correct;
  }, [activeChallenge, taskAnswers]);

  const handleBack = useCallback(() => {
    setActiveChallenge(null);
    setSelectedPacket(null);
    setFilterText('');
    setTaskAnswers({});
    setRevealedHints(new Set());
    setFlagInput('');
    setFlagStatus('idle');
    setFlagLoading(false);
  }, []);

  const handleStartChallenge = useCallback((challenge: TrafficChallenge) => {
    setActiveChallenge(challenge);
    setSelectedPacket(null);
    setFilterText('');
    setTaskAnswers({});
    setRevealedHints(new Set());
    setFlagInput('');
    setFlagStatus('idle');
    setFlagLoading(false);
  }, []);

  const handleApplyFilter = useCallback((filter: string) => {
    setFilterText(filter);
  }, []);

  const handleSubmitFlag = useCallback(async () => {
    if (!activeChallenge || !flagInput.trim() || flagLoading) return;
    setFlagLoading(true);
    try {
      const result = await verifyLabFlag('traffic', activeChallenge.id, flagInput.trim());
      if (result.correct) {
        setFlagStatus('correct');
      } else {
        setFlagStatus('incorrect');
      }
    } catch {
      setFlagStatus('incorrect');
    } finally {
      setFlagLoading(false);
    }
  }, [activeChallenge, flagInput, flagLoading]);

  const toggleHint = useCallback((index: number) => {
    setRevealedHints((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  if (!activeChallenge) {
    return (
      <div className="bg-bg min-h-full">
        <SEO title="Traffic Analysis Lab" description="Analyze simulated network packet captures for security threats." />

        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                <Activity className="w-6 h-6 text-accent" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight">
                Traffic <span className="text-accent">Analysis</span>
              </h1>
            </div>
            <p className="text-sm text-text-muted font-mono">
              Analyze simulated packet captures to identify threats and extract intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TRAFFIC_CHALLENGES.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onClick={() => handleStartChallenge(challenge)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const difficulty = DIFFICULTY_STYLES[activeChallenge.difficulty];

  return (
    <div className="bg-bg min-h-full">
      <SEO title={`${activeChallenge.title} — Traffic Lab`} description={activeChallenge.description} />

      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24 space-y-6">
        {/* Back + Header */}
        <div>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors text-sm font-mono mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Challenges</span>
          </button>

          <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-accent" />
                </div>
                <h2 className="text-lg font-black text-text-primary">{activeChallenge.title}</h2>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${difficulty.bg} ${difficulty.text}`}>
                  {activeChallenge.difficulty}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-blue-400/10 text-blue-400">
                  {activeChallenge.packets.length} packets
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent/10 text-accent">
                  {activeChallenge.cpReward} CP
                </span>
              </div>
            </div>
            <p className="text-xs text-text-muted/70 font-mono leading-relaxed">
              {activeChallenge.description}
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="rounded-2xl border border-border/30 bg-bg-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <Filter className="w-4 h-4 text-accent shrink-0" />
            <span className="text-[9px] font-black uppercase tracking-widest text-accent">
              Packet Filter
            </span>
            {filterText && (
              <span className="text-[9px] font-mono text-text-muted">
                ({filteredPackets.length} of {activeChallenge.packets.length} packets)
              </span>
            )}
          </div>

          <div className="flex gap-3 mb-3">
            <div className="flex-1 flex items-center gap-2 bg-bg border border-border/30 rounded-xl px-3 py-2 focus-within:border-accent transition-colors">
              <Search className="w-4 h-4 text-text-muted/50 shrink-0" />
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                placeholder="tcp, http, dns, ip.addr == 192.168.1.1 ..."
                className="flex-1 bg-transparent text-xs font-mono text-text-primary outline-none placeholder:text-text-muted/30"
              />
              {filterText && (
                <button
                  onClick={() => setFilterText('')}
                  className="text-text-muted hover:text-accent transition-colors text-xs"
                >
                  &#x2715;
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {activeChallenge.filterCommands.map((fc, i) => (
              <button
                key={i}
                onClick={() => handleApplyFilter(fc.filter)}
                className="btn-secondary group relative px-3 py-1.5 !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest border border-border/20 hover:border-accent/30 bg-bg-elevated/30 transition-all"
                title={fc.description}
              >
                <span className="text-[10px] font-mono text-text-muted group-hover:text-accent transition-colors">
                  {fc.filter}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Packet List + Detail side by side */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Packet List */}
          <div className="flex-1 min-w-0 rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
            {/* Table header */}
            <div className="overflow-x-auto">
            <div className="grid grid-cols-[48px_80px_1fr_1fr_70px_64px_1fr] gap-0 border-b border-border/30 bg-bg-elevated/50 min-w-[600px]">
              {['No.', 'Time', 'Source', 'Destination', 'Proto', 'Len', 'Info'].map((col) => (
                <div key={col} className="px-3 py-2 text-[8px] font-black uppercase tracking-widest text-text-muted border-r border-border/10 last:border-r-0">
                  {col}
                </div>
              ))}
            </div>
            </div>

            {/* Packet rows */}
            <div className="max-h-[400px] overflow-y-auto overflow-x-auto">
              {filteredPackets.length === 0 && (
                <div className="p-8 text-center">
                  <Filter className="w-6 h-6 text-text-muted/30 mx-auto mb-2" />
                  <p className="text-xs font-mono text-text-muted/50">No packets match the current filter</p>
                </div>
              )}
              {filteredPackets.map((packet) => {
                const rowBg = PROTOCOL_COLORS[packet.protocol] || 'hover:bg-white/5';
                const isSelected = selectedPacket?.number === packet.number;

                return (
                  <button
                    key={packet.number}
                    onClick={() => setSelectedPacket(packet)}
                    className={`grid grid-cols-[48px_80px_1fr_1fr_70px_64px_1fr] gap-0 w-full text-left border-b border-border/10 transition-colors min-w-[600px] ${rowBg} ${
                      isSelected ? 'ring-1 ring-accent/50 bg-accent/10' : ''
                    }`}
                  >
                    <div className="px-3 py-2 text-[10px] font-mono text-text-muted/60 border-r border-border/10">
                      {packet.number}
                    </div>
                    <div className="px-3 py-2 text-[10px] font-mono text-text-muted/60 border-r border-border/10 truncate">
                      {packet.time}
                    </div>
                    <div className="px-3 py-2 text-[10px] font-mono text-text-primary/80 border-r border-border/10 truncate">
                      {packet.source}
                    </div>
                    <div className="px-3 py-2 text-[10px] font-mono text-text-primary/80 border-r border-border/10 truncate">
                      {packet.destination}
                    </div>
                    <div className={`px-3 py-2 text-[10px] font-mono font-bold border-r border-border/10 ${PROTOCOL_TEXT_COLORS[packet.protocol] || 'text-text-muted'}`}>
                      {packet.protocol}
                    </div>
                    <div className="px-3 py-2 text-[10px] font-mono text-text-muted/60 border-r border-border/10 text-right">
                      {packet.length}
                    </div>
                    <div className="px-3 py-2 text-[10px] font-mono text-text-muted/70 truncate">
                      {packet.info}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="w-full lg:w-[380px] shrink-0">
            {selectedPacket ? (
              <PacketDetailPanel packet={selectedPacket} />
            ) : (
              <div className="rounded-2xl border border-border/30 bg-bg-card p-6 text-center">
                <Wifi className="w-8 h-8 text-text-muted/30 mx-auto mb-3" />
                <p className="text-xs text-text-muted font-mono">
                  Click a packet in the list to view its details.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Tasks */}
        <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-accent" />
              <span className="text-[9px] font-black uppercase tracking-widest text-accent">
                Analysis Tasks
              </span>
            </div>
            <span className="text-[10px] font-black text-accent">
              {score} / {activeChallenge.analysisTasks.length}
            </span>
          </div>

          <div className="space-y-4">
            {activeChallenge.analysisTasks.map((task, i) => {
              const userAnswer = (taskAnswers[i] || '').trim().toLowerCase();
              const correctAnswer = task.answer.trim().toLowerCase();
              const isCorrect = userAnswer && (userAnswer === correctAnswer || correctAnswer.includes(userAnswer) || userAnswer.includes(correctAnswer));

              return (
                <div key={i} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <span className="text-[10px] font-black text-accent mt-1 shrink-0">
                      {i + 1}.
                    </span>
                    <div className="flex-1 space-y-2">
                      <p className="text-xs font-mono text-text-primary leading-relaxed">
                        {task.question}
                      </p>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={taskAnswers[i] || ''}
                          onChange={(e) => setTaskAnswers((prev) => ({ ...prev, [i]: e.target.value }))}
                          placeholder="Your answer"
                        aria-label={`Answer for task ${i + 1}`}
                          className={`flex-1 bg-bg border rounded-xl px-3 py-2 text-xs font-mono text-text-primary focus:outline-none placeholder:text-text-muted/30 ${
                            isCorrect
                              ? 'border-accent/50 text-accent'
                              : 'border-border/30 focus:border-accent'
                          }`}
                        />
                        <button
                          onClick={() => toggleHint(i)}
                          className="btn-secondary px-3 py-2 !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest text-text-muted hover:text-yellow-400 transition-colors"
                        >
                          Hint
                        </button>
                      </div>

                      {isCorrect && (
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-accent" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-accent">Correct</span>
                        </div>
                      )}

                      {revealedHints.has(i) && (
                        <div className="px-3 py-2 rounded-xl bg-yellow-400/5 border border-yellow-400/20 text-[10px] font-mono text-yellow-400">
                          Hint: {task.hint}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Flag Submission */}
        <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-accent" />
            <span className="text-[9px] font-black uppercase tracking-widest text-accent">
              Submit Flag
            </span>
          </div>

          {flagStatus === 'correct' ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-400/10 border border-green-400/20">
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
              <div>
                <p className="text-sm font-black text-green-400">Traffic Analysis Complete!</p>
                <p className="text-xs font-mono text-text-muted mt-1">
                  You earned <span className="text-accent font-black">{activeChallenge.cpReward} CP</span> for completing this challenge.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={flagInput}
                  onChange={(e) => { setFlagInput(e.target.value); setFlagStatus('idle'); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSubmitFlag(); }}
                  placeholder="FLAG{...}"
                  className={`flex-1 bg-bg border rounded-xl py-3 px-4 text-text-primary focus:outline-none font-mono text-sm ${
                    flagStatus === 'incorrect'
                      ? 'border-red-400/50'
                      : 'border-border/30 focus:border-accent'
                  }`}
                />
                <button
                  onClick={handleSubmitFlag}
                  disabled={!flagInput.trim() || flagLoading}
                  className="btn-primary !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-6 py-3 disabled:opacity-50"
                >
                  {flagLoading ? 'Verifying...' : 'Submit'}
                </button>
              </div>
              {flagStatus === 'incorrect' && (
                <p className="text-xs text-red-400 mt-2 font-mono">Incorrect flag. Keep analyzing.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrafficLab;
