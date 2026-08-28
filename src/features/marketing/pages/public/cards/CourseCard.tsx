import React from 'react';
import type { ViewMode } from '@/shared/components/card-collection';
import type { Course } from '@/features/student/data/courses';
import CourseBadge from '@/shared/components/CourseBadge';
import LearningCard from '@/shared/components/learning/LearningCard';

interface CourseCardProps {
  course: Course;
  view?: ViewMode;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, view = 'grid' }) => {
  return (
    <LearningCard
      id={course.id}
      type="course"
      title={course.title}
      description={course.description}
      to={`/courses/${course.id}`}
      difficulty={course.skillLevel}
      badge={<CourseBadge courseId={course.id} className="w-11 h-11 shrink-0" />}
      duration={`${course.estimatedMinutes}min`}
      cpReward={course.cpCost}
      actionLabel="Start Course"
      view={view}
    />
  );
};

export default CourseCard;

