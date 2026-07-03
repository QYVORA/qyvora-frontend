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
            <svg viewBox="0 0 600 220" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="eco-box-grad-1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(102,184,112,0.12)" />
                  <stop offset="100%" stopColor="rgba(102,184,112,0.04)" />
                </linearGradient>
                <linearGradient id="eco-box-grad-2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(102,184,112,0.15)" />
                  <stop offset="100%" stopColor="rgba(102,184,112,0.05)" />
                </linearGradient>
                <filter id="eco-shadow">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(102,184,112,0.08)" />
                </filter>
                <marker id="eco-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 Z" fill="rgba(102,184,112,0.35)" />
                </marker>
                <marker id="eco-arrow-down" viewBox="0 0 10 10" refX="5" refY="9" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 0 L 10 0 L 5 10 Z" fill="rgba(102,184,112,0.35)" />
                </marker>
              </defs>

              <rect x="10" y="15" width="180" height="75" rx="10" fill="url(#eco-box-grad-1)" stroke="rgba(102,184,112,0.25)" strokeWidth="1.5" filter="url(#eco-shadow)" />
              <rect x="10" y="15" width="180" height="3" rx="1.5" fill="rgba(102,184,112,0.3)" />
              <text x="100" y="62" textAnchor="middle" fill="#66B870" fontFamily="JetBrains Mono, monospace" fontWeight="900" fontSize="13" letterSpacing="1">Education &amp; Training</text>

              <rect x="210" y="120" width="180" height="75" rx="10" fill="url(#eco-box-grad-2)" stroke="rgba(102,184,112,0.25)" strokeWidth="1.5" filter="url(#eco-shadow)" />
              <rect x="210" y="120" width="180" height="3" rx="1.5" fill="rgba(102,184,112,0.3)" />
              <text x="300" y="167" textAnchor="middle" fill="#66B870" fontFamily="JetBrains Mono, monospace" fontWeight="900" fontSize="13" letterSpacing="1">Security Tooling</text>

              <rect x="410" y="15" width="180" height="75" rx="10" fill="url(#eco-box-grad-1)" stroke="rgba(102,184,112,0.25)" strokeWidth="1.5" filter="url(#eco-shadow)" />
              <rect x="410" y="15" width="180" height="3" rx="1.5" fill="rgba(102,184,112,0.3)" />
              <text x="500" y="62" textAnchor="middle" fill="#66B870" fontFamily="JetBrains Mono, monospace" fontWeight="900" fontSize="13" letterSpacing="1">Security Services</text>

              <path d="M 190 52 L 410 52" stroke="rgba(102,184,112,0.3)" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#eco-arrow)" />
              <path d="M 300 195 L 300 115" stroke="rgba(102,184,112,0.3)" strokeWidth="1.5" markerEnd="url(#eco-arrow-down)" />
              <path d="M 410 52 L 300 52 L 300 90" stroke="rgba(102,184,112,0.25)" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#eco-arrow-down)" />

              <rect x="252" y="34" width="96" height="18" rx="9" fill="rgba(102,184,112,0.08)" />
              <text x="300" y="46" textAnchor="middle" fill="rgba(102,184,112,0.5)" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="1">FEEDS INTO</text>

              <rect x="264" y="94" width="72" height="18" rx="9" fill="rgba(102,184,112,0.08)" />
              <text x="300" y="106" textAnchor="middle" fill="rgba(102,184,112,0.5)" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="1">ENABLES</text>
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
