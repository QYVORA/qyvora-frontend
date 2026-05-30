import React from 'react';
import { Mail, Trash2 } from 'lucide-react';
import { ContactMessage } from '../../types/admin.types';

interface ContactsTabProps {
  contactMessages: ContactMessage[];
  updateContactStatus: (id: string, status: ContactMessage['status']) => Promise<void>;
  deleteContactMessage: (id: string) => Promise<void>;
}

const ContactsTab: React.FC<ContactsTabProps> = ({
  contactMessages,
  updateContactStatus,
  deleteContactMessage,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-xs font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-2">
        <Mail className="w-4 h-4 text-accent" />
        {contactMessages.length} intercept(s) in inbox
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-4">
        {contactMessages.length === 0 ? (
          <div className="text-center py-20 bg-bg-card border-2 border-dashed border-border rounded-2xl">
            <Mail className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
            <p className="text-sm text-text-muted font-bold uppercase tracking-widest">Signal silence (no messages)</p>
          </div>
        ) : contactMessages.map(item => (
          <div key={item.id} className="bg-bg-card border-2 border-border rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-black text-lg text-text-primary leading-tight">{item.name}</div>
                <div className="text-xs text-text-muted font-mono mt-0.5">{item.email}</div>
              </div>
              <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${item.status === 'new' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-bg border-border text-text-muted'}`}>
                {item.status}
              </span>
            </div>
            {item.subject && (
              <div className="text-sm font-black text-text-primary bg-bg/50 px-3 py-2 rounded-lg border border-border/50 uppercase tracking-tight">
                {item.subject}
              </div>
            )}
            <div className="text-sm text-text-secondary leading-relaxed bg-bg p-4 rounded-xl border border-border shadow-inner italic">
              "{item.message}"
            </div>
            <div className="flex gap-3 pt-2">
              <select
                value={item.status}
                onChange={e => void updateContactStatus(item.id, e.target.value as ContactMessage['status'])}
                className="flex-1 bg-bg border-2 border-border rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-text-primary min-h-[48px] focus:border-accent outline-none"
              >
                <option value="new">New Signal</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="archived">Archived</option>
              </select>
              <button onClick={() => void deleteContactMessage(item.id)} className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-red-500/20 text-red-400 hover:bg-red-400/10 transition-all active:scale-90">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden md:block bg-bg-card border-2 border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="border-b-2 border-border bg-bg/50 backdrop-blur-sm">
              <tr>
                {['From','Subject','Message','Status','Date','Actions'].map((h,i) => (
                  <th key={i} className={`px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {contactMessages.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-20 text-center">
                  <Mail className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
                  <p className="text-sm text-text-muted font-bold uppercase tracking-widest">Signal silence (no messages)</p>
                </td></tr>
              ) : contactMessages.map(item => (
                <tr key={item.id} className="align-top hover:bg-accent-dim/10 transition-colors group">
                  <td className="px-6 py-6 text-sm">
                    <div className="font-black text-text-primary group-hover:text-accent transition-colors leading-tight">{item.name}</div>
                    <div className="text-[11px] text-text-muted font-mono mt-0.5">{item.email}</div>
                  </td>
                  <td className="px-6 py-6 text-xs text-text-primary font-black uppercase tracking-tight max-w-[160px]">{item.subject || '—'}</td>
                  <td className="px-6 py-6 text-xs text-text-secondary max-w-[320px]">
                    <div className="line-clamp-3 leading-relaxed italic">"{item.message}"</div>
                  </td>
                  <td className="px-6 py-6">
                    <select
                      value={item.status}
                      onChange={e => void updateContactStatus(item.id, e.target.value as ContactMessage['status'])}
                      className={`bg-bg border-2 border-border rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest text-text-primary focus:border-accent outline-none transition-all ${item.status === 'new' ? 'border-accent/40 text-accent' : ''}`}
                    >
                      <option value="new">New Signal</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="px-6 py-6 text-[11px] text-text-muted font-mono whitespace-nowrap">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="px-6 py-6 text-right">
                    <button
                      onClick={() => void deleteContactMessage(item.id)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-red-500/20 text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-all active:scale-90 bg-bg-card shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactsTab;
