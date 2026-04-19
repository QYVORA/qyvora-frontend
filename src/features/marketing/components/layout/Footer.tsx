import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Youtube, Mail } from 'lucide-react';
import Logo from '../../../../shared/components/brand/Logo';

const FOOTER_COLS = [
  {
    heading: 'Company',
    links: [
      { label: 'Team', path: '/team' },
      { label: 'Blog', path: '/blog' },
      { label: 'Careers', path: '/careers' },
      { label: 'Contact', path: '/contact' },
    ],
  },
  {
    heading: 'Platform',
    links: [
      { label: 'Bootcamps', path: '/bootcamps' },
      { label: 'Rooms', path: '/rooms' },
      { label: 'Marketplace', path: '/marketplace' },
      { label: 'Zero-Day Market', path: '/zero-day-market' },
      { label: 'Leaderboard', path: '/leaderboard' },
    ],
  },
  {
    heading: 'Tools',
    links: [
      { label: 'Domain Recon', path: '/domain-recon' },
      { label: 'Field Playbooks', path: '/field-playbooks' },
      { label: 'OWASP Top 10', path: '/owasp-top-10' },
    ],
  },
];

const Footer: React.FC = () => (
  <footer className="relative bg-bg border-t border-border">
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-16 pb-0 relative z-10">

      {/* Top row — brand + nav columns */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 md:mb-14">

        {/* Brand */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <p className="text-text-secondary text-xs md:text-sm leading-relaxed max-w-xs">
            Africa's premier offensive security training platform. Training the next generation of cybersecurity operators.
          </p>
          <div className="flex items-center gap-3">
            {[
              { icon: Twitter, href: 'https://x.com/hsocietyoffsec', label: 'X' },
              { icon: Linkedin, href: 'https://www.linkedin.com/company/hsociety-offsec/', label: 'LinkedIn' },
              { icon: Youtube, href: 'https://youtube.com/@hsocietyoffsec', label: 'YouTube' },
              { icon: Mail, href: 'mailto:ops@hsociety.africa', label: 'Email' },
            ].map(({ icon: Icon, href, label }, i) => (
              <a key={i} href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer" aria-label={label}
                className="p-2 bg-bg-card border border-border rounded-md text-text-muted hover:text-accent hover:border-accent transition-all">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Nav columns */}
        {FOOTER_COLS.map((col) => (
          <div key={col.heading}>
            <h4 className="text-accent font-bold uppercase tracking-widest text-[10px] mb-4">{col.heading}</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.path}
                    className="text-text-secondary hover:text-accent text-xs transition-colors whitespace-nowrap">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    {/* Logo banner — dark bg so the light logo is always visible */}
    <div className="footer-logo-banner" style={{ width: '100%', overflow: 'hidden', height: '180px', position: 'relative' }}>
      <img
        src="/HSOCIETY_LOGO.png"
        alt="HSociety"
        style={{
          position: 'absolute',
          width: '140%',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          objectFit: 'contain',
        }}
      />
    </div>

    {/* Bottom bar */}
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-text-muted text-[10px] gap-3 border-t border-border/30">
      <p>© {new Date().getFullYear()} HSOCIETY OFFSEC. ALL RIGHTS RESERVED.</p>
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <a href="#" className="hover:text-text-secondary transition-colors">PRIVACY POLICY</a>
        <a href="#" className="hover:text-text-secondary transition-colors">TERMS OF SERVICE</a>
        <a href="#" className="hover:text-text-secondary transition-colors">HALL OF FAME</a>
      </div>
    </div>
  </footer>
);

export default Footer;
