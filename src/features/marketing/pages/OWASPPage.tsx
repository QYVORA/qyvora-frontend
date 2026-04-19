import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ChevronDown, CheckCircle, AlertTriangle, Terminal, BookOpen, Lock, Code, Database, Key, Upload, RefreshCw, Eye, Server, Layers } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';

const OWASP = [
  {
    id: 'A01',
    title: 'Broken Access Control',
    icon: Lock,
    severity: 'Critical',
    desc: 'Access control enforces policy such that users cannot act outside of their intended permissions. Failures typically lead to unauthorized information disclosure, modification, or destruction of data.',
    examples: ['Bypassing access control checks by modifying the URL', 'Elevation of privilege — acting as admin without being logged in', 'IDOR: accessing another user\'s account by changing an ID parameter'],
    mitigation: ['Deny by default except for public resources', 'Implement access control once and reuse throughout the app', 'Log access control failures and alert admins on repeated failures'],
    lab: 'Modify the user_id parameter in /api/profile?id=1 to access other accounts.',
  },
  {
    id: 'A02',
    title: 'Cryptographic Failures',
    icon: Key,
    severity: 'Critical',
    desc: 'Previously known as Sensitive Data Exposure. Focuses on failures related to cryptography which often lead to exposure of sensitive data or system compromise.',
    examples: ['Passwords stored using weak hashing (MD5, SHA1)', 'Sensitive data transmitted in cleartext (HTTP)', 'Weak or default crypto keys in use'],
    mitigation: ['Use strong adaptive hashing: bcrypt, Argon2, scrypt', 'Enforce TLS for all data in transit', 'Disable caching for responses containing sensitive data'],
    lab: 'Crack the MD5 hash found in the leaked database dump: 5f4dcc3b5aa765d61d8327deb882cf99',
  },
  {
    id: 'A03',
    title: 'Injection',
    icon: Terminal,
    severity: 'Critical',
    desc: 'Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. SQL, NoSQL, OS, and LDAP injection are common variants.',
    examples: ['SQL injection via login form: \' OR 1=1 --', 'Command injection via filename parameter', 'LDAP injection to bypass authentication'],
    mitigation: ['Use parameterized queries / prepared statements', 'Validate and sanitize all user input server-side', 'Use an ORM that handles escaping automatically'],
    lab: 'The search endpoint is vulnerable. Extract the admin password using UNION-based SQLi.',
  },
  {
    id: 'A04',
    title: 'Insecure Design',
    icon: Layers,
    severity: 'High',
    desc: 'A new category for 2021 focusing on risks related to design and architectural flaws. Insecure design cannot be fixed by a perfect implementation.',
    examples: ['Password reset flows that reveal whether an email exists', 'Business logic flaws allowing negative cart quantities', 'Lack of rate limiting on authentication endpoints'],
    mitigation: ['Threat model during design phase', 'Integrate security requirements into user stories', 'Use secure design patterns and reference architectures'],
    lab: 'Exploit the password reset flow to take over an account without knowing the original password.',
  },
  {
    id: 'A05',
    title: 'Security Misconfiguration',
    icon: Server,
    severity: 'High',
    desc: 'The most commonly seen issue. Results from insecure default configurations, incomplete configurations, open cloud storage, verbose error messages, and unnecessary features enabled.',
    examples: ['Default credentials left on admin panels', 'Directory listing enabled on web server', 'Detailed stack traces exposed to end users'],
    mitigation: ['Minimal platform — remove unused features and frameworks', 'Automated configuration review as part of CI/CD', 'Segment application architecture for isolation'],
    lab: 'Find the exposed .git directory and extract the application source code.',
  },
  {
    id: 'A06',
    title: 'Vulnerable & Outdated Components',
    icon: RefreshCw,
    severity: 'High',
    desc: 'Components such as libraries, frameworks, and other software modules run with the same privileges as the application. If a vulnerable component is exploited, it can facilitate serious data loss or server takeover.',
    examples: ['Running an unpatched version of Log4j', 'Using jQuery 1.x with known XSS vulnerabilities', 'Outdated WordPress plugins with public exploits'],
    mitigation: ['Continuously inventory component versions', 'Monitor CVE databases and subscribe to security advisories', 'Only obtain components from official sources over secure links'],
    lab: 'Identify the vulnerable library version from the HTTP response headers and find its CVE.',
  },
  {
    id: 'A07',
    title: 'Identification & Authentication Failures',
    icon: Eye,
    severity: 'High',
    desc: 'Confirmation of the user\'s identity, authentication, and session management is critical to protect against authentication-related attacks.',
    examples: ['Credential stuffing attacks due to no rate limiting', 'Weak session tokens that can be predicted', 'Session IDs exposed in URLs'],
    mitigation: ['Implement multi-factor authentication', 'Use a secure, server-side session manager', 'Limit or delay failed login attempts'],
    lab: 'The session token is a base64-encoded username. Forge a token for the admin user.',
  },
  {
    id: 'A08',
    title: 'Software & Data Integrity Failures',
    icon: Code,
    severity: 'High',
    desc: 'Relates to code and infrastructure that does not protect against integrity violations. Includes insecure deserialization and CI/CD pipeline attacks.',
    examples: ['Auto-update functionality without integrity verification', 'Deserializing untrusted data from cookies', 'Dependency confusion attacks in build pipelines'],
    mitigation: ['Use digital signatures to verify software integrity', 'Ensure libraries are consumed from trusted repositories', 'Review CI/CD pipeline for misconfigurations'],
    lab: 'The app deserializes a base64 cookie. Craft a malicious payload to achieve RCE.',
  },
  {
    id: 'A09',
    title: 'Security Logging & Monitoring Failures',
    icon: Database,
    severity: 'Medium',
    desc: 'Insufficient logging and monitoring, coupled with missing or ineffective integration with incident response, allows attackers to further attack systems, maintain persistence, and exfiltrate data.',
    examples: ['Login failures not logged', 'Logs stored only locally and wiped after breach', 'No alerting on suspicious activity patterns'],
    mitigation: ['Ensure all login, access control, and server-side validation failures are logged', 'Establish effective monitoring and alerting', 'Establish or adopt an incident response and recovery plan'],
    lab: 'Analyse the provided log file to identify the attacker\'s IP and the exfiltrated endpoint.',
  },
  {
    id: 'A10',
    title: 'Server-Side Request Forgery',
    icon: Upload,
    severity: 'High',
    desc: 'SSRF flaws occur whenever a web application fetches a remote resource without validating the user-supplied URL. Allows attackers to coerce the server to send requests to unintended locations.',
    examples: ['Fetching internal metadata endpoints (AWS 169.254.169.254)', 'Port scanning internal network via SSRF', 'Bypassing IP allowlists using DNS rebinding'],
    mitigation: ['Sanitize and validate all client-supplied input data', 'Enforce URL schema, port, and destination with an allowlist', 'Disable HTTP redirections'],
    lab: 'Use the URL fetch feature to retrieve http://169.254.169.254/latest/meta-data/iam/security-credentials/',
  },
];

