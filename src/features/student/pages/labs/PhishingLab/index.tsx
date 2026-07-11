import { useState, useMemo, useCallback } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertTriangle, ExternalLink, Shield, Eye, FileText, Paperclip, Search, ChevronDown, ChevronRight, X, Info } from 'lucide-react';
import { PHISHING_CHALLENGES } from '@/features/student/data/simulations/phishing-data';
import type { PhishingChallenge, PhishingEmail, PhishingIndicator } from '@/features/student/data/simulations/phishing-data';

type Tab = 'email' | 'headers' | 'analysis';

const PHISHING_SEVERITY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  high: { bg: 'bg-red-500/15', text: 'text-red-400', dot: 'bg-red-400' },
  medium: { bg: 'bg-yellow-500/15', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  low: { bg: 'bg-blue-500/15', text: 'text-blue-300', dot: 'bg-blue-300' },
};

const DIFFICULTY_STYLES: Record<string, { bg: string; text: string }> = {
  beginner: { bg: 'bg-accent/10', text: 'text-accent' },
  intermediate: { bg: 'bg-yellow-400/10', text: 'text-yellow-400' },
  advanced: { bg: 'bg-red-400/10', text: 'text-red-400' },
};

const formatDate = (dateString: string): string => {
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const classNames = (...classes: (string | false | null | undefined)[]): string =>
  classes.filter(Boolean).join(' ');

const renderHTML = (html: string) => {
  return <div className="phishing-email-body" dangerouslySetInnerHTML={{ __html: html }} />;
};

const ChallengeCard = ({ challenge, onClick }: { challenge: PhishingChallenge; onClick: () => void }) => {
  const difficulty = DIFFICULTY_STYLES[challenge.difficulty];
  const numEmails = challenge.emails.length;
  const numQuestions = challenge.questions.length;

  return (
    <button
      onClick={onClick}
      className="group flex flex-col h-full rounded-2xl border border-border/30 bg-bg-card p-5 hover:border-accent/30 transition-all duration-300 text-left w-full"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-accent" />
        </div>
        <h3 className="text-sm font-black text-text-primary group-hover:text-accent transition-colors leading-snug">
          {challenge.title}
        </h3>
      </div>

      <p className="text-xs text-text-muted/70 font-mono leading-relaxed mb-4 flex-1 line-clamp-2">
        {challenge.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent/10 text-accent">
          {numEmails} {numEmails === 1 ? 'email' : 'emails'}
        </span>
        <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-400">
          {numQuestions} questions
        </span>
        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${difficulty.bg} ${difficulty.text}`}>
          {challenge.difficulty}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/20">
        <span className="text-[10px] font-black uppercase tracking-widest text-accent">
          {challenge.cpReward} CP
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-accent transition-colors">
          Start Challenge
        </span>
      </div>
    </button>
  );
};

const InboxEmail = ({ email, isSelected, onSelect }: { email: PhishingEmail; isSelected: boolean; onSelect: () => void }) => {
  return (
    <button
      onClick={onSelect}
      className={classNames(
        'w-full text-left p-3 border-b border-border/20 transition-colors',
        isSelected
          ? 'bg-accent/10 border-l-2 border-l-accent'
          : 'hover:bg-bg-hover border-l-2 border-l-transparent'
      )}
    >
      <div className="flex items-center justify-between mb-0.5">
        <span className={classNames(
          'text-sm truncate pr-2',
          isSelected ? 'text-accent font-black' : 'text-text-primary font-bold'
        )}>
          {email.fromName}
        </span>
        <span className="text-[9px] text-text-muted whitespace-nowrap">
          {formatDate(email.receivedAt)}
        </span>
      </div>
      <p className="text-xs text-text-primary truncate font-medium mb-0.5">
        {email.subject}
      </p>
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] text-text-muted truncate">
          To: {email.to}
        </span>
        {email.isPhishing && (
          <span className={classNames(
            'ml-auto text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-lg',
            'bg-red-400/10 text-red-400'
          )}>
            Phish
          </span>
        )}
      </div>
    </button>
  );
};

const EmailAddressLink = ({ email: address }: { email: string }) => {
  const parts = address.split('@');
  const obfuscated = parts.length === 2 ? `${parts[0][0]}${'*'.repeat(parts[0].length - 1)}@${parts[1]}` : address;
  return <span className="text-text-muted font-mono text-xs cursor-pointer hover:text-accent transition-colors">{obfuscated}</span>;
};

const EmailDetailView = ({ email }: { email: PhishingEmail }) => {
  const [activeTab, setActiveTab] = useState<Tab>('email');
  const [showAllHeaders, setShowAllHeaders] = useState(false);

  const visibleHeaders = showAllHeaders ? email.headers : email.headers.slice(0, 10);
  const hasMoreHeaders = email.headers.length > 10;

  const mainLinks = email.links.filter(l => l.actualUrl !== l.displayUrl);
  const secureLinks = email.links.filter(l => l.actualUrl === l.displayUrl);

  return (
    <div className="flex flex-col h-full">
      <div className="bg-bg-card border-b border-border/20 px-4 py-3">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl font-black text-text-primary leading-none">
            {email.subject}
          </span>
          {email.isPhishing && (
            <span className="px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-red-500/15 text-red-400 shrink-0">
              Phishing
            </span>
          )}
        </div>
        <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1 text-sm">
          <span className="text-text-muted/60 font-mono text-xs">From</span>
          <span className="text-text-primary text-xs">"{email.fromName}" &lt;{email.from}&gt;</span>

          <span className="text-text-muted/60 font-mono text-xs">To</span>
          <span className="text-text-primary text-xs">{email.to}</span>

          <span className="text-text-muted/60 font-mono text-xs">Date</span>
          <span className="text-text-primary text-xs">{formatDate(email.receivedAt)}</span>
        </div>
      </div>

      <div className="flex border-b border-border/20 bg-bg-card">
        <TabButton tab="email" currentTab={activeTab} onClick={setActiveTab} icon={Eye} label="Email" />
        <TabButton tab="headers" currentTab={activeTab} onClick={setActiveTab} icon={FileText} label="Headers" />
        <TabButton tab="analysis" currentTab={activeTab} onClick={setActiveTab} icon={Search} label="Analysis" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'email' && (
          <div className="p-4 sm:p-6 overflow-x-hidden">
            <div className="max-w-full break-words [&_img]:max-w-full [&_table]:max-w-full [&_table]:w-auto [&_pre]:max-w-full [&_pre]:overflow-auto [&_figure]:max-w-full [&_figure]:overflow-auto [&_.email-body-content_div]:max-w-full [&_.email-body-content]:max-w-full">
              <div
                className="phishing-email-render"
                dangerouslySetInnerHTML={{ __html: email.body }}
              />
            </div>
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="p-4">
            <div className="rounded-2xl border border-border/30 bg-bg-card p-4 space-y-0.5">
              {visibleHeaders.map((h, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-1 py-2 border-b border-border/10 last:border-b-0">
                  <span className="text-[11px] font-black uppercase tracking-widest text-accent shrink-0 w-44">
                    {h.key}
                  </span>
                  <span className="text-xs text-text-primary break-all leading-relaxed">
                    {h.value}
                  </span>
                </div>
              ))}
              {hasMoreHeaders && (
                <button
                  onClick={() => setShowAllHeaders(!showAllHeaders)}
                  className="flex items-center gap-1.5 mt-2 text-accent hover:text-accent/70 transition-colors text-xs"
                >
                  {showAllHeaders ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  {showAllHeaders ? 'Show less' : `Show ${email.headers.length - 10} more`}
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="p-4 sm:p-6 space-y-6">
            {email.indicators.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-accent" />
                  <span className="text-sm font-black uppercase tracking-widest text-accent">Phishing indicators</span>
                </div>
                <div className="space-y-3">
                  {email.indicators.map((indicator, idx) => (
                    <IndicatorCard key={idx} indicator={indicator} />
                  ))}
                </div>
              </section>
            )}

            {email.links.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <ExternalLink className="w-5 h-5 text-accent" />
                  <span className="text-sm font-black uppercase tracking-widest text-accent">Link analysis</span>
                </div>
                <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
                  {email.links.map((link, idx) => (
                    <div key={idx} className="p-4 border-b border-border/20 last:border-b-0">
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 ${link.actualUrl !== link.displayUrl ? 'bg-red-500/15' : 'bg-accent/10'}`}>
                          {link.actualUrl !== link.displayUrl ? (
                            <X className="w-3 h-3 text-red-400" />
                          ) : (
                            <CheckCircle className="w-3 h-3 text-accent" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-text-primary font-medium mb-0.5">{link.text}</p>
                          <div className="space-y-1">
                            <div className="flex items-start gap-2 text-xs">
                              <span className="text-text-muted w-14 shrink-0">Display:</span>
                              <span className="font-mono break-all text-text-primary">{link.displayUrl}</span>
                            </div>
                            <div className="flex items-start gap-2 text-xs">
                              <span className="text-text-muted w-14 shrink-0">Actual:</span>
                              <span className={classNames(
                                'font-mono break-all',
                                link.actualUrl !== link.displayUrl ? 'text-red-400' : 'text-accent'
                              )}>
                                {link.actualUrl}
                              </span>
                            </div>
                            {link.actualUrl !== link.displayUrl && (
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded-lg">MISMATCH</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {email.attachment && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Paperclip className="w-5 h-5 text-accent" />
                  <span className="text-sm font-black uppercase tracking-widest text-accent">Attachment analysis</span>
                </div>
                <div className="rounded-2xl border border-border/30 bg-bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-sm text-text-primary font-medium">{email.attachment.name}</p>
                      <p className="text-xs text-text-muted font-mono">{email.attachment.size}</p>
                    </div>
                    {email.attachment.malicious && (
                      <span className="ml-auto px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-red-500/15 text-red-400 shrink-0">
                        MALICIOUS
                      </span>
                    )}
                  </div>
                </div>
              </section>
            )}

            {email.indicators.length === 0 && email.links.length === 0 && !email.attachment && (
              <div className="flex flex-col items-center justify-center py-10 text-text-muted">
                <Info className="w-10 h-10 mb-3 opacity-50" />
                <p className="text-sm font-mono">No analysis data available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ tab, currentTab, onClick, icon: Icon, label }: { tab: string; currentTab: Tab; onClick: (tab: Tab) => void; icon: React.ComponentType<{ className?: string }>; label: string }) => (
  <button
    onClick={() => onClick(tab as Tab)}
    className={classNames(
      'flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-colors',
      tab === currentTab
        ? 'border-accent text-accent'
        : 'border-transparent text-text-muted hover:text-accent'
    )}
    role="tab"
    aria-selected={tab === currentTab}
    aria-controls={`tabpanel-${tab}`}
  >
    <Icon className="w-3.5 h-3.5" />
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const IndicatorCard = ({ indicator }: { indicator: PhishingIndicator }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sev = PHISHING_SEVERITY_COLORS[indicator.severity] || PHISHING_SEVERITY_COLORS.low;

  return (
    <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-bg-hover transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 shrink-0">
            <div className={classNames('w-2 h-2 rounded-full', sev.dot)} />
            <span className={classNames('text-[9px] font-black uppercase tracking-widest', sev.text)}>
              {indicator.severity}
            </span>
          </div>
          <span className="text-sm font-black text-text-primary truncate">{indicator.type}</span>
          <span className="text-[9px] text-text-muted font-mono truncate">{indicator.location}</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-text-muted shrink-0" /> : <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 -mt-1">
          <div className="ml-10 pl-2 border-l-2 border-border/20">
            <p className="text-xs text-text-muted font-mono leading-relaxed">{indicator.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const ChevronUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const QuizSection = ({ questions, onComplete }: { questions: PhishingQuestion[]; onComplete: () => void }) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);
  const score = questions.reduce((acc, q) => acc + (answers[q.id] === q.correctIndex ? 1 : 0), 0);
  const passed = score >= Math.ceil(questions.length / 2);

  const handleSubmit = () => {
    setSubmitted(true);
    if (passed) {
      setTimeout(onComplete, 1500);
    }
  };

  if (submitted && passed) {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle className="w-5 h-5 text-accent" />
          <span className="text-sm font-black text-accent">Quiz completed!</span>
        </div>
        <p className="text-xs text-text-muted font-mono">
          Score {score}/{questions.length} - Analysis verified
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-5 h-5 text-accent" />
        <span className="text-sm font-black uppercase tracking-widest text-accent">analysis questions</span>
        {submitted && !passed && <AlertTriangle className="w-5 h-5 text-red-400 ml-2" />}
      </div>
      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const selected = answers[q.id];
          const showResults = submitted;
          const isCorrect = showResults && selected === q.correctIndex;
          const isWrong = showResults && selected !== undefined && !isCorrect;

          return (
            <div key={q.id} className="space-y-2">
              <p className="text-sm text-text-primary font-bold flex items-start gap-2">
                <span className="text-accent text-xs font-black w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  {qIdx + 1}
                </span>
                {q.question}
              </p>
              <div className="ml-4 space-y-1">
                {q.options.map((option, oIdx) => {
                  let optionStyle = '';
                  if (showResults) {
                    if (oIdx === q.correctIndex) {
                      optionStyle = 'border-accent/50 bg-accent/5';
                    } else if (oIdx === selected) {
                      optionStyle = 'border-red-400/50 bg-red-400/5';
                    } else {
                      optionStyle = 'border-border/30 bg-bg';
                    }
                  } else {
                    optionStyle = selected === oIdx ? 'border-accent/50 bg-accent/10' : 'border-border/30 bg-bg';
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={submitted}
                      onClick={() => setAnswers({ ...answers, [q.id]: oIdx })}
                      className={`w-full text-left px-4 py-2.5 rounded-xl border transition-colors ${optionStyle} ${!showResults ? 'hover:border-accent/30' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={classNames(
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
                          showResults && oIdx === q.correctIndex ? 'border-accent' : showResults && oIdx === selected ? 'border-red-400' : selected === oIdx ? 'border-accent' : 'border-border/50'
                        )}>
                          {oIdx === q.correctIndex && showResults && (
                            <CheckCircle className="w-3 h-3 text-accent" />
                          )}
                          {oIdx === selected && showResults && oIdx !== q.correctIndex && (
                            <X className="w-3 h-3 text-red-400" />
                          )}
                          {showResults && oIdx === q.correctIndex && oIdx !== selected && (
                            <CheckCircle className="w-3 h-3 text-accent opacity-60" />
                          )}
                        </div>
                        <span className={`text-xs ${showResults && oIdx === q.correctIndex ? 'text-accent' : showResults && oIdx === selected ? 'text-red-400' : 'text-text-primary'}`}>
                          {option}
                        </span>
                      </div>
                    </button>
                  );
                })}
                {showResults && (
                  <div className="bg-accent/5 border border-accent/10 rounded-xl p-3 mt-2">
                    <p className="text-xs text-accent font-bold mb-0.5">Explanation</p>
                    <p className="text-xs text-text-muted font-mono leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {allAnswered && !submitted && (
          <button onClick={handleSubmit} className="btn-primary !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-6 py-3 w-full">
            Submit answers
          </button>
        )}
      </div>
    </div>
  );
};

interface PhishingQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const SuccessCelebration = ({ challenge, onBack }: { challenge: PhishingChallenge; onBack: () => void }) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-accent" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-2">
          Challenge Complete!
        </h1>
        <p className="text-text-muted font-mono mb-2">{challenge.title}</p>
        <p className="text-accent text-2xl font-black mb-6">{challenge.cpReward} CP</p>
        <div className="space-x-4">
          <button onClick={onBack} className="btn-primary !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-6 py-3">
            Back to Challenges
          </button>
        </div>
      </div>
    </div>
  );
};

const PhishingLab = () => {
  const [activeChallenge, setActiveChallenge] = useState<PhishingChallenge | null>(null);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [flagInput, setFlagInput] = useState('');
  const [flagSubmitted, setFlagSubmitted] = useState(false);
  const [flagCorrect, setFlagCorrect] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const selectedEmail = useMemo(() => {
    if (!activeChallenge || !selectedEmailId) return null;
    return activeChallenge.emails.find((e) => e.id === selectedEmailId) || null;
  }, [activeChallenge, selectedEmailId]);

  const handleStart = useCallback((challenge: PhishingChallenge) => {
    setActiveChallenge(challenge);
    setSelectedEmailId(challenge.emails[0]?.id || null);
    setFlagInput('');
    setFlagSubmitted(false);
    setFlagCorrect(false);
    setQuizComplete(false);
  }, []);

  const handleBack = useCallback(() => {
    setActiveChallenge(null);
    setSelectedEmailId(null);
    setFlagInput('');
    setFlagSubmitted(false);
    setFlagCorrect(false);
    setQuizComplete(false);
  }, []);

  const handleFlag = useCallback(() => {
    if (!activeChallenge) return;
    const correct = flagInput.trim() === activeChallenge.flag;
    setFlagCorrect(correct);
    setFlagSubmitted(true);
  }, [activeChallenge, flagInput]);

  const handleQuizComplete = useCallback(() => {
    setQuizComplete(true);
  }, []);

  const win = flagCorrect && quizComplete;

  if (!activeChallenge) {
    return (
      <div className="bg-bg min-h-full">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight">
                Phishing &amp; Social <span className="text-accent">Engineering</span> Lab
              </h1>
            </div>
            <p className="text-sm text-text-muted font-mono">
              Analyze simulated phishing emails for signs of deception and social engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PHISHING_CHALLENGES.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onClick={() => handleStart(challenge)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (win) {
    return (
      <div className="bg-bg min-h-full">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24">
          <SuccessCelebration challenge={activeChallenge} onBack={handleBack} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-full">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors text-sm mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to challenges</span>
        </button>

        <div className="rounded-2xl border border-border/30 bg-bg-card p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-black text-text-primary truncate">{activeChallenge.title}</h2>
                <p className="text-xs text-text-muted/80 font-mono line-clamp-1">{activeChallenge.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent/10 text-accent">
                {activeChallenge.emails.length} {activeChallenge.emails.length === 1 ? 'email' : 'emails'}
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${DIFFICULTY_STYLES[activeChallenge.difficulty].bg} ${DIFFICULTY_STYLES[activeChallenge.difficulty].text}`}>
                {activeChallenge.difficulty}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent/10 text-accent">
                {activeChallenge.cpReward} CP
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/30 overflow-hidden mb-6">
          <div className="flex h-[34rem]">
            <div className="w-72 xl:w-80 shrink-0 border-r border-border/20 overflow-y-auto bg-bg-card">
              {activeChallenge.emails.map(email => (
                <InboxEmail key={email.id} email={email} isSelected={email.id === selectedEmailId} onSelect={() => setSelectedEmailId(email.id)} />
              ))}
            </div>
            <div className="flex-1 overflow-hidden bg-bg">
              {selectedEmail ? <EmailDetailView key={selectedEmail.id} email={selectedEmail} /> : null}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/30 bg-bg-card p-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-black text-accent">{activeChallenge.questions.length}</span>
            </div>
            <span className="text-sm font-black uppercase tracking-widest text-accent">analysis questions</span>
          </div>
        </div>
        <QuizSection questions={activeChallenge.questions} onComplete={handleQuizComplete} />

        {quizComplete && (
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5 mt-6">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span className="text-sm font-black text-accent">All questions answered!</span>
            </div>
            <p className="text-xs text-text-muted font-mono mb-3">
              Submit the completion flag to earn {activeChallenge.cpReward} CP
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={flagInput}
                onChange={(e) => setFlagInput(e.target.value)}
                placeholder="FLAG{...}"
                className="flex-1 bg-bg border border-border rounded-xl py-3 px-4 text-text-primary focus:border-accent outline-none font-mono text-sm"
              />
              <button
                onClick={handleFlag}
                disabled={!flagInput.trim()}
                className="btn-primary !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-6 py-3 disabled:opacity-50"
              >
                Submit
              </button>
            </div>
            {flagSubmitted && (
              <div className={`mt-4 p-4 rounded-xl ${flagCorrect ? 'bg-accent/10 border border-accent/30' : 'bg-red-400/10 border border-red-400/30'}`}>
                {flagCorrect ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span className="text-sm text-accent">Flag accepted! challenge complete.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-400">Incorrect flag. Try again.</span>
                    <button
                      onClick={() => { setFlagSubmitted(false); setFlagInput(''); }}
                      className="ml-auto btn-secondary !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-4 py-1.5"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!quizComplete && (
          <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-4 mt-6">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-xs text-text-muted font-mono">
                Answer all analysis questions above before the flag submission unlocks.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhishingLab;
