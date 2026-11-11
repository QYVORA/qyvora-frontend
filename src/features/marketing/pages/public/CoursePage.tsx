import { Navigate, useParams } from 'react-router-dom';
import { getUnifiedLabById } from '@/features/student/data/labs';

/**
 * Legacy public course URL. Courses are now Labs, so every former course URL
 * forwards to that Lab's learning route, or to the Labs tab when the id is
 * unknown.
 */
const CoursePage = () => {
  const { courseId } = useParams();
  const lab = courseId ? getUnifiedLabById(courseId) : undefined;

  return <Navigate to={lab?.route ?? '/learn?tab=labs'} replace />;
};

export default CoursePage;
