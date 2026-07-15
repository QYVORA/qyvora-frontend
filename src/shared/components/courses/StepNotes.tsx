import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StickyNote, Trash2 } from 'lucide-react';

interface StepNotesProps {
  storageKey: string;
  className?: string;
}

const StepNotes: React.FC<StepNotesProps> = ({ storageKey, className = '' }) => {
  const { t } = useTranslation();
  const [notes, setNotes] = useState('');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setNotes(saved);
    } catch {}
  }, [storageKey]);

  const handleChange = (val: string) => {
    setNotes(val);
    try { localStorage.setItem(storageKey, val); } catch {}
  };

  const handleClear = () => {
    setNotes('');
    try { localStorage.removeItem(storageKey); } catch {}
  };

  return (
    <div className={`border border-border rounded-xl overflow-hidden ${className} ${expanded ? '' : ''}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-4 py-3 bg-bg-card text-text-muted hover:text-accent transition-colors text-xs font-black uppercase tracking-widest"
      >
        <StickyNote className="h-3.5 w-3.5" />
        {expanded ? t('components.stepNotes.hideNotes') : t('components.stepNotes.myNotes')}
        {notes && <span className="ml-auto w-2 h-2 rounded-full bg-accent" />}
      </button>
      {expanded && (
        <div className="p-3 border-t border-border">
          <textarea
            value={notes}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={t('components.stepNotes.placeholder')}
            className="w-full bg-bg-elevated border border-border rounded-lg p-3 text-sm font-mono text-text-primary placeholder:text-text-muted/30 outline-none resize-none min-h-[80px] caret-accent"
            spellCheck={false}
          />
          {notes && (
            <button onClick={handleClear} className="mt-2 flex items-center gap-1 text-[10px] font-mono text-text-muted hover:text-red-400 transition-colors">
              <Trash2 className="h-3 w-3" /> {t('components.stepNotes.clearNotes')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default StepNotes;
