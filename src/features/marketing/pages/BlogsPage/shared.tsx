import React from 'react';
import { Terminal } from '@/shared/components/blog/Terminal';
import { OutputBlock as OutputBlockComponent } from '@/shared/components/blog/OutputBlock';

export const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-16 md:mb-24 last:mb-0">
    {children}
  </div>
);

export const Heading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-8">
    {children}
  </h2>
);

export const SubHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-6 text-accent">
    {children}
  </h3>
);

export const Body = ({ children }: { children: React.ReactNode }) => (
  <p className="text-base md:text-lg text-text-secondary font-mono leading-[2] mb-8 last:mb-0">
    {children}
  </p>
);

export const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="text-accent font-bold">{children}</span>
);

export const CodeBlock = ({ code, lang = 'terminal' }: { code: string; lang?: string }) => (
  <Terminal code={code} title={lang} />
);

export const OutputBlock = ({ text, title = 'output' }: { text: string; title?: string }) => (
  <OutputBlockComponent text={text} title={title} />
);

export const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-accent/5 border border-accent/10">
    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <div className="text-[10px] font-black uppercase tracking-widest text-text-muted">{label}</div>
      <div className="text-lg font-black text-text-primary">{value}</div>
    </div>
  </div>
);

export const PhaseCard = ({ icon: Icon, name, desc }: { icon: React.ElementType; name: string; desc: string }) => (
  <div className="p-5 rounded-xl border border-accent/10 bg-accent/5 flex items-start gap-4 hover:border-accent/30 transition-colors">
    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
      <Icon className="w-5 h-5 text-accent" />
    </div>
    <div>
      <div className="text-sm font-black uppercase tracking-wider text-text-primary mb-1">{name}</div>
      <div className="text-xs font-mono text-text-secondary leading-relaxed">{desc}</div>
    </div>
  </div>
);

export const FeatureCard = ({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) => (
  <div className="p-6 rounded-xl border border-accent/10 bg-accent/5">
    <div className="flex items-start gap-4">
      <Icon className="w-6 h-6 text-accent mt-1 shrink-0" />
      <div>
        <h3 className="text-lg font-black uppercase tracking-wider mb-2 text-text-primary">{title}</h3>
        <p className="text-sm font-mono text-text-secondary leading-[2]">
          {desc}
        </p>
      </div>
    </div>
  </div>
);

export const BulletList = ({ items }: { items: { icon: React.ReactNode; text: React.ReactNode }[] }) => (
  <ul className="space-y-4 my-8 text-sm md:text-base font-mono text-text-secondary leading-[2]">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0">{item.icon}</span>
        <span>{item.text}</span>
      </li>
    ))}
  </ul>
);

export const CTA = ({ title, desc, href, label }: { title: string; desc: string; href: string; label: string }) => (
  <div className="p-8 md:p-12 rounded-2xl border border-accent/20 bg-accent/5 text-center">
    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">
      {title}
    </h2>
    <p className="text-base md:text-lg text-text-secondary font-mono max-w-2xl mx-auto leading-relaxed mb-8">
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
  <div className="w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent my-16 md:my-24" />
);

export const InlineDiagram = ({ children }: { children: React.ReactNode }) => (
  <div className="my-8 p-3 md:p-8 rounded-xl bg-accent/5 border border-accent/10 flex items-center justify-center w-full">
    {children}
  </div>
);
