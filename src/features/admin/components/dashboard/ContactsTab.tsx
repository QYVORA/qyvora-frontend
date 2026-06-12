import React, { useState } from 'react';
import { Mail, Trash2, Eye, Calendar, User, Tag, Info } from 'lucide-react';
import { ContactMessage } from '../../types/admin.types';
import { Dialog, DialogContent } from '../../../../shared/components/ui/Dialog';

interface ContactsTabProps { contactMessages: ContactMessage[]; updateContactStatus: (id: string, status: ContactMessage['status']) => Promise<void>; deleteContactMessage: (id: string) => Promise<void>; }

const ContactsTab: React.FC<ContactsTabProps> = ({ contactMessages, updateContactStatus, deleteContactMessage }) => {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-accent bg-accent/10';
      case 'in_progress': return 'text-blue-400 bg-blue-400/10';
      case 'resolved': return 'text-green-400 bg-green-400/10';
      case 'archived': return 'text-text-muted bg-bg-elevated';
      default: return 'text-text-muted bg-bg-elevated';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/60 flex items-center gap-2 px-1">
        <Mail className="w-4 h-4 text-accent" /> {contactMessages.length} intercept(s) in inbox
      </div>

      <div className="md:hidden space-y-6">
        {contactMessages.length === 0 ? (
          <div className="text-center py-20 bg-bg-card border-2 border-dashed border-border/20 rounded-2xl mx-1">
            <Mail className="w-12 h-12 text-text-muted/20 mx-auto mb-4" />
            <p className="text-sm text-text-muted/60 font-black uppercase tracking-widest">Signal silence</p>
          </div>
        ) : contactMessages.map(item => (
          <div key={item.id} className="bg-bg-card border border-border/40 rounded-2xl p-5 space-y-4 shadow-lg shadow-black/5">
            <div className="flex justify-between items-start">
              <div className="min-w-0 flex-1 px-1">
                <div className="font-black text-lg text-text-primary leading-tight truncate">{item.name}</div>
                <div className="text-xs text-text-muted/60 font-mono mt-0.5 truncate">{item.email}</div>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shrink-0 ml-2 border ${getStatusColor(item.status)}`}>
                {item.status.replace('_', ' ')}
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSelectedMessage(item)} className="flex-1 flex items-center justify-center gap-2 bg-bg border border-border/60 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest text-text-primary active:scale-95 shadow-sm"><Eye className="w-4 h-4 text-accent" /> View Intelligence</button>
              <button onClick={() => void deleteContactMessage(item.id)} className="w-12 h-12 flex items-center justify-center rounded-xl border border-red-500/20 text-red-400/60 active:scale-90 shadow-sm bg-bg"><Trash2 className="w-4.5 h-4.5" /></button>
            </div>
            <select value={item.status} onChange={e => void updateContactStatus(item.id, e.target.value as ContactMessage['status'])} className="w-full bg-bg border border-border/60 rounded-xl px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-text-primary outline-none cursor-pointer shadow-sm">
              <option value="new">Mark: NEW</option>
              <option value="in_progress">Mark: IN PROGRESS</option>
              <option value="resolved">Mark: RESOLVED</option>
              <option value="archived">Mark: ARCHIVED</option>
            </select>
          </div>
        ))}
      </div>

      <div className="hidden md:block bg-bg-card border border-border/40 rounded-2xl overflow-hidden shadow-xl shadow-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-bg-elevated/50 border-b border-border/40 backdrop-blur-sm">
              <tr>{['From','Subject','Status','Date','Actions'].map((h,i) => <th key={i} className={`px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-text-muted/60 ${i === 4 ? 'text-right' : ''}`}>{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {contactMessages.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-20 text-center"><Mail className="w-12 h-12 text-text-muted/20 mx-auto mb-4" /><p className="text-sm text-text-muted/60 font-black uppercase tracking-widest">Signal silence</p></td></tr>
              ) : contactMessages.map(item => (
                <tr key={item.id} className="align-middle hover:bg-accent-dim/5 transition-colors group">
                  <td className="px-6 py-6 text-sm"><div className="font-black text-text-primary group-hover:text-accent transition-colors leading-tight">{item.name}</div><div className="text-[11px] text-text-muted/60 font-mono mt-0.5">{item.email}</div></td>
                  <td className="px-6 py-6"><div className="text-xs text-text-primary font-black uppercase tracking-tight truncate max-w-[200px]">{item.subject || '—'}</div></td>
                  <td className="px-6 py-6"><select value={item.status} onChange={e => void updateContactStatus(item.id, e.target.value as ContactMessage['status'])} className={`bg-bg border border-border/60 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-text-primary outline-none transition-all cursor-pointer ${item.status === 'new' ? 'text-accent border-accent/40' : ''}`}><option value="new">New</option><option value="in_progress">Progress</option><option value="resolved">Resolved</option><option value="archived">Archived</option></select></td>
                  <td className="px-6 py-6 text-[11px] text-text-muted/60 font-mono whitespace-nowrap">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="px-6 py-6 text-right"><div className="flex items-center justify-end gap-3"><button onClick={() => setSelectedMessage(item)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg border border-border/60 text-text-muted hover:text-accent transition-all active:scale-90 shadow-sm" title="View Details"><Eye className="w-4.5 h-4.5" /></button><button onClick={() => void deleteContactMessage(item.id)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg border border-red-500/20 text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all active:scale-90 shadow-sm" title="Delete Intercept"><Trash2 className="w-4.5 h-4.5" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={selectedMessage !== null} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent title="Intercept Intelligence" maxWidth="max-w-2xl">
          {selectedMessage && (
            <div className="space-y-8 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-bg-elevated rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted/60 mb-3"><User className="w-3.5 h-3.5 text-accent" /> Submitter</div>
                  <div className="font-black text-text-primary">{selectedMessage.name}</div>
                  <div className="text-xs text-text-muted/80 font-mono mt-1 break-all tracking-tighter">{selectedMessage.email}</div>
                </div>
                <div className="bg-bg-elevated rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted/60 mb-3"><Calendar className="w-3.5 h-3.5 text-accent" /> Timestamp</div>
                  <div className="font-black text-text-primary">{selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleString() : 'Unavailable'}</div>
                  <div className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-2">Status: <span className={selectedMessage.status === 'new' ? 'text-accent' : 'text-text-primary'}>{selectedMessage.status.replace('_', ' ')}</span></div>
                </div>
              </div>
              <div className="bg-bg-elevated rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted/60 mb-3"><Tag className="w-3.5 h-3.5 text-accent" /> Subject Line</div>
                <div className="text-sm font-black text-text-primary uppercase tracking-tight">{selectedMessage.subject || '(No subject provided)'}</div>
              </div>
              <div className="bg-bg-elevated rounded-xl p-7 relative overflow-hidden shadow-sm ring-1 ring-white/5">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-accent" />
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted/60 mb-5"><Info className="w-3.5 h-3.5 text-accent" /> Decrypted Transmission</div>
                <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap font-mono italic">"{selectedMessage.message}"</div>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                 <button onClick={() => setSelectedMessage(null)} className="flex-1 bg-bg-elevated text-text-muted py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:text-text-primary active:scale-95">Dismiss Record</button>
                 <select value={selectedMessage.status} onChange={e => { void updateContactStatus(selectedMessage.id, e.target.value as ContactMessage['status']); setSelectedMessage(prev => prev ? { ...prev, status: e.target.value as ContactMessage['status'] } : null); }} className={`flex-1 bg-accent text-bg rounded-xl px-5 py-4 text-[10px] font-black uppercase tracking-widest outline-none shadow-lg shadow-accent/20 cursor-pointer`}>
                   <option value="new">Mark: NEW</option><option value="in_progress">Mark: PROGRESS</option><option value="resolved">Mark: RESOLVED</option><option value="archived">Mark: ARCHIVED</option>
                 </select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactsTab;
