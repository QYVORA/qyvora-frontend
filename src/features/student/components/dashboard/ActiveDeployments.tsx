import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import type { StudentBootcampCardData } from '@/features/student/components/StudentBootcampCard';
import StudentBootcampCard from '@/features/student/components/StudentBootcampCard';

interface ActiveDeploymentsProps {
  bootcamps: StudentBootcampCardData[];
  loading?: boolean;
}

const EmptyDeployments = () => (
  <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border/20 py-12 text-center h-full min-h-[220px] flex flex-col items-center justify-center bg-transparent mx-1">
    <BookOpen className="mx-auto mb-3 h-8 w-8 text-text-muted opacity-40" />
    <p className="mb-4 text-sm text-text-muted">No active bootcamps.</p>
    <Link
      to="/dashboard/bootcamps"
      className="btn-primary !text-[10px] !px-6 !py-2.5 flex items-center gap-1.5"
    >
      Start Training <ArrowRight className="inline-block ml-1.5 h-3.5 w-3.5" />
    </Link>
  </div>
);

const ActiveDeployments = ({ bootcamps }: ActiveDeploymentsProps) => (
  <div className="flex flex-col gap-6 h-full">
    <div className="flex items-center justify-between px-4 md:px-0">
      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">Active Deployments</h3>
      <Link to="/dashboard/bootcamps" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">View All</Link>
    </div>
    {bootcamps.length === 0 ? (
      <EmptyDeployments />
    ) : (
      bootcamps.slice(0, 1).map((item, idx) => (
        <div key={item.id} className="h-full px-4 md:px-0">
          <StudentBootcampCard data={item} index={idx} />
        </div>
      ))
    )}
  </div>
);

export default ActiveDeployments;
