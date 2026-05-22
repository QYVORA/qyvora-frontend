import React, { useState } from 'react';
import { X, Github, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../../../core/services/api';
import { useToast } from '../../../../core/contexts/ToastContext';

interface AssignmentSubmissionModalProps {
  moduleId: number;
  bootcampId: string;
  assignment: {
    title: string;
    description: string;
    details: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

const AssignmentSubmissionModal: React.FC<AssignmentSubmissionModalProps> = ({
  moduleId,
  bootcampId,
  assignment,
  onClose,
  onSuccess,
}) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    try {
      await api.post(`/student/modules/${moduleId}/assignment/submit`, {
        githubRepoUrl: url,
      });
      addToast('Assignment submitted successfully!', 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Failed to submit assignment', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border-2 border-border bg-bg-card shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-dim border border-accent/20">
              <Github className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-black text-text-primary">Phase Assignment</h2>
              <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Module {moduleId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-text-muted hover:bg-bg hover:text-text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-base font-black text-accent">{assignment.title}</h3>
            <p className="text-sm leading-relaxed text-text-secondary">{assignment.description}</p>
          </div>

          <div className="rounded-2xl bg-bg/50 border border-border p-4">
            <h4 className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-primary">
              <AlertCircle className="h-3.5 w-3.5 text-accent" />
              Submission Details
            </h4>
            <p className="text-xs leading-relaxed text-text-muted">{assignment.details}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="repo-url" className="text-xs font-black uppercase tracking-widest text-text-muted">
                GitHub Repository URL
              </label>
              <div className="relative">
                <Github className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
                <input
                  id="repo-url"
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full rounded-2xl border-2 border-border bg-bg py-4 pl-12 pr-4 text-sm font-bold text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="btn-primary flex w-full items-center justify-center gap-2 py-4 text-base font-black uppercase disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Submit Assignment
                </>
              )}
            </button>
          </form>
        </div>

        <div className="bg-bg/50 border-t border-border p-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
            The instructor will review your repository. Ensure it is public or accessible.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AssignmentSubmissionModal;
