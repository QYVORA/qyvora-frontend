import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight, Hash, Shield, CheckCircle2, Link2,
  Zap, BookOpen, Award, Activity, Lock,
} from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import ChainLogo from '../../../shared/components/ChainLogo';
import CpLogo from '../../../shared/components/CpLogo';

// ── Block preview component ───────────────────────────────────────────────────
const FakeBlock: React.FC<{
  index: number;
  type: string;
  userId: string;
  cp?: number;
  hash: string;
  prevHash: string;
  delay?: number;
}> = ({ index, type, userId, cp, hash, prevHash, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="rounded-2xl border-2 border-border bg-bg-card overflow-hidden"
  >
    {/* Block header */}
    <div className="flex items-center gap-3 border-b border-border px-4 py-3 bg-accent/5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/30 bg-accent-dim font-mono text-xs font-black text-accent">
        #{index}
      </div>
      <span className={`rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
        type === 'ROOM_COMPLETED'   ? 'border-accent/30 bg-accent/10 text-accent' :
        type === 'CP_REWARD'        ? 'border-yellow-400/30 bg-yellow-400/10 text-yellow-400' :
        type === 'MODULE_COMPLETED' ? 'border-blue-400/30 bg-blue-400/10 text-blue-400' :
                                      'border-border bg-bg text-text-muted'
      }`}>
        {type.replace(/_/g, ' ')}
      </span>
      {cp != null && cp > 0 && (
        <span className="ml-auto font-mono text-sm font-black text-accent inline-flex items-center gap-1">
          +{cp} <CpLogo className="w-3.5 h-3.5" />
        </span>
      )}
    </div>

    {/* Block body */}
    <div className="px-4 py-3 space-y-2 text-xs font-mono">
      <div className="flex gap-2">
        <span className="text-text-muted w-20 shrink-0">userId</span>
        <span className="text-text-secondary truncate">{userId}</span>
      </div>
      <div className="flex gap-2">
        <span className="text-text-muted w-20 shrink-0">hash</span>
        <span className="text-accent truncate">{hash}</span>
      </div>
      <div className="flex gap-2">
        <span className="text-text-muted w-20 shrink-0">prevHash</span>
        <span className="text-text-muted truncate">{prevHash}</span>
      </div>
    </div>
  </motion.div>
);

// ── Main page ─────────────────────────────────────────────────────────────────
const ChainPage: React.FC = () => (
  <div className="min-h-screen bg-bg">

    {/* ── Hero ── */}
    <section className="relative min-h-[80svh] md:min-h-[70vh] w-full overflow-hidden scanlines">
      <div className="absolute inset-0 bg-bg z-0" />
      <div className="absolute inset-0 dot-grid hero-dot-grid opacity-20 z-0" />
      <div className="absolute inset-0 bg-radial-vignette opacity-70 z-10" />

      <div className="relative z-20 min-h-[80svh] md:min-h-[70vh] max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-24 pb-10 md:pt-28 md:pb-16">

        {/* Left */}
        <div className="flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="mb-5 px-3 py-1 border border-border bg-accent-dim rounded-sm"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">// HSOCIETY CHAIN</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary leading-[1.1] mb-5"
          >
            The Trust Layer<br />
            <span className="text-accent">Behind Every CP</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.35 }}
            className="text-text-secondary text-sm md:text-base lg:text-lg max-w-lg mb-8"
          >
            HSOCIETY Chain is a private Proof-of-Authority ledger that records every learning event
            as an immutable, SHA-256 hashed block. Your rank, your CP, your progress — all
            tamper-proof and independently verifiable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
            className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-7"
          >
            <Link to="/register" className="btn-primary text-sm !px-6 text-center inline-flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> Start Training <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/cyber-points" className="btn-secondary text-sm !px-6 text-center inline-flex items-center justify-center gap-2">
              <CpLogo className="w-4 h-4" /> Learn About CP
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.75 }}
            className="font-mono text-[9px] md:text-[10px] text-accent tracking-tighter"
          >
            $ hsociety-chain --validate --status operational<span className="animate-blink italic">_</span>
          </motion.div>
        </div>

        {/* Right: chain logo + live block preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden lg:flex flex-col gap-4 relative"
        >
          <div className="flex items-center gap-4 mb-2">
            <ChainLogo size={56} showLabel labelClassName="text-base" />
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest">Proof-of-Authority · SHA-256</span>
              <span className="text-[9px] font-mono text-accent uppercase tracking-widest">● Operational</span>
            </div>
          </div>

          {/* Fake live blocks */}
          <FakeBlock
            index={42} type="ROOM_COMPLETED" userId="operator_7f3a…" cp={250}
            hash="b7ff99a3c2…" prevHash="4e1a8f02d9…" delay={0.4}
          />
          <FakeBlock
            index={43} type="CP_REWARD" userId="operator_7f3a…" cp={250}
            hash="9c4d2e7b1a…" prevHash="b7ff99a3c2…" delay={0.55}
          />
          <FakeBlock
            index={44} type="MODULE_COMPLETED" userId="operator_7f3a…" cp={750}
            hash="1f8a3c9e4d…" prevHash="9c4d2e7b1a…" delay={0.7}
          />
        </motion.div>
      </div>
    </section>

    {/* ── Body ── */}
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 space-y-8">

      {/* What it is */}
      <ScrollReveal>
        <div className="rounded-3xl border-2 border-accent/20 bg-accent/5 p-6 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-none">
              <ChainLogo size={72} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-accent">// What it is</div>
              <h2 className="text-2xl md:text-3xl font-black text-text-primary mb-4">
                A tamper-proof audit ledger for your skills
              </h2>
              <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-4">
                Every time you complete a room, pass a quiz, or earn CP — the HSOCIETY backend writes
                an immutable block to the chain. Each block contains a SHA-256 hash linked to the
                previous block. If anyone tampers with a record, the hash chain breaks and the
                integrity check catches it instantly.
              </p>
              <p className="text-text-secondary text-sm leading-relaxed">
                This is not a public blockchain or cryptocurrency. It's a private
                <strong className="text-text-primary"> Proof-of-Authority ledger</strong> — purpose-built
                for HSOCIETY's learning ecosystem. Its job is to make your history verifiable,
                not tradeable.
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* How it works — 3 steps */}
      <ScrollReveal>
        <div className="mb-4">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">// How it works</div>
          <h2 className="text-2xl md:text-3xl font-black text-text-primary">From action to block in 3 steps</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              step: '01',
              icon: BookOpen,
              title: 'You complete a room',
              desc: 'You finish a bootcamp room or pass a quiz. The backend records your progress in MongoDB as normal.',
            },
            {
              step: '02',
              icon: Link2,
              title: 'A block is written',
              desc: 'The backend calls the HSOCIETY Chain with a PoA header. A new block is created, hashed, and appended to the chain.',
            },
            {
              step: '03',
              icon: CheckCircle2,
              title: 'Your history is verified',
              desc: 'The block hash is linked to the previous block. Run validate-chain at any time to prove the ledger hasn\'t been altered.',
            },
          ].map(({ step, icon: Icon, title, desc }) => (
            <div key={step} className="rounded-2xl border-2 border-border bg-bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/30 bg-accent-dim font-mono text-sm font-black text-accent">
                  {step}
                </div>
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-base font-black text-text-primary mb-2">{title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* What gets recorded */}
      <ScrollReveal>
        <div className="mb-4">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">// What gets recorded</div>
          <h2 className="text-2xl md:text-3xl font-black text-text-primary">Every meaningful event, immutably</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: BookOpen,      type: 'ROOM_COMPLETED',       label: 'Room Completed',       desc: 'Fires when a student opens and completes a bootcamp room.',       color: 'text-accent border-accent/30 bg-accent/10' },
            { icon: Award,         type: 'MODULE_COMPLETED',     label: 'Module Completed',     desc: 'Fires when all rooms + CTF in a module are finished.',            color: 'text-blue-400 border-blue-400/30 bg-blue-400/10' },
            { icon: Zap,           type: 'CP_REWARD',            label: 'CP Reward',            desc: 'Fires whenever CP is granted — room, quiz, module, or admin.',    color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' },
            { icon: Shield,        type: 'CERTIFICATION_ISSUED', label: 'Certification Issued', desc: 'Fires when a completion certificate PDF is generated.',           color: 'text-purple-400 border-purple-400/30 bg-purple-400/10' },
            { icon: Activity,      type: 'USER_ACTIVITY_LOG',    label: 'Activity Log',         desc: 'Fires for CTF completions and other auditable milestones.',       color: 'text-text-muted border-border bg-bg' },
          ].map(({ icon: Icon, type, label, desc, color }) => (
            <div key={type} className="rounded-2xl border-2 border-border bg-bg-card p-5">
              <div className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest mb-3 ${color}`}>
                <Icon className="h-3 w-3" />
                {label}
              </div>
              <div className="font-mono text-[10px] text-text-muted mb-2">{type}</div>
              <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Block anatomy */}
      <ScrollReveal>
        <div className="rounded-3xl border-2 border-border bg-bg-card p-6 md:p-10">
          <div className="mb-6">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">// Block anatomy</div>
            <h2 className="text-2xl font-black text-text-primary">What's inside every block</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {[
                { field: 'index',        desc: 'Position in the chain (0 = genesis)' },
                { field: 'timestamp',    desc: 'ISO 8601 UTC timestamp of the event' },
                { field: 'hash',         desc: 'SHA-256 of all block fields combined' },
                { field: 'previousHash', desc: 'Hash of the block before this one — the chain link' },
                { field: 'validator',    desc: 'Node ID that approved this block (HSOCIETY_ADMIN_NODE)' },
              ].map(({ field, desc }) => (
                <div key={field} className="flex gap-3">
                  <code className="shrink-0 rounded-lg border border-accent/20 bg-accent/5 px-2.5 py-1 font-mono text-[11px] text-accent">{field}</code>
                  <span className="text-xs text-text-muted leading-relaxed pt-1">{desc}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {[
                { field: 'data.type',      desc: 'Event type — ROOM_COMPLETED, CP_REWARD, etc.' },
                { field: 'data.userId',    desc: 'MongoDB ID of the student who triggered the event' },
                { field: 'data.bootcampId',desc: 'Which bootcamp the event belongs to' },
                { field: 'data.cpPoints',  desc: 'CP awarded in this event (null if not applicable)' },
                { field: 'data.metadata',  desc: 'Additional context — moduleId, roomId, reason, etc.' },
              ].map(({ field, desc }) => (
                <div key={field} className="flex gap-3">
                  <code className="shrink-0 rounded-lg border border-border bg-bg px-2.5 py-1 font-mono text-[11px] text-text-secondary">{field}</code>
                  <span className="text-xs text-text-muted leading-relaxed pt-1">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Why not crypto */}
      <ScrollReveal>
        <div className="rounded-3xl border-2 border-border bg-bg-card p-6 md:p-10">
          <div className="mb-6">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">// Honest positioning</div>
            <h2 className="text-2xl font-black text-text-primary">Why it's not a cryptocurrency</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Lock,         label: 'No wallet address',    desc: 'CP lives in your HSOCIETY account, not a crypto wallet.' },
              { icon: Shield,       label: 'No market price',      desc: 'CP has no exchange rate. It\'s earned by skill, not bought.' },
              { icon: Hash,         label: 'Private PoA',          desc: 'Single trusted validator — no mining, no staking, no consensus.' },
              { icon: CheckCircle2, label: 'Verifiable, not tradeable', desc: 'The chain proves you earned it. It doesn\'t make it a token.' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3 rounded-xl border border-border bg-bg p-4">
                <Icon className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-text-primary mb-0.5">{label}</div>
                  <div className="text-xs text-text-muted">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal>
        <div className="rounded-3xl border-2 border-accent/25 bg-accent/5 p-8 md:p-12 text-center flex flex-col items-center gap-5">
          <ChainLogo size={56} showLabel labelClassName="text-sm" />
          <h3 className="text-2xl md:text-3xl font-black text-text-primary">
            Your skills deserve a receipt
          </h3>
          <p className="text-sm text-text-secondary max-w-md">
            Every room you complete, every CP you earn — recorded on the HSOCIETY Chain.
            Start training and build a verifiable operator history.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link to="/register" className="btn-primary !px-8 !py-3 text-sm inline-flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> Start Training <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/cyber-points" className="btn-secondary !px-8 !py-3 text-sm inline-flex items-center justify-center gap-2">
              <CpLogo className="w-4 h-4" /> Learn About CP
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </div>
);

export default ChainPage;
