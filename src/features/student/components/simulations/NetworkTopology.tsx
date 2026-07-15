import { useMemo } from 'react';
import { Monitor, Server, Wifi, Shield, Router, Printer, Cpu } from 'lucide-react';
import type { TopologyNode, TopologyLink } from './types';
import { useSimulation } from './SimulationContext';

interface NetworkTopologyProps {
  nodes: TopologyNode[];
  links: TopologyLink[];
}

const ICONS: Record<string, typeof Server> = {
  router: Router, switch: Wifi, server: Server, firewall: Shield,
  workstation: Monitor, printer: Printer, iot: Cpu,
};

const COLORS: Record<string, string> = {
  router: 'text-amber-400', switch: 'text-blue-400', server: 'text-accent',
  firewall: 'text-red-400', workstation: 'text-purple-400', printer: 'text-orange-400', iot: 'text-cyan-400',
};

export function NetworkTopology({ nodes, links }: NetworkTopologyProps) {
  const { discovery } = useSimulation();

  const enrichedNodes = useMemo(() =>
    nodes.map(n => ({
      ...n,
      discovered: n.discovered || discovery.discoveredIps.includes(n.ip || ''),
    })),
  [nodes, discovery.discoveredIps]);

  const enrichedLinks = useMemo(() =>
    links.map(l => ({
      ...l,
      discovered: l.discovered || (
        enrichedNodes.find(n => n.id === l.from)?.discovered &&
        enrichedNodes.find(n => n.id === l.to)?.discovered
      ),
    })),
  [links, enrichedNodes]);

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
      <div className="px-4 py-3 bg-bg-elevated border-b border-border/20">
        <p className="text-[10px] font-black uppercase tracking-widest text-accent">Network Topology</p>
        <p className="text-[9px] font-mono text-text-muted mt-0.5">
          {enrichedNodes.filter(n => n.discovered).length}/{enrichedNodes.length} devices discovered
        </p>
      </div>

      <div className="flex-1 min-h-0 p-4 overflow-auto">
        {/* SVG Topology */}
        <svg viewBox="0 0 600 400" className="w-full h-full" style={{ minHeight: '300px' }}>
          {/* Links */}
          {enrichedLinks.map((link, i) => {
            const from = enrichedNodes.find(n => n.id === link.from);
            const to = enrichedNodes.find(n => n.id === link.to);
            if (!from || !to) return null;
            return (
              <line key={i}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={link.discovered ? 'var(--color-accent)' : 'var(--color-border)'}
                strokeWidth={link.discovered ? 2 : 1}
                strokeDasharray={link.discovered ? 'none' : '4 4'}
                opacity={link.discovered ? 0.6 : 0.2}
              />
            );
          })}

          {/* Nodes */}
          {enrichedNodes.map(node => {
            const Icon = ICONS[node.type] || Server;
            const color = COLORS[node.type] || 'text-text-muted';
            const discovered = node.discovered;

            return (
              <g key={node.id} opacity={discovered ? 1 : 0.25}>
                <circle cx={node.x} cy={node.y} r={24}
                  fill={discovered ? 'var(--color-bg-elevated)' : 'var(--color-bg-card)'}
                  stroke={discovered ? 'var(--color-accent)' : 'var(--color-border)'}
                  strokeWidth={discovered ? 2 : 1}
                />
                <foreignObject x={node.x - 10} y={node.y - 10} width={20} height={20}>
                  <div className={`${discovered ? color : 'text-text-muted/30'}`}>
                    <Icon size={20} />
                  </div>
                </foreignObject>
                <text x={node.x} y={node.y + 36}
                  textAnchor="middle"
                  className="fill-text-muted text-[9px] font-mono"
                  style={{ fontFamily: 'monospace' }}>
                  {discovered ? node.label : '???'}
                </text>
                {discovered && node.ip && (
                  <text x={node.x} y={node.y + 48}
                    textAnchor="middle"
                    className="fill-text-muted/50 text-[8px] font-mono"
                    style={{ fontFamily: 'monospace' }}>
                    {node.ip}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 justify-center">
          {Object.entries(ICONS).map(([type, Icon]) => (
            <div key={type} className="flex items-center gap-1 text-[8px] font-mono text-text-muted">
              <Icon size={10} className={COLORS[type]} />
              <span className="capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
