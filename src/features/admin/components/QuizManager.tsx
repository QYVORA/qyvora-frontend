import React, { useState } from 'react';
import { Upload, Trash2, Eye, EyeOff } from 'lucide-react';

interface Bootcamp { id: string; title: string; modules: any[]; }

interface Props {
  bootcamps: Bootcamp[];
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  api: any;
}

const EXAMPLE_JSON = {
  bootcampId: 'bc_1775270338500',
  moduleId: 1,
  roomId: 1,
  totalPoints: 30,
  questions: [
    {
      id: 'q1',
      text: 'What does SQL injection exploit?',
      options: [
        'Weak passwords',
        'Unsanitised user input in database queries',
        'Outdated SSL certificates',
        'Missing firewall rules',
      ],
      correctIndex: 1,
      points: 10,
    },
    {
      id: 'q2',
      text: 'Which HTTP method is typically used to submit a login form?',
      options: ['GET', 'POST', 'PUT', 'DELETE'],
      correctIndex: 1,
      points: 10,
    },
    {
      id: 'q3',
      text: 'What does XSS stand for?',
      options: [
        'Cross-Site Scripting',
        'Cross-Server Session',
        'Extended Security Schema',
        'External Script Source',
      ],
      correctIndex: 0,
      points: 10,
    },
  ],
};

const QuizManager: React.FC<Props> = ({ addToast, api }) => {
  const [bootcampId, setBootcampId] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [jsonText, setJsonText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [existing, setExisting] = useState<any>(null);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [showExample, setShowExample] = useState(false);

  const fetchExisting = async () => {
    if (!bootcampId || !moduleId || !roomId) return;
    setLoadingExisting(true);
    try {
      const res = await api.get(
        `/admin/quiz?bootcampId=${encodeURIComponent(bootcampId)}&moduleId=${encodeURIComponent(moduleId)}&roomId=${encodeURIComponent(roomId)}`
      );
      setExisting(res.data?.exists ? res.data.quiz : null);
    } catch {
      setExisting(null);
    } finally {
      setLoadingExisting(false);
    }
  };

  const handleUpload = async () => {
    if (!bootcampId || !moduleId || !roomId) {
      addToast('Fill in Bootcamp ID, Module ID, and Room ID first.', 'error');
      return;
    }
    let parsed: any;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      addToast('Invalid JSON — check the format and try again.', 'error');
      return;
    }

    // Allow the JSON to omit the scope fields — we inject them from the form
    const payload = {
      bootcampId,
      moduleId: Number(moduleId),
      roomId: Number(roomId),
      totalPoints: Number(parsed.totalPoints),
      questions: parsed.questions,
    };

    setUploading(true);
    try {
      await api.post('/admin/quiz', payload);
      addToast('Quiz uploaded successfully.', 'success');
      setJsonText('');
      await fetchExisting();
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Upload failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this quiz? Students will no longer be able to take it.')) return;
    setDeleting(true);
    try {
      await api.delete(
        `/admin/quiz?bootcampId=${encodeURIComponent(bootcampId)}&moduleId=${encodeURIComponent(moduleId)}&roomId=${encodeURIComponent(roomId)}`
      );
      addToast('Quiz deleted.', 'success');
      setExisting(null);
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Delete failed.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="space-y-5 max-w-3xl">

      {/* Scope selector */}
      <div className="bg-zinc-950 border border-zinc-800 rounded p-4 space-y-3">
        <div className="text-xs font-bold uppercase text-zinc-500">Target Room</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-zinc-500">Bootcamp ID</label>
            <input
              value={bootcampId}
              onChange={(e) => setBootcampId(e.target.value.trim())}
              placeholder="e.g. bc_1775270338500"
              className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-100 font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-zinc-500">Module ID</label>
            <input
              type="number"
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              placeholder="e.g. 1"
              className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-100"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-zinc-500">Room ID</label>
            <input
              type="number"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="e.g. 1"
              className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-100"
            />
          </div>
        </div>
        <button
          onClick={() => void fetchExisting()}
          disabled={!bootcampId || !moduleId || !roomId || loadingExisting}
          className="px-3 py-2 border border-zinc-700 rounded text-xs font-bold uppercase text-zinc-200 hover:border-zinc-500 disabled:opacity-40 transition-colors"
        >
          {loadingExisting ? 'Checking...' : 'Check Existing Quiz'}
        </button>
      </div>

      {/* Existing quiz status */}
      {existing && (
        <div className="bg-zinc-950 border border-zinc-700 rounded p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Quiz exists</div>
              <div className="text-sm text-zinc-300">
                {existing.questions?.length ?? 0} questions &nbsp;·&nbsp;
                <span className="font-mono text-zinc-100">{existing.totalPoints ?? 0} total points</span>
              </div>
            </div>
            <button
              onClick={() => void handleDelete()}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-800/60 rounded text-xs font-bold uppercase text-red-300 hover:bg-red-950/40 disabled:opacity-40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {deleting ? 'Deleting...' : 'Delete Quiz'}
            </button>
          </div>
          <div className="space-y-2">
            {existing.questions?.map((q: any, i: number) => (
              <div key={q.id || i} className="text-xs text-zinc-400 border border-zinc-800 rounded px-3 py-2">
                <span className="text-zinc-200 font-bold">Q{i + 1}.</span> {q.text}
                <span className="ml-2 text-zinc-500">({q.points ?? 1} pt{(q.points ?? 1) !== 1 ? 's' : ''})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JSON upload */}
      <div className="bg-zinc-950 border border-zinc-800 rounded p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase text-zinc-500">Upload Quiz JSON</div>
          <button
            onClick={() => setShowExample((v) => !v)}
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {showExample ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showExample ? 'Hide' : 'Show'} Example
          </button>
        </div>

        {showExample && (
          <div className="rounded border border-zinc-700 bg-black p-3 space-y-2">
            <div className="text-[10px] font-bold uppercase text-zinc-500 mb-1">Example format</div>
            <pre className="text-[11px] text-zinc-300 font-mono whitespace-pre-wrap overflow-x-auto leading-relaxed">
              {JSON.stringify(EXAMPLE_JSON, null, 2)}
            </pre>
            <div className="text-[10px] text-zinc-500 space-y-1 pt-1 border-t border-zinc-800">
              <p><span className="text-zinc-300">totalPoints</span> — the overall quiz score (e.g. 30). This is what students earn if they pass.</p>
              <p><span className="text-zinc-300">questions[].points</span> — points awarded for each correct answer. All question points should add up to <code>totalPoints</code>.</p>
              <p><span className="text-zinc-300">correctIndex</span> — zero-based index of the correct option (0 = first option, 1 = second, etc.).</p>
              <p>You can omit <code>bootcampId</code>, <code>moduleId</code>, <code>roomId</code> from the JSON — the form fields above take priority.</p>
            </div>
          </div>
        )}

        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder={'Paste your quiz JSON here...\n\n{\n  "totalPoints": 30,\n  "questions": [...]\n}'}
          rows={14}
          className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-100 font-mono resize-y"
        />

        <button
          onClick={() => void handleUpload()}
          disabled={uploading || !jsonText.trim() || !bootcampId || !moduleId || !roomId}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-red-800/60 rounded text-xs font-bold uppercase text-red-300 hover:bg-red-950/40 disabled:opacity-40 transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          {uploading ? 'Uploading...' : 'Upload Quiz'}
        </button>
        <p className="text-[10px] text-zinc-600">Uploading replaces any existing quiz for this room.</p>
      </div>
    </section>
  );
};

export default QuizManager;
