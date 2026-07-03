import React from 'react';
import { Users, TrendingUp, GraduationCap, Globe, Shield, Target, Zap, DollarSign, BookOpen, CheckCircle2 } from 'lucide-react';
import { Section, Heading, SubHeading, Body, Highlight, StatCard, FeatureCard, CodeBlock, BulletList, CTA, InlineDiagram, Divider } from './shared';

export const AfricaNeedsCybersecurityProfessionalsBlog: React.FC = () => {
  return (
    <div className="space-y-0">

      <Section>
        <Body>
          Africa has a cybersecurity problem. It is not just a security problem — it is a <Highlight>talent problem</Highlight>. The continent is digitising rapidly, but the number of trained cybersecurity professionals is not keeping pace. The gap is measured in <Highlight>hundreds of thousands</Highlight>, and it is growing every year.
        </Body>
        <Body>
          According to the (ISC)2 Cybersecurity Workforce Study, the global cybersecurity workforce gap stands at approximately 4 million professionals. Africa's share of that gap is disproportionate — not because the talent is absent, but because the <Highlight>pathways to develop it are missing</Highlight>.
        </Body>
        <Body>
          Here is a closer look at the problem, the opportunity, and what we are doing about it.
        </Body>
      </Section>

      {/* ── The Numbers ── */}
      <Section>
        <Heading>The Gap in Numbers</Heading>
        <Body>
          Let us look at the data. The cybersecurity workforce shortage is not evenly distributed. Africa has some of the lowest ratios of security professionals to population of any region:
        </Body>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          <StatCard icon={<Globe className="w-5 h-5 text-accent" />} label="Global Workforce Gap" value="4 Million" />
          <StatCard icon={<Users className="w-5 h-5 text-accent" />} label="Africa's Share" value="Disproportionate" />
          <StatCard icon={<TrendingUp className="w-5 h-5 text-accent" />} label="Annual Digital Growth" value="40%+ YoY" />
        </div>

        <Body>
          To put this in perspective: North America has roughly <Highlight>1 security professional per 500 people</Highlight>. In Africa, that ratio is closer to <Highlight>1 per 10,000 people</Highlight> — and in many countries, it is far worse. Meanwhile, digital adoption across the continent is accelerating at over 40% year-over-year in sectors like fintech, e-commerce, and digital banking.
        </Body>

        <Body>
          This means the <Highlight>attack surface is expanding faster than our defensive capacity</Highlight>. Every new mobile money platform, every new government digital service, every new cloud deployment adds to the surface area that needs protection — but there are not enough skilled professionals to secure it.
        </Body>
      </Section>

      {/* ── Why the Gap Exists ── */}
      <Section>
        <Heading>Why the Gap Exists</Heading>
        <Body>
          The talent gap is not about intelligence or aptitude — African professionals compete and excel globally. The gap exists because of <Highlight>structural barriers</Highlight> that prevent talent from entering the field:
        </Body>

        <BulletList
          items={[
            { icon: <GraduationCap className="w-5 h-5 text-accent" />, text: <span><Highlight>Limited university programmes</Highlight> — few African universities offer dedicated cybersecurity degrees, and those that do often focus on theory over practice</span> },
            { icon: <DollarSign className="w-5 h-5 text-accent" />, text: <span><Highlight>Cost of certification</Highlight> — industry certifications like OSCP, CISSP, and CEH cost hundreds to thousands of dollars, often more than a month's salary</span> },
            { icon: <Globe className="w-5 h-5 text-accent" />, text: <span><Highlight>Lack of practical pathways</Highlight> — online courses assume Western infrastructure, reliable high-bandwidth internet, and credit cards for payment</span> },
            { icon: <Users className="w-5 h-5 text-accent" />, text: <span><Highlight>No local community infrastructure</Highlight> — limited meetups, conferences, Capture The Flag events, and mentorship programmes</span> },
          ]}
        />

        <Body>
          The result is a <Highlight>leaky pipeline</Highlight>. Talented individuals with the aptitude for cybersecurity either cannot find a way in, or they leave for opportunities abroad where the infrastructure and support systems exist. Africa ends up exporting its best security talent instead of deploying it locally.
        </Body>
      </Section>

      {/* ── The Opportunity ── */}
      <Section>
        <Heading>The Opportunity: 100,000 Professionals</Heading>
        <Body>
          We believe Africa needs <Highlight>100,000 new cybersecurity professionals</Highlight> over the next five years. This is not an impossible target — it is a <Highlight>strategic necessity</Highlight>. And the opportunity is as much economic as it is defensive.
        </Body>

        <InlineDiagram>
          <div className="w-full">
            <svg viewBox="0 0 600 180" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="current-bar-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#66B870" />
                  <stop offset="100%" stopColor="rgba(102,184,112,0.6)" />
                </linearGradient>
                <linearGradient id="target-bar-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(102,184,112,0.5)" />
                  <stop offset="100%" stopColor="rgba(102,184,112,0.15)" />
                </linearGradient>
                <filter id="bar-glow">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(102,184,112,0.15)" />
                </filter>
              </defs>

              <rect x="20" y="15" width="560" height="42" rx="21" fill="rgba(102,184,112,0.06)" stroke="rgba(102,184,112,0.2)" strokeWidth="1" />
              <rect x="20" y="15" width="100" height="42" rx="21" fill="url(#current-bar-grad)" filter="url(#bar-glow)" />
              <rect x="20" y="15" width="100" height="42" rx="21" fill="url(#current-bar-grad)" opacity="0.15" />
              <text x="70" y="41" textAnchor="middle" fill="#000000" fontFamily="JetBrains Mono, monospace" fontWeight="900" fontSize="13" letterSpacing="1">Current</text>
              <text x="140" y="41" textAnchor="start" fill="rgba(102,184,112,0.5)" fontFamily="JetBrains Mono, monospace" fontSize="13">~15,000 professionals</text>

              <rect x="20" y="78" width="560" height="42" rx="21" fill="rgba(102,184,112,0.06)" stroke="rgba(102,184,112,0.2)" strokeWidth="1" />
              <rect x="20" y="78" width="180" height="42" rx="21" fill="url(#target-bar-grad)" filter="url(#bar-glow)" />
              <text x="110" y="104" textAnchor="middle" fill="#FFFFFF" fontFamily="JetBrains Mono, monospace" fontWeight="900" fontSize="13" letterSpacing="1">Target</text>
              <text x="220" y="104" textAnchor="start" fill="#66B870" fontFamily="JetBrains Mono, monospace" fontWeight="900" fontSize="13">100,000 professionals by 2030</text>

              <rect x="140" y="155" width="320" height="20" rx="10" fill="rgba(102,184,112,0.05)" />
              <text x="300" y="169" textAnchor="middle" fill="rgba(238,240,238,0.35)" fontFamily="JetBrains Mono, monospace" fontSize="11">The gap represents a $2B+ training opportunity</text>
            </svg>
          </div>
        </InlineDiagram>

        <Body>
          The economic opportunity is significant. Entry-level cybersecurity roles in Africa command salaries 2-3x the average for other IT roles. Senior positions — penetration testers, security architects, SOC managers — earn competitive global rates while working locally. For young professionals, cybersecurity represents one of the <Highlight>fastest paths to economic mobility</Highlight> in the technology sector.
        </Body>
      </Section>

      {/* ── Skills in Demand ── */}
      <Section>
        <Heading>Skills the Market Needs Now</Heading>
        <Body>
          Not all cybersecurity skills are equally in demand. Based on our engagements with African organisations, the most pressing skill gaps are:
        </Body>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
          <FeatureCard icon={Target} title="Penetration Testing" desc="Hands-on offensive security skills — web application testing, network penetration testing, mobile app security assessments. The most in-demand and highest-paid skill in the African market." />
          <FeatureCard icon={Shield} title="SOC Operations" desc="Security Operations Centre analysts who can triage alerts, investigate incidents, and manage SIEM platforms. Critical for banks, telcos, and government agencies." />
          <FeatureCard icon={Globe} title="Cloud Security" desc="With African organisations migrating to AWS, Azure, and GCP at record rates, cloud security architects who understand IAM, network segmentation, and compliance are urgently needed." />
          <FeatureCard icon={Users} title="Security Awareness" desc="Professionals who can build security culture — policy development, training delivery, phishing simulations. Often undervalued but critical for organisational security maturity." />
        </div>

        <Body>
          The common thread across all these roles: <Highlight>practical, hands-on ability matters more than certifications</Highlight>. An operator who has exploited real vulnerabilities, configured real firewalls, and responded to real incidents will always outperform one who has only studied for exams.
        </Body>
      </Section>

      {/* ── The HPB Solution ── */}
      <Section>
        <Heading>How the Hacker Protocol Bootcamp Helps</Heading>
        <Body>
          The Hacker Protocol Bootcamp (HPB) was designed specifically to address this talent gap. It is not a traditional course — it is a <Highlight>hands-on, phase-gated pipeline</Highlight> that takes students from zero to operational capability in a structured, measurable way.
        </Body>

        <BulletList
          items={[
            { icon: <CheckCircle2 className="w-5 h-5 text-accent" />, text: <span><Highlight>No prerequisites required</Highlight> — Phase 01 is open to everyone, regardless of background. The only requirement is the willingness to learn</span> },
            { icon: <CheckCircle2 className="w-5 h-5 text-accent" />, text: <span><Highlight>Low-bandwidth accessible</Highlight> — built for the African connectivity reality. The bootcamp works on mobile connections and moderate bandwidth</span> },
            { icon: <CheckCircle2 className="w-5 h-5 text-accent" />, text: <span><Highlight>Structured walkthroughs</Highlight> — no local setup, no dependency management. Every room guides you step-by-step with built-in quiz validation to confirm understanding</span> },
            { icon: <CheckCircle2 className="w-5 h-5 text-accent" />, text: <span><Highlight>Verifiable credentials</Highlight> — every completed room earns CyberPoints (CP) recorded on a blockchain, providing provable proof of capability for employers</span> },
          ]}
        />

        <Body>
          The HPB is our contribution to closing the 100,000-professional gap. We are not trying to replace university education or industry certifications — we are building a <Highlight>parallel pathway</Highlight> that focuses purely on practical capability, accessible to anyone on the continent with the drive to learn.
        </Body>
      </Section>

      {/* ── Call to Act ── */}
      <Section>
        <Heading>The Path Forward</Heading>
        <Body>
          Closing Africa's cybersecurity talent gap requires coordinated effort from multiple stakeholders. Governments need to invest in cybersecurity education. Companies need to create entry-level positions and apprenticeship programmes. And training providers need to build accessible, practical pathways that work in the African context.
        </Body>
        <Body>
          But the most important thing is <Highlight>starting</Highlight>. If you are reading this and thinking about a career in cybersecurity, the best time to start was yesterday. The next best time is now.
        </Body>
      </Section>

      {/* ── CTA ── */}
      <Section>
        <CTA
          title="Start Your Journey"
          desc="Phase 01 of the Hacker Protocol Bootcamp is open to everyone. No prerequisites. No cost. Just you, the terminal, and the journey to becoming an offensive security operator."
          href="/learn"
          label="Begin Phase 01"
        />
      </Section>

    </div>
  );
};
