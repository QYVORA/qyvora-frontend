import React from 'react';
import { Link } from 'react-router-dom';
import { IconMarketplace } from '@/shared/components/icons';
import { AuthImage } from '@/shared/components/ui';
import CpLogo from '@/shared/components/CpLogo';
import type { ViewMode } from '@/shared/components/card-collection';

export interface MarketProduct {
  id: string;
  title: string;
  description: string;
  cpPrice: number;
  coverUrl: string;
  type: string;
}

interface ProductCardProps {
  product: MarketProduct;
  isLoggedIn: boolean;
  view: ViewMode;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isLoggedIn, view }) => {
  const cta = isLoggedIn ? (
    <Link
      to="/dashboard/marketplace"
      className="px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-accent text-on-accent transition-all hover:brightness-110"
    >
      View in Store
    </Link>
  ) : (
    <Link
      to="/login"
      className="px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest border border-border/40 text-text-primary hover:border-accent/30 hover:text-accent transition-all"
    >
      Log In to Purchase
    </Link>
  );

  const price = (
    <div className="flex items-center gap-1.5">
      <CpLogo className="h-4 w-4" />
      <span className="font-mono text-sm font-black text-text-primary">
        {Number(product.cpPrice || 0).toLocaleString()}
      </span>
    </div>
  );

  if (view === 'expanded') {
    return (
      <div className="group relative flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-border/50 bg-bg-card transition-all duration-300 hover:border-accent/30">
        <div className="sm:w-40 lg:w-48 shrink-0 aspect-[16/9] sm:aspect-auto sm:min-h-[120px] overflow-hidden bg-accent/5 border-b sm:border-b-0 sm:border-r border-border/30">
          <AuthImage
            src={product.coverUrl}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col gap-2 p-4 flex-1 justify-between min-w-0">
          <div className="min-w-0">
            <span className="self-start px-2 py-0.5 rounded-lg bg-accent/10 text-[9px] font-black uppercase text-accent tracking-widest border border-accent/20 inline-flex items-center gap-1 mb-1">
              <IconMarketplace className="h-2.5 w-2.5" /> Intelligence Asset
            </span>
            <h3 className="text-sm sm:text-base font-black leading-snug text-text-primary group-hover:text-accent transition-colors tracking-tight line-clamp-1">
              {product.title}
            </h3>
            <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mt-1">
              {product.description || 'Premium intelligence asset.'}
            </p>
          </div>
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/10">
            {price}
            {cta}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-bg-card transition-all duration-300 hover:border-accent/30 h-full min-h-[240px] justify-between">
      <div className="relative aspect-[16/9] overflow-hidden bg-accent/5 border-b border-border/30 shrink-0">
        <AuthImage
          src={product.coverUrl}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col gap-2 p-4 flex-1 justify-between">
        <div>
          <span className="self-start px-2 py-0.5 rounded-lg bg-accent/10 text-[9px] font-black uppercase text-accent tracking-widest border border-accent/20 inline-flex items-center gap-1 mb-1">
            <IconMarketplace className="h-2.5 w-2.5" /> Intelligence Asset
          </span>
          <h3 className="text-sm sm:text-base font-black leading-snug text-text-primary group-hover:text-accent transition-colors tracking-tight line-clamp-2">
            {product.title}
          </h3>
          <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mt-1">
            {product.description || 'Premium intelligence asset.'}
          </p>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/10">
          {price}
          {cta}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
