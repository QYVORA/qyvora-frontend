/**
 * CTF Challenge Page
 *
 * Renders the current module's web-based CTF challenge.
 * Students use browser DevTools, page source, network inspector,
 * cookies, and console to find the flag — no VM required.
 *
 * Challenge types and where to look:
 *   html_source      → View Page Source (Ctrl+U)
 *   devtools_console → Console tab in DevTools
 *   network_header   → Network tab → response headers
 *   cookie           → Application → Cookies in DevTools
 *   robots           → Visit /robots.txt
 *   base64           → Decode the visible string on screen
 *   js_variable      → Sources tab → find the variable
 *   meta_tag         → View Page Source → <meta> tags
 *   redirect_chain   → Network tab → follow the redirects
 *   http_status      → Network tab → check the status code
 */

import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Flag, Terminal, CheckCircle2, XCircle, Lightbulb,
  ArrowLeft, Loader2, Lock, ChevronRight, RefreshCw,
} from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import CpLogo from '../../../shared/components/CpLogo';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Hint {
  order: number;
  cpCost: number;
  text: string | null; // null = not yet unlocked
}

interface Challenge {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  cpReward: number;
  hints: Hint[];
  solved?: boolean;
}

interface ScenarioResponse {
  challenge: Challenge | null;
  allSolved: boolean;
  totalChallenges: number;
  solvedCount: number;
}

