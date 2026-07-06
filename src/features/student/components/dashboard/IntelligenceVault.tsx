import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Loader2, Download, BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import api from '@/core/services/api';
import { useToast } from '@/core/contexts/ToastContext';
import CpLogo from '@/shared/components/CpLogo';
import { resolveImg } from '@/shared/utils/resolveImg';
import productFallbackImg from '@/assets/sections/stats/cp-earned-bg.webp';

interface Product {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  coverUrl?: string;
  fileName?: string;
  isFree?: boolean;
}

interface IntelligenceVaultProps {
  products: Product[];
  purchased: Set<string>;
}

const ProductCard = ({ product, purchased }: { product: Product; purchased: Set<string> }) => {
  const { addToast } = useToast();
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [isPurchased, setIsPurchased] = useState(purchased.has(String(product.id || product._id || '')));

  const id = String(product.id || product._id || '');
  const hasPurchased = isPurchased || product.isFree;

  const handlePurchase = async () => {
    setPurchasing(id);
    try {
      await api.post('/cp/purchase', { productId: id });
      addToast(`${product.title} purchased.`, 'success');
      setIsPurchased(true);
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Purchase failed.', 'error');
    } finally {
      setPurchasing(null);
    }
  };

  const handleDownload = async () => {
    setDownloading(id);
    try {
      const base = String(import.meta.env.VITE_API_BASE_URL || '/api');
      const res = await fetch(`${base}/cp/products/${id}/download`, { credentials: 'include' });
      if (!res.ok) { addToast('Download failed.', 'error'); return; }
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = product.fileName || `${product.title || 'product'}.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch { addToast('Download failed.', 'error'); }
    finally { setDownloading(null); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex-none w-[240px] md:w-auto md:flex-1"
    >
      <div className="flex flex-col h-full overflow-hidden border border-border/40 bg-bg-card rounded-2xl transition-all duration-300 group hover:border-accent/30 hover:scale-[1.01]">
        <div className="relative aspect-video overflow-hidden rounded-t-2xl">
          <img
            src={resolveImg(product.coverUrl, productFallbackImg)}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            {hasPurchased && <span className="px-2 py-0.5 bg-accent text-bg rounded text-[8px] font-black uppercase tracking-widest shadow-md">Owned</span>}
          </div>
          <div className="absolute bottom-2 left-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-bg/85 backdrop-blur-md rounded-lg text-[8px] font-black uppercase text-text-primary tracking-widest">
              <ShoppingBag className="h-2.5 w-2.5 text-accent" /> Premium Asset
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="mb-1.5 text-sm font-black leading-snug text-text-primary line-clamp-2 transition-colors group-hover:text-accent">
            {product.title}
          </h3>
          <p className="text-[11px] text-text-muted/70 mb-4 line-clamp-2 leading-relaxed font-mono">
            {product.description || 'Access high-value intelligence reports and research papers.'}
          </p>
          <div className="mt-auto">
            {hasPurchased ? (
              <button
                onClick={handleDownload}
                disabled={downloading === id}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent text-bg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
              >
                {downloading === id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                Download
              </button>
            ) : (
              <button
                onClick={handlePurchase}
                disabled={purchasing === id}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent text-bg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
              >
                {purchasing === id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><CpLogo className="h-3.5 w-3.5" /> Unlock</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const IntelligenceVault = ({ products, purchased }: IntelligenceVaultProps) => (
  <div className="flex flex-col gap-6 h-full">
    <div className="flex items-center justify-between px-5">
      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">Intelligence Vault</h3>
      <Link to="/dashboard/marketplace" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">Marketplace</Link>
    </div>
    {products.length === 0 ? (
      <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border/20 py-12 text-center h-full min-h-[220px] flex flex-col items-center justify-center bg-transparent mx-1">
        <ShoppingBag className="mx-auto mb-3 h-8 w-8 text-text-muted opacity-40" />
        <p className="mb-4 text-sm text-text-muted">No products available.</p>
        <Link to="/dashboard/marketplace" className="bg-accent text-bg px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:brightness-110">
          Browse Marketplace <ArrowRight className="inline-block ml-1.5 h-3.5 w-3.5" />
        </Link>
      </div>
    ) : (
      <div className="flex gap-4 overflow-x-auto pb-2 px-5 md:px-0 md:grid md:grid-cols-3 md:gap-4 scroll-hover">
        {products.map((prod) => (
          <ProductCard key={String(prod.id || prod._id || '')} product={prod} purchased={purchased} />
        ))}
      </div>
    )}
  </div>
);

export default IntelligenceVault;
