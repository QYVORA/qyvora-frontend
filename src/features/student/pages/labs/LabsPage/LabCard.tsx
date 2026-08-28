import React from 'react';
import { useTranslation } from 'react-i18next';
import LearningCard from '@/shared/components/learning/LearningCard';

interface LabCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  cpReward: string;
  route: string;
  accentColor: string;
}

const LabCard: React.FC<LabCardProps> = ({ id, title, description, difficulty, cpReward, route, accentColor }) => {
  const { t } = useTranslation();
  return (
    <LearningCard
      id={id}
      type="lab"
      title={title}
      description={description}
      to={route}
      difficulty={difficulty}
      accentColor={accentColor}
      cpReward={cpReward}
      actionLabel={t('student.labs.labCard.start')}
    />
  );
};

export default LabCard;