// ── Category metadata ─────────────────────────────────────────────────────────
const CATEGORY_META: Record<string, { label: string; tip: string; color: string }> = {
  html_source:      { label: 'HTML Source',      tip: 'Press Ctrl+U (or Cmd+U) to view page source.',                color: 'text-blue-400 border-blue-400/30 bg-blue-400/10'   },
  devtools_console: { label: 'DevTools Console', tip: 'Open DevTools (F12) → Console tab.',                          color: 'text-accent border-accent/30 bg-accent/10'          },
  network_header:   { label: 'Network Header',   tip: 'DevTools → Network tab → click the request → Headers.',       color: 'text-purple-400 border-purple-400/30 bg-purple-400/10' },
  cookie:           { label: 'Cookie',           tip: 'DevTools → Application → Cookies → select this site.',        color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' },
  robots:           { label: 'Robots.txt',       tip: 'Visit /robots.txt in your browser.',                          color: 'text-orange-400 border-orange-400/30 bg-orange-400/10' },
  base64:           { label: 'Base64 Decode',    tip: 'Copy the string and decode it (atob() in console).',          color: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10'    },
  js_variable:      { label: 'JS Variable',      tip: 'DevTools → Sources → search for the variable name.',          color: 'text-pink-400 border-pink-400/30 bg-pink-400/10'    },
  meta_tag:         { label: 'Meta Tag',         tip: 'View page source and look for <meta> tags.',                  color: 'text-indigo-400 border-indigo-400/30 bg-indigo-400/10' },
  redirect_chain:   { label: 'Redirect Chain',   tip: 'DevTools → Network → check "Preserve log" → follow redirects.', color: 'text-red-400 border-red-400/30 bg-red-400/10'    },
  http_status:      { label: 'HTTP Status',      tip: 'DevTools → Network → check the response status code.',        color: 'text-teal-400 border-teal-400/30 bg-teal-400/10'   },
};

const DIFFICULTY_COLOR = {
  easy:   'text-accent border-accent/30 bg-accent/10',
  medium: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  hard:   'text-red-400 border-red-400/30 bg-red-400/10',
};

// ── Component ─────────────────────────────────────────────────────────────────
const CtfPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { addToast } = useToast();

  const [scenario, setScenario]     = useState<ScenarioResponse | null>(null);
  const [loading, setLoading]       = useState(true);
  const [flag, setFlag]             = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult]         = useState<{ correct: boolean; message: string; cpAwarded?: number } | null>(null);
  const [hintLoading, setHintLoading] = useState<number | null>(null);
  const [hints, setHints]           = useState<Hint[]>([]);
  const flagInputRef                = useRef<HTMLInputElement>(null);

  const mid = Number(moduleId || 1);

  const loadScenario = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await api.get<ScenarioResponse>(`/student/ctf/${mid}/scenario`);
      setScenario(res.data);
      setHints(res.data.challenge?.hints ?? []);
    } catch {
      addToast('Could not load CTF challenge.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadScenario(); }, [mid]);

  // ── Trigger clue endpoints based on challenge category ────────────────────
  useEffect(() => {
    if (!scenario?.challenge) return;
    const cat = scenario.challenge.category;

    if (cat === 'network_header' || cat === 'cookie') {
      // Fire the clue endpoint so the header/cookie is set — student inspects it
      api.get(`/student/ctf/${mid}/clue/${cat === 'network_header' ? 'header' : 'cookie'}`)
        .catch(() => {});
    }
    if (cat === 'devtools_console') {
      // Log the clue to the browser console — student finds it there
      const clue = btoa(`ctf_module_${mid}_console_clue`);
      console.log('%c[HSOCIETY CTF]', 'color:#B7FF99;font-weight:bold;font-size:14px');
      console.log('%cSomething is hidden here. Look carefully.', 'color:#88AD7C');
      console.log(`%cClue: ${clue}`, 'color:#666;font-size:10px');
    }
  }, [scenario?.challenge?.category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag.trim() || !scenario?.challenge) return;
    setSubmitting(true);
    setResult(null);
    try {
      const res = await api.post(`/student/ctf/${mid}/submit`, {
        flag: flag.trim(),
        challengeId: scenario.challenge._id,
      });
      const data = res.data;
      setResult({ correct: data.correct, message: data.message, cpAwarded: data.cpAwarded });
      if (data.correct) {
        addToast(`Flag correct! +${data.cpAwarded} CP`, 'success');
        // Reload to show next challenge or completion state
        setTimeout(() => void loadScenario(), 1200);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Submission failed.';
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnlockHint = async (hint: Hint) => {
    if (!scenario?.challenge) return;
    setHintLoading(hint.order);
    try {
      const res = await api.post(`/student/ctf/${mid}/hint`, {
        challengeId: scenario.challenge._id,
        hintOrder: hint.order,
      });
      setHints((prev) =>
        prev.map((h) => h.order === hint.order ? { ...h, text: res.data.hint } : h)
      );
      if (res.data.cpDeducted > 0) {
        addToast(`Hint unlocked. -${res.data.cpDeducted} CP`, 'info');
      }
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Could not unlock hint.', 'error');
    } finally {
      setHintLoading(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (!scenario?.challenge && !scenario?.allSolved) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-4 px-4">
        <Lock className="w-12 h-12 text-text-muted opacity-40" />
        <p className="text-text-muted text-base">No CTF challenge available for this module yet.</p>
        <Link to="/bootcamps" className="btn-secondary text-sm !px-6">Back to Curriculum</Link>
      </div>
    );
  }

  if (scenario.allSolved) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="w-20 h-20 rounded-2xl bg-accent-dim border border-accent/30 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-accent" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-text-primary mb-2">Module CTF Complete</h1>
          <p className="text-text-muted text-sm">
            You solved all {scenario.totalChallenges} challenge{scenario.totalChallenges !== 1 ? 's' : ''} in this module.
          </p>
        </div>
        <Link to={`/bootcamps`} className="btn-primary text-sm !px-8 inline-flex items-center gap-2">
          <ChevronRight className="w-4 h-4" /> Continue Curriculum
        </Link>
      </div>
    );
  }

  const challenge = scenario.challenge!;
  const catMeta   = CATEGORY_META[challenge.category] ?? { label: challenge.category, tip: '', color: 'text-text-muted border-border bg-bg' };

  return (
    <div className="min-h-screen bg-bg pb-16">
      {/* Hidden clues in HTML — students find these in View Source */}
      {challenge.category === 'html_source' && (
        <>
          {/* FLAG IS NOT HERE — this is a decoy */}
          {/* <!-- hsociety_ctf_decoy: dGhpcyBpcyBub3QgdGhlIGZsYWc= --> */}
          {/* <!-- operator_note: check the meta tags --> */}
        </>
      )}
      {challenge.category === 'meta_tag' && (
        <meta name="ctf-clue" content={btoa(`module_${mid}_meta_clue`)} />
      )}

      <div className="max-w-3xl mx-auto px-4 pt-8 md:px-8 md:pt-10">

        {/* Back */}
        <Link
          to={`/bootcamps`}
          className="inline-flex items-center gap-2 text-xs font-bold text-text-muted hover:text-accent transition-colors mb-8 uppercase tracking-widest"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Curriculum
        </Link>

        {/* Progress */}
        {scenario.totalChallenges > 1 && (
          <div className="mb-6 flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-700"
                style={{ width: `${(scenario.solvedCount / scenario.totalChallenges) * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono text-text-muted shrink-0">
              {scenario.solvedCount}/{scenario.totalChallenges}
            </span>
          </div>
        )}

        <ScrollReveal>
          {/* Challenge header */}
          <div className="card-hsociety p-6 md:p-8 mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border ${catMeta.color}`}>
                {catMeta.label}
              </span>
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border ${DIFFICULTY_COLOR[challenge.difficulty]}`}>
                {challenge.difficulty}
              </span>
              <span className="ml-auto text-xs font-mono font-bold text-accent inline-flex items-center gap-1">
                +{challenge.cpReward} <CpLogo className="w-3.5 h-3.5" />
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-text-primary mb-3 font-mono">
              {challenge.title}
            </h1>

            <p className="text-sm text-text-secondary leading-relaxed mb-5 whitespace-pre-wrap">
              {challenge.description}
            </p>

            {/* Category tip */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accent-dim/30 border border-accent/20">
              <Terminal className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <p className="text-xs text-accent font-mono">{catMeta.tip}</p>
            </div>
          </div>

          {/* Flag submission */}
          <div className="card-hsociety p-6 md:p-8 mb-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-text-primary mb-4 flex items-center gap-2">
              <Flag className="w-4 h-4 text-accent" /> Submit Flag
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1.5">
                  Flag — format: FLAG&#123;...&#125;
                </label>
                <input
                  ref={flagInputRef}
                  type="text"
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  placeholder="FLAG{your_answer_here}"
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full bg-bg border border-border rounded-lg py-3 px-4 text-sm text-text-primary font-mono placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
                />
              </div>

              {/* Result feedback */}
              {result && (
                <div className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${
                  result.correct
                    ? 'border-accent/30 bg-accent/10 text-accent'
                    : 'border-red-500/30 bg-red-500/10 text-red-400'
                }`}>
                  {result.correct
                    ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    : <XCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                  <span className="font-mono text-xs">{result.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !flag.trim()}
                className="w-full btn-primary !py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Checking...</>
                  : <><Flag className="w-4 h-4" /> Submit Flag</>}
              </button>
            </form>
          </div>

          {/* Hints */}
          {hints.length > 0 && (
            <div className="card-hsociety p-6 md:p-8">
              <h2 className="text-sm font-black uppercase tracking-widest text-text-primary mb-4 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-accent" /> Hints
              </h2>
              <div className="space-y-3">
                {hints.map((hint) => (
                  <div key={hint.order} className="rounded-lg border border-border bg-bg p-4">
                    {hint.text ? (
                      <div>
                        <div className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">
                          Hint {hint.order}
                        </div>
                        <p className="text-sm text-text-secondary font-mono">{hint.text}</p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-0.5">
                            Hint {hint.order}
                          </div>
                          <div className="text-xs text-text-muted">
                            {hint.cpCost > 0
                              ? <span className="inline-flex items-center gap-1">Costs {hint.cpCost} <CpLogo className="w-3 h-3" /></span>
                              : 'Free'}
                          </div>
                        </div>
                        <button
                          onClick={() => void handleUnlockHint(hint)}
                          disabled={hintLoading === hint.order}
                          className="btn-secondary !py-2 !px-4 text-xs flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {hintLoading === hint.order
                            ? <Loader2 className="w-3 h-3 animate-spin" />
                            : <Lightbulb className="w-3 h-3" />}
                          Unlock
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </ScrollReveal>
      </div>
    </div>
  );
};

export default CtfPage;
