import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Play } from 'lucide-react';
import { formatSyncLabel } from '../../utils/studentExperience';

interface CourseHeaderProps {
  bootcampId: string;
  courseTitle: string;
  syncError: string;
  lastSync: string | null;
  progressValue: string;
  progressNum: number;
  resumePath: string | null;
  mobileOnly?: boolean;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({
  bootcampId,
  courseTitle,
  syncError,
  lastSync,
  progressValue,
  progressNum,
  resumePath,
  mobileOnly = false,
}) => {
  const content = (
    <div className="mb-8">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-text-muted">
        <Link
          to="/dashboard/bootcamps"
          className="inline-flex items-center gap-1 font-black uppercase tracking-widest transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Bootcamps
        </Link>
        <ChevronRight className="h-3.5 w-3.5 opacity-40" />
        <span className="truncate font-black uppercase tracking-wide text-text-primary">
          {courseTitle}
        </span>
      </div>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.35em] text-accent md:text-sm">
            Curriculum map
          </span>
          <h1 className="mb-2 text-4xl font-black text-text-primary md:text-5xl lg:text-6xl">
            {courseTitle}
          </h1>
          <p className={`mt-2 text-sm ${syncError ? 'text-red-400' : 'text-text-muted'}`}>
            {syncError || formatSyncLabel(lastSync)}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="rounded-2xl border-2 border-accent/25 bg-accent-dim px-4 py-2.5 inline-flex items-center gap-2">
            <span className="font-mono text-xl font-black text-accent">{progressValue}</span>
          </div>
          <Link
            to={resumePath || '#'}
            className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-black"
          >
            <Play className="h-3.5 w-3.5 fill-current" /> Resume mission
          </Link>
        </div>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-accent-dim">
        <div
          className="h-full rounded-full bg-accent transition-all duration-700"
          style={{ width: `${progressNum}%` }}
        />
      </div>
    </div>
  );

  if (mobileOnly) {
    return <div className="px-2 sm:px-6 md:px-8 pt-6 lg:hidden">{content}</div>;
  }

  return <div className="hidden lg:block">{content}</div>;
};

export default CourseHeader;
