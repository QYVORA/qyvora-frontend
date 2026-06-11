import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, ChevronRight, Lock, CheckCircle2,
  BookOpen, Loader2, ArrowRight, Play, ListChecks,
  BarChart3, Layers, Trophy, Github, FileText,
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { BOOTCAMP_CONFIG } from '../constants/bootcampConfig';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import { useAuth } from '../../../core/contexts/AuthContext';
import { formatSyncLabel, getLastSync, resolveNextRoomPath, setLastSyncNow } from '../utils/studentExperience';
import OptionalDecorImage from '../../../shared/components/OptionalDecorImage';
import { STUDENT_DECOR } from '../constants/studentDecorPaths';
import PageLoader from '../../../shared/components/PageLoader';
import CourseHeader from '../components/bootcamp-course/CourseHeader';
import SidebarProgress from '../components/bootcamp-course/SidebarProgress';
import PhaseSection from '../components/bootcamp-course/PhaseSection';
import type { Course } from '../components/bootcamp-course/types';

const BootcampCourse: React.FC = () => {
  const { bootcampId } = useParams<{ bootcampId?: string }>();
  const { addToast } = useToast();
  const { refreshMe } = useAuth();

  const [course, setCourse]     = useState<Course | null>(null);
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [syncError, setSyncError]   = useState('');
  const [lastSync, setLastSync]     = useState<string | null>(getLastSync('bootcamp-course'));

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        // Refresh overview data when returning to the page to show updated stats
        load();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [bootcampId]);

  const load = async () => {
    try {
      const query = bootcampId ? `?bootcampId=${encodeURIComponent(bootcampId)}` : '';
      // Add cache-busting parameter to force fresh data
      const cacheBust = `?_t=${Date.now()}`;
      const [ovRes, courseRes] = await Promise.all([
        api.get(`/student/overview${cacheBust}`),
        api.get(`/student/course${query}`).catch(() => null),
      ]);
      const ov = ovRes.data || null;
      setOverview(ov);
      
      if (courseRes?.data) setCourse(courseRes.data as Course);
      setLastSync(setLastSyncNow('bootcamp-course'));
      setSyncError('');
    } catch {
      setSyncError('Could not sync. Displaying available data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [bootcampId]);

  // Build a map from moduleId (number) → overview module entry.
  // The overview API returns modules with a numeric `moduleId` field that
  // matches the course module's `moduleId`.
  const moduleProgressMap = new Map<number, any>(
    (overview?.modules || []).map((m: any) => [Number(m.moduleId ?? m.id), m])
  );

  const totalModules = course?.modules?.length || 0;
  const totalRooms   = (course?.modules || []).reduce((acc, m) => acc + (m.rooms?.length || 0), 0);
  // Prefer snapshot values if present, otherwise derive from overview.modules
  const snapshotProgress = overview?.snapshot?.find((s: any) => s?.id === 'progress')?.value;
  const snapshotDoneModules = overview?.snapshot?.find((s: any) => s?.id === 'modules')?.value;
  const snapshotDoneRooms   = overview?.snapshot?.find((s: any) => s?.id === 'rooms')?.value;

  const ovModules: any[] = Array.isArray(overview?.modules) ? overview.modules : [];

  // doneModules: count of modules where progress === 100
  const doneModules = snapshotDoneModules != null
    ? Number(snapshotDoneModules)
    : ovModules.filter((m: any) => Number(m.progress || 0) === 100).length;

  // doneRooms: sum of roomsCompleted across all modules
  const doneRooms = snapshotDoneRooms != null
    ? Number(snapshotDoneRooms)
    : ovModules.reduce((acc: number, m: any) => acc + Number(m.roomsCompleted || 0), 0);

  // Overall progress: prefer snapshot, otherwise derive from rooms ratio
  const progressValue = snapshotProgress != null
    ? String(snapshotProgress)
    : totalRooms > 0
      ? `${Math.round((doneRooms / totalRooms) * 100)}%`
      : '0%';
  const progressNum = parseInt(progressValue, 10) || 0;

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) return <PageLoader />;

  // ── Enrolled ─────────────────────────────────────────────────────────────
  return (
    <div className="bg-bg">
      {/* Mobile-first header */}
      <CourseHeader
        bootcampId={bootcampId || ''}
        courseTitle={course?.title || 'Bootcamp'}
        syncError={syncError}
        lastSync={lastSync}
        progressValue={progressValue}
        progressNum={progressNum}
        resumePath={resolveNextRoomPath(String(bootcampId || ''), course)}
        mobileOnly
      />

      <div className="
        lg:fixed lg:left-0 lg:right-0 lg:bottom-0 lg:top-24
        lg:flex lg:flex-row lg:overflow-hidden
      ">

        {/* ── LEFT SIDEBAR ─────────────────────────────────────────────── */}
        <div
          className="
            w-full
            lg:w-72 xl:w-80 lg:flex-none lg:h-full
            lg:overflow-y-auto lg:overscroll-contain scroll-hover
            lg:border-r lg:border-border lg:bg-bg
          "
        >
          <SidebarProgress
            progressValue={progressValue}
            progressNum={progressNum}
            doneRooms={doneRooms}
            totalRooms={totalRooms}
            doneModules={doneModules}
            totalModules={totalModules}
            courseModules={course?.modules || []}
            moduleProgressMap={moduleProgressMap}
          />
        </div>

        {/* ── RIGHT MAIN ─────────────────── */}
        <div
          className="
            w-full flex-1 min-w-0
            lg:h-full lg:overflow-y-auto lg:overscroll-contain scroll-hover
          "
        >
          <div className="px-4 pb-16 lg:px-8 lg:py-6 space-y-8 max-w-5xl">
            {/* Desktop header */}
            <CourseHeader
              bootcampId={bootcampId || ''}
              courseTitle={course?.title || 'Bootcamp'}
              syncError={syncError}
              lastSync={lastSync}
              progressValue={progressValue}
              progressNum={progressNum}
              resumePath={resolveNextRoomPath(String(bootcampId || ''), course)}
            />

            {(course?.modules || []).map((mod, modIdx) => (
              <PhaseSection
                key={mod.moduleId}
                bootcampId={bootcampId || ''}
                mod={mod}
                modIdx={modIdx}
                moduleProgressMap={moduleProgressMap}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BootcampCourse;
