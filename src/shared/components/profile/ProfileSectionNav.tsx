import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { PROFILE_SECTIONS, type ProfileSectionId } from '@/shared/types/profile';

interface ProfileSectionNavProps {
  /** IDs of sections that actually exist on the page */
  visibleSections: ProfileSectionId[];
  className?: string;
}

const ProfileSectionNav: React.FC<ProfileSectionNavProps> = ({
  visibleSections,
  className = '',
}) => {
  const { t } = useTranslation();
  const [active, setActive] = useState<ProfileSectionId>(visibleSections[0] || 'identity');
  const navRef = useRef<HTMLDivElement>(null);
  const isClickScrolling = useRef(false);

  const sections = PROFILE_SECTIONS.filter((s) => visibleSections.includes(s.id));

  // IntersectionObserver to track active section
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section-id') as ProfileSectionId | null;
            if (id) setActive(id);
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
    );

    for (const section of sections) {
      const el = document.getElementById(`profile-section-${section.id}`);
      if (el) {
        el.setAttribute('data-section-id', section.id);
        observer.observe(el);
        observers.push(observer);
      }
    }

    return () => {
      for (const obs of observers) obs.disconnect();
    };
  }, [sections]);

  const scrollTo = useCallback((id: ProfileSectionId) => {
    const el = document.getElementById(`profile-section-${id}`);
    if (!el) return;
    isClickScrolling.current = true;
    setActive(id);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { isClickScrolling.current = false; }, 800);
  }, []);

  if (sections.length === 0) return null;

  return (
    <>
      {/* Desktop: vertical sidebar */}
      <nav
        ref={navRef}
        aria-label="Profile sections"
        className={`hidden lg:flex flex-col gap-1 sticky top-28 self-start ${className}`}
      >
        {sections.map((section) => {
          const isActive = active === section.id;
          return (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className={`
                relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-[10px] font-black uppercase tracking-widest transition-all
                ${isActive
                  ? 'text-accent bg-accent/10 border border-accent/20'
                  : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated border border-transparent'
                }
              `}
              aria-current={isActive ? 'true' : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="profile-nav-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {t(section.labelKey, section.label)}
            </button>
          );
        })}
      </nav>

      {/* Mobile: horizontal scrollable tabs */}
      <nav
        aria-label="Profile sections"
        className="lg:hidden sticky top-0 z-10 -mx-3 md:-mx-4 lg:-mx-6 px-3 md:px-4 lg:px-6 py-2 bg-bg/90 backdrop-blur-md border-b border-border/20 overflow-x-auto no-scrollbar"
      >
        <div className="flex gap-1 min-w-max">
          {sections.map((section) => {
            const isActive = active === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className={`
                  relative px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all
                  ${isActive
                    ? 'text-accent bg-accent/10'
                    : 'text-text-muted hover:text-text-secondary'
                  }
                `}
                aria-current={isActive ? 'true' : undefined}
              >
                {t(section.labelKey, section.label)}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default ProfileSectionNav;
