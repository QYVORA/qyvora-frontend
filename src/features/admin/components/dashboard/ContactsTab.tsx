import React, { useState } from 'react';
import { Mail, Trash2, Eye, Calendar, User, Tag, Info } from 'lucide-react';
import { ContactMessage } from '../../types/admin.types';
import { Dialog, DialogContent } from '../../../../shared/components/ui/Dialog';

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
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-accent border-accent/30 bg-accent/10';
      case 'in_progress': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      case 'resolved': return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'archived': return 'text-text-muted border-border bg-bg-card';
      default: return 'text-text-muted border-border bg-bg-card';
    }
  };

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
              <div className="min-w-0 flex-1">
                <div className="font-black text-lg text-text-primary leading-tight truncate">{item.name}</div>
                <div className="text-xs text-text-muted font-mono mt-0.5 truncate">{item.email}</div>
              </div>
              <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border shrink-0 ml-2 ${getStatusColor(item.status)}`}>
                {item.status.replace('_', ' ')}
              </span>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedMessage(item)}
                className="flex-1 flex items-center justify-center gap-2 bg-bg border border-border rounded-xl py-2.5 text-[10px] font-black uppercase tracking-widest text-text-primary hover:border-accent/50 transition-all"
              >
                <Eye className="w-3.5 h-3.5" /> View Detail
              </button>
              <button 
                onClick={() => void deleteContactMessage(item.id)} 
                className="w-11 h-11 flex items-center justify-center rounded-xl border border-red-500/20 text-red-400 hover:bg-red-400/10 transition-all active:scale-90"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <select
              value={item.status}
              onChange={e => void updateContactStatus(item.id, e.target.value as ContactMessage['status'])}
              className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-text-primary focus:border-accent outline-none"
            >
              <option value="new">Mark as New</option>
              <option value="in_progress">Mark In Progress</option>
              <option value="resolved">Mark Resolved</option>
              <option value="archived">Archive Signal</option>
            </select>
          </div>
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden md:block bg-bg-card border-2 border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="border-b-2 border-border bg-bg/50 backdrop-blur-sm">
              <tr>
                {['From','Subject','Status','Date','Actions'].map((h,i) => (
                  <th key={i} className={`px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ${i === 4 ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {contactMessages.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-20 text-center">
                  <Mail className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
                  <p className="text-sm text-text-muted font-bold uppercase tracking-widest">Signal silence (no messages)</p>
                </td></tr>
              ) : contactMessages.map(item => (
                <tr key={item.id} className="align-middle hover:bg-accent-dim/10 transition-colors group">
                  <td className="px-6 py-5 text-sm">
                    <div className="font-black text-text-primary group-hover:text-accent transition-colors leading-tight">{item.name}</div>
                    <div className="text-[11px] text-text-muted font-mono mt-0.5">{item.email}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-xs text-text-primary font-black uppercase tracking-tight truncate max-w-[200px]">
                      {item.subject || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <select
                      value={item.status}
                      onChange={e => void updateContactStatus(item.id, e.target.value as ContactMessage['status'])}
                      className={`bg-bg border border-border rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest text-text-primary focus:border-accent outline-none transition-all ${item.status === 'new' ? 'border-accent/40 text-accent' : ''}`}
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="px-6 py-5 text-[11px] text-text-muted font-mono whitespace-nowrap">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedMessage(item)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-border text-text-muted hover:text-accent hover:border-accent/40 transition-all active:scale-90 bg-bg shadow-sm"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => void deleteContactMessage(item.id)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-red-500/20 text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-all active:scale-90 bg-bg shadow-sm"
                        title="Delete Intercept"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Detail Modal ─────────────────────────────────────────────────── */}
      <Dialog open={selectedMessage !== null} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent title="Intercept Intelligence" maxWidth="max-w-2xl">
          {selectedMessage && (
            <div className="space-y-6">
              {/* Info Header */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-bg rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">
                    <User className="w-3 h-3 text-accent" /> Submitter
                  </div>
                  <div className="font-black text-text-primary">{selectedMessage.name}</div>
                  <div className="text-xs text-text-muted font-mono mt-1 break-all">{selectedMessage.email}</div>
                </div>

                <div className="bg-bg rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">
                    <Calendar className="w-3 h-3 text-accent" /> Timestamp
                  </div>
                  <div className="font-black text-text-primary">
                    {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleString() : 'Unavailable'}
                  </div>
                  <div className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-1">
                    Status: <span className={selectedMessage.status === 'new' ? 'text-accent' : 'text-text-primary'}>
                      {selectedMessage.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="bg-bg rounded-xl border border-border p-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">
                  <Tag className="w-3 h-3 text-accent" /> Subject Line
                </div>
                <div className="text-sm font-black text-text-primary uppercase tracking-tight">
                  {selectedMessage.subject || '(No subject provided)'}
                </div>
              </div>

              {/* Message Body */}
              <div className="bg-bg rounded-xl border border-border p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent/20" />
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted mb-4">
                  <Info className="w-3 h-3 text-accent" /> Decrypted Transmission
                </div>
                <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap font-mono italic">
                  "{selectedMessage.message}"
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center gap-3 pt-2">
                 <button 
                   onClick={() => setSelectedMessage(null)}
                   className="flex-1 btn-secondary !py-3 text-[10px] font-black uppercase tracking-widest"
                 >
                   Close Record
                 </button>
                 <select
                   value={selectedMessage.status}
                   onChange={e => {
                     void updateContactStatus(selectedMessage.id, e.target.value as ContactMessage['status']);
                     setSelectedMessage(prev => prev ? { ...prev, status: e.target.value as ContactMessage['status'] } : null);
                   }}
                   className={`flex-1 bg-bg border border-border rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-text-primary focus:border-accent outline-none ${selectedMessage.status === 'new' ? 'border-accent/40 text-accent' : ''}`}
                 >
                   <option value="new">Mark as New</option>
                   <option value="in_progress">Mark In Progress</option>
                   <option value="resolved">Mark Resolved</option>
                   <option value="archived">Archive Signal</option>
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
