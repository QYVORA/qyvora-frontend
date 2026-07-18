import { useTranslation } from 'react-i18next';
import { ExternalLink, Calendar, Radio, ImageOff } from 'lucide-react';

interface NewsCardProps {
  title: string;
  description: string;
  imageUrl: string | null;
  source: string;
  publishedAt: string;
  url: string;
  categories: string[];
}

const NewsCard = ({ title, description, imageUrl, source, publishedAt, url, categories }: NewsCardProps) => {
  const { t } = useTranslation();
  const dateStr = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block relative rounded-2xl border border-border/30 bg-bg-card overflow-hidden transition-all duration-300 hover:border-accent/30 hover:shadow-[0_0_30px_var(--color-accent-glow)]"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-bg-elevated">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            width={800}
            height={192}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const img = e.currentTarget;
              img.style.display = 'none';
              img.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`absolute inset-0 flex items-center justify-center text-text-muted/30 ${imageUrl ? 'hidden' : ''}`}>
          <ImageOff className="w-10 h-10" />
        </div>
        {/* Gradient overlay at bottom for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg-card to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Meta row */}
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3 h-3" />
            {source}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {dateStr}
          </span>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-lg border border-accent/20 bg-accent-dim text-accent"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-base font-black text-text-primary leading-snug group-hover:text-accent transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
            {description}
          </p>
        )}

        {/* Read more */}
        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-accent opacity-0 group-hover:opacity-100 transition-opacity">
          {t('news.readIntelligence')} <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </a>
  );
};

export default NewsCard;
