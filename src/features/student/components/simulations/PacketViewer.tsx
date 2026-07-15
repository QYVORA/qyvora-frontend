import { useState } from 'react';
import type { SimPacket } from './types';

interface PacketViewerProps {
  packets: SimPacket[];
}

export function PacketViewer({ packets }: PacketViewerProps) {
  const [selectedNum, setSelectedNum] = useState<number | null>(packets[0]?.number || null);
  const [filter, setFilter] = useState('');

  const selected = packets.find(p => p.number === selectedNum);
  const filtered = filter
    ? packets.filter(p => p.protocol.toLowerCase().includes(filter.toLowerCase()) || p.source.includes(filter) || p.destination.includes(filter))
    : packets;

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
      <div className="px-4 py-3 bg-bg-elevated border-b border-border/20 flex items-center gap-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-accent">Packet Viewer</p>
        <input
          type="text"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Filter..."
          className="px-2 py-1 rounded bg-bg border border-border/30 text-[10px] font-mono text-text-primary outline-none w-32"
        />
        <span className="ml-auto text-[9px] font-mono text-text-muted">{filtered.length} packets</span>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        {/* Packet List */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-[10px] font-mono">
            <thead className="sticky top-0 bg-bg-elevated">
              <tr className="text-text-muted">
                <th className="text-left px-3 py-2">#</th>
                <th className="text-left px-3 py-2">Time</th>
                <th className="text-left px-3 py-2">Source</th>
                <th className="text-left px-3 py-2">Destination</th>
                <th className="text-left px-3 py-2">Proto</th>
                <th className="text-left px-3 py-2">Info</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(pkt => (
                <tr
                  key={pkt.number}
                  onClick={() => setSelectedNum(pkt.number)}
                  className={`cursor-pointer border-b border-border/10 transition-colors ${
                    selectedNum === pkt.number ? 'bg-accent/10' : 'hover:bg-white/5'
                  }`}
                >
                  <td className="px-3 py-1.5 text-text-muted">{pkt.number}</td>
                  <td className="px-3 py-1.5 text-text-muted">{pkt.time}</td>
                  <td className="px-3 py-1.5 text-text-primary">{pkt.source}</td>
                  <td className="px-3 py-1.5 text-text-primary">{pkt.destination}</td>
                  <td className="px-3 py-1.5">
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                      pkt.protocol === 'TCP' ? 'bg-blue-400/10 text-blue-400' :
                      pkt.protocol === 'UDP' ? 'bg-green-400/10 text-green-400' :
                      pkt.protocol === 'HTTP' ? 'bg-yellow-400/10 text-yellow-400' :
                      pkt.protocol === 'DNS' ? 'bg-purple-400/10 text-purple-400' :
                      pkt.protocol === 'ARP' ? 'bg-orange-400/10 text-orange-400' :
                      'bg-text-muted/10 text-text-muted'
                    }`}>{pkt.protocol}</span>
                  </td>
                  <td className="px-3 py-1.5 text-text-muted truncate max-w-[200px]">{pkt.info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Packet Detail */}
        {selected && (
          <div className="border-t border-border/20 p-4 max-h-[250px] overflow-auto">
            <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-2">
              Packet #{selected.number} Detail
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono mb-3">
              <div><span className="text-text-muted">Source:</span> <span className="text-text-primary">{selected.source}</span></div>
              <div><span className="text-text-muted">Destination:</span> <span className="text-text-primary">{selected.destination}</span></div>
              <div><span className="text-text-muted">Protocol:</span> <span className="text-text-primary">{selected.protocol}</span></div>
              <div><span className="text-text-muted">Length:</span> <span className="text-text-primary">{selected.length} bytes</span></div>
              {selected.flags && <div><span className="text-text-muted">Flags:</span> <span className="text-text-primary">{selected.flags}</span></div>}
            </div>

            {selected.layers && selected.layers.map((layer, i) => (
              <div key={i} className="mb-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-1">{layer.name}</p>
                {Object.entries(layer.fields).map(([k, v]) => (
                  <div key={k} className="text-[10px] font-mono">
                    <span className="text-text-muted">{k}:</span>{' '}
                    <span className="text-text-primary">{v}</span>
                  </div>
                ))}
              </div>
            ))}

            {selected.payload && (
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-1">Payload</p>
                <pre className="text-[10px] font-mono text-text-muted bg-black/40 rounded p-2 whitespace-pre-wrap">{selected.payload}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
