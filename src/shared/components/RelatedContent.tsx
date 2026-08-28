import React from 'react';
import { BookOpen, Swords } from 'lucide-react';
import { IconLabs } from '@/shared/components/icons';
import { type ContentRef } from '@/shared/constants/topicMap';
import ScrollReveal from '@/shared/components/ScrollReveal';
import LearningCard from '@/shared/components/learning/LearningCard';

interface RelatedContentProps {
  courses?: ContentRef[];
  labs?: ContentRef[];
  hpbRooms?: ContentRef[];
  title?: string;
}

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType }> = {
  course: { label: 'Course', icon: BookOpen },
  lab: { label: 'Lab', icon: IconLabs },
  hpb: { label: 'HPB Room', icon: Swords },
};

export function RelatedContent({ courses = [], labs = [], hpbRooms = [], title }: RelatedContentProps) {
  const allItems = [...courses, ...labs, ...hpbRooms];
  if (allItems.length === 0) return null;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-text-primary mb-2">
          {title || 'Related Content'}
        </h2>
        <p className="text-xs md:text-sm text-text-muted font-mono">
          Continue learning this topic across other parts of the platform
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {allItems.map((item) => {
          const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.course;
          const Icon = cfg.icon;
          return (
            <ScrollReveal key={`${item.type}-${item.id}`} direction="up" amount={0.1}>
              <LearningCard
                title={item.title}
                description={item.subtitle}
                to={item.route}
                badgeText={cfg.label}
                icon={<Icon className="h-5 w-5" />}
                actionLabel="Open"
              />
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}

export default RelatedContent;

