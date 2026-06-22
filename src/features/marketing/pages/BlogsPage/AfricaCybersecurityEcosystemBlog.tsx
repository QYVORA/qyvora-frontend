import React from 'react';
import { Globe, Shield, Users, TrendingUp, Lightbulb, Target, Zap, BookOpen } from 'lucide-react';
import { Section, Heading, SubHeading, Body, Highlight, FeatureCard, StatCard, BulletList, CTA, InlineDiagram } from './shared';

export const AfricaCybersecurityEcosystemBlog: React.FC = () => {
  return (
    <div className="space-y-0">

      <Section>
        <Body>
          Africa is at a crossroads. The continent is digitising faster than anywhere else on the planet — mobile money, e-governance, fintech, healthtech, and digital infrastructure are expanding at an unprecedented rate. But there is a problem: <Highlight>security is not keeping up</Highlight>.
        </Body>
        <Body>
          This is the story of why QYVORA exists, what we are building, and why we believe Africa needs a homegrown offensive security ecosystem — not just imported solutions.
        </Body>
      </Section>

      {/* ── The Reality ── */}
      <Section>
        <Heading>The Cybersecurity Reality in Africa</Heading>
        <Body>
          Most organisations in Africa operate with <Highlight>minimal security visibility</Highlight>. A 2024 Interpol report identified Africa as one of the most targeted regions for cybercrime, with losses estimated at over $4 billion annually. Yet the majority of companies have no dedicated security team, no attack surface monitoring, and no incident response plan.
        </Body>
        <Body>
          The problem is structural:
        </Body>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
          <StatCard icon={<Globe className="w-5 h-5 text-accent" />} label="Digital Adoption" value="Fastest Growing" />
          <StatCard icon={<Shield className="w-5 h-5 text-accent" />} label="With Security Coverage" value="Less than 15%" />
          <StatCard icon={<Users className="w-5 h-5 text-accent" />} label="Cybersecurity Professionals" value="Critically Low" />
          <StatCard icon={<TrendingUp className="w-5 h-5 text-accent" />} label="Annual Cyber Losses" value="$4B+" />
        </div>

        <Body>
          The gap is not just technical — it is <Highlight>structural and educational</Highlight>. We do not have enough trained professionals, enough local tooling, or enough awareness at the decision-maker level.
        </Body>
      </Section>

      {/* ── The Gap ── */}
      <Section>
        <Heading>The Gap: Imported Solutions, Local Problems</Heading>
        <Body>
          Many African organisations rely on imported security products built for Western infrastructure and compliance regimes. These tools assume a certain maturity level — dedicated SOC teams, mature DevSecOps pipelines, and budgets that most African companies do not have.
        </Body>
        <Body>
          The result is a <Highlight>false sense of security</Highlight>. Expensive tools sit misconfigured. Alerts are ignored because there is nobody to triage them. Incident response plans exist on paper but have never been tested.
        </Body>
        <Body>
          Africa does not need cheaper copies of Western security products. Africa needs <Highlight>context-aware solutions</Highlight> built for the realities of the continent: mobile-first infrastructure, variable connectivity, growing but green technical teams, and a rapidly expanding attack surface.
        </Body>
      </Section>

      {/* ── Our Approach ── */}
      <Section>
        <Heading>The QYVORA Approach</Heading>
        <Body>
          QYVORA was founded on a simple premise: <Highlight>build African security for African challenges</Highlight>. We are not a reseller. We are not a consultancy that rebadges global frameworks. We are a <Highlight>homegrown offensive security company</Highlight> that builds tools, trains talent, and delivers services designed for the African context.
        </Body>
        <Body>
          Our approach rests on three pillars:
        </Body>

        <div className="space-y-6 my-8">
          <FeatureCard
            icon={Target}
            title="Attack Surface Intelligence"
            desc="Tools like the Anansi CLI engine that map, probe, and analyse external attack surfaces — giving organisations the same visibility attackers have, built for the African infrastructure landscape."
          />
          <FeatureCard
            icon={BookOpen}
            title="Education & Talent Development"
            desc="The Hacker Protocol Bootcamp (HPB) trains the next generation of African offensive security operators through a hands-on, phase-gated curriculum designed for the African learner."
          />
          <FeatureCard
            icon={Zap}
            title="Tooling & Innovation"
            desc="We build our own tools — like the Anansi attack surface intelligence engine — because existing tools do not fit our workflow. Open source, terminal-first, built in Accra."
          />
        </div>
      </Section>

      {/* ── Pipeline Diagram ── */}
      <Section>
        <Heading>How It All Connects</Heading>
        <Body>
          These three pillars feed into each other. Education produces skilled operators. Skilled operators use and improve our tools. Better tools enable better services. Better services fund more education. It is a <Highlight>self-reinforcing ecosystem</Highlight>:
        </Body>

        <InlineDiagram>
          <div className="w-full">
            <svg viewBox="0 0 600 200" className="w-full h-auto" fill="none">
              <rect x="10" y="20" width="180" height="70" rx="8" className="fill-accent/10 stroke-accent/30" strokeWidth="1.5" />
              <text x="100" y="63" textAnchor="middle" className="fill-accent font-mono font-bold uppercase" fontSize="14">Education &amp; Training</text>

              <rect x="210" y="110" width="180" height="70" rx="8" className="fill-accent/10 stroke-accent/30" strokeWidth="1.5" />
              <text x="300" y="153" textAnchor="middle" className="fill-accent font-mono font-bold uppercase" fontSize="14">Security Tooling</text>

              <rect x="410" y="20" width="180" height="70" rx="8" className="fill-accent/10 stroke-accent/30" strokeWidth="1.5" />
              <text x="500" y="63" textAnchor="middle" className="fill-accent font-mono font-bold uppercase" fontSize="14">Security Services</text>

              <path d="M 190 55 L 410 55" className="stroke-accent/40" strokeWidth="1.5" strokeDasharray="4 4" />
              <path d="M 300 110 L 300 90" className="stroke-accent/40" strokeWidth="1.5" />
              <path d="M 410 55 L 300 55 L 300 110" className="stroke-accent/40" strokeWidth="1.5" strokeDasharray="4 4" />

              <text x="295" y="48" textAnchor="middle" className="fill-accent/60 font-mono" fontSize="11">feeds into</text>
              <text x="290" y="90" textAnchor="middle" className="fill-accent/60 font-mono" fontSize="11">enables</text>
            </svg>
          </div>
        </InlineDiagram>

        <Body>
          This is not a linear pipeline — it is a <Highlight>flywheel</Highlight>. Every skilled operator we train becomes a potential tool contributor, service deliverer, or future trainer. Every engagement teaches us something that improves our tools and our curriculum.
        </Body>
      </Section>

      {/* ── The Big Picture ── */}
      <Section>
        <Heading>Why This Matters for Africa</Heading>
        <Body>
          Cybersecurity is not a luxury — it is a <Highlight>foundational requirement</Highlight> for digital sovereignty. If African companies and governments cannot secure their own infrastructure, they cannot truly own it. They remain dependent on external vendors, external expertise, and external approval.
        </Body>
        <Body>
          QYVORA is building the <Highlight>infrastructure for African cybersecurity independence</Highlight>. Every bootcamp graduate, every attack surface scan, every engagement brings us closer to a continent that can defend itself, innovate on its own terms, and compete globally.
        </Body>
        <Body>
          We are based in Tamale and Accra, Ghana. We are African. We build for Africa. And we are just getting started.
        </Body>
      </Section>

      {/* ── CTA ── */}
      <Section>
        <CTA
          title="Join the Mission"
          desc="Whether you are a student looking to start your cybersecurity journey, a company needing security assessments, or a partner who shares our vision — there is a place for you in the QYVORA ecosystem."
          href="/learn"
          label="Explore the Ecosystem"
        />
      </Section>

    </div>
  );
};
