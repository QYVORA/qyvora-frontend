import { GridBoxedBackground } from '@/shared/components/backgrounds';

interface StudentHeroStat {
  label: string;
  value: string | number;
  accent?: boolean;
}

interface StudentHeroSectionProps {
  icon: React.ReactNode;
  title: string;
  accentWord?: string;
  description: string;
  stats?: StudentHeroStat[];
  children?: React.ReactNode;
}

export function StudentHeroSection({ icon, title, accentWord, description, stats, children }: StudentHeroSectionProps) {
  return (
    <div className="relative min-h-[60vh] md:min-h-[70vh] flex flex-col justify-center overflow-hidden">
      <GridBoxedBackground opacity={0.3} blur={0} mask="none" />

      <div className="relative z-10 px-4 sm:px-10 md:px-12 lg:pl-16 xl:pl-20 lg:pr-8 xl:pr-12 pt-24 pb-16">
        <div className="max-w-6xl space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              {icon}
            </div>
          </div>

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
