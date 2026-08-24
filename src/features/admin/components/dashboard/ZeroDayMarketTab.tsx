import React, { useState, useRef } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { IconSearch } from '@/shared/components/icons';
import { CPProduct } from '../../types/admin.types';
import { INPUT_CLS } from '../../types/admin.types';
import type { SectionStatus } from '../../pages/AdminDashboardPage';
import { AuthImage, ErrorState } from '@/shared/components/ui';
import CpLogo from '@/shared/components/CpLogo';
import { DataTable } from '@/shared/components/dashboard';
import type { Column } from '@/shared/components/dashboard';

interface ZeroDayMarketTabProps {
  products: CPProduct[];
  status?: SectionStatus;
  onRetry?: () => void;
  saveProduct: (product: any, coverFile: File | null, productFile: File | null) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ZeroDayMarketTab: React.FC<ZeroDayMarketTabProps> = ({
  products, status = 'loaded', onRetry, saveProduct, deleteProduct,
}) => {
  const { t } = useTranslation();
  const [productForm, setProductForm] = useState({ id: '', title: '', description: '', cpPrice: 0, type: 'book', sortOrder: 0, isActive: true, isFree: false });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const productFormRef = useRef<HTMLDivElement>(null);

  const resetProductForm = () => {
    setProductForm({ id: '', title: '', description: '', cpPrice: 0, type: 'book', sortOrder: 0, isActive: true, isFree: false });
    setCoverFile(null); setProductFile(null);
  };

  const editProduct = (item: CPProduct) => {
    setProductForm({ id: item._id, title: item.title || '', description: item.description || '', cpPrice: Number(item.cpPrice || 0), type: item.type || 'book', sortOrder: Number(item.sortOrder || 0), isActive: item.isActive !== false, isFree: item.isFree === true });
    setCoverFile(null); setProductFile(null);
    setTimeout(() => { productFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
  };

  const handleSave = async () => {
    setSaving(true);
    try { await saveProduct(productForm, coverFile, productFile); resetProductForm(); }
    finally { setSaving(false); }
  };

  const columns: Column<CPProduct>[] = [
    {
      key: 'title',
      header: t('admin.market.asset'),
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-border/40 shrink-0">
            <AuthImage src={item.coverUrl} alt={item.title} width={56} height={56} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="min-w-0">
            <div className="font-black text-base text-text-primary group-hover:text-accent transition-colors">{item.title}</div>
            <div className="text-[10px] text-text-muted/40 font-mono mt-0.5 uppercase tracking-widest">ID: {String(item._id).slice(-8)}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'cpPrice',
      header: t('admin.market.valuation'),
      sortable: true,
      render: (item) => (
        item.isFree
          ? <span className="text-[9px] font-black text-accent bg-accent/10 px-2.5 py-1 rounded-lg uppercase tracking-widest border border-accent/20">{t('admin.market.freeAccess')}</span>
          : <div className="flex items-center gap-2 font-mono font-bold text-text-primary"><CpLogo className="w-4 h-4" />{Number(item.cpPrice || 0).toLocaleString()}</div>
      ),
    },
    {
      key: 'type',
      header: t('admin.market.classification'),
      render: (item) => (
        <span className="px-2.5 py-1 rounded-lg bg-accent-dim text-[9px] font-black uppercase tracking-widest text-accent whitespace-nowrap border border-accent/10">{item.type}</span>
      ),
    },
    {
      key: 'isActive',
      header: t('admin.market.status'),
      render: (item) => (
        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${item.isActive ? 'bg-accent/10 text-accent border-accent/20' : 'bg-red-400/10 text-red-400 border-red-400/20'}`}>
          {item.isActive ? t('admin.market.operational') : t('badge.offline')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: t('admin.market.actions'),
      className: 'text-right',
      headerClassName: 'text-right',
      render: (item) => (
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => editProduct(item)}
            aria-label={t('admin.market.modify')}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl bg-bg-elevated text-text-muted hover:text-accent transition-all active:scale-90"
          >
            <IconSearch size={18} />
          </button>
          <button
            onClick={() => void deleteProduct(item._id)}
            aria-label={t('admin.market.terminate')}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl bg-red-500/5 text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all active:scale-90"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        </div>
      ),
    },
  ];

  const mobileCard = (item: CPProduct) => (
    <div className="bg-bg-card border border-border/40 rounded-2xl p-5 space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-border/40"><AuthImage src={item.coverUrl} alt={item.title} width={80} height={80} className="w-full h-full object-cover" loading="lazy" /></div>
        <div className="min-w-0 flex-1">
          <div className="font-black text-base text-text-primary leading-tight">{item.title}</div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-lg bg-accent-dim text-[8px] font-black uppercase tracking-widest text-accent border border-accent/10">{item.type}</span>
            <span className="text-[10px] font-mono font-bold text-text-secondary inline-flex items-center gap-1">{item.isFree ? <span className="text-accent">{t('admin.market.freeAccess')}</span> : <>{item.cpPrice} <CpLogo className="w-3 h-3" /></>}</span>
            <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${item.isActive ? 'bg-accent/10 text-accent border-accent/20' : 'bg-red-400/10 text-red-400 border-red-400/20'}`}>{item.isActive ? t('badge.active') : t('badge.offline')}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button onClick={() => editProduct(item)} className="btn-secondary py-3 active:scale-95">{t('admin.market.modify')}</button>
        <button onClick={() => void deleteProduct(item._id)} className="py-3 rounded-xl border border-red-500/20 text-red-400/60 hover:bg-red-500/10 hover:text-red-400 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">{t('admin.market.terminate')}</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {status === 'error' && (
        <ErrorState message={t('admin.market.unavailable')} title={t('admin.dataUnavailable')} />
      )}

      <div ref={productFormRef} className={`rounded-2xl p-6 md:p-8 space-y-6 transition-all duration-300 border border-border/40 ${productForm.id ? 'bg-accent/5' : 'bg-bg-card'}`}>
        <div className="flex items-center justify-between pb-4">
          <div className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${productForm.id ? 'text-accent' : 'text-text-muted'}`}>{productForm.id ? <><RefreshCw className="w-4 h-4 animate-spin-slow" /> {t('admin.market.editingAsset')}: {productForm.title}</> : t('admin.market.initializeNewAsset')}</div>
          {productForm.id && <button onClick={resetProductForm} className="text-[9px] font-black text-text-muted hover:text-accent uppercase tracking-[0.2em] transition-colors border border-border/40 px-3 py-1 rounded-lg">{t('admin.market.abortProtocol')}</button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <label className="block space-y-2"><span className="text-[9px] font-black uppercase text-text-muted/60 tracking-[0.2em]">{t('admin.market.assetTitle')} *</span><input value={productForm.title} onChange={e => setProductForm(p => ({ ...p, title: e.target.value }))} placeholder={t('admin.market.assetTitlePlaceholder')} className={INPUT_CLS} /></label>
            <label className="block space-y-2"><span className="text-[9px] font-black uppercase text-text-muted/60 tracking-[0.2em]">{t('admin.market.assetDescription')}</span><textarea value={productForm.description} onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))} placeholder={t('admin.market.assetDescriptionPlaceholder')} rows={4} className={`${INPUT_CLS} resize-none`} /></label>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <label className="block space-y-2"><span className="text-[9px] font-black uppercase text-text-muted/60 tracking-[0.2em]">{t('admin.market.cpValuation')} {productForm.isFree && <span className="text-accent">({t('admin.market.zeroCost')})</span>}</span><div className="relative"><input type="number" min={0} value={productForm.isFree ? 0 : productForm.cpPrice} onChange={e => setProductForm(p => ({ ...p, cpPrice: Number(e.target.value || 0) }))} disabled={productForm.isFree} className={`${INPUT_CLS} pr-10 disabled:opacity-50`} /><CpLogo className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" /></div></label>
              <label className="block space-y-2"><span className="text-[9px] font-black uppercase text-text-muted/60 tracking-[0.2em]">{t('admin.market.sequenceOrder')}</span><input type="number" min={0} value={productForm.sortOrder} onChange={e => setProductForm(p => ({ ...p, sortOrder: Number(e.target.value || 0) }))} placeholder="0" className={INPUT_CLS} /></label>
            </div>
            <label className="block space-y-2"><span className="text-[9px] font-black uppercase text-text-muted/60 tracking-[0.2em]">{t('admin.market.classification')}</span><input value={productForm.type} onChange={e => setProductForm(p => ({ ...p, type: e.target.value }))} placeholder={t('admin.market.classificationPlaceholder')} className={INPUT_CLS} /></label>
            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-text-secondary cursor-pointer group"><input type="checkbox" checked={productForm.isActive} onChange={e => setProductForm(p => ({ ...p, isActive: e.target.checked }))} className="accent-accent w-4.5 h-4.5" /><span className="group-hover:text-accent transition-colors">{t('admin.market.deploymentActive')}</span></label>
              <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-text-secondary cursor-pointer group"><input type="checkbox" checked={productForm.isFree} onChange={e => setProductForm(p => ({ ...p, isFree: e.target.checked, cpPrice: e.target.checked ? 0 : p.cpPrice }))} className="accent-accent w-4.5 h-4.5" /><span className="group-hover:text-accent transition-colors">{t('admin.market.publicDomainFree')}</span></label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
          <label className="block space-y-2"><span className="text-[9px] font-black uppercase text-text-muted/60 tracking-[0.2em]">{t('admin.market.coverImage')}</span><input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] || null)} className="block w-full text-[10px] text-text-muted file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:bg-accent/10 file:text-[9px] file:font-black file:uppercase file:tracking-widest file:text-accent file:cursor-pointer hover:file:bg-accent/20 file:transition-all" /></label>
          <label className="block space-y-2"><span className="text-[9px] font-black uppercase text-text-muted/60 tracking-[0.2em]">{t('admin.market.productPdf')} *</span><input type="file" accept="application/pdf" onChange={e => setProductFile(e.target.files?.[0] || null)} className="block w-full text-[10px] text-text-muted file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:bg-accent/10 file:text-[9px] file:font-black file:uppercase file:tracking-widest file:text-accent file:cursor-pointer hover:file:bg-accent/20 file:transition-all" /></label>
        </div>

        <div className="flex gap-4 pt-4">
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">{saving ? t('admin.market.processing') : productForm.id ? t('admin.market.authorizeUpdate') : t('admin.market.initializeAsset')}</button>
          <button onClick={resetProductForm} className="btn-secondary px-8 active:scale-[0.98]">{t('button.purge')}</button>
        </div>
      </div>

      <DataTable
        data={products}
        columns={columns}
        keyExtractor={(p) => p._id}
        mobileCard={mobileCard}
        emptyTitle={t('admin.market.empty')}
        emptyIcon={<RefreshCw className="w-10 h-10 text-text-muted" />}
        minWidth="min-w-[720px]"
      />
    </div>
  );
};

export default ZeroDayMarketTab;
