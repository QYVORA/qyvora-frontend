import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import { Card } from '@/shared/components/ui/Card';
import EmptyState from '@/shared/components/ui/EmptyState';
import LearningWorkspaceShell from '@/shared/components/learning/LearningWorkspaceShell';
import api from '@/core/services/api';
import useStudentOverview from '@/features/student/hooks/useStudentOverview';
import {
  LAB_MODULE_MATRIX,
  getUnifiedLabById,
} from '@/features/student/data/labs';
import type { Course } from '@/features/student/components/bootcamp-course/types';
import qoseLogo from '@/assets/bootcamp/QOSE-Logo.webp';

const QOSE_BOOTCAMP_ID = 'qose';

/**
 * QOSE programme overview.
 *
 * QOSE is delivered as a 12-week lab-led programme. Each week maps to the
 * practical labs in the shared lab matrix, so this page is the QOSE-specific
 * learning destination instead of dropping paid students into the general lab
 * catalogue. Opening a lab uses the existing protected lab walkthrough.
 */
const QoseCoursePage = () => {
  const { data: overview, loading: overviewLoading } = useStudentOverview();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get(`/student/course?bootcampId=${encodeURIComponent(QOSE_BOOTCAMP_ID)}`)
      .then((response) => {
        if (!cancelled) setCourse(response.data as Course);
      })
      .catch(() => {
        if (!cancelled) setCourse(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const modules = useMemo(
    () =>
      LAB_MODULE_MATRIX.map((entry, index) => {
        const courseModule = course?.modules?.find((module) => module.moduleId === index + 1);
        const labs = entry.labs
          .map((labId) => getUnifiedLabById(labId))
          .filter((lab): lab is NonNullable<typeof lab> => Boolean(lab));
        const rooms = courseModule?.rooms || [];
        const completedRooms = rooms.filter((room) => room.completed).length;
        const progress = rooms.length ? Math.round((completedRooms / rooms.length) * 100) : 0;

        return {
          ...entry,
          description: courseModule?.description || '',
          locked: Boolean(courseModule?.locked),
          completed: rooms.length > 0 && completedRooms === rooms.length,
          progress,
          labs,
        };
      }),
    [course],
  );

  const totalRooms = (course?.modules || []).reduce((sum, module) => sum + module.rooms.length, 0);
  const completedRooms = (course?.modules || []).reduce(
    (sum, module) => sum + module.rooms.filter((room) => room.completed).length,
    0,
  );
  const progress = totalRooms ? Math.round((completedRooms / totalRooms) * 100) : 0;
  const completedWeeks = modules.filter((module) => module.completed).length;
  const nextModule = modules.find((module) => !module.completed && !module.locked) || modules[0];

  if (overviewLoading || loading) {
    return (
      <div className="min-h-dvh bg-canvas px-[var(--app-gutter,12px)] py-16">
        <p className="type-body-sm text-text-secondary" role="status">
          Loading QOSE programme…
        </p>
      </div>
    );
  }

  const isEnrolled = Boolean(
    overview?.bootcampStatus &&
      overview.bootcampStatus !== 'not_enrolled' &&
      (!overview.bootcampId || String(overview.bootcampId) === QOSE_BOOTCAMP_ID),
  );

  if (!isEnrolled) {
    return (
      <div className="min-h-full bg-canvas">
        <SEO title="QOSE programme" description="QOSE bootcamp enrolment required." noindex />
        <LearningWorkspaceShell
          kicker="QYVORA · QOSE"
          title="Offensive Security Engineer Bootcamp"
          description="Registration is required before the QOSE programme and lab map open."
          backTo="/dashboard"
          backLabel="Back to Dashboard"
          icon={<img src={qoseLogo} alt="" />}
          heroArtSrc={qoseLogo}
        >
          <EmptyState
            icon={<Lock className="h-6 w-6" aria-hidden="true" />}
            title="QOSE access required"
            description="Your account does not have an active QOSE seat. Complete enrolment or check your payment status to unlock the programme."
            action={
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button to="/dashboard/qose">View QOSE registration</Button>
                <Button to="/qose" variant="secondary">QOSE programme page</Button>
              </div>
            }
          />
        </LearningWorkspaceShell>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-canvas">
      <SEO
        title="QOSE programme"
        description={`QOSE 12-week programme — ${progress}% complete.`}
        noindex
      />
      <LearningWorkspaceShell
        kicker="QYVORA · QOSE"
        title={course?.title || 'Offensive Security Engineer Bootcamp'}
        description="Twelve weeks, one engagement cycle. Each week opens the practical labs that carry its topic."
        backTo="/dashboard"
        backLabel="Back to Dashboard"
        icon={<img src={qoseLogo} alt="" />}
        heroArtSrc={qoseLogo}
        stats={[
          { label: 'progress', value: `${progress}%`, accent: true },
          { label: 'weeks', value: `${completedWeeks}/${modules.length}` },
          { label: 'rooms', value: `${completedRooms}/${totalRooms}` },
        ]}
        progress={{ value: progress, label: `${completedRooms}/${totalRooms} rooms` }}
        actions={
          nextModule?.labs[0] ? (
            <Button to={nextModule.labs[0].route}>
              Continue QOSE labs
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          ) : (
            <Button to="/dashboard/labs">Open all labs</Button>
          )
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <Card key={module.module} className="flex flex-col gap-4 p-5 md:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="type-label uppercase tracking-[0.12em] text-text-tertiary">
                    {module.week}
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-text-primary">{module.title}</h2>
                </div>
                {module.completed ? (
                  <Badge variant="success" size="sm">
                    <CheckCircle2 className="mr-1 h-3 w-3" aria-hidden="true" />
                    Complete
                  </Badge>
                ) : module.locked ? (
                  <Badge variant="warning" size="sm">
                    <Lock className="mr-1 h-3 w-3" aria-hidden="true" />
                    Locked
                  </Badge>
                ) : (
                  <Badge variant="accent" size="sm">
                    {module.progress}%
                  </Badge>
                )}
              </div>

              {module.description && (
                <p className="type-body-sm text-text-secondary">{module.description}</p>
              )}

              <div className="mt-auto flex flex-wrap gap-2">
                {module.labs.map((lab) => (
                  <Button
                    key={lab.id}
                    to={module.locked ? undefined : lab.route}
                    variant="secondary"
                    size="sm"
                    disabled={module.locked}
                    aria-disabled={module.locked}
                  >
                    {lab.title}
                  </Button>
                ))}
                {!module.labs.length && (
                  <span className="type-meta text-text-muted">Labs for this week are being prepared.</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </LearningWorkspaceShell>
    </div>
  );
};

export default QoseCoursePage;
