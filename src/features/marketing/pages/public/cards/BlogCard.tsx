import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { IconArrowRight, IconClock } from '@/shared/components/icons';
import type { ViewMode } from '@/shared/components/card-collection';
import type { BlogPost } from '@/features/marketing/pages/BlogsPage/blogContent';

interface BlogCardProps {
  post: BlogPost;
  view: ViewMode;
}

const Tags: React.FC<{ post: BlogPost }> = ({ post }) => (
  <div className="flex items-center gap-2 flex-wrap">
    {post.tags?.slice(0, 2).map((tag) => (
      <span key={tag} className="px-2 py-0.5 rounded-lg bg-accent/10 text-[9px] font-black uppercase tracking-widest text-accent border border-accent/20">
        {tag}
      </span>
    ))}
  </div>
);

const BlogCard: React.FC<BlogCardProps> = ({ post, view }) => {
  if (view === 'expanded') {
    return (
      <Link
        to={`/blogs/${post.slug}`}
        className="group flex flex-col sm:flex-row rounded-2xl border border-border/30 bg-bg-card overflow-hidden transition-all duration-300 hover:border-accent/30"
      >
        {post.image && (
          <div className="sm:w-48 lg:w-56 shrink-0 aspect-[16/9] sm:aspect-auto sm:min-h-[120px] overflow-hidden bg-accent/5">
            <img
              src={post.image}
              alt={post.title}
              width={1536}
              height={1024}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex flex-col gap-2 p-4 flex-1 justify-between min-w-0">
          <div className="min-w-0">
            <Tags post={post} />
            <h3 className="text-sm sm:text-base font-black text-text-primary group-hover:text-accent transition-colors leading-snug line-clamp-2 mt-1">
              {post.title}
            </h3>
            <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mt-1">
              {post.excerpt}
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/10 text-[10px] text-text-muted font-mono">
            <span className="flex items-center gap-1 truncate min-w-0">
              <User className="w-3 h-3 shrink-0" /> <span className="truncate">{post.author?.name}</span>
            </span>
            <div className="flex items-center gap-3 shrink-0">
              <span className="flex items-center gap-1">
                <IconClock className="w-3 h-3" /> {post.readTime}
              </span>
              <span className="flex items-center gap-1 text-accent font-black uppercase tracking-widest text-[9px]">
                Read <IconArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/blogs/${post.slug}`}
      className="group flex flex-col rounded-2xl border border-border/30 bg-bg-card overflow-hidden transition-all duration-300 hover:border-accent/30 h-full min-h-[220px]"
    >
      {post.image && (
        <div className="aspect-[16/9] overflow-hidden bg-accent/5 shrink-0">
          <img
            src={post.image}
            alt={post.title}
            width={1536}
            height={1024}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
      <div className="flex flex-col gap-2 p-4 flex-1 justify-between">
        <div>
          <Tags post={post} />
          <h3 className="text-sm sm:text-base font-black text-text-primary group-hover:text-accent transition-colors leading-snug line-clamp-2">
            {post.title}
          </h3>
          <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mt-1">
            {post.excerpt}
          </p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border/10 text-[10px] text-text-muted font-mono">
          <span className="flex items-center gap-1 truncate">
            <User className="w-3 h-3" /> {post.author?.name}
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <IconClock className="w-3 h-3" /> {post.readTime}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
