import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlaskConical, Search } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import LabCard from './LabCard';
import { LearningOverviewCard, LearningFilterStrip } from '@/features/student/components/learning';

const LABS_IDS = ['privesc', 'passwords', 'webapp', 'sqli', 'phishing', 'proxy', 'traffic', 'osint', 'wireless', 'killchain'] as const;

const LABS = [
  { id: 'privesc', route: '/dashboard/labs/privesc', accentColor: '#FBBF24', difficulty: 'beginner-advanced', cpReward: '50-400' },
  { id: 'passwords', route: '/dashboard/labs/passwords', accentColor: '#F59E0B', difficulty: 'beginner-advanced', cpReward: '100-300' },
  { id: 'webapp', route: '/dashboard/labs/web-exploitation', accentColor: '#EF4444', difficulty: 'beginner-advanced', cpReward: '100-400' },
  { id: 'sqli', route: '/dashboard/labs/sql-injection', accentColor: '#06B66F', difficulty: 'beginner-advanced', cpReward: '200-400' },
  { id: 'phishing', route: '/dashboard/labs/phishing', accentColor: '#8B5CF6', difficulty: 'beginner-advanced', cpReward: '150-400' },
  { id: 'proxy', route: '/dashboard/labs/proxy', accentColor: '#10B981', difficulty: 'beginner-advanced', cpReward: '150-400' },
  { id: 'traffic', route: '/dashboard/labs/traffic', accentColor: '#84CC16', difficulty: 'beginner-advanced', cpReward: '150-400' },
  { id: 'osint', route: '/dashboard/labs/osint', accentColor: '#0EA5E9', difficulty: 'beginner-advanced', cpReward: '150-400' },
  { id: 'wireless', route: '/dashboard/labs/wireless', accentColor: '#F59E0B', difficulty: 'beginner-advanced', cpReward: '200-400' },
  { id: 'killchain', route: '/dashboard/labs/kill-chain', accentColor: '#DC2626', difficulty: 'intermediate-advanced', cpReward: '500-600' },
];

const LabsPage = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const labsWithTranslations = useMemo(() => LABS.map((lab) => ({
    ...lab,
    title: t(`student.labs.list.${lab.id}.title`),
    description: t(`student.labs.list.${lab.id}.description`),
  })), [t]);

  const difficultyFilters = useMemo(() => {
    const difficulties = new Set(LABS.map((lab) => {
      const parts = lab.difficulty.split('-');
      return parts[0];
    }));
    return [
      { id: 'all', label: t('student.labs.filter.all'), count: LABS.length },
      ...Array.from(difficulties).sort().map((d) => ({
        id: d,
        label: d.charAt(0).toUpperCase() + d.slice(1),
        count: LABS.filter((lab) => lab.difficulty.startsWith(d)).length,
      })),
    ];
  }, [t]);

  const filteredLabs = useMemo(() => {
    let result = [...labsWithTranslations];

    if (activeFilter !== 'all') {
      result = result.filter((lab) => lab.difficulty.startsWith(activeFilter));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (lab) =>
          lab.title.toLowerCase().includes(q) ||
          lab.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [searchQuery, activeFilter, labsWithTranslations]);

  const totalCpMin = LABS.reduce((sum, lab) => sum + parseInt(lab.cpReward.split('-')[0]), 0);
  const totalCpMax = LABS.reduce((sum, lab) => sum + parseInt(lab.cpReward.split('-')[1]), 0);

  return (
    <div className="bg-bg min-h-full">
      <SEO title={t('student.labs.seoTitle')} description={t('student.labs.seoDesc')} noindex />
      <div className=" px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-8">

        <LearningOverviewCard
          icon={<FlaskConical className="w-6 h-6 text-bg" />}
          title={t('student.labs.title')}
          description={t('student.labs.description')}
          stats={[
            { label: t('stat.labs'), value: LABS.length },
            { label: t('stat.cpRange'), value: `${totalCpMin}-${totalCpMax}` },
          ]}
          action={{
            label: t('button.startFirstLab'),
            to: LABS[0]?.route,
          }}
        />

        <LearningFilterStrip
          filters={difficultyFilters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder={t('student.labs.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg border border-border rounded-xl py-3 pl-11 pr-4 text-text-primary focus:border-accent outline-none font-mono text-sm transition-colors"
          />
        </div>

        {filteredLabs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-12 h-12 text-text-muted mb-4" />
            <h3 className="text-lg font-black text-text-primary mb-2">{t('student.labs.empty.title')}</h3>
            <p className="text-sm text-text-muted">{t('student.labs.empty.description')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredLabs.map((lab) => (
              <LabCard key={lab.id} {...lab} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LabsPage;
