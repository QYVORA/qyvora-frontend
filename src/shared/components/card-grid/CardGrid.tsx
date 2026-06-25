import React from 'react';
import ScrollReveal from '@/shared/components/ScrollReveal';

export interface CardGridProps<T extends { id: string }> {
  slides: readonly T[];
  renderCard: (slide: T, index: number) => React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  containerClassName?: string;
}

function CardGrid<T extends { id: string }>({
  slides,
  renderCard,
  cols = 2,
  containerClassName,
}: CardGridProps<T>) {
  if (!slides.length) return null;

  const gridCols: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
  };

  const wrapper =
    containerClassName ??
    'w-full px-4 sm:px-6 md:px-10 py-20 md:pt-28 lg:pt-36 xl:pt-40 md:pb-16 lg:pb-20';

  return (
    <div className={wrapper}>
      <div className="max-w-[1600px] mx-auto w-full">
        <div
          className={`grid ${gridCols[cols] ?? gridCols[2]} gap-5 sm:gap-6 lg:gap-8`}
        >
          {slides.map((slide, i) => (
            <ScrollReveal key={slide.id} direction="up" amount={0.1}>
              {renderCard(slide, i)}
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CardGrid;