const severityColor: Record<string, string> = {
  Critical: 'text-red-400 border-red-400/30 bg-red-400/5',
  High: 'text-orange-400 border-orange-400/30 bg-orange-400/5',
  Medium: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
};

const OWASPRoom: React.FC = () => {
  const [open, setOpen] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggle = (id: string) => setOpen(prev => prev === id ? null : id);
  const markDone = (id: string) => setCompleted(prev => new Set([...prev, id]));

  return (
    <div className="pt-32 pb-24 min-h-screen bg-bg">
      <div className="max-w-5xl mx-auto px-4 md:px-8">

        {/* Header */}
        <ScrollReveal className="mb-16">
          <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-4 block">// EDUCATIONAL ROOM</span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl font-black text-text-primary tracking-tighter uppercase mb-4">
                OWASP Top 10
              </h1>
              <p className="text-text-muted text-lg max-w-2xl">
                The ten most critical web application security risks. Study each vulnerability, understand the attack vector, and complete the lab challenge.
              </p>
            </div>
            <div className="flex-none flex items-center gap-4 p-4 bg-bg-card border border-border rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-black text-accent font-mono">{completed.size}/10</div>
                <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Completed</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-black text-text-primary font-mono">2,400</div>
                <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest">CP Reward</div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-8 h-1.5 w-full bg-bg-card rounded-full overflow-hidden border border-border">
            <motion.div
              className="h-full bg-accent"
              animate={{ width: `${(completed.size / 10) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </ScrollReveal>

        {/* Accordion list */}
        <div className="flex flex-col gap-3">
          {OWASP.map((item, idx) => {
            const Icon = item.icon;
            const isOpen = open === item.id;
            const isDone = completed.has(item.id);

            return (
              <ScrollReveal key={item.id} delay={idx * 0.04}>
                <div className={`border rounded-lg overflow-hidden transition-colors ${isDone ? 'border-accent/40 bg-accent/5' : 'border-border bg-bg-card'}`}>
                  {/* Row header */}
                  <button
                    onClick={() => toggle(item.id)}
                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-accent-dim/10 transition-colors"
                  >
                    <div className="flex-none w-10 h-10 rounded bg-bg border border-border flex items-center justify-center text-accent">
                      {isDone ? <CheckCircle className="w-5 h-5 text-accent" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-xs text-text-muted">{item.id}</span>
                        <span className="font-bold text-text-primary text-sm uppercase tracking-tight">{item.title}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${severityColor[item.severity]}`}>
                          {item.severity}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className={`flex-none w-4 h-4 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-6 pt-2 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Left */}
                          <div>
                            <p className="text-text-secondary text-sm leading-relaxed mb-6">{item.desc}</p>

                            <div className="mb-5">
                              <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Attack Examples</span>
                              </div>
                              <ul className="flex flex-col gap-2">
                                {item.examples.map((ex, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                                    <span className="text-accent font-mono mt-0.5">›</span> {ex}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Shield className="w-3.5 h-3.5 text-accent" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Mitigation</span>
                              </div>
                              <ul className="flex flex-col gap-2">
                                {item.mitigation.map((m, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                                    <span className="text-accent font-mono mt-0.5">✓</span> {m}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Right — lab */}
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-3">
                              <Terminal className="w-3.5 h-3.5 text-accent" />
                              <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Lab Challenge</span>
                            </div>
                            <div className="flex-1 p-4 bg-bg border border-border rounded-lg font-mono text-xs text-text-secondary leading-relaxed mb-4">
                              <span className="text-accent">$ </span>{item.lab}
                            </div>
                            <button
                              onClick={() => markDone(item.id)}
                              disabled={isDone}
                              className={`w-full py-2.5 rounded text-xs font-bold uppercase tracking-widest transition-all ${
                                isDone
                                  ? 'bg-accent/20 text-accent border border-accent/30 cursor-default'
                                  : 'btn-primary'
                              }`}
                            >
                              {isDone ? '✓ Challenge Complete' : 'Mark as Complete'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OWASPRoom;
