import React from 'react';
import { motion } from 'motion/react';
import { fmtShort } from './utils';

interface BarChartProps {
  data: { label: string; value: number; color: string }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-20 text-[10px] font-mono text-text-muted uppercase tracking-wider truncate">{d.label}</div>
          <div className="flex-1 h-5 bg-bg rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(d.value / max) * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: d.color }}
            />
          </div>
          <div className="w-16 text-right text-[10px] font-mono text-text-secondary">{fmtShort(d.value)}</div>
        </div>
      ))}
    </div>
  );
};

export default BarChart;
