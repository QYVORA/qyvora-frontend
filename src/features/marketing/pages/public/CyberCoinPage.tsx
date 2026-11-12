import React from 'react';
import { ShieldCheck, Trophy, Users, Zap, CheckCircle2 } from 'lucide-react';
import { IconArrowRight as IconArrow } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import ScrollReveal from '@/shared/components/ScrollReveal';
import Button from '@/shared/components/ui/Button';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import ProgrammeCtaCard from '@/features/marketing/components/programmes/ProgrammeCtaCard';
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

      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <PageHeader
          kicker="QYVORA · Economy"
          title={
            <span className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center">
                <CpLogo alt="CP" className="h-full w-full" />
              </span>
              <span>{"CyberPoints (CP)"}</span>
            </span>
          }
          description="QYVORA's learning verification system. Every point you earn represents verifiable proof of completed labs, challenges, and real-world cybersecurity work — not just completion certificates."
          actions={
            <>
              <Button size="lg" to="/register">
                {"Start Learning"}
                <IconArrow size={14} />
              </Button>
              <Button variant="secondary" size="lg" to="/bootcamp">
                {"View Bootcamp"}
              </Button>
            </>
          }
        />

        {/* ── 02 · HOW IT WORKS — The verification process ─────────── */}
        <section className="mt-14 w-full md:mt-20">
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
                <div className="mb-4 flex h-12 w-12 items-center justify-center text-accent">
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
      <section className="mt-14 w-full md:mt-20">
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
                {"Employers, clients, and teams can see exactly what you've accomplished — not just which labs you've completed, but which vulnerabilities you've found, which systems you've secured, and which challenges you've solved."}
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
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center text-accent">
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
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center text-accent">
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
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center text-accent">
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
      <section className="mt-14 w-full md:mt-20">
        <ProgrammeCtaCard
          kicker="Ready to Start"
          title="Build Your Verified Cybersecurity Profile"
          description="Join QYVORA's Hacker Protocol Bootcamp and start earning CP for every lab, challenge, and skill you master. Your verifiable cybersecurity journey starts here."
        >
          <Button size="lg" to="/bootcamp">
            {"View Bootcamp"}
            <IconArrow size={14} />
          </Button>
          <Button variant="secondary" size="lg" to="/register">
            {"Create Account"}
          </Button>
        </ProgrammeCtaCard>
      </section>
    </PublicContainer>
  </div>
  );
};

export default CyberCoinPage;
