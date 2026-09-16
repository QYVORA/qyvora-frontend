import { RANK_COLORS } from './types';

const RankBadge = ({ label }: { label: string }) => {
  const color = RANK_COLORS[label] || 'text-text-muted';
  return (
    <span className={`text-xs font-black uppercase tracking-widest ${color}`}>
      {label}
    </span>
  );
};

export default RankBadge;
