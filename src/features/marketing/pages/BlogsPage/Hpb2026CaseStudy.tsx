import React from 'react';
import { Shield, Terminal, Network, Globe, Users, Target, Search, Map, Flag, Trophy } from 'lucide-react';
import { Section, Heading, Body, Highlight, CodeBlock } from './shared';
import sopt4Img from '@/assets/team/sopt4.webp';
import quiteRootLogo from '@/assets/quiteRoot/ChatGPT Image Jul 3, 2026, 02_45_59 AM.webp';
import img01 from '@/assets/blog/01-hpb-2026-online-class-screenshot.png';
import img02 from '@/assets/blog/02-hpb-2026-online-class-screenshot.png';
import img03 from '@/assets/blog/03-hpb-2026-online-class-screenshot.png';
import img04 from '@/assets/blog/04-hpb-2026-online-class-screenshot.png';
import img05 from '@/assets/blog/05-hpb-2026-online-class-screenshot.png';

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

const Screenshot = ({ src, alt, caption }: { src: string; alt: string; caption: string }) => (
  <div className="my-10 rounded-2xl overflow-hidden border border-border/20">
    <img src={src} alt={alt} className="w-full object-cover" loading="lazy" />
    <div className="px-5 py-3 bg-bg-card border-t border-border/20">
      <p className="text-xs font-mono text-text-muted">{caption}</p>
    </div>
  </div>
);

