import { GridBoxedBackground } from '@/shared/components/backgrounds';

interface StudentHeroStat {
  label: string;
  value: string | number;
  accent?: boolean;
}

interface StudentHeroSectionProps {
  icon?: React.ReactNode;
  title: string;
  accentWord?: string;
  description: string;
  stats?: StudentHeroStat[];
  children?: React.ReactNode;
  villain?: {
    name: string;
    alias: string;
    description: string;
    avatar: string;
  };
}

export function StudentHeroSection({ title, accentWord, description, stats, children }: StudentHeroSectionProps) {
  return (
    <div className="relative h-[calc(100dvh-5rem)] md:h-[calc(100dvh-6rem)] flex flex-col justify-center overflow-hidden">
      <GridBoxedBackground opacity={0.3} blur={0} mask="none" />

      <div className="relative z-10 px-3 md:px-4 lg:px-6 py-12 md:py-16">
        <div className="w-full space-y-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-text-primary tracking-tight leading-[1.05]">
            {title}{' '}
            {accentWord && <span className="text-accent">{accentWord}</span>}
          </h1>

          <p className="text-base sm:text-lg text-text-secondary font-mono max-w-2xl leading-relaxed">
            {description}
          </p>

          {stats && stats.length > 0 && (
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className={`font-mono text-2xl sm:text-3xl font-black ${stat.accent ? 'text-accent' : 'text-text-primary'}`}>
                    {stat.value}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}

export default StudentHeroSection;
