import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Users, ExternalLink, CheckCircle2, ChevronLeft } from 'lucide-react';
import api from '../../../core/services/api';
import { getBootcampGroupLink, getConfiguredCommunityLink } from '../constants/communityLinks';

interface Step {
  id: string;
  question: string;
  subtitle?: string;
  type: 'single' | 'text';
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

const STEPS: Step[] = [
  {
    id: 'motivation',
    question: 'Why are you joining this bootcamp?',
    subtitle: 'Pick the one that fits best.',
    type: 'single',
    options: [
      'I want to start a career in cybersecurity',
      'I want to level up my existing skills',
      'I\'m curious and want to learn the basics',
      'I want to work with HSOCIETY OFFSEC',
      'Other',
    ],
  },
  {
    id: 'level',
    question: 'What\'s your current level in offensive security?',
    subtitle: 'Be honest — we\'ll meet you where you are.',
    type: 'single',
    options: [
      'Complete beginner — never touched it',
      'I know the basics (networking, Linux, etc.)',
      'Intermediate — done some CTFs or labs',
      'Advanced — I have real-world experience',
    ],
  },
  {
    id: 'goal',
    question: 'What do you want to achieve in the next 6 months?',
    subtitle: 'This helps us understand your ambition.',
    type: 'single',
    options: [
      'Land my first security job or internship',
      'Pass a certification (CEH, OSCP, etc.)',
      'Build a portfolio of real skills',
      'Start freelancing or consulting',
      'Just learn and explore',
    ],
  },
  {
    id: 'commitment',
    question: 'How many hours per week can you commit?',
    type: 'single',
    options: [
      'Less than 5 hours',
      '5–10 hours',
      '10–20 hours',
      '20+ hours — I\'m all in',
    ],
  },
  {
    id: 'phone',
    question: 'What\'s your WhatsApp number?',
    subtitle: 'So we can add you to the operator community group.',
    type: 'text',
    placeholder: '+233 XX XXX XXXX',
    required: true,
  },
];

interface EnrollmentModalProps {
  bootcamp: { id: string; title: string };
  onClose: () => void;
  onEnrolled: () => void;
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ bootcamp, onClose, onEnrolled }) => {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [groupJoined, setGroupJoined] = useState(false);
  const [error, setError] = useState('');

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const progress = ((step) / STEPS.length) * 100;

  const canAdvance = () => {
    if (!current.required && current.type === 'text') return true;
    const val = answers[current.id] || '';
    return val.trim().length > 0;
  };

  const goNext = async () => {
    if (!canAdvance()) {
      setError('Please answer this question to continue.');
      return;
    }
    setError('');

    if (isLast) {
      await submit();
      return;
    }
    setDir(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step === 0) return;
    setDir(-1);
    setStep((s) => s - 1);
    setError('');
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      await api.post('/student/bootcamp', {
        bootcampId: bootcamp.id,
        application: {
          motivation: answers.motivation || '',
          level: answers.level || '',
          goal: answers.goal || '',
          commitment: answers.commitment || '',
          phone: answers.phone || '',
          bootcampTitle: bootcamp.title,
          submittedAt: new Date().toISOString(),
        },
      });
      setDone(true);
      onEnrolled();
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Enrollment failed. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25 }}
        className="relative bg-bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full border border-border hover:border-accent/50 text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Progress bar */}
        {!done && (
          <div className="h-0.5 bg-border w-full">
            <motion.div
              className="h-full bg-accent"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          {done ? (
            /* ── Success screen ── */
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-2"
            >
              {/* Top accent bar */}
              <div aria-hidden className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)' }} />

              <div className="w-16 h-16 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-black text-text-primary mb-2 uppercase">You're In.</h3>
              <p className="text-text-muted text-sm mb-2">
                Welcome to <span className="text-text-primary font-bold">{bootcamp.title}</span>.
              </p>

              {(() => {
                const groupLink = getBootcampGroupLink(bootcamp.id);
                if (groupLink) {
                  return (
                    <>
                      {/* Compulsory group join — required before proceeding */}
                      <div className="rounded-xl border border-accent/30 bg-accent-dim p-4 mb-5 text-left">
                        <p className="text-accent text-[10px] font-bold uppercase tracking-[0.2em] mb-1">// REQUIRED</p>
                        <p className="text-text-primary text-sm font-bold mb-1">Join the Bootcamp WhatsApp Group</p>
                        <p className="text-text-muted text-xs">
                          This is the main communication channel for {bootcamp.title}. All updates, sessions, and announcements happen here. You must join to proceed.
                        </p>
                      </div>
                      <a
                        href={groupLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setGroupJoined(true)}
                        className="btn-primary text-sm w-full flex items-center justify-center gap-2 mb-3"
                      >
                        <Users className="w-4 h-4" /> Join WhatsApp Group <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={onClose}
                        disabled={!groupJoined}
                        className="btn-secondary text-sm w-full disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                      >
                        {groupJoined ? 'Go to Bootcamp' : 'Join the group first ↑'}
                      </button>
                      {!groupJoined && (
                        <p className="text-text-muted text-[10px] mt-2">
                          Click the button above to join, then this will unlock.
                        </p>
                      )}
                    </>
                  );
                }
                return (
                  <>
                    <p className="text-text-secondary text-xs mb-8">
                      Join the operator community on WhatsApp to get updates, connect with other operators, and stay ahead.
                    </p>
                    <a
                      href={getConfiguredCommunityLink(bootcamp.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-sm w-full flex items-center justify-center gap-2 mb-3"
                    >
                      <Users className="w-4 h-4" /> Join the Community <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button onClick={onClose} className="btn-secondary text-sm w-full">
                      Go to Bootcamp
                    </button>
                  </>
                );
              })()}
            </motion.div>
          ) : (
            /* ── Question steps ── */
            <>
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  {step > 0 && (
                    <button
                      onClick={goBack}
                      className="w-7 h-7 flex items-center justify-center rounded-full border border-border hover:border-accent/50 text-text-muted hover:text-accent transition-colors flex-none"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">
                    {bootcamp.title} // {step + 1} of {STEPS.length}
                  </span>
                </div>
              </div>

              {/* Animated step content */}
              <div className="relative overflow-hidden min-h-[260px]">
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.div
                    key={step}
                    custom={dir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                  >
                    <h3 className="text-lg md:text-xl font-black text-text-primary mb-1 leading-snug">
                      {current.question}
                    </h3>
                    {current.subtitle && (
                      <p className="text-text-muted text-xs mb-5">{current.subtitle}</p>
                    )}
                    {!current.subtitle && <div className="mb-5" />}

                    {current.type === 'single' && current.options && (
                      <div className="flex flex-col gap-2">
                        {current.options.map((opt) => {
                          const selected = answers[current.id] === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => {
                                setAnswers((a) => ({ ...a, [current.id]: opt }));
                                setError('');
                              }}
                              className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                                selected
                                  ? 'border-accent bg-accent-dim text-text-primary'
                                  : 'border-border bg-bg hover:border-accent/40 text-text-secondary hover:text-text-primary'
                              }`}
                            >
                              <span className={`inline-block w-3 h-3 rounded-full border mr-3 flex-none align-middle transition-colors ${selected ? 'bg-accent border-accent' : 'border-text-muted'}`} />
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {current.type === 'text' && (
                      <input
                        type="text"
                        value={answers[current.id] || ''}
                        onChange={(e) => {
                          setAnswers((a) => ({ ...a, [current.id]: e.target.value }));
                          setError('');
                        }}
                        placeholder={current.placeholder}
                        className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-sm text-text-primary focus:border-accent outline-none transition-colors placeholder:text-text-muted"
                        onKeyDown={(e) => { if (e.key === 'Enter') void goNext(); }}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {error && (
                <p className="text-red-400 text-xs mt-2 mb-1">{error}</p>
              )}

              <button
                onClick={() => void goNext()}
                disabled={submitting}
                className="mt-5 w-full btn-primary text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-bg border-t-transparent rounded-full animate-spin" />
                ) : isLast ? (
                  <>Enroll Now <CheckCircle2 className="w-4 h-4" /></>
                ) : (
                  <>Next <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EnrollmentModal;