export const Hpb2026CaseStudy: React.FC = () => {
  return (
    <div className="space-y-0">
      {/* ── Introduction ── */}
      <Section>
        <Body>
          The Hacker Protocol Bootcamp (HPB) — <Highlight>2026 Cohort</Highlight> — was more than just a training program. It was a <Highlight>mission</Highlight>. We set out to find, train, and credential the next generation of offensive security operators in Africa, and what we accomplished exceeded every expectation.
        </Body>
        <Body>
          Over the course of the bootcamp, participants moved through five intensive phases — from the hacker mindset all the way to advanced social engineering — completing <Highlight>20 rooms</Highlight> and earning <Highlight>on-chain verified CyberPoints (CP)</Highlight>. But the real story isn't the curriculum. It's the <Highlight>community, the outcomes, and the team</Highlight> that emerged from this cohort.
        </Body>
        <Body>
          <Highlight>Note on our evolution:</Highlight> When the HPB 2026 Cohort launched, we operated under the name <Highlight>HSOCIETY OFFSEC</Highlight>. Since then, we have evolved into <Highlight>QYVORA</Highlight> — a unified platform for offensive security training, credentialing, and operations. The bootcamp's results and participants remain the same; only the banner has grown.
        </Body>
      </Section>

      <Screenshot
        src={img01}
        alt="HPB 2026 cohort online class session"
        caption="Online class session — Phase 01 introduction to offensive security and the hacker mindset."
      />

      {/* ── The Five Phases ── */}
      <Section>
        <Heading>The Five-Phase Pipeline</Heading>
        <Body>
          The HPB curriculum was structured as a <Highlight>progressive pipeline</Highlight>. Each phase built on the previous one, ensuring participants developed deep, operational fluency before moving to the next layer.
        </Body>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
          <StatRow icon={<Shield className="w-5 h-5 text-accent" />} label="Phase 01" value="Hacker Mindset" />
          <StatRow icon={<Terminal className="w-5 h-5 text-accent" />} label="Phase 02" value="Linux Foundations" />
          <StatRow icon={<Network className="w-5 h-5 text-accent" />} label="Phase 03" value="Networking & Protocol Analysis" />
          <StatRow icon={<Globe className="w-5 h-5 text-accent" />} label="Phase 04" value="Web & Backend Systems" />
          <div className="md:col-span-2">
            <StatRow icon={<Users className="w-5 h-5 text-accent" />} label="Phase 05" value="Social Engineering & Operational Security" />
          </div>
        </div>

        <Body>
          <Highlight>Phase 01 — Hacker Mindset:</Highlight> Participants learned the ethical and legal frameworks that distinguish security researchers from malicious actors. Scope definition, rules of engagement, and the operational discipline required to operate professionally.
        </Body>
        <Body>
          <Highlight>Phase 02 — Linux Foundations:</Highlight> Terminal fluency was built from the ground up — filesystem navigation, privilege escalation, process management, and bash scripting. No graphical interfaces, no shortcuts.
        </Body>
        <Body>
          <Highlight>Phase 03 — Networking:</Highlight> Total visibility over the network stack — TCP/IP, OSI layers, packet interception with tcpdump and Wireshark, DNS interrogation, and Nmap mastery.
        </Body>
        <Body>
          <Highlight>Phase 04 — Web & Backend Systems:</Highlight> The modern attack surface. Participants dissected HTTP, exploited SQL injection and XSS, manipulated authentication flows, and used Burp Suite for web application testing.
        </Body>
        <Body>
          <Highlight>Phase 05 — Social Engineering:</Highlight> The human layer. Pretexting, phishing, OSINT, and physical security concepts including tailgating and RFID cloning.
        </Body>
      </Section>

      <Screenshot
        src={img02}
        alt="HPB 2026 cohort hands-on exercise"
        caption="Hands-on terminal exercise during the Linux Foundations phase — participants navigating real command-line environments."
      />

      {/* ── Beyond the Core Curriculum ── */}
      <Section>
        <Heading>Beyond the Core Curriculum</Heading>
        <Body>
          While the five phases formed the backbone of the bootcamp, we brought in <Highlight>real-world tools and scenarios</Highlight> that gave participants exposure to the actual toolkit of a professional offensive security operator.
        </Body>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          <div className="p-5 rounded-xl border border-accent/10 bg-accent/5">
            <Map className="w-6 h-6 text-accent mb-3" />
            <h3 className="text-sm font-black uppercase tracking-wider mb-2 break-words">IP Geolocation</h3>
            <p className="text-xs font-mono text-text-secondary leading-[2] break-words">
              Participants learned to trace IP addresses to physical locations, analyse ISP ownership, and correlate geolocation data with threat intelligence feeds.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-accent/10 bg-accent/5">
            <Search className="w-6 h-6 text-accent mb-3" />
            <h3 className="text-sm font-black uppercase tracking-wider mb-2 break-words">Shodan</h3>
            <p className="text-xs font-mono text-text-secondary leading-[2] break-words">
              Deep dive into Shodan for internet-wide device discovery — identifying exposed industrial control systems, open databases, and misconfigured servers.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-accent/10 bg-accent/5">
            <Flag className="w-6 h-6 text-accent mb-3" />
            <h3 className="text-sm font-black uppercase tracking-wider mb-2 break-words">CTF Competition</h3>
            <p className="text-xs font-mono text-text-secondary leading-[2] break-words">
              A capture-the-flag competition where participants applied everything they learned in a timed, competitive environment with real attack scenarios.
            </p>
          </div>
        </div>

        <Body>
          We also held an <Highlight>open Q&A session</Highlight> where participants could ask anything about careers in cybersecurity, the tools we use daily, and the realities of working in offensive security. The engagement was intense — participants asked questions for over two hours straight.
        </Body>
      </Section>

      <Screenshot
        src={img03}
        alt="HPB 2026 cohort Q&A and discussion session"
        caption="Q&A session — participants engaging with the team on career pathways, tooling choices, and real-world offensive security operations."
      />

      {/* ── The Outcomes ── */}
      <Section>
        <Heading>What Came Out of This Bootcamp</Heading>
        <Body>
          The HPB 2026 Cohort produced outcomes that went far beyond technical skills. Three things emerged from this bootcamp that will shape QYVORA for years to come.
        </Body>

        <div className="space-y-6 my-8">
          <div className="p-6 rounded-xl border border-accent/10 bg-accent/5 flex flex-col md:flex-row items-center md:items-start gap-5 md:gap-6">
            <img
              src={sopt4Img}
              alt="sopt4"
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-accent/20 shrink-0"
            />
            <div className="min-w-0">
              <h3 className="text-base md:text-lg font-black uppercase tracking-wider mb-2 text-text-primary break-words">sopt4 — Our COO</h3>
              <p className="text-sm font-mono text-text-secondary leading-[2]">
                Among the participants, one stood out not just for technical ability but for <Highlight>leadership, discipline, and vision</Highlight>. <Highlight>sopt4</Highlight> demonstrated an exceptional understanding of offensive security concepts and the operational maturity to lead. After the bootcamp, we recruited sopt4 as QYVORA's <Highlight>Chief Operating Officer (COO)</Highlight> — a testament to the calibre of talent the HPB pipeline can identify and develop.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-accent/10 bg-accent/5 flex flex-col md:flex-row items-center md:items-start gap-5 md:gap-6">
            <img
              src={quiteRootLogo}
              alt="QuiteRoot logo"
              className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0">
              <h3 className="text-base md:text-lg font-black uppercase tracking-wider mb-2 text-text-primary break-words">QuiteRoot — The Tech Team</h3>
              <p className="text-sm font-mono text-text-secondary leading-[2]">
                From the HPB cohort, we identified the most <Highlight>serious and dedicated learners</Highlight> and formed <Highlight>QuiteRoot</Highlight> — QYVORA's offensive research and engineering collective. QuiteRoot is responsible for building the tools, frameworks, and intelligence capabilities that power QYVORA's platform. The team emerged organically from the bootcamp because the curriculum itself was a filter: those who completed all 20 rooms demonstrated the <Highlight>grit, curiosity, and technical aptitude</Highlight> that makes a great operator.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-accent/10 bg-accent/5 flex flex-col md:flex-row items-start gap-4 md:gap-6">
            <Trophy className="w-8 h-8 md:w-10 md:h-10 text-accent shrink-0" />
            <div className="min-w-0">
              <h3 className="text-base md:text-lg font-black uppercase tracking-wider mb-2 text-text-primary break-words">Verifiable Credentials</h3>
              <p className="text-sm font-mono text-text-secondary leading-[2]">
                Every participant who completed rooms earned <Highlight>CyberPoints (CP)</Highlight> recorded on QYVORA's Proof-of-Authority blockchain. These are not certificates — they are <Highlight>tamper-proof, independently verifiable on-chain credentials</Highlight> that participants can present to employers as proof of capability.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Screenshot
        src={img04}
        alt="HPB 2026 cohort CTF and practical assessment"
        caption="Capture-the-flag session — participants competing in a timed offensive security challenge."
      />

      {/* ── The Architecture ── */}
      <Section>
        <Heading>How It Worked Under the Hood</Heading>
        <Body>
          The HPB ran on QYVORA's <Highlight>interactive room architecture</Highlight> — a terminal-first, browser-based learning environment where every concept was taught through structured walkthroughs with built-in quiz validation. No local setup, no dependency management, no friction.
        </Body>
        <Body>
          Each room completion triggered a <Highlight>blockchain transaction</Highlight> on our Proof-of-Authority chain:
        </Body>
        <CodeBlock code={`Student → Complete Room → Solve Quiz
                            ↓
                 Proof-of-Authority Validator
                            ↓
               CyberPoints (CP) Minted On-Chain
                            ↓
               Verifiable Credential → CV / Portfolio`} />
        <Body>
          This architecture ensures that every credential is <Highlight>portable and permanent</Highlight>. Even if QYVORA's platform changes, the on-chain record remains.
        </Body>
      </Section>

      <Screenshot
        src={img05}
        alt="HPB 2026 cohort graduation and credential award"
        caption="Bootcamp wrap-up — participants receiving their on-chain credentials and discussing next steps in their cybersecurity careers."
      />

      {/* ── Why This Matters ── */}
      <Section>
        <Heading>Why This Matters for Africa</Heading>
        <Body>
          The HPB 2026 Cohort proved something we've believed from the start: Africa does not have a <Highlight>talent problem</Highlight>. It has a <Highlight>discovery and infrastructure problem</Highlight>. When you build the right pipeline and the right incentive structure, the talent surfaces naturally.
        </Body>
        <Body>
          We didn't just train operators — we <Highlight>recruited a COO</Highlight>, <Highlight>formed a tech team</Highlight>, and <Highlight>issued verifiable blockchain credentials</Highlight> that will follow these participants throughout their careers. That is the model. That is what the HPB is designed to do.
        </Body>
        <Body>
          The 2026 Cohort was the proof of concept. The pipeline works. The question now is: <Highlight>how many more cohorts can we run?</Highlight>
        </Body>
      </Section>

      {/* ── CTA ── */}
      <Section>
        <div className="p-8 md:p-12 rounded-2xl border border-accent/20 bg-accent/5 text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">
            Ready for the Next Cohort?
          </h2>
          <p className="text-base md:text-lg text-text-secondary font-mono max-w-2xl mx-auto leading-relaxed mb-8">
            Hacker Protocol Bootcamp is open to everyone. No prerequisites, no application, no cost. Start Phase 01 today.
          </p>
          <a
            href="/hpb"
            className="inline-flex items-center gap-3 bg-accent text-bg font-black uppercase tracking-[0.12em] rounded-xl px-10 py-4 text-sm hover:brightness-110 active:scale-95 transition-all"
          >
            <Target className="w-5 h-5" /> Begin Phase 01
          </a>
        </div>
      </Section>
    </div>
  );
};
