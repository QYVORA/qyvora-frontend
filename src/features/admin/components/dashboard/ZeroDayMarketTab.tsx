import React, { useState, useRef } from 'react';
import { RefreshCw, Search, Trash2 } from 'lucide-react';
import { CPProduct } from '../../types/admin.types';
import { resolveImg } from '../../../../shared/utils/resolveImg';
import CpLogo from '../../../../shared/components/CpLogo';

interface ZeroDayMarketTabProps {
  products: CPProduct[];
  saveProduct: (product: any, coverFile: File | null, productFile: File | null) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ZeroDayMarketTab: React.FC<ZeroDayMarketTabProps> = ({
  products,
  saveProduct,
  deleteProduct,
}) => {
  const [productForm, setProductForm] = useState({
    id: '', title: '', description: '', cpPrice: 0, type: 'book',
    sortOrder: 0, isActive: true, isFree: false,
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const productFormRef = useRef<HTMLDivElement>(null);

  const resetProductForm = () => {
    setProductForm({ id: '', title: '', description: '', cpPrice: 0, type: 'book', sortOrder: 0, isActive: true, isFree: false });
    setCoverFile(null); setProductFile(null);
  };

  const editProduct = (item: CPProduct) => {
    setProductForm({
      id: item._id,
      title: item.title || '',
      description: item.description || '',
      cpPrice: Number(item.cpPrice || 0),
      type: item.type || 'book',
      sortOrder: Number(item.sortOrder || 0),
      isActive: item.isActive !== false,
      isFree: item.isFree === true,
    });
    setCoverFile(null);
    setProductFile(null);
    setTimeout(() => {
      productFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveProduct(productForm, coverFile, productFile);
      resetProductForm();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Form */}
      <div
        ref={productFormRef}
        className={`bg-bg-card rounded-2xl p-6 md:p-8 space-y-6 border-2 transition-all duration-300 shadow-xl ${
          productForm.id ? 'border-accent/40 shadow-accent/5' : 'border-border'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          <div className={`text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 ${productForm.id ? 'text-accent' : 'text-text-muted'}`}>
            {productForm.id ? <><RefreshCw className="w-4 h-4 animate-spin-slow" /> Editing: {productForm.title}</> : 'Initialize New Asset'}
          </div>
          {productForm.id && (
            <button onClick={resetProductForm} className="text-[10px] font-black text-text-muted hover:text-accent uppercase tracking-[0.2em] transition-colors border border-border px-3 py-1.5 rounded-lg hover:border-accent/30">
              ✕ Cancel Protocol
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <label className="block space-y-2">
              <span className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em]">Asset Title *</span>
              <input value={productForm.title} onChange={e => setProductForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Linux Hacking Handbook" className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:border-accent outline-none transition-colors" />
            </label>
            <label className="block space-y-2">
              <span className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em]">Asset Intelligence (Description)</span>
              <textarea value={productForm.description} onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))} placeholder="Detailed product telemetry…" rows={4} className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:border-accent outline-none transition-colors resize-none" />
            </label>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <label className="block space-y-2">
                <span className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em]">
                  CP Valuation {productForm.isFree && <span className="text-accent">(zero cost)</span>}
                </span>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={productForm.isFree ? 0 : productForm.cpPrice}
                    onChange={e => setProductForm(p => ({ ...p, cpPrice: Number(e.target.value || 0) }))}
                    disabled={productForm.isFree}
                    className="w-full bg-bg border-2 border-border rounded-xl pl-4 pr-10 py-3 text-sm text-text-primary focus:border-accent outline-none transition-colors disabled:opacity-40"
                  />
                  <CpLogo className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                </div>
              </label>
              <label className="block space-y-2">
                <span className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em]">Sequence Order</span>
                <input type="number" min={0} value={productForm.sortOrder} onChange={e => setProductForm(p => ({ ...p, sortOrder: Number(e.target.value || 0) }))} placeholder="0" className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:border-accent outline-none transition-colors" />
              </label>
            </div>
            <label className="block space-y-2">
              <span className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em]">Classification (Type)</span>
              <input value={productForm.type} onChange={e => setProductForm(p => ({ ...p, type: e.target.value }))} placeholder="book / tool / guide / network-map" className="w-full bg-bg border-2 border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:border-accent outline-none transition-colors" />
            </label>
            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-text-secondary cursor-pointer group">
                <input type="checkbox" checked={productForm.isActive} onChange={e => setProductForm(p => ({ ...p, isActive: e.target.checked }))} className="accent-accent w-5 h-5 rounded-lg border-2 border-border" />
                <span className="group-hover:text-accent transition-colors">Deployment Active</span>
              </label>
              <label className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-text-secondary cursor-pointer group">
                <input type="checkbox" checked={productForm.isFree} onChange={e => setProductForm(p => ({ ...p, isFree: e.target.checked, cpPrice: e.target.checked ? 0 : p.cpPrice }))} className="accent-accent w-5 h-5 rounded-lg border-2 border-border" />
                <span className="group-hover:text-accent transition-colors">Public Domain (Free)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border/50">
          <label className="block space-y-2">
            <span className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em]">Visual Identification (Cover Image)</span>
            <div className="relative group">
              <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] || null)} className="block w-full text-[10px] text-text-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-2 file:border-border file:bg-bg file:text-[10px] file:font-black file:uppercase file:tracking-widest file:text-text-primary file:cursor-pointer hover:file:border-accent/40 file:transition-all" />
            </div>
          </label>
          <label className="block space-y-2">
            <span className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em]">Data Core (Product PDF) *</span>
            <div className="relative group">
              <input type="file" accept="application/pdf" onChange={e => setProductFile(e.target.files?.[0] || null)} className="block w-full text-[10px] text-text-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-2 file:border-border file:bg-bg file:text-[10px] file:font-black file:uppercase file:tracking-widest file:text-text-primary file:cursor-pointer hover:file:border-accent/40 file:transition-all" />
            </div>
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-4 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-accent/10 transition-all active:scale-[0.98] disabled:opacity-50">
            {saving ? 'Processing...' : productForm.id ? 'Authorize Update' : 'Initialize Asset'}
          </button>
          <button onClick={resetProductForm} className="px-8 rounded-2xl border-2 border-border text-xs font-black uppercase tracking-[0.2em] text-text-muted hover:border-accent/30 hover:text-accent transition-all active:scale-[0.98]">
            Purge
          </button>
        </div>
      </div>

      {/* Product list — mobile */}
      <div className="md:hidden space-y-4">
        {products.map(item => (
          <div key={item._id} className="bg-bg-card border-2 border-border rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-border shrink-0 bg-bg shadow-inner">
                <img
                  src={resolveImg(item.coverUrl, '/assets/sections/backgrounds/process-earn.webp')}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const el = e.currentTarget;
                    if (!el.dataset.fallbackApplied) {
                      el.dataset.fallbackApplied = '1';
                      el.src = '/assets/sections/backgrounds/process-earn.webp';
                    }
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-black text-base text-text-primary leading-tight">{item.title}</div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="px-1.5 py-0.5 rounded bg-accent-dim text-[8px] font-black uppercase tracking-widest text-accent border border-accent/10">{item.type}</span>
                  <span className="text-[10px] font-mono font-bold text-text-secondary inline-flex items-center gap-1">
                    {item.isFree ? <span className="text-accent">FREE</span> : <>{item.cpPrice} <CpLogo className="w-3 h-3" /></>}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${item.isActive ? 'bg-accent/10 text-accent border-accent/20' : 'bg-red-400/10 text-red-400 border-red-400/20'}`}>
                    {item.isActive ? 'Active' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => editProduct(item)}
                className="btn-primary py-2.5 bg-transparent border-border text-text-muted hover:text-accent hover:border-accent/40 text-[10px] font-black uppercase tracking-widest"
              >Modify</button>
              <button onClick={() => void deleteProduct(item._id)} className="btn-primary py-2.5 bg-transparent border-red-500/20 text-red-400 hover:bg-red-400/10 text-[10px] font-black uppercase tracking-widest">Terminate</button>
            </div>
          </div>
        ))}
      </div>

      {/* Product list — desktop */}
      <div className="hidden md:block bg-bg-card border-2 border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead className="border-b-2 border-border bg-bg/50 backdrop-blur-sm">
              <tr>
                {['Asset','Title','Valuation','Classification','Status','Actions'].map(h => (
                  <th key={h} className={`px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {products.map(item => (
                <tr key={item._id} className="hover:bg-accent-dim/10 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-border bg-bg shrink-0 shadow-lg group-hover:border-accent/40 transition-all">
                      <img
                        src={resolveImg(item.coverUrl, '/assets/sections/backgrounds/process-earn.webp')}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          const el = e.currentTarget;
                          if (!el.dataset.fallbackApplied) {
                            el.dataset.fallbackApplied = '1';
                            el.src = '/assets/sections/backgrounds/process-earn.webp';
                          }
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-black text-base text-text-primary group-hover:text-accent transition-colors">{item.title}</div>
                    <div className="text-[10px] text-text-muted font-mono mt-0.5 uppercase tracking-widest">ID: {String(item._id).slice(-8)}</div>
                  </td>
                  <td className="px-6 py-5">
                    {item.isFree ? (
                      <span className="text-[10px] font-black text-accent bg-accent/10 px-2 py-1 rounded border border-accent/20 uppercase tracking-widest">Free Access</span>
                    ) : (
                      <div className="flex items-center gap-2 font-mono font-bold text-text-primary">
                        <CpLogo className="w-4 h-4" />
                        {Number(item.cpPrice || 0).toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2 py-1 rounded bg-accent-dim/50 text-[10px] font-black uppercase tracking-widest text-accent border border-accent/10 whitespace-nowrap">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.isActive ? 'bg-accent animate-pulse' : 'bg-red-500'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${item.isActive ? 'text-accent' : 'text-red-400'}`}>
                        {item.isActive ? 'Operational' : 'Offline'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="inline-flex gap-3">
                      <button
                        onClick={() => editProduct(item)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-border text-text-muted hover:border-accent/40 hover:text-accent transition-all active:scale-90 bg-bg-card shadow-sm"
                      ><Search className="w-4 h-4" /></button>
                      <button
                        onClick={() => void deleteProduct(item._id)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-red-500/20 text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-all active:scale-90 bg-bg-card shadow-sm"
                      ><Trash2 className="w-4 h-4" /></button>
                    </div>
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

export default ZeroDayMarketTab;
