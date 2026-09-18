import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import ScrollReveal from '@/shared/components/ScrollReveal';
import SEO from '@/shared/components/SEO';

import anansiLogo from '@/assets/anansi/anansi-main-logo.webp';
import toha3eeLogo from '@/assets/toha3ee/toha3ee-main-logo.webp';
import jabariLogo from '@/assets/jabari/jabari-main-logo.webp';
import aksumLogo from '@/assets/aksum/aksum-main-logo.webp';
import shakaLogo from '@/assets/shaka/shaka-main-logo.webp';
import nzingaLogo from '@/assets/nzinga/nzinga-main-logo.webp';
import sekhmetLogo from '@/assets/sekhmet/sekhmet-main-logo.webp';
import mansaLogo from '@/assets/mansa/mansa-main-logo.webp';
import amanirenasLogo from '@/assets/amanirenas/amanirenas-main-logo.webp';
import sundiataLogo from '@/assets/sundiata/sundiata-main-logo.webp';
import timbuktuLogo from '@/assets/timbuktu/timbuktu-main-logo.webp';
import kushLogo from '@/assets/kush/kush-main-logo.webp';
import imhotepLogo from '@/assets/imhotep/imhotep-main-logo.webp';

interface ToolEntry {
  path: string;
  name: string;
  logo: string;
  title: string;
  desc: string;
}

const TOOLS: ToolEntry[] = [
  { path: '/anansi', name: 'anansi', logo: anansiLogo, title: 'Anansi', desc: 'Terminal-first attack surface intelligence engine. Automate discovery, probing, and takeover detection.' },
  { path: '/toha3ee', name: 'toha3ee', logo: toha3eeLogo, title: 'Toha3ee', desc: 'Local & network security assessment framework in Go: host and service discovery, enumeration, wireless and MITM capabilities from an interactive REPL.' },
  { path: '/shaka', name: 'shaka', logo: shakaLogo, title: 'Shaka', desc: 'Windows & Active Directory security assessment framework in Go: domain discovery, object enumeration, graph-modeled privilege escalation, and evidence-driven reporting.' },
  { path: '/nzinga', name: 'nzinga', logo: nzingaLogo, title: 'Nzinga', desc: 'Authorized open-source intelligence (OSINT) collection, cross-source correlation, and evidence-driven reporting in Go.' },
  { path: '/jabari', name: 'jabari', logo: jabariLogo, title: 'Jabari', desc: 'Android security assessment framework: authorized USB and network (ADB) targets, non-destructive rule engine and evidence-driven reporting.' },
  { path: '/aksum', name: 'aksum', logo: aksumLogo, title: 'Aksum', desc: 'Binary security assessment & reverse-engineering platform in Go: identification, disassembly, function discovery, call graphs and evidence-backed findings.' },
  { path: '/sekhmet', name: 'sekhmet', logo: sekhmetLogo, title: 'Sekhmet', desc: 'Baseline-aware, feedback-driven fuzzing & vulnerability discovery framework in Go: profile normal behaviour, adaptive mutation, SHA-256 crash dedup and delta minimization.' },
  { path: '/mansa', name: 'mansa', logo: mansaLogo, title: 'Mansa', desc: 'Authorized wireless security assessment framework in Go: WLAN discovery, enumeration, MITM-range analysis, deterministic rule engine and transparent risk scoring.' },
  { path: '/amanirenas', name: 'amanirenas', logo: amanirenasLogo, title: 'Amanirenas', desc: 'Offline iOS/Android app security assessment in Go: static analysis, hardcoded secrets, weak crypto, insecure endpoints, WebView posture and evidence-backed risk scoring.' },
  { path: '/sundiata', name: 'sundiata', logo: sundiataLogo, title: 'Sundiata', desc: 'Identity & access security assessment for Active Directory in Go: identity discovery, account posture, password policies, sensitive memberships. Credentials are never stored or printed.' },
  { path: '/timbuktu', name: 'timbuktu', logo: timbuktuLogo, title: 'Timbuktu', desc: 'Incident response & digital forensics framework in Go: source integrity, artifact identification, filesystem lifecycle, memory postmortems, log analysis and evidence-backed timelines.' },
  { path: '/kush', name: 'kush', logo: kushLogo, title: 'Kush', desc: 'Offline malware sample analysis framework in Go: hashing, metadata, static posture, strings, network indicators, IOC extraction and threat classification — without executing samples.' },
  { path: '/imhotep', name: 'imhotep', logo: imhotepLogo, title: 'Imhotep', desc: 'Offline cloud snapshot analysis framework in Go: IAM posture, storage exposure, network exposure, container posture, secret redaction and misconfiguration detection.' },
];

/**
 * ToolsIndexPage — calm index of the open-source tool docs. One compact card
 * per tool, whole card links to the documentation page.
 */
const ToolsIndexPage: React.FC = () => {

  return (
    <div className="w-full bg-canvas">
      <SEO
        title={"Tools | QYVORA"}
        description={"Open-source offensive security tools, documented for operators."}
      />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker={"Open-source tooling"}
          title={"Combat-ready tools, documented end to end."}

          description={"Thirteen offensive security tools built by the QuiteRoot collective. Each tool has full documentation, install guides, and walkthroughs."}
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool, i) => (
            <ScrollReveal key={tool.path} delay={(i % 3) * 0.08} className="h-full">
              <Card to={tool.path} interactive className="flex h-full flex-col gap-5 p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-canvas">
                    <img
                      src={tool.logo}
                      alt=""
                      aria-hidden="true"
                      className="h-7 w-7 object-contain"
                    />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-black uppercase tracking-tight text-text-primary">
                      {tool.title}
                    </h3>
                    <span className="type-meta text-text-tertiary">{tool.name}</span>
                  </div>
                </div>

                <p className="type-body-sm flex-1 line-clamp-3">{tool.desc}</p>

                <span className="flex items-center gap-1.5 pt-1 text-sm font-bold text-accent">
                  {"Read the docs"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </PublicContainer>
    </div>
  );
};

export default ToolsIndexPage;