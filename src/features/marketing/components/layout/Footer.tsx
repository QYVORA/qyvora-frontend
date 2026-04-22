import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Youtube, Mail } from 'lucide-react';
import { SITE_CONFIG } from '../../content/siteConfig';
import BrandXIcon from '../../../../shared/components/icons/BrandXIcon';

const FOOTER_COLS = [
  {
    heading: 'Company',
    links: SITE_CONFIG.nav.company.map((item) => ({ label: item.label, path: item.path })),
  },
  {
    heading: 'Platform',
    links: SITE_CONFIG.nav.platform.map((item) => ({ label: item.label, path: item.path })),
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
            {SITE_CONFIG.brand.description}
          </p>
          <div className="flex items-center gap-3">
            {[
              { icon: BrandXIcon, href: SITE_CONFIG.social.find((item) => item.key === 'x')?.href || '#', label: 'X' },
              { icon: Linkedin, href: SITE_CONFIG.social.find((item) => item.key === 'linkedin')?.href || '#', label: 'LinkedIn' },
              { icon: Youtube, href: SITE_CONFIG.social.find((item) => item.key === 'youtube')?.href || '#', label: 'YouTube' },
              { icon: Mail, href: `mailto:${SITE_CONFIG.contact.opsEmail}`, label: 'Email' },
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
        {SITE_CONFIG.footer.links.map((item) => (
          <a key={item.label} href={item.path} className="hover:text-text-secondary transition-colors">{item.label}</a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
