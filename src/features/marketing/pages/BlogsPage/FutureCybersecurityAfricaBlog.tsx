import React from 'react';
import { Cpu, Brain, Globe, Users, Shield, TrendingUp, Zap, Lightbulb, Target, Rocket, Cloud, AlertTriangle } from 'lucide-react';
import { Section, Heading, SubHeading, Body, Highlight, FeatureCard, StatCard, PhaseCard, BulletList, CTA, InlineDiagram, Divider } from './shared';

export const FutureCybersecurityAfricaBlog: React.FC = () => {
  return (
    <div className="space-y-0">

      <Section>
        <Body>
          Cybersecurity is not standing still. The tools, techniques, and technologies that define the field are evolving rapidly — driven by artificial intelligence, cloud transformation, and the growing sophistication of both attackers and defenders.
        </Body>
        <Body>
          For Africa, this evolution presents both a <Highlight>challenge and an opportunity</Highlight>. The challenge is that the continent is playing catch-up on basic security maturity while the field advances. The opportunity is that Africa can <Highlight>leapfrog</Highlight> — adopting the latest approaches without being burdened by decades of legacy infrastructure.
        </Body>
        <Body>
          Here is our view on where cybersecurity in Africa is heading over the next five to ten years.
        </Body>
      </Section>

      {/* ── Trend 1: AI ── */}
      <Section delay={0.1}>
        <Heading>Trend 01: AI Is Reshaping Both Sides</Heading>
        <Body>
          Artificial intelligence is the most transformative force in cybersecurity since the invention of the firewall. But it cuts both ways:
        </Body>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className="p-6 rounded-xl border border-accent/10 bg-accent/5">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="text-sm font-black uppercase tracking-wider text-text-primary">Attacker Advantage</h3>
            </div>
            <ul className="space-y-3 text-sm font-mono text-text-secondary leading-relaxed">
              <li className="flex items-start gap-2">• AI-generated phishing emails with perfect grammar and context</li>
              <li className="flex items-start gap-2">• Automated vulnerability discovery at machine speed</li>
              <li className="flex items-start gap-2">• Deepfake audio and video for social engineering</li>
              <li className="flex items-start gap-2">• Adaptive malware that evades signature detection</li>
            </ul>
          </div>
          <div className="p-6 rounded-xl border border-accent/10 bg-accent/5">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-accent" />
              <h3 className="text-sm font-black uppercase tracking-wider text-text-primary">Defender Advantage</h3>
            </div>
            <ul className="space-y-3 text-sm font-mono text-text-secondary leading-relaxed">
              <li className="flex items-start gap-2">• AI-powered SOC triage that filters 99% of false positives</li>
              <li className="flex items-start gap-2">• Behavioural analytics detecting anomalies in real-time</li>
              <li className="flex items-start gap-2">• Automated incident response at machine speed</li>
              <li className="flex items-start gap-2">• Predictive threat modelling from global telemetry</li>
            </ul>
          </div>
        </div>

        <Body>
          The key insight is that AI benefits attackers <Highlight>today</Highlight> and defenders <Highlight>tomorrow</Highlight>. Attackers can deploy AI immediately because they do not need permission. Defenders need to build infrastructure, integrate tools, and train teams. The organisations that <Highlight>start building AI-capable defences now</Highlight> will be the ones that are not overwhelmed in three years.
        </Body>
      </Section>

      {/* ── Trend 2 ── */}
      <Section delay={0.2}>
        <Heading>Trend 02: Automation and the Death of Manual Recon</Heading>
        <Body>
          The era of manual reconnaissance is ending. Attackers already use automated pipelines that discover, probe, fingerprint, and map vulnerabilities in minutes — work that used to take days or weeks.
        </Body>

        <InlineDiagram>
          <div className="w-full max-w-2xl">
            <svg viewBox="0 0 600 100" className="w-full h-auto" fill="none">
              <text x="300" y="15" textAnchor="middle" className="fill-accent/60 text-[8px] font-mono" fontSize="8">THE RECON AUTOMATION PIPELINE</text>

              <rect x="10" y="30" width="90" height="40" rx="6" className="fill-accent/10 stroke-accent/30" strokeWidth="1" />
              <text x="55" y="55" textAnchor="middle" className="fill-accent text-[8px] font-mono font-bold uppercase" fontSize="8">Discover</text>

              <path d="M 100 50 L 130 50" className="stroke-accent/40" strokeWidth="1.5" />
              <polygon points="128,44 140,50 128,56" className="fill-accent/40" />

              <rect x="140" y="30" width="90" height="40" rx="6" className="fill-accent/10 stroke-accent/30" strokeWidth="1" />
              <text x="185" y="55" textAnchor="middle" className="fill-accent text-[8px] font-mono font-bold uppercase" fontSize="8">Probe</text>

              <path d="M 230 50 L 260 50" className="stroke-accent/40" strokeWidth="1.5" />
              <polygon points="258,44 270,50 258,56" className="fill-accent/40" />

              <rect x="270" y="30" width="90" height="40" rx="6" className="fill-accent/10 stroke-accent/30" strokeWidth="1" />
              <text x="315" y="55" textAnchor="middle" className="fill-accent text-[8px] font-mono font-bold uppercase" fontSize="8">Analyse</text>

              <path d="M 360 50 L 390 50" className="stroke-accent/40" strokeWidth="1.5" />
              <polygon points="388,44 400,50 388,56" className="fill-accent/40" />

              <rect x="400" y="30" width="90" height="40" rx="6" className="fill-accent/10 stroke-accent/30" strokeWidth="1" />
              <text x="445" y="55" textAnchor="middle" className="fill-accent text-[8px] font-mono font-bold uppercase" fontSize="8">Exploit</text>

              <path d="M 490 50 L 520 50" className="stroke-accent/40" strokeWidth="1.5" />
              <polygon points="518,44 530,50 518,56" className="fill-accent/40" />

              <rect x="520" y="30" width="70" height="40" rx="6" className="fill-accent/10 stroke-red-400/30" strokeWidth="1" />
              <text x="555" y="55" textAnchor="middle" className="fill-red-400 text-[8px] font-mono font-bold uppercase" fontSize="8">Report</text>
            </svg>
          </div>
        </InlineDiagram>

        <Body>
          Defenders must respond with the same level of automation. <Highlight>Continuous attack surface monitoring</Highlight> — scanning your own infrastructure the same way attackers do — should become as standard as having a firewall or antivirus. The organisations that automate their defence will have a serious advantage over those that still run periodic manual assessments.
        </Body>

        <Body>
          This is why we built Anansi CLI — to give defenders access to the same automated recon capabilities that attackers use. The battlefield is asymmetric. Defenders need every advantage they can get.
        </Body>
      </Section>

      {/* ── Trend 3 ── */}
      <Section delay={0.3}>
        <Heading>Trend 03: Africa's Leapfrog Moment</Heading>
        <Body>
          Africa has a unique advantage that more mature markets do not: <Highlight>minimal legacy infrastructure</Highlight>. Most African organisations are not running mainframes from the 1980s. They are not maintaining on-premise data centres with decades-old configurations. They are building on <Highlight>cloud-native architectures from day one</Highlight>.
        </Body>

        <BulletList
          items={[
            { icon: <Rocket className="w-5 h-5 text-accent" />, text: <span><Highlight>Mobile-first security</Highlight> — Africa skipped the desktop era and went straight to mobile. Security models designed for mobile-first infrastructure are more relevant than PC-era frameworks</span> },
            { icon: <Cloud className="w-5 h-5 text-accent" />, text: <span><Highlight>Cloud-native by default</Highlight> — new organisations launch on AWS, GCP, or Azure, not on-premise servers. This means modern IAM, infrastructure-as-code, and API-first security models</span> },
            { icon: <Users className="w-5 h-5 text-accent" />, text: <span><Highlight>Young, adaptable workforce</Highlight> — Africa has the youngest population in the world. Young professionals are more adaptable to new technologies and less burdened by "this is how we have always done it" thinking</span> },
          ]}
        />

        <Body>
          The opportunity is significant. Instead of spending years migrating off legacy systems, African organisations can <Highlight>build securely from the start</Highlight>. The organisations that invest in security now — while their infrastructure is still new and flexible — will have a massive advantage over those that wait until after a breach forces their hand.
        </Body>
      </Section>

      {/* ── Trend 4 ── */}
      <Section delay={0.4}>
        <Heading>Trend 04: Talent Localisation</Heading>
        <Body>
          The global cybersecurity talent shortage means that organisations everywhere are competing for the same limited pool of professionals. For African organisations, relying on imported expertise is not sustainable — it is too expensive, too slow, and often disconnected from local context.
        </Body>
        <Body>
          The future belongs to organisations that <Highlight>grow their own talent</Highlight>. This means investing in training programmes, apprenticeship models, and partnerships with educational institutions. It means creating career pathways that do not require expensive certifications or overseas experience.
        </Body>
        <Body>
          The Hacker Protocol Bootcamp is our contribution to this future. We are building a pipeline that takes raw talent and turns it into operational capability — at scale, at low cost, and without the barriers that have traditionally prevented talented Africans from entering the field.
        </Body>
      </Section>

      {/* ── Our Vision ── */}
      <Section delay={0.5}>
        <Heading>Our Vision for 2030</Heading>
        <Body>
          By 2030, we envision an Africa where:
        </Body>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
          <FeatureCard
            icon={Shield}
            title="Security Is Native"
            desc="Every African organisation building digital infrastructure treats security as a core requirement, not an afterthought — embedded from design through deployment."
          />
          <FeatureCard
            icon={Users}
            title="Talent Is Local"
            desc="Africa produces 100,000+ cybersecurity professionals annually, trained through diverse pathways — bootcamps, university programmes, apprenticeships, and self-study."
          />
          <FeatureCard
            icon={Zap}
            title="Tools Are Homegrown"
            desc="African security companies build world-class tools for African needs — tools that understand the local infrastructure landscape, regulatory environment, and threat model."
          />
          <FeatureCard
            icon={Globe}
            title="The Continent Is Resilient"
            desc="African organisations defend themselves effectively. Breaches still happen, but they are contained, investigated, and learned from — not catastrophic events that threaten the organisation's existence."
          />
        </div>

        <Body>
          This vision is ambitious but achievable. It requires investment, collaboration, and sustained effort from governments, companies, educators, and the security community. But the cost of inaction is much higher.
        </Body>
      </Section>

      {/* ── CTA ── */}
      <Section delay={0.6}>
        <CTA
          title="Help Build the Future"
          desc="Whether you are a student, a professional, an investor, or an organisation — there is a role for you in building Africa's cybersecurity future. Start where you are, with what you have."
          href="/learn"
          label="Get Involved"
        />
      </Section>

    </div>
  );
};
