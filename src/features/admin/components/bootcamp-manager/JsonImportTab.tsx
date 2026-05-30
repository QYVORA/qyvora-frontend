import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Bootcamp } from './types';

const JSON_IMPORT_EXAMPLE = {
  id: "bc_1775270338500",
  modules: [
    {
      moduleId: 1,
      title: "Reconnaissance & OSINT",
      description: "Learn passive and active recon techniques used by real operators.",
      codename: "GHOST_EYE",
      roleTitle: "Intelligence Analyst",
      ctf: "",
      rooms: [
        {
          roomId: 1,
          title: "Introduction to OSINT",
          overview: "Understand what OSINT is, why it matters, and the mindset of an intelligence operator.",
          cpReward: 250,
          meetingLink: ""
        }
      ]
    }
  ]
};

interface JsonImportTabProps {
  bootcamps: Bootcamp[];
  selectedBootcampId: string;
  contentVersion: number;
  onSave: (bootcamps: any[]) => Promise<void>;
  saving: boolean;
  addToast: (msg: string, type: string) => void;
}

const JsonImportTab: React.FC<JsonImportTabProps> = ({
  bootcamps,
  onSave,
  saving,
  addToast,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [showExample, setShowExample] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [parseError, setParseError] = useState('');

  const handleParse = () => {
    setParseError('');
    setPreview(null);
    try {
      const parsed = JSON.parse(jsonText);
      const asArray = Array.isArray(parsed) ? parsed : [parsed];
      setPreview(asArray);
    } catch (e: any) {
      setParseError(`JSON parse error: ${e.message}`);
    }
  };

  const handleImport = async () => {
    if (!preview) return;
    const merged = [...bootcamps];
    for (const incoming of preview) {
      const idx = merged.findIndex((b) => b.id === incoming.id);
      if (idx >= 0) {
        merged[idx] = {
          ...merged[idx],
          ...(incoming.title ? { title: incoming.title } : {}),
          ...(incoming.description ? { description: incoming.description } : {}),
          ...(incoming.level ? { level: incoming.level } : {}),
          ...(incoming.duration ? { duration: incoming.duration } : {}),
          ...(incoming.modules ? { modules: incoming.modules } : {}),
        };
      } else {
        merged.push(incoming);
      }
    }
    await onSave(merged);
    setJsonText('');
    setPreview(null);
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="text-xs text-text-muted leading-relaxed">
        Paste a bootcamp JSON object (or array of objects) below. The import will merge modules into the matching bootcamp by <code className="text-red-300">id</code>. Existing metadata is preserved unless you include it in the JSON.
      </div>

      <button
        type="button"
        onClick={() => setShowExample((v) => !v)}
        className="text-xs font-bold text-accent hover:text-accent/70 uppercase tracking-widest transition-colors"
      >
        {showExample ? '▲ Hide example' : '▼ Show example JSON'}
      </button>

      {showExample && (
        <div className="bg-bg border border-border rounded-xl p-4 overflow-x-auto">
          <pre className="text-[11px] text-text-secondary font-mono whitespace-pre leading-relaxed">
            {JSON.stringify(JSON_IMPORT_EXAMPLE, null, 2)}
          </pre>
        </div>
      )}

      <textarea
        value={jsonText}
        onChange={(e) => { setJsonText(e.target.value); setParseError(''); setPreview(null); }}
        rows={16}
        placeholder={'Paste your bootcamp JSON here...\n\n{ "id": "bc_...", "modules": [...] }'}
        className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary font-mono resize-y focus:outline-none focus:border-accent transition-colors"
      />

      {parseError && (
        <div className="text-xs text-red-400 font-mono bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
          {parseError}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleParse}
          disabled={!jsonText.trim()}
          className="px-4 py-2 border border-border rounded-xl text-xs font-bold uppercase text-text-muted hover:border-accent/30 hover:text-accent disabled:opacity-40 transition-colors"
        >
          Validate JSON
        </button>
        {preview && (
          <button
            type="button"
            onClick={() => void handleImport()}
            disabled={saving}
            className="flex items-center gap-2 bg-red-700 hover:bg-accent disabled:opacity-40 text-white text-xs font-bold uppercase px-4 py-2 rounded transition-colors"
          >
            <Save size={13} />
            {saving ? 'Importing…' : `Import ${preview.length} bootcamp${preview.length !== 1 ? 's' : ''}`}
          </button>
        )}
      </div>

      {preview && (
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-2 bg-bg-card border-b border-border text-[10px] font-bold uppercase text-text-muted tracking-widest">
            Preview — {preview.length} bootcamp{preview.length !== 1 ? 's' : ''}
          </div>
          {preview.map((bc: any, i: number) => (
            <div key={i} className="px-4 py-3 border-b border-border last:border-0">
              <div className="text-sm font-bold text-text-primary">{bc.title || bc.id || `Bootcamp ${i + 1}`}</div>
              <div className="text-xs text-text-muted mt-0.5">
                id: <span className="text-text-secondary font-mono">{bc.id || '—'}</span>
                {' · '}
                {Array.isArray(bc.modules) ? bc.modules.length : 0} module{(Array.isArray(bc.modules) ? bc.modules.length : 0) !== 1 ? 's' : ''}
                {' · '}
                {Array.isArray(bc.modules) ? bc.modules.reduce((acc: number, m: any) => acc + (Array.isArray(m.rooms) ? m.rooms.length : 0), 0) : 0} rooms
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JsonImportTab;
