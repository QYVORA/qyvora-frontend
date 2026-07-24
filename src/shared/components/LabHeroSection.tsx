import { GridBoxedBackground } from '@/shared/components/backgrounds';

interface LabHeroSectionProps {
  icon: React.ReactNode;
  title: string;
  accentWord: string;
  description: string;
  villain?: {
    name: string;
    alias: string;
    description: string;
    avatar: string;
  };
  children?: React.ReactNode;
}

export function LabHeroSection({ icon, title, accentWord, description, villain, children }: LabHeroSectionProps) {
  return (
    <div className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden">
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
            <span className="text-accent">{accentWord}</span>
          </h1>

          <p className="text-base sm:text-lg text-text-secondary font-mono max-w-2xl leading-relaxed">
            {description}
          </p>

          {children}
        </div>
      </div>
    </div>
  );
}

export default LabHeroSection;
