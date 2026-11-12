import { UserRound } from 'lucide-react';

interface TeamPortraitProps {
  name: string;
  image?: string;
  width?: number;
  height?: number;
}

const TeamPortrait = ({ name, image, width = 560, height = 560 }: TeamPortraitProps) => (
  <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-raised">
    {image ? (
      <img
        src={image}
        alt={name}
        width={width}
        height={height}
        loading="lazy"
        className="h-full w-full object-cover object-[center_20%] transition-transform duration-700 hover:scale-105"
      />
    ) : (
      <div
        role="img"
        aria-label={`${name} profile silhouette`}
        className="flex h-full w-full items-center justify-center"
      >
        <span className="flex h-24 w-24 items-center justify-center rounded-full border border-border-subtle bg-surface text-text-muted md:h-28 md:w-28">
          <UserRound className="h-12 w-12 md:h-14 md:w-14" strokeWidth={1.5} aria-hidden="true" />
        </span>
      </div>
    )}
  </div>
);

export default TeamPortrait;
