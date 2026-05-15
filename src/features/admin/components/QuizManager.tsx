import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface Bootcamp { id: string; title: string; modules: any[]; }
interface QuizQuestion { id: string; text: string; options: string[]; correctIndex: number; points: number; }

interface Props {
  bootcamps: Bootcamp[];
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  api: any;
}

const BOOTCAMP_MODULES = [
  { moduleId: 1, title: 'Hacker Mindset' },
  { moduleId: 2, title: 'Linux Foundations' },
  { moduleId: 3, title: 'Networking' },
  { moduleId: 4, title: 'Web & Backend Systems' },
  { moduleId: 5, title: 'Social Engineering' },
];

const DEFAULT_QUESTIONS: Record<number, QuizQuestion[]> = {
  1: [
    { id: 'q1', text: 'What is the primary mindset of an ethical hacker?', options: ['Break everything without limits', 'Think like an attacker while respecting boundaries', 'Ignore rules to find vulnerabilities', 'Automate all security work'], correctIndex: 1, points: 10 },
    { id: 'q2', text: 'What does OSINT stand for?', options: ['Open Source Intelligence', 'Offensive Security Integration', 'Online System Intrusion Test', 'Operational Security Interface'], correctIndex: 0, points: 10 },
    { id: 'q3', text: 'Which of the following is a key principle of responsible disclosure?', options: ['Publish vulnerabilities immediately', 'Notify the vendor before going public', 'Exploit the vulnerability for profit', 'Ignore the vulnerability'], correctIndex: 1, points: 10 },
  ],
  2: [
    { id: 'q1', text: 'Which command lists files including hidden ones in Linux?', options: ['ls', 'ls -la', 'dir', 'show files'], correctIndex: 1, points: 10 },
    { id: 'q2', text: 'What does chmod 755 set on a file?', options: ['Read-only for all', 'Full access for owner, read/execute for others', 'No permissions', 'Write-only for owner'], correctIndex: 1, points: 10 },
    { id: 'q3', text: 'Which command shows running processes in Linux?', options: ['tasklist', 'ps aux', 'proc list', 'show processes'], correctIndex: 1, points: 10 },
  ],
  3: [
    { id: 'q1', text: 'What does TCP stand for?', options: ['Transfer Control Protocol', 'Transmission Control Protocol', 'Terminal Connection Protocol', 'Transport Channel Protocol'], correctIndex: 1, points: 10 },
    { id: 'q2', text: 'Which port does HTTPS use by default?', options: ['80', '8080', '443', '22'], correctIndex: 2, points: 10 },
    { id: 'q3', text: 'What tool is commonly used for network scanning?', options: ['Wireshark', 'nmap', 'Burp Suite', 'Metasploit'], correctIndex: 1, points: 10 },
  ],
  4: [
    { id: 'q1', text: 'What does SQL injection exploit?', options: ['Weak passwords', 'Unsanitised user input in database queries', 'Outdated SSL certificates', 'Missing firewall rules'], correctIndex: 1, points: 10 },
    { id: 'q2', text: 'What does XSS stand for?', options: ['Cross-Site Scripting', 'Cross-Server Session', 'Extended Security Schema', 'External Script Source'], correctIndex: 0, points: 10 },
    { id: 'q3', text: 'Which HTTP method is typically used to submit a login form?', options: ['GET', 'POST', 'PUT', 'DELETE'], correctIndex: 1, points: 10 },
  ],
  5: [
    { id: 'q1', text: 'What is phishing?', options: ['A network scanning technique', 'A social engineering attack using deceptive messages', 'A type of malware', 'A firewall bypass method'], correctIndex: 1, points: 10 },
    { id: 'q2', text: 'What does pretexting involve?', options: ['Creating a fabricated scenario to extract information', 'Scanning open ports', 'Brute-forcing passwords', 'Injecting malicious code'], correctIndex: 0, points: 10 },
    { id: 'q3', text: 'Which of the following is an OSINT tool?', options: ['Metasploit', 'Maltego', 'Burp Suite', 'Hydra'], correctIndex: 1, points: 10 },
  ],
};

function blankQuestion(index: number): QuizQuestion {
  return { id: `q${index + 1}_${Date.now()}`, text: '', options: ['', '', '', ''], correctIndex: 0, points: 10 };
}

