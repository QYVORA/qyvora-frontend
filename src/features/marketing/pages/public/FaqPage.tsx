import React from 'react';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { FAQ_GROUPS } from '@/features/marketing/content/faqData';

const FaqPage: React.FC = () => {
  return (
    <div className="w-full bg-canvas">
      <SEO
        title="Frequently Asked Questions | QYVORA"
        description="Answers about QYVORA bootcamps, QOSE dates and tuition, security services, credential verification, tools and support."
      />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker={"QYVORA · FAQ"}
          title={"Questions, answered"}
          description={"Programmes, pricing, services, credentials and support — the answers people ask for most, with links to the full detail."}
          actions={
            <Button to="/contact" size="lg">
              Ask the desk
              <MessageCircleQuestion className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />

        <nav aria-label="FAQ categories" className="mt-8 flex flex-wrap gap-2">
          {FAQ_GROUPS.map((group) => (
            <a
              key={group.id}
              href={`#${group.id}`}
              className="inline-flex min-h-[44px] items-center rounded-full border border-border-subtle bg-surface-raised px-4 text-xs font-black uppercase tracking-widest text-text-secondary transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {group.title}
            </a>
          ))}
        </nav>

        <div className="mt-8 flex flex-col gap-10 md:gap-12">
          {FAQ_GROUPS.map((group) => (
            <section
              key={group.id}
              id={group.id}
              aria-labelledby={`${group.id}-title`}
              className="scroll-mt-24"
            >
              <div className="mb-4">
                <h2
                  id={`${group.id}-title`}
                  className="type-h2 font-black uppercase tracking-tight text-text-primary"
                >
                  {group.title}
                </h2>
                <p className="type-body-sm mt-1 text-text-muted">{group.intro}</p>
              </div>

              <div className="divide-y divide-border-subtle overflow-hidden rounded-2xl border border-border-subtle bg-bg-card">
                {group.items.map((item) => (
                  <details key={item.id} className="group">
                    <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-bold text-text-primary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:px-6">
                      <span>{item.question}</span>
                      <ChevronDown
                        className="h-4 w-4 shrink-0 text-accent transition-transform duration-[var(--dur-base)] group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <div className="px-5 pb-5 md:px-6">
                      <p className="type-body-sm max-w-3xl text-text-secondary">{item.answer}</p>
                      {item.links && item.links.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                          {item.links.map((link) => (
                            <Link
                              key={link.to + link.label}
                              to={link.to}
                              className="text-sm font-bold text-accent transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                            >
                              {link.label} →
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <Card className="mt-12 flex flex-col items-start gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="type-label uppercase tracking-[0.12em] text-accent">
              {"Still stuck?"}
            </p>
            <h2 className="type-h3 mt-1 font-black uppercase tracking-tight text-text-primary">
              {"Talk to the operations desk"}
            </h2>
            <p className="type-body-sm mt-1 max-w-xl text-text-secondary">
              {"Send a message or request a call and we will get back to you within 24 hours."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to="/contact" size="lg">
              Contact us
            </Button>
            <Button to="/contact#book-a-call" variant="secondary" size="lg">
              Book a call
            </Button>
          </div>
        </Card>
      </PublicContainer>
    </div>
  );
};

export default FaqPage;
