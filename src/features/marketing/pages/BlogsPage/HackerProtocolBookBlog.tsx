import React from 'react';
import { Globe, Users, Lightbulb, TrendingUp } from 'lucide-react';
import { IconShield, IconTerminal, IconNetwork, IconTarget } from '@/shared/components/icons';
import { Section, Heading, Body, Highlight, CodeBlock } from './shared';

const StatRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-accent/5 border border-accent/10">
    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <div className="text-[10px] font-black uppercase tracking-widest text-text-muted">{label}</div>
      <div className="text-base md:text-lg font-black text-text-primary break-words">{value}</div>
    </div>
  </div>
);

export const HackerProtocolBookBlog: React.FC = () => {
  return (
    <div className="space-y-0">
      {/* ── Introduction ── */}
      <Section>
        <Body>
          Cybersecurity education in Africa has a <Highlight>discovery problem</Highlight>. Not a talent problem — a <Highlight>discovery</Highlight> problem. There are brilliant minds across the continent with the raw aptitude for offensive security, but they don't know where to start, what tools matter, or how to think like an operator.
        </Body>
        <Body>
          The Hacker Protocol Bootcamp (HPB) — <Highlight>2026 Cohort</Highlight> — was designed to solve exactly that. It's not a collection of video lectures or multiple-choice quizzes. It's a <Highlight>hands-on, terminal-first bootcamp</Highlight> that walks you through the entire offensive security stack — from the hacker mindset all the way to advanced exploitation — using real tools, real scenarios, and real infrastructure.
        </Body>
        <Body>
          This is the philosophy behind the HPB, the architecture of the bootcamp, and why we believe it's the right approach for building Africa's cybersecurity pipeline.
        </Body>
      </Section>

      {/* ── The Problem ── */}
      <Section>
        <Heading>The Discovery Problem</Heading>
        <Body>
          Most would-be security operators in Africa face the same wall: <Highlight>information overload with no signal</Highlight>. YouTube tutorials jump between beginner and expert with no ramp. Online courses cost in dollars that don't stretch the same way locally. CTF platforms assume you already know the basics.
        </Body>
        <Body>
          The result? Talented people give up before they even start. Or worse — they learn the wrong things and develop bad habits that take years to unlearn.
        </Body>
        <Body>
          The HPB flips this. Instead of throwing a million resources at you and saying "good luck," it gives you a <Highlight>structured, phase-gated pipeline</Highlight> where each phase builds directly on the last. You don't move forward until you've internalised the current layer.
        </Body>
      </Section>

      {/* ── The Five Phases ── */}
      <Section>
        <Heading>The Five-Phase Pipeline</Heading>
        <Body>
          The HPB is divided into five phases. Each one represents a layer of the offensive security stack. You complete them in order, and each phase unlocks the next.
        </Body>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
          <StatRow icon={<IconShield size={20} className="text-accent" />} label="Phase 01" value="Hacker Mindset" />
          <StatRow icon={<IconTerminal size={20} className="text-accent" />} label="Phase 02" value="Linux Foundations" />
          <StatRow icon={<IconNetwork size={20} className="text-accent" />} label="Phase 03" value="Networking & Protocol Analysis" />
          <StatRow icon={<Globe className="w-5 h-5 text-accent" />} label="Phase 04" value="Web & Backend Systems" />
          <div className="md:col-span-2">
            <StatRow icon={<Users className="w-5 h-5 text-accent" />} label="Phase 05" value="Social Engineering & Operational Security" />
          </div>
        </div>

        <Body>
          <Highlight>Phase 01 — Hacker Mindset:</Highlight> Before you touch a single tool, you learn how to think. Legal boundaries, scope definition, rules of engagement, and the ethical framework that separates a security researcher from a black-hat actor. This isn't philosophy — it's <Highlight>operational discipline</Highlight>.
        </Body>
        <Body>
          <Highlight>Phase 02 — Linux Foundations:</Highlight> The terminal is your cockpit. If you can't navigate, escalate privileges, and manipulate the filesystem blindfolded, you can't operate. This phase builds terminal fluency from the ground up — no GUI crutches, no hand-holding.
        </Body>
        <Body>
          <Highlight>Phase 03 — Networking:</Highlight> Every attack traverses a network. You need total visibility over the stack — TCP/IP, OSI layers, routing protocols, packet interception at the raw bytecode level. You don't just learn how networks work; you learn how to <Highlight>break them</Highlight>.
        </Body>
        <Body>
          <Highlight>Phase 04 — Web & Backend Systems:</Highlight> The modern attack surface is web-first. You dissect HTTP, manipulate REST APIs, exploit injection points, and compromise backend persistence layers. This is where theory meets <Highlight>practical exploitation</Highlight>.
        </Body>
        <Body>
          <Highlight>Phase 05 — Social Engineering:</Highlight> The human layer is the weakest link. You study pretexting, psychological manipulation vectors, trust exploitation, and spoofing. Because the most sophisticated technical exploit is useless if the front door is already open.
        </Body>
      </Section>

      {/* ── The Room-Based Architecture ── */}
      <Section>
        <Heading>Room-Based Architecture</Heading>
        <Body>
          Each phase is composed of <Highlight>rooms</Highlight> — individual, self-contained challenges that teach a specific concept or skill. A room might ask you to enumerate a subdomain, exploit a misconfigured HTTP header, or pivot through a compromised host.
        </Body>
        <Body>
          Rooms are designed as <Highlight>structured walkthroughs</Highlight> — step-by-step guides that teach each concept through carefully crafted content with built-in quiz validation to confirm understanding. No local setup, no dependency hell.
        </Body>
        <Body>
          When you complete a room, you earn <Highlight>CyberPoints (CP)</Highlight> — on-chain verified credentials that represent your mastery. These aren't participation trophies. They're <Highlight>provable, transferable signals</Highlight> of your capability. You can show them to employers, add them to your portfolio, or just flex on the leaderboard.
        </Body>
      </Section>

      {/* ── Why This Matters ── */}
      <Section>
        <Heading>Why This Matters for Africa</Heading>
        <Body>
          The global cybersecurity workforce shortage is projected at <Highlight>4 million professionals</Highlight>. Africa's share of that gap is disproportionate — not because we lack talent, but because we lack <Highlight>infrastructure and pathways</Highlight>.
        </Body>
        <Body>
          The HPB is our attempt to build that pathway. It's designed for the African context: low-bandwidth-friendly, mobile-accessible, and completely free to start. Every room, every phase, every CyberPoint is a step toward building a self-sustaining cybersecurity ecosystem on the continent.
        </Body>
        <Body>
          We're not just training operators. We're building a <Highlight>credentialing layer</Highlight> that lets talent surface regardless of where they're from, who they know, or what school they went to.
        </Body>
        <Body>
          To build the HPB platform and the infrastructure behind it, we formed <Highlight>QuitRoot</Highlight> — a tech team focused on building cybersecurity tools and educational systems for the African market. QuitRoot is the engineering backbone that makes the bootcamp possible, from the blockchain credentialing layer to the interactive room environments.
        </Body>
      </Section>

      {/* ── The Tech Stack ── */}
      <Section>
        <Heading>How It Works Under the Hood</Heading>
        <Body>
          The HPB runs on a <Highlight>Proof-of-Authority (PoA) blockchain</Highlight> we built specifically for this purpose. Every room completion, every CP award, every phase unlock is recorded on-chain — not because we need a blockchain for the sake of it, but because we wanted <Highlight>verifiable, tamper-proof credentials</Highlight> that outlive any single platform.
        </Body>
        <Body>
          The architecture is straightforward:
        </Body>
        <CodeBlock code={`Student → Bootcamp Room → Solve Challenge
                           ↓
                Proof-of-Authority Chain
                           ↓
              CyberPoints (CP) Credential
                           ↓
              Verifiable On-Chain Record`} />
        <Body>
          The chain runs a set of <Highlight>validators</Highlight> that approve legitimate completions and reject fraud. Each block contains the student's ID, the room ID, the timestamp, and a hash of the solution evidence. This makes every credential <Highlight>independently verifiable</Highlight> without needing to trust us.
        </Body>
      </Section>

      {/* ── The Philosophy ── */}
      <Section>
        <Heading>The Core Philosophy</Heading>
        <Body>
          Three principles drive everything about the HPB:
        </Body>
        <div className="space-y-6 my-8">
          <div className="p-6 rounded-xl border border-accent/10 bg-accent/5">
            <div className="flex items-start gap-4">
              <IconTarget size={24} className="text-accent mt-1 shrink-0" />
              <div className="min-w-0">
                <h3 className="text-base md:text-lg font-black uppercase tracking-wider mb-2 text-text-primary break-words">Signal Over Noise</h3>
                <p className="text-sm font-mono text-text-secondary leading-[2]">
                  Every room teaches exactly one concept. No fluff, no filler, no "watch this 45-minute video." You learn by doing, and you prove it by solving.
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl border border-accent/10 bg-accent/5">
            <div className="flex items-start gap-4">
              <TrendingUp className="w-6 h-6 text-accent mt-1 shrink-0" />
              <div className="min-w-0">
                <h3 className="text-base md:text-lg font-black uppercase tracking-wider mb-2 text-text-primary break-words">Progressive Complexity</h3>
                <p className="text-sm font-mono text-text-secondary leading-[2]">
                  Each phase gates behind the previous one. You can't skip ahead because understanding the foundation is non-negotiable. Mastery is the only shortcut.
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl border border-accent/10 bg-accent/5">
            <div className="flex items-start gap-4">
              <Lightbulb className="w-6 h-6 text-accent mt-1 shrink-0" />
              <div className="min-w-0">
                <h3 className="text-base md:text-lg font-black uppercase tracking-wider mb-2 text-text-primary break-words">Real-World Relevance</h3>
                <p className="text-sm font-mono text-text-secondary leading-[2]">
                  Every room is based on a real vulnerability class or attack technique. You're not solving abstract puzzles — you're learning skills that map directly to bug bounties, pentest engagements, and red team operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── CTA ── */}
      <Section>
        <div className="p-8 md:p-12 rounded-2xl border border-accent/20 bg-accent/5 text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">
            Ready for the 2026 Cohort?
          </h2>
          <p className="text-base md:text-lg text-text-secondary font-mono max-w-2xl mx-auto leading-relaxed mb-8">
            Hacker Protocol Bootcamp — 2026 Cohort is live now. Phase 01 is open to everyone. No prerequisites, no application, no cost.
          </p>
          <a
            href="/hpb"
            className="inline-flex items-center gap-3 bg-accent text-bg font-black uppercase tracking-[0.12em] rounded-xl px-10 py-4 text-sm hover:brightness-110 active:scale-95 transition-all"
          >
            <IconTarget size={20} /> Begin Phase 01
          </a>
        </div>
      </Section>
    </div>
  );
};
