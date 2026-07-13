import React from 'react';
import { Terminal } from '@/shared/components/blog/Terminal';
import { OutputBlock as OutputBlockComponent } from '@/shared/components/blog/OutputBlock';
import { IdeBlock } from '@/shared/components/blog/IdeBlock';

export const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-20 md:mb-28 last:mb-0">
    {children}
  </div>
);

export const Heading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-6 md:mb-8">
    {children}
  </h2>
);

export const SubHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-5 md:mb-6 text-accent">
    {children}
  </h3>
);

export const Body = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm md:text-base text-text-secondary font-mono leading-[2] md:leading-[2.2] mb-6 md:mb-8 last:mb-0">
    {children}
  </p>
);

export const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="text-accent font-bold">{children}</span>
);

export const CodeBlock = ({ code, lang = 'typescript' }: { code: string; lang?: string }) => (
  <IdeBlock code={code} language={lang} />
);

export const TerminalBlock = ({ code, title = 'terminal' }: { code: string; title?: string }) => (
  <Terminal code={code} title={title} />
);

export const OutputBlock = ({ text, title = 'output' }: { text: string; title?: string }) => (
  <OutputBlockComponent text={text} title={title} />
);

export const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-4 p-4 md:p-5 rounded-xl bg-bg-elevated border border-border/30">
    <div className="w-10 h-10 rounded-lg bg-bg-card flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <div className="text-[10px] font-black uppercase tracking-widest text-text-muted truncate">{label}</div>
      <div className="text-base md:text-lg font-black text-text-primary truncate">{value}</div>
    </div>
  </div>
);

export const PhaseCard = ({ icon: Icon, name, desc }: { icon: React.ElementType; name: string; desc: string }) => (
  <div className="p-5 md:p-6 rounded-xl border border-border/30 bg-bg-card flex items-start gap-4 hover:border-accent/30 transition-colors">
    <div className="w-10 h-10 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0">
      <Icon className="w-5 h-5 text-accent" />
    </div>
    <div className="min-w-0">
      <div className="text-sm font-black uppercase tracking-wider text-text-primary mb-1">{name}</div>
      <div className="text-xs font-mono text-text-secondary leading-relaxed break-words">{desc}</div>
    </div>
  </div>
);

export const FeatureCard = ({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) => (
  <div className="p-6 md:p-7 rounded-xl border border-border/30 bg-bg-card">
    <div className="flex items-start gap-4">
      <Icon className="w-6 h-6 text-accent mt-1 shrink-0" />
      <div className="min-w-0">
        <h3 className="text-base md:text-lg font-black uppercase tracking-wider mb-2 md:mb-3 text-text-primary break-words">{title}</h3>
        <p className="text-xs md:text-sm font-mono text-text-secondary leading-[2] md:leading-[2.2]">
          {desc}
        </p>
      </div>
    </div>
  </div>
);

export const BulletList = ({ items }: { items: { icon: React.ReactNode; text: React.ReactNode }[] }) => (
  <ul className="space-y-4 md:space-y-5 my-8 md:my-10 text-sm md:text-base font-mono text-text-secondary leading-[2] md:leading-[2.2]">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3 md:gap-4">
        <span className="mt-0.5 shrink-0">{item.icon}</span>
        <span className="min-w-0">{item.text}</span>
      </li>
    ))}
  </ul>
);

export const CTA = ({ title, desc, href, label }: { title: string; desc: string; href: string; label: string }) => (
  <div className="p-8 md:p-14 rounded-2xl border border-border/30 bg-bg-card text-center">
    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">
      {title}
    </h2>
    <p className="text-sm md:text-lg text-text-secondary font-mono max-w-2xl mx-auto leading-relaxed md:leading-[2] mb-8 md:mb-10">
      {desc}
    </p>
    <a
      href={href}
      className="inline-flex items-center gap-3 bg-accent text-bg font-black uppercase tracking-[0.12em] rounded-xl px-10 py-4 text-sm hover:brightness-110 active:scale-95 transition-all"
    >
      {label}
    </a>
  </div>
);

export const Divider = () => (
  <div className="w-full h-px bg-gradient-to-r from-transparent via-border/30 to-transparent my-16 md:my-24" />
);

export const InlineDiagram = ({ children }: { children: React.ReactNode }) => (
  <div className="relative my-10 md:my-12 p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl bg-bg-card border border-border/30 overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
    <div className="relative z-10 flex items-center justify-center w-full">
      {children}
    </div>
  </div>
);
