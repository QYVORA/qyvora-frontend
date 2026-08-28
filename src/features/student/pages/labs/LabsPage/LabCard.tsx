import React from 'react';
import { useTranslation } from 'react-i18next';
import LearningCard from '@/shared/components/learning/LearningCard';
import { getAllCompletedLabIds } from '@/features/student/utils/labProgress';
import { useAuth } from '@/core/contexts/AuthContext';

interface LabCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  cpReward: string;
  route: string;
  accentColor: string;
}

/**
 * Derive lab-level completion from completed scenario IDs.
 * Scenario IDs are prefixed per lab (privesc-*, pwd-*, sqli-*, osint-*, kc-*),
 * so a lab is considered completed once any of its scenarios is completed.
 */
const LAB_PREFIXES: Record<string, string> = {
  privesc: 'privesc-',
  passwords: 'pwd-',
  sqli: 'sqli-',
  osint: 'osint-',
  killchain: 'kc-',
};

const LabCard: React.FC<LabCardProps> = ({ id, title, description, difficulty, cpReward, route, accentColor }) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const prefix = LAB_PREFIXES[id];
  const completed = user && prefix
    ? [...getAllCompletedLabIds()].some((scenarioId) => scenarioId.startsWith(prefix))
    : false;

  const actionLabel = completed
    ? t('student.labs.labCard.completed', 'Completed')
    : t('student.labs.labCard.start');

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
      actionLabel={actionLabel}
      progress={completed ? 100 : undefined}
    />
  );
};

export default LabCard;
