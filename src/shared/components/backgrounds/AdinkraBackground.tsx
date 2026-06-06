import React from 'react';

interface AdinkraBackgroundProps {
  /**
   * Overall opacity of the Adinkra symbols layer (0-1)
   * @default 0.25
   */
  opacity?: number;
  
  /**
   * Whether to include the ambient gradient blobs
   * @default true
   */
  includeGradients?: boolean;
  
  /**
   * Whether to include the dot grid pattern
   * @default true
   */
  includeDotGrid?: boolean;
  
  /**
   * Additional CSS classes for the container
   */
  className?: string;
}

/**
 * AdinkraBackground Component
 * 
 * A reusable background component featuring traditional West African Adinkra symbols
 * combined with modern geometric shapes and ambient effects. Perfect for adding
 * cultural richness and visual depth to any section.
 * 
 * Adinkra symbols included:
 * - GYE NYAME: Supremacy of God
 * - SANKOFA: Learning from the past
 * - DWENNIMMEN: Strength and humility
 * - NKYINKYIM: Initiative and dynamism
 * - WISDOM KNOT: Cleverness and wisdom
 * - NSOROMMA: Faithfulness
 */
const AdinkraBackground: React.FC<AdinkraBackgroundProps> = ({
  opacity = 0.25,
  includeGradients = true,
  includeDotGrid = true,
  className = '',
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      
      {/* Dot Grid Pattern */}
      {includeDotGrid && (
        <div className="absolute inset-0 dot-grid opacity-[0.04] pointer-events-none" />
      )}
      
      {/* Ambient gradient blobs */}
      {includeGradients && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {/* Large gradient orb - bottom left */}
          <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-accent/[0.03] rounded-full blur-[120px]" />
          
          {/* Medium gradient orb - top right */}
          <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-accent/[0.04] rounded-full blur-[100px]" />
          
          {/* Small accent glow - center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/[0.02] rounded-full blur-[80px]" />
        </div>
      )}
      
      {/* Geometric Shapes & Adinkra Symbols Layer */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none" 
        aria-hidden="true"
        style={{ opacity }}
      >
        {/* Large technical circle with dash */}
        <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full border border-accent/20 border-dashed animate-[spin_60s_linear_infinite]" />
        
        {/* Nested concentric circles */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 rounded-full border border-accent/10" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 translate-x-4 w-48 h-48 rounded-full border border-accent/5" />
        
        {/* Small accent circles */}
        <div className="absolute top-24 right-[10%] w-16 h-16 rounded-full border-2 border-accent/20" />
        <div className="absolute bottom-32 right-[20%] w-32 h-32 rounded-full border border-accent/15 border-dashed" />
        
        {/* Floating dot circle */}
        <div className="absolute top-1/3 right-1/4 w-8 h-8 rounded-full bg-accent/10" />
        
        {/* Adinkra Symbols - GYE NYAME (Supremacy of God - except God symbol) */}
        <div className="absolute top-20 left-[8%] w-20 h-20 opacity-40">
          <svg viewBox="0 0 100 100" className="w-full h-full text-accent/50" fill="currentColor">
            <path d="M50 10 L50 40 M50 40 Q35 40 35 55 Q35 65 45 65 L55 65 Q65 65 65 55 Q65 40 50 40 M30 70 L70 70 M40 80 L60 80 M45 90 L55 90" stroke="currentColor" strokeWidth="3" fill="none"/>
            <circle cx="50" cy="20" r="5"/>
          </svg>
        </div>
        
        {/* Adinkra Symbols - SANKOFA (Go back and get it - learning from the past) */}
        <div className="absolute bottom-40 left-[20%] w-24 h-24 opacity-35">
          <svg viewBox="0 0 100 100" className="w-full h-full text-accent/50" fill="currentColor">
            <path d="M50 20 Q70 30 70 50 Q70 70 50 80 Q30 70 30 50 Q30 30 50 20 M50 20 L50 5 M45 10 L50 5 L55 10" stroke="currentColor" strokeWidth="2.5" fill="none"/>
            <circle cx="50" cy="50" r="12" stroke="currentColor" strokeWidth="2.5" fill="none"/>
          </svg>
        </div>
        
        {/* Adinkra Symbols - DWENNIMMEN (Ram's horns - strength and humility) */}
        <div className="absolute top-32 right-[12%] w-20 h-20 opacity-40">
          <svg viewBox="0 0 100 100" className="w-full h-full text-accent/50">
            <path d="M30 70 Q30 40 50 30 Q70 40 70 70" stroke="currentColor" strokeWidth="3" fill="none"/>
            <path d="M30 70 Q25 75 25 80 M70 70 Q75 75 75 80" stroke="currentColor" strokeWidth="3" fill="none"/>
            <circle cx="50" cy="30" r="4" fill="currentColor"/>
          </svg>
        </div>
        
        {/* Adinkra Symbols - NKYINKYIM (Twisting - initiative and dynamism) */}
        <div className="absolute bottom-24 right-[25%] w-28 h-28 opacity-30 rotate-12">
          <svg viewBox="0 0 100 100" className="w-full h-full text-accent/50">
            <path d="M20 50 Q30 30 50 30 Q70 30 80 50 Q70 70 50 70 Q30 70 20 50" stroke="currentColor" strokeWidth="2.5" fill="none"/>
            <path d="M35 50 Q40 40 50 40 Q60 40 65 50 Q60 60 50 60 Q40 60 35 50" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        
        {/* Adinkra Symbols - WISDOM KNOT (Cleverness and wisdom) */}
        <div className="absolute top-1/2 right-[8%] w-16 h-16 opacity-45">
          <svg viewBox="0 0 100 100" className="w-full h-full text-accent/50">
            <path d="M50 20 L30 40 L50 60 L70 40 Z M50 40 L30 60 L50 80 L70 60 Z" stroke="currentColor" strokeWidth="2.5" fill="none"/>
            <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        
        {/* Adinkra Symbols - NSOROMMA (Star child - faithfulness) */}
        <div className="absolute top-[60%] left-[12%] w-16 h-16 opacity-35">
          <svg viewBox="0 0 100 100" className="w-full h-full text-accent/50">
            <path d="M50 10 L55 40 L85 45 L60 60 L70 90 L50 75 L30 90 L40 60 L15 45 L45 40 Z" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        
        {/* Additional geometric elements */}
        {/* Hexagon outline - top left */}
        <div className="absolute top-16 left-[15%] w-24 h-24 opacity-30">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon 
              points="50 1 95 25 95 75 50 99 5 75 5 25" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1" 
              className="text-accent/40"
            />
          </svg>
        </div>
        
        {/* Diamond shape - bottom right */}
        <div className="absolute bottom-16 right-[15%] w-20 h-20 rotate-45 border border-accent/15" />
        
        {/* Grid pattern overlay */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.02]">
          <div className="w-full h-full" style={{
            backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            color: 'var(--color-accent)'
          }} />
        </div>
      </div>
    </div>
  );
};

export default AdinkraBackground;
