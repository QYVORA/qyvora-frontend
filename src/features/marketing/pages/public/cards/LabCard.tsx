import React from 'react';
import type { ViewMode } from '@/shared/components/card-collection';
import LearningCard from '@/shared/components/learning/LearningCard';

export interface LabCardItem {
  id: string;
  route: string;
  accentColor: string;
  difficulty: string;
  cpReward: string;
  title: string;
  description: string;
}

interface LabCardProps {
  lab: LabCardItem;
  view?: ViewMode;
}

const LabCard: React.FC<LabCardProps> = ({ lab, view = 'grid' }) => {
  return (
    <LearningCard
      id={lab.id}
      type="lab"
      title={lab.title}
      description={lab.description}
      to={lab.route}
      difficulty={lab.difficulty}
      accentColor={lab.accentColor}
      cpReward={lab.cpReward}
      actionLabel="Launch"
      view={view}
    />
  );
};

export default LabCard;

