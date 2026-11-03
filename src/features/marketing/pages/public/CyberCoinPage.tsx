import React from 'react';
import { ShieldCheck, Trophy, Users, Zap, CheckCircle2 } from 'lucide-react';
import { IconArrowRight as IconArrow } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import ScrollReveal from '@/shared/components/ScrollReveal';
import Button from '@/shared/components/ui/Button';
import CpLogo from '@/shared/components/CpLogo';

/**
 * CyberCoinPage — CP is QYVORA's learning verification and credential ecosystem.
 * This page explains the verification system, how it works, and why it matters.
 */
const CyberCoinPage: React.FC = () => {
  return (
    <div className="min-h-dvh w-full bg-canvas">
      <SEO
        title="CyberPoints (CP) - Learning Verification System | QYVORA"
        description="CP: QYVORA's learning verification and credential ecosystem. Verifiable proof of cybersecurity skills earned through hands-on learning, labs, and real-world challenges."
      />

      {/* ── 01 · HERO — Clear explanation of verification system ─────────── */}
      <section className="relative w-full px-3 py-24 md:px-4 md:py-32 lg:px-6 lg:py-40">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <ScrollReveal>
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-accent/25 bg-accent/10 p-3">
              <CpLogo alt="CP Cyber Coin" className="h-full w-full" />
            </div>
            <p className="type-label mb-3 uppercase tracking-[0.12em] text-accent">
              {"Learning Verification"}
            </p>
            <h1 className="type-h1 mb-6 text-4xl font-black uppercase tracking-tight text-text-primary md:text-6xl lg:text-7xl">
              {"Verifiable Proof of Cybersecurity Skills"}
            </h1>
            <p className="type-body mb-8 max-w-2xl text-lg text-text-secondary md:text-xl">
              {"CP (CyberPoints) is QYVORA's learning verification system. Every point you earn represents verifiable proof of completed labs, challenges, and real-world cybersecurity work — not just course completion certificates."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" to="/register">
                {"Start Learning"}
                <IconArrow size={14} />
              </Button>
              <Button variant="secondary" size="lg" to="/bootcamp">
                {"View Bootcamp"}
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 02 · HOW IT WORKS — The verification process ─────────── */}
      <section className="w-full bg-surface px-3 py-20 md:px-4 md:py-24 lg:px-6">
        <ScrollReveal>
          <div className="mb-12 max-w-2xl">
            <p className="type-label mb-1.5 uppercase tracking-[0.12em] text-accent">
              {"How It Works"}
            </p>
            <h2 className="type-h2 text-3xl font-black uppercase tracking-tight text-text-primary md:text-5xl">
              {"Earn CP Through Real Work"}
            </h2>
            <p className="type-body mt-3 text-text-secondary">
              {"Unlike traditional certificates, CP tracks every practical task you complete. Each action is verified, recorded, and contributes to your public cybersecurity profile."}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <CheckCircle2 className="h-5 w-5" />,
              title: "Complete Labs",
              description: "Solve hands-on challenges in our bootcamp and earn CP for each verified completion.",
            },
            {
              icon: <Zap className="h-5 w-5" />,
              title: "Submit Solutions",
              description: "Your work is validated against real-world security criteria, not multiple-choice answers.",
            },
            {
              icon: <Trophy className="h-5 w-5" />,
              title: "Accumulate Points",
              description: "Each verified task adds CP to your profile, building a transparent skill record.",
            },
            {
              icon: <ShieldCheck className="h-5 w-5" />,
              title: "Prove Your Skills",
              description: "Your CP total is public proof of practical cybersecurity capability, not just theory.",
            },
          ].map((step, index) => (
            <ScrollReveal key={step.title} delay={0.05 * index}>
              <div className="flex h-full flex-col rounded-2xl border border-border-subtle bg-canvas p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                  {step.icon}
                </div>
                <h3 className="type-h3 mb-2 text-xl font-black uppercase tracking-tight text-text-primary">
                  {step.title}
                </h3>
                <p className="type-body-sm text-text-secondary">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── 03 · WHY IT MATTERS — Credential verification value ─────────── */}
      <section className="w-full px-3 py-20 md:px-4 md:py-24 lg:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal>
            <div>
              <p className="type-label mb-1.5 uppercase tracking-[0.12em] text-accent">
                {"Why CP Matters"}
              </p>
              <h2 className="type-h2 mb-4 text-3xl font-black uppercase tracking-tight text-text-primary md:text-5xl">
                {"Skills Over Certificates"}
              </h2>
              <p className="type-body mb-6 text-text-secondary">
                {"Traditional cybersecurity certificates don't prove you can do the work. CP changes that by creating a transparent, verifiable record of every practical task you've completed."}
              </p>
              <p className="type-body mb-6 text-text-secondary">
                {"Employers, clients, and teams can see exactly what you've accomplished — not just which courses you've taken, but which vulnerabilities you've found, which systems you've secured, and which challenges you've solved."}
              </p>
              <Button to="/verify" variant="secondary" size="lg">
                {"Verify a Credential"}
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="rounded-2xl border border-border-subtle bg-surface p-8">
              <div className="mb-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="type-h4 mb-1 font-black uppercase tracking-tight text-text-primary">
                      {"Public Profiles"}
                    </h3>
                    <p className="type-body-sm text-text-secondary">
                      {"Your CP balance and completed work are visible on your public profile. Share your handle to prove your skills."}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="type-h4 mb-1 font-black uppercase tracking-tight text-text-primary">
                      {"Competitive Rankings"}
                    </h3>
                    <p className="type-body-sm text-text-secondary">
                      {"See where you rank among other operators. CP creates a transparent leaderboard of verified capability."}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="type-h4 mb-1 font-black uppercase tracking-tight text-text-primary">
                      {"Verifiable Progress"}
                    </h3>
                    <p className="type-body-sm text-text-secondary">
                      {"Every CP point is tied to a specific task. Your progress is transparent, auditable, and cannot be faked."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 04 · START EARNING — Simple CTA to learning ─────────── */}
      <section className="w-full bg-surface px-3 py-20 md:px-4 md:py-24 lg:px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <ScrollReveal>
            <p className="type-label mb-3 uppercase tracking-[0.12em] text-accent">
              {"Ready to Start"}
            </p>
            <h2 className="type-h2 mb-4 text-3xl font-black uppercase tracking-tight text-text-primary md:text-5xl">
              {"Build Your Verified Cybersecurity Profile"}
            </h2>
            <p className="type-body mb-8 max-w-2xl text-text-secondary">
              {"Join QYVORA's Hacker Protocol Bootcamp and start earning CP for every lab, challenge, and skill you master. Your verifiable cybersecurity journey starts here."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" to="/bootcamp">
                {"View Bootcamp"}
                <IconArrow size={14} />
              </Button>
              <Button variant="secondary" size="lg" to="/register">
                {"Create Account"}
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default CyberCoinPage;
