import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { GraduationCap, Globe, Wifi, Wrench } from 'lucide-react';
import { IconArrowRight, IconTerminal, IconNetwork, IconCode } from '@/shared/components/icons';
import DotMapBackground from '@/shared/components/DotMapBackground';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  terminal: IconTerminal,
  networking: IconNetwork,
  programming: IconCode,
  'web-security': Globe,
  wireless: Wifi,
  tools: Wrench,
};

const CATEGORY_COLORS: Record<string, string> = {
  terminal: '#4ade80',
  networking: '#60A5FA',
  programming: '#A78BFA',
  'web-security': '#F59E0B',
  wireless: '#10B981',
  tools: '#EF4444',
};

const CATEGORY_LABELS: Record<string, string> = {
  terminal: 'Terminal',
  networking: 'Networking',
  programming: 'Programming',
  'web-security': 'Web Security',
  wireless: 'Wireless',
  tools: 'Tools',
};

const COURSES = [
  { id: 'linux-terminal-101', title: 'Linux Terminal 101', category: 'terminal', level: 'beginner', minutes: 70, popular: true, desc: 'Master the Linux command line from scratch.' },
  { id: 'windows-cmd-101', title: 'Windows CMD 101', category: 'terminal', level: 'beginner', minutes: 50, popular: false, desc: 'Windows Command Prompt and PowerShell.' },
  { id: 'networking-101', title: 'Networking 101', category: 'networking', level: 'beginner', minutes: 60, popular: true, desc: 'IP addresses, ports, protocols, and the OSI model.' },
  { id: 'python-for-hackers-101', title: 'Python for Hackers', category: 'programming', level: 'beginner', minutes: 85, popular: true, desc: 'Security-focused Python scripting.' },
  { id: 'git-github-101', title: 'Git & GitHub 101', category: 'programming', level: 'beginner', minutes: 55, popular: false, desc: 'Version control for security projects.' },
  { id: 'web-technologies-101', title: 'Web Technologies', category: 'web-security', level: 'beginner', minutes: 55, popular: false, desc: 'HTTP, cookies, sessions, and APIs.' },
  { id: 'web-recon-101', title: 'Web Reconnaissance', category: 'web-security', level: 'intermediate', minutes: 55, popular: true, desc: 'Subdomain enumeration and fingerprinting.' },
  { id: 'sql-injection-101', title: 'SQL Injection 101', category: 'web-security', level: 'intermediate', minutes: 85, popular: true, desc: 'Exploit databases through SQL injection.' },
  { id: 'burp-suite-101', title: 'Burp Suite 101', category: 'tools', level: 'intermediate', minutes: 65, popular: false, desc: 'The industry-standard web security proxy.' },
  { id: 'nmap-101', title: 'Nmap 101', category: 'tools', level: 'beginner', minutes: 60, popular: true, desc: 'Network scanning and service discovery.' },
  { id: 'wireshark-101', title: 'Wireshark 101', category: 'tools', level: 'intermediate', minutes: 65, popular: false, desc: 'Packet capture and traffic analysis.' },
  { id: 'wifi-fundamentals-101', title: 'Wi-Fi Fundamentals', category: 'wireless', level: 'beginner', minutes: 55, popular: false, desc: 'Wireless networks and encryption protocols.' },
];

const CATEGORIES = Object.keys(CATEGORY_COLORS);
const PER_PAGE = 3;
const CYCLE_MS = 3000;

const LandingCoursesSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);

  const filteredCourses = useMemo(
    () => activeCategory ? COURSES.filter((c) => c.category === activeCategory) : COURSES,
    [activeCategory]
  );

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / PER_PAGE));

  const advance = useCallback(() => {
    setDir(1);
    setPage((p) => (p + 1) % totalPages);
  }, [totalPages]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const id = setInterval(advance, CYCLE_MS);
    return () => clearInterval(id);
  }, [advance, shouldReduceMotion]);

  useEffect(() => {
    setPage(0);
  }, [activeCategory]);

  const pageCourses = filteredCourses.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  // Get the color for the first visible course's category
  const activeColor = pageCourses[0] ? CATEGORY_COLORS[pageCourses[0].category] : '#06B66F';
  const ActiveCatIcon = pageCourses[0] ? CATEGORY_ICONS[pageCourses[0].category] : GraduationCap;

  return (
    <div className="relative overflow-hidden">
      <DotMapBackground />
      <div className="relative w-full px-4 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20">
        <div className="w-full lg:max-w-6xl lg:mx-auto flex-1 flex flex-col">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 md:mb-8"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/30 bg-bg-elevated text-[10px] font-black uppercase tracking-[0.25em] text-text-primary mb-3">
              <GraduationCap className="h-3 w-3" /> Self-Paced
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none mb-2">
              Courses
            </h2>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed max-w-lg">
              12 courses across 6 categories. Each lesson earns CP.
            </p>
          </motion.div>

          {/* Category tabs */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide flex-wrap"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <button
              onClick={() => setActiveCategory(null)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 border ${
                activeCategory === null
                  ? 'bg-bg-elevated text-text-primary border-border/50 shadow-lg'
                  : 'bg-bg-card text-text-muted border-border/30 hover:bg-bg-elevated hover:text-text-primary'
              }`}
            >
              All
              <span className={`text-[9px] font-mono ${activeCategory === null ? 'text-text-muted' : 'text-text-muted/60'}`}>
                {COURSES.length}
              </span>
            </button>
            {CATEGORIES.map((cat) => {
              const isActive = cat === activeCategory;
              const catColor = CATEGORY_COLORS[cat];
              const CatIconBtn = CATEGORY_ICONS[cat];
              const count = COURSES.filter((c) => c.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 border ${
                    isActive
                      ? 'bg-bg-elevated text-text-primary border-border/50 shadow-lg'
                      : 'bg-bg-card text-text-muted border-border/30 hover:bg-bg-elevated hover:text-text-primary'
                  }`}
                >
                  {CatIconBtn && <CatIconBtn className="w-3.5 h-3.5" style={isActive ? { color: catColor } : {}} />}
                  {CATEGORY_LABELS[cat]}
                  <span className={`text-[9px] font-mono ${isActive ? 'text-text-muted' : 'text-text-muted/60'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* Carousel — fills remaining space */}
          <div className="flex-1 flex flex-col justify-center overflow-hidden">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={`${activeCategory}-${page}`}
                custom={dir}
                initial={{ opacity: 0, x: dir > 0 ? 60 : -60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir > 0 ? -60 : 60 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
              >
                {pageCourses.map((course) => {
                  const cColor = CATEGORY_COLORS[course.category];
                  const CatIc = CATEGORY_ICONS[course.category];
                  return (
                    <Link
                      key={course.id}
                      to={`/courses/${course.id}`}
                      className="group/card rounded-2xl border border-border/30 bg-bg-card p-4 md:p-5 transition-all duration-300 hover:border-accent/30 flex flex-col"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: `${cColor}25` }}
                        >
                          {CatIc && <CatIc className="w-4 h-4" style={{ color: cColor }} />}
                        </div>
                        {course.popular && (
                          <span className="px-2 py-0.5 rounded-full bg-bg-elevated border border-border/30 text-[8px] font-black uppercase tracking-widest text-text-primary">
                            Popular
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-black text-text-primary tracking-tight mb-1 leading-snug">
                        {course.title}
                      </h4>
                      <p className="text-xs text-text-muted leading-relaxed mb-2 line-clamp-2 flex-1">
                        {course.desc}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/20">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                            style={{ color: cColor, background: `${cColor}20` }}
                          >
                            {course.level}
                          </span>
                          <span className="text-[9px] text-text-muted/60 font-mono">{course.minutes}m</span>
                        </div>
                        <IconArrowRight size={14} className="text-text-muted/40 group-hover/card:text-accent transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="mt-4 md:mt-6 flex items-center justify-between">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
            >
              View All {COURSES.length} Courses <IconArrowRight size={14} />
            </Link>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === page ? 'bg-accent w-5' : 'bg-border/40 w-1.5'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingCoursesSection;