const LETTERS = ['A', 'B', 'C', 'D'];
const inp = 'w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors';

const QuizManager: React.FC<Props> = ({ addToast, api }) => {
  const [selectedModuleId, setSelectedModuleId] = useState<number>(1);
  const [questions, setQuestions] = useState<QuizQuestion[]>(DEFAULT_QUESTIONS[1]);
  const [existing, setExisting] = useState<any>(null);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [released, setReleased] = useState(false);
  const [releaseSaving, setReleaseSaving] = useState(false);

  const bootcampId = 'bc_1775270338500';

  const fetchExisting = async (moduleId: number) => {
    setLoadingExisting(true);
    try {
      const res = await api.get(`/admin/quiz?bootcampId=${encodeURIComponent(bootcampId)}&moduleId=${encodeURIComponent(String(moduleId))}`);
      if (res.data?.exists && res.data.quiz) {
        setExisting(res.data.quiz);
        setQuestions(res.data.quiz.questions || DEFAULT_QUESTIONS[moduleId] || [blankQuestion(0), blankQuestion(1), blankQuestion(2)]);
      } else {
        setExisting(null);
        setQuestions(DEFAULT_QUESTIONS[moduleId] || [blankQuestion(0), blankQuestion(1), blankQuestion(2)]);
      }
    } catch {
      setExisting(null);
      setQuestions(DEFAULT_QUESTIONS[moduleId] || [blankQuestion(0), blankQuestion(1), blankQuestion(2)]);
    } finally {
      setLoadingExisting(false);
    }
  };

  const fetchReleaseState = async (moduleId: number) => {
    try {
      const res = await api.get(`/admin/bootcamp/access?bootcampId=${encodeURIComponent(bootcampId)}`);
      const releasedModules: number[] = Array.isArray(res.data?.access?.quizRelease?.modules)
        ? res.data.access.quizRelease.modules.map(Number)
        : [];
      setReleased(releasedModules.includes(moduleId));
    } catch {
      setReleased(false);
    }
  };

  useEffect(() => {
    void fetchExisting(selectedModuleId);
    void fetchReleaseState(selectedModuleId);
  }, [selectedModuleId]);

  const updateQuestion = (id: string, patch: Partial<QuizQuestion>) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...patch } : q));
  };

  const updateOption = (qId: string, oi: number, value: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== qId) return q;
      const options = [...q.options];
      options[oi] = value;
      return { ...q, options };
    }));
  };

  const saveQuiz = async () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) { addToast(`Question ${i + 1} is empty.`, 'error'); return; }
      if (q.options.some(o => !o.trim())) { addToast(`All options in Q${i + 1} must be filled.`, 'error'); return; }
    }
    setSaving(true);
    try {
      await api.post('/admin/quiz', {
        bootcampId,
        moduleId: selectedModuleId,
        totalPoints: questions.length * 10,
        questions: questions.map((q, i) => ({
          id: `q${i + 1}`,
          text: q.text.trim(),
          options: q.options.map(o => o.trim()),
          correctIndex: q.correctIndex,
          points: 10,
        })),
      });
      addToast('Quiz saved.', 'success');
      await fetchExisting(selectedModuleId);
    } catch (e: any) {
      addToast(e?.response?.data?.error || 'Failed to save quiz.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleRelease = async () => {
    setReleaseSaving(true);
    try {
      await api.patch('/admin/quiz/release', { bootcampId, moduleId: selectedModuleId, released: !released });
      setReleased(r => !r);
      addToast(!released ? 'Quiz released to students.' : 'Quiz hidden from students.', 'success');
    } catch (e: any) {
      addToast(e?.response?.data?.error || 'Failed to update release.', 'error');
    } finally {
      setReleaseSaving(false);
    }
  };

  const deleteQuiz = async () => {
    if (!window.confirm('Delete this quiz?')) return;
    try {
      await api.delete(`/admin/quiz?bootcampId=${encodeURIComponent(bootcampId)}&moduleId=${encodeURIComponent(String(selectedModuleId))}`);
      addToast('Quiz deleted.', 'success');
      setExisting(null);
      setQuestions(DEFAULT_QUESTIONS[selectedModuleId] || [blankQuestion(0), blankQuestion(1), blankQuestion(2)]);
    } catch (e: any) {
      addToast(e?.response?.data?.error || 'Failed to delete.', 'error');
    }
  };

  const selectedModule = BOOTCAMP_MODULES.find(m => m.moduleId === selectedModuleId);

  return (
    <div className="space-y-6 max-w-3xl">

      {/* Module selector */}
      <div className="space-y-2">
        <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Select Module</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {BOOTCAMP_MODULES.map(mod => (
            <button
              key={mod.moduleId}
              onClick={() => setSelectedModuleId(mod.moduleId)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                selectedModuleId === mod.moduleId
                  ? 'border-accent/40 bg-accent-dim text-accent'
                  : 'border-border bg-bg-card text-text-secondary hover:border-accent/20'
              }`}
            >
              <span className="text-xs font-black font-mono w-5 flex-none">{String(mod.moduleId).padStart(2, '0')}</span>
              <span className="text-sm font-bold truncate">{mod.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-bg-card border border-border rounded-xl">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-text-primary">{selectedModule?.title}</div>
          {loadingExisting ? (
            <div className="text-[10px] text-text-muted animate-pulse">Checking…</div>
          ) : existing ? (
            <div className="text-[10px] text-text-muted">{existing.questions?.length ?? 0} questions saved</div>
          ) : (
            <div className="text-[10px] text-text-muted">No quiz saved yet — using default questions below</div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {existing && (
            <button
              onClick={() => void deleteQuiz()}
              className="px-3 py-2 rounded-xl border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/10 transition-colors"
            >
              Delete
            </button>
          )}
          <button
            onClick={() => void toggleRelease()}
            disabled={releaseSaving}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition-colors disabled:opacity-40 ${
              released
                ? 'border-accent/40 bg-accent-dim text-accent'
                : 'border-border text-text-muted hover:border-accent/30 hover:text-accent'
            }`}
          >
            {releaseSaving ? '…' : released ? '✓ Released to Students' : 'Release to Students'}
          </button>
        </div>
      </div>

      {/* Question editor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
            Questions ({questions.length})
          </div>
          <button
            type="button"
            onClick={() => setQuestions(prev => [...prev, blankQuestion(prev.length)])}
            className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:text-accent/70 transition-colors"
          >
            <Plus size={13} /> Add Question
          </button>
        </div>

        {questions.map((q, qi) => (
          <div key={q.id} className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-[10px] font-black text-accent uppercase tracking-widest mt-3 w-6 shrink-0">Q{qi + 1}</span>
              <input
                type="text"
                value={q.text}
                onChange={e => updateQuestion(q.id, { text: e.target.value })}
                placeholder={`Question ${qi + 1}…`}
                className="flex-1 bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
              />
              {questions.length > 2 && (
                <button
                  type="button"
                  onClick={() => setQuestions(prev => prev.filter(x => x.id !== q.id))}
                  className="text-text-muted hover:text-red-400 transition-colors mt-2 shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <div className="space-y-2 pl-9">
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => updateQuestion(q.id, { correctIndex: oi })}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-none transition-colors ${
                      q.correctIndex === oi ? 'border-accent bg-accent' : 'border-border hover:border-accent/50'
                    }`}
                  >
                    {q.correctIndex === oi && <CheckCircle2 size={10} className="text-bg" />}
                  </button>
                  <span className="text-[10px] font-bold text-text-muted w-4 flex-none">{LETTERS[oi]}</span>
                  <input
                    type="text"
                    value={opt}
                    onChange={e => updateOption(q.id, oi, e.target.value)}
                    placeholder={`Option ${LETTERS[oi]}…`}
                    className={`${inp} flex-1`}
                  />
                </div>
              ))}
              <p className="text-[10px] text-text-muted pl-7">Click the circle to mark the correct answer</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => void saveQuiz()}
        disabled={saving}
        className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50"
      >
        {saving ? <><span className="w-4 h-4 border-2 border-bg border-t-transparent rounded-full animate-spin inline-block" /> Saving…</> : 'Save Quiz'}
      </button>
    </div>
  );
};

export default QuizManager;
