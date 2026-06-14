import { useState } from 'react';
import { Flag, Loader2 } from 'lucide-react';
import api from '../../../../core/services/api';
import { useToast } from '../../../../core/contexts/ToastContext';
import { Dialog, DialogContent } from '../../../../shared/components/ui/Dialog';

interface Props {
  phaseId: string;
  roomId: string;
  stepIdx: number;
  onClose: () => void;
}

const ReportIssueModal: React.FC<Props> = ({ phaseId, roomId, stepIdx, onClose }) => {
  const [issueText, setIssueText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const submit = async () => {
    if (!issueText.trim()) {
      addToast('Please describe the issue', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/student/report-issue', {
        type: 'bootcamp_room',
        phaseId,
        roomId,
        stepIdx,
        description: issueText,
        url: window.location.href,
      });
      addToast('Issue reported — thank you!', 'success');
      onClose();
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Could not submit report', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent title="Report Issue" maxWidth="max-w-xl" className="shadow-none">
        <div className="flex items-center gap-2 mb-4">
          <Flag className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">Room Feedback</h3>
        </div>
        <p className="text-sm text-text-muted mb-4">
          Found a typo, broken image, or unclear instruction? Let us know and we'll fix it.
        </p>
        <textarea
          value={issueText}
          onChange={(e) => setIssueText(e.target.value)}
          placeholder="Describe the issue..."
          className="w-full h-32 px-4 py-3 rounded-xl border border-border bg-bg text-text-primary text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/50"
          autoFocus
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={submit}
            disabled={submitting || !issueText.trim()}
            className="btn-primary flex-1 py-2.5 text-sm disabled:opacity-50"
          >
            {submitting
              ? <><Loader2 className="h-3.5 w-3.5 animate-spin inline mr-2" />Submitting...</>
              : 'Submit Report'}
          </button>
          <button onClick={onClose} className="btn-secondary px-4 py-2.5 text-sm">
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportIssueModal;
