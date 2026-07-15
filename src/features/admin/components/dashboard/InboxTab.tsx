import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { IconShield, IconSearch } from '@/shared/components/icons';
import api from '@/core/services/api';
import { useToast } from '@/core/contexts/ToastContext';
import type { ContactMessage, ServiceRequestItem } from '../../types/admin.types';
import { Skeleton } from '@/shared/components/ui';
import { Dialog, DialogContent, ConfirmDialog } from '@/shared/components/ui/Dialog';

type InboxItem = {
  type: 'contact' | 'service';
  data: ContactMessage | ServiceRequestItem;
};

const InboxTab = () => {
  const { addToast } = useToast();
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'contact' | 'service'>('all');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<InboxItem | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState<InboxItem | null>(null);
  const limit = 25;

  const fetchAll = async (p = 1) => {
    setLoading(true);
    try {
      const [contactsRes, servicesRes] = await Promise.all([
        api.get(`/admin/contact-messages?limit=${limit}&page=${p}`),
        api.get(`/admin/service-requests?limit=${limit}&page=${p}`),
      ]);

      const contacts = (contactsRes.data?.items || []).map((d: any) => ({ type: 'contact' as const, data: d }));
      const services = (servicesRes.data?.items || []).map((d: any) => ({ type: 'service' as const, data: d }));

      let merged = [...contacts, ...services].sort(
        (a, b) => new Date(b.data.createdAt || 0).getTime() - new Date(a.data.createdAt || 0).getTime()
      );

      if (filter !== 'all') merged = merged.filter((i) => i.type === filter);
      if (statusFilter) merged = merged.filter((i) => i.data.status === statusFilter);
      if (search.trim()) {
        const q = search.toLowerCase();
        merged = merged.filter(
          (i) =>
            i.data.name?.toLowerCase().includes(q) ||
            i.data.email?.toLowerCase().includes(q)
        );
      }

      setItems(merged);
      setTotal(merged.length);
    } catch {
      addToast('Failed to load inbox', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(page); }, [page, filter]);

  const updateContactStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/contact-messages/${id}`, { status });
      addToast('Updated', 'success');
      fetchAll(page);
    } catch { addToast('Failed to update', 'error'); }
  };

  const updateServiceStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/service-requests/${id}`, { status });
      addToast('Updated', 'success');
      fetchAll(page);
    } catch { addToast('Failed to update', 'error'); }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    const id = confirmDelete.data.id;
    const endpoint = confirmDelete.type === 'contact' ? 'contact-messages' : 'service-requests';
    try {
      await api.delete(`/admin/${endpoint}/${id}`);
      addToast('Deleted', 'success');
      fetchAll(page);
    } catch { addToast('Failed to delete', 'error'); }
    finally { setConfirmDelete(null); }
  };

  const requestDelete = (item: InboxItem) => setConfirmDelete(item);

  const statusOptions = {
    contact: ['new', 'in_progress', 'resolved', 'archived'],
    service: ['new', 'contacted', 'qualified', 'closed', 'archived'],
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          {(['all', 'contact', 'service'] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors ${
                filter === f ? 'bg-accent text-bg' : 'border border-border text-text-muted hover:border-accent/30 hover:text-accent'
              }`}
            >
              {f === 'all' ? 'All' : f === 'contact' ? 'Contact' : 'Service'}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <IconSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-bg border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-text-primary focus:border-accent outline-none transition-colors"
          />
        </div>
        <span className="text-xs text-text-muted font-mono">{total} items</span>
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-14 rounded-xl bg-bg-card border border-border animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/30 py-12 text-center">
          <Mail className="mx-auto mb-3 h-10 w-10 text-text-muted opacity-30" />
          <p className="text-sm text-text-muted font-bold">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const isContact = item.type === 'contact';
            const d = item.data;
            return (
              <div
                key={`${item.type}-${d.id}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-bg-card hover:border-accent/20 transition-all cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isContact ? 'bg-blue-500/10' : 'bg-accent/10'}`}>
                  {isContact ? <Mail className="w-4 h-4 text-blue-400" /> : <IconShield size={16} className="text-accent" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text-primary truncate">{d.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      isContact ? 'bg-blue-500/10 text-blue-400' : 'bg-accent/10 text-accent'
                    }`}>
                      {isContact ? 'Contact' : 'Service'}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      d.status === 'new' ? 'bg-accent/10 text-accent' :
                      d.status === 'archived' ? 'bg-zinc-500/10 text-zinc-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {d.status}
                    </span>
                  </div>
                  <div className="text-xs text-text-muted font-mono truncate mt-0.5">{d.email}</div>
                </div>
                <div className="text-[10px] text-text-muted font-mono shrink-0">
                  {new Date(d.createdAt || '').toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={selectedItem !== null} onOpenChange={(o) => { if (!o) setSelectedItem(null); }}>
        <DialogContent title={selectedItem?.data.name || ''} maxWidth="max-w-2xl">
          {selectedItem && (() => {
            const isContact = selectedItem.type === 'contact';
            const d = selectedItem.data;
            return (
              <div className="space-y-5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                    isContact ? 'bg-blue-500/10 text-blue-400' : 'bg-accent/10 text-accent'
                  }`}>
                    {isContact ? 'Contact Message' : 'Service Inquiry'}
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                    d.status === 'new' ? 'bg-accent/10 text-accent' :
                    d.status === 'archived' ? 'bg-zinc-500/10 text-zinc-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    {d.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Name</span>
                    <span className="font-bold text-text-primary">{d.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Email</span>
                    <span className="font-mono text-text-primary">{d.email}</span>
                  </div>
                  {!isContact && (
                    <>
                      <div>
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Business</span>
                        <span className="text-text-primary">{(d as any).businessName || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Phone</span>
                        <span className="text-text-primary">{(d as any).phone || '—'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Website</span>
                        <span className="text-text-primary font-mono text-xs">{(d as any).websiteUrl || '—'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Package / Service Type</span>
                        <span className="text-text-primary">{(d as any).packageTier || (d as any).serviceType || '—'}</span>
                      </div>
                    </>
                  )}
                  {isContact && (
                    <div className="col-span-2">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Subject</span>
                      <span className="text-text-primary">{(d as any).subject || '—'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2">Message</span>
                  <div className="rounded-xl border border-border bg-bg p-4 text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {d.message || 'No message'}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border/20">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Update Status:</span>
                  {(isContact ? statusOptions.contact : statusOptions.service).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        if (isContact) updateContactStatus(d.id, s);
                        else updateServiceStatus(d.id, s);
                        setSelectedItem(null);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        d.status === s ? 'bg-accent text-bg' : 'border border-border text-text-muted hover:border-accent/30 hover:text-accent'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                    <button
                      onClick={() => {
                        requestDelete(selectedItem!);
                        setSelectedItem(null);
                      }}
                      className="ml-auto px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-red-400/30 text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      Delete
                    </button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmDelete !== null}
        onOpenChange={(o) => { if (!o) setConfirmDelete(null); }}
        title="Delete Message"
        description={`Are you sure you want to delete this ${confirmDelete?.type === 'contact' ? 'contact message' : 'service request'}? This action is irreversible.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default InboxTab;
