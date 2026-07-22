import { Link } from 'react-router-dom';
import { BookOpen, Swords } from 'lucide-react';
import { IconArrowRight, IconLabs } from '@/shared/components/icons';
import { type ContentRef } from '@/shared/constants/topicMap';
import ScrollReveal from '@/shared/components/ScrollReveal';

interface RelatedContentProps {
  courses?: ContentRef[];
  labs?: ContentRef[];
  hpbRooms?: ContentRef[];
  title?: string;
}

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  course: { label: 'Course', icon: BookOpen, color: 'text-accent border-accent/30 bg-accent/10' },
  lab: { label: 'Lab', icon: IconLabs, color: 'text-amber-400 border-amber-400/30 bg-amber-400/10' },
  hpb: { label: 'HPB Room', icon: Swords, color: 'text-purple-400 border-purple-400/30 bg-purple-400/10' },
};

function ContentCard({ item }: { item: ContentRef }) {
  const cfg = TYPE_CONFIG[item.type];
  const Icon = cfg.icon;
  return (
    <Link
      to={item.route}
      className="group flex flex-col aspect-square rounded-2xl border border-border/30 bg-bg-card p-4 transition-all hover:border-accent/30"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${cfg.color}`}>
          <Icon className="h-2.5 w-2.5" /> {cfg.label}
        </span>
      </div>
      <h4 className="text-sm font-black text-text-primary group-hover:text-accent transition-colors leading-snug mb-1">
        {item.title}
      </h4>
      {item.subtitle && (
        <p className="text-[11px] text-text-muted line-clamp-2 flex-1">{item.subtitle}</p>
      )}
      <div className="mt-auto pt-2 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-text-muted group-hover:text-accent transition-colors">
        Open <IconArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

export function RelatedContent({ courses = [], labs = [], hpbRooms = [], title }: RelatedContentProps) {
  const allItems = [...courses, ...labs, ...hpbRooms];
  if (allItems.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-black text-text-primary tracking-tight mb-4 font-mono">
        <span className="text-accent">//</span> {title || 'Related Content'}
      </h2>
      <p className="text-xs text-text-muted font-mono mb-5">
        Continue learning this topic across other parts of the platform
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {allItems.map((item) => (
          <ScrollReveal key={`${item.type}-${item.id}`} direction="up" amount={0.1}>
            <ContentCard item={item} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export default RelatedContent;
