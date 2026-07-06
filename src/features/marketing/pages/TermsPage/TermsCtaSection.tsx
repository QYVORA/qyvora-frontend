import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/shared/components/ScrollReveal';
import SimpleHeading from '@/shared/components/ui/SimpleHeading';
import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';

const TermsCtaSection: React.FC = () => {
  return (
    <div className="min-h-full flex flex-col justify-center py-20 md:py-24">
      <div className="max-w-5xl mx-auto px-2 md:px-10 w-full">
        <ScrollReveal>
          <div
            className="terminal-card relative rounded-3xl border border-border bg-bg-card overflow-hidden p-8 md:p-16 text-center"
          >
            <div aria-hidden className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-black text-accent uppercase tracking-[0.35em]">Legal Support</span>
                </div>
                <SimpleHeading text="Questions?" compact />
              </div>
              <p className="text-text-muted text-sm md:text-base mb-10 leading-relaxed max-w-md mx-auto">
                Our operations desk is available for legal and compliance inquiries. Reach out
                directly and we&apos;ll respond within {SITE_CONFIG.contact.responseTime}.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/contact" className="btn-primary !px-10 py-4 inline-flex items-center gap-3 text-sm font-bold w-full sm:w-auto">
                  <Mail className="w-4 h-4" /> Contact Us
                </Link>
                <Link to="/" className="btn-secondary !px-10 py-4 inline-flex items-center gap-3 text-sm font-bold w-full sm:w-auto">
                  Return Home <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default TermsCtaSection;
export { TermsCtaSection };
