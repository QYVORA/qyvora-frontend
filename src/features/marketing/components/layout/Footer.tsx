import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { SITE_CONFIG } from '../../content/siteConfig';
import BrandWhatsAppIcon from '../../../../shared/components/icons/BrandWhatsAppIcon';
import BrandLinkedinIcon from '../../../../shared/components/icons/BrandLinkedinIcon';
import BrandYoutubeIcon from '../../../../shared/components/icons/BrandYoutubeIcon';

const FOOTER_COLS = [
  {
    heading: 'Company',
    links: SITE_CONFIG.nav.company.map((item) => ({ label: item.label, path: item.path })),
  },
  {
    heading: 'Platform',
    links: SITE_CONFIG.nav.platform.map((item) => ({ label: item.label, path: item.path })),
  },
  {
    heading: 'Quick Links',
    links: [
      { label: 'CTF Arena',       path: '/ctf'             },
      { label: 'Leaderboard',     path: '/leaderboard'     },
      { label: 'Marketplace',     path: '/zero-day-market' },
      { label: 'Bootcamps',       path: '/bootcamps'       },
      { label: 'Cyber Points',    path: '/cyber-points'    },
      { label: 'HSOCIETY Chain',  path: '/chain'           },
      { label: 'Services',        path: '/services'        },
      { label: 'Register',        path: '/register'        },
      { label: 'Log In',          path: '/login'           },
    ],
  },
];

const Footer: React.FC = () => {
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>(
    FOOTER_COLS.reduce((acc, col) => ({ ...acc, [col.heading]: false }), {}),
  );

  const toggleSection = (heading: string) => {
    setOpenSections((prev) => ({ ...prev, [heading]: !prev[heading] }));
  };

  return (
    <footer className="
      relative bg-bg border-t border-border flex flex-col
      pb-[calc(60px+env(safe-area-inset-bottom,0px))] md:pb-0
      md:h-full md:overflow-hidden
    ">
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full pt-5 md:pt-6 pb-3">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">

            {/* Brand + social */}
            <div className="md:col-span-2 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                {[
                  { icon: BrandLinkedinIcon, href: SITE_CONFIG.social.find((i) => i.key === 'linkedin')?.href || '#', label: 'LinkedIn'  },
                  { icon: BrandYoutubeIcon,  href: SITE_CONFIG.social.find((i) => i.key === 'youtube')?.href  || '#', label: 'YouTube'   },
                  { icon: BrandWhatsAppIcon, href: SITE_CONFIG.social.find((i) => i.key === 'whatsapp')?.href || '#', label: 'WhatsApp' },
                ].map(({ icon: Icon, href, label }, i) => (
                  <a key={i} href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer" aria-label={label}
                    className="p-1.5 bg-bg-card border border-border rounded-md text-text-muted hover:text-accent hover:border-accent transition-all">
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Nav columns as dropdowns */}
            {FOOTER_COLS.map((col) => (
              <div key={col.heading} className="rounded-lg bg-bg-card/30 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection(col.heading)}
                  className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-bg-card/70 transition-colors"
                >
                  <h4 className="text-accent font-bold uppercase tracking-widest text-[9px]">{col.heading}</h4>
                  <ChevronDown className={`w-3.5 h-3.5 text-accent transition-transform ${openSections[col.heading] ? 'rotate-180' : ''}`} />
                </button>
                <ul className={`${openSections[col.heading] ? 'block' : 'hidden'} px-3 pb-3 grid grid-cols-1 gap-y-1.5`}>
                  {col.links.map((link) => (
                    <li key={link.label} className="pt-1.5 first:pt-2">
                      <Link to={link.path} className="text-text-secondary hover:text-accent text-[10px] transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full py-3 flex flex-col sm:flex-row items-center justify-between text-text-muted text-[9px] gap-2 border-t border-border/30">
          <p>© {new Date().getFullYear()} HSOCIETY OFFSEC. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {SITE_CONFIG.footer.links.map((item) => (
              <Link key={item.label} to={item.path} className="hover:text-text-secondary transition-colors">{item.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
