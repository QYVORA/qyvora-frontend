import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import MyLearningCard, { type MyLearningBootcamp } from './MyLearningCard';
import { CONTENT_LABS, PRACTICAL_LABS } from '@/features/student/data/labs';

const courseLabs = CONTENT_LABS.slice(0, 3);
const practicalLab = PRACTICAL_LABS[0];
const bootcamp: MyLearningBootcamp = {
  id: 'bootcamp-test',
  title: 'Hacker Protocol Bootcamp',
  progress: 40,
  to: '/dashboard/bootcamps/bootcamp-test',
  isActive: true,
};

const renderCard = (
  progressById: Record<string, number | undefined>,
  bootcamps: MyLearningBootcamp[] = [],
) => render(
  <MemoryRouter>
    <MyLearningCard
      labs={[...courseLabs, practicalLab]}
      bootcamps={bootcamps}
      progressById={progressById}
    />
  </MemoryRouter>,
);

describe('MyLearningCard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('groups active current learning under headings with row descriptions', () => {
    renderCard({
      [courseLabs[0].id]: 65,
      [courseLabs[1].id]: 0,
      [courseLabs[2].id]: 100,
    }, [bootcamp]);

    const panel = screen.getByRole('tabpanel');
    expect(within(panel).getByText(bootcamp.title)).toBeInTheDocument();
    expect(within(panel).getByText('Continue your bootcamp training')).toBeInTheDocument();
    expect(
      within(panel).getByRole('progressbar', { name: `${bootcamp.title} completion` }),
    ).toHaveAttribute('aria-valuenow', '40');
    expect(within(panel).getByText('40%')).toBeInTheDocument();
    expect(within(panel).getByRole('heading', { name: 'Labs & courses' })).toBeInTheDocument();
    expect(within(panel).getByText(courseLabs[0].title)).toBeInTheDocument();
    expect(within(panel).getAllByText(courseLabs[0].description).length).toBeGreaterThan(0);
    expect(within(panel).queryByText(courseLabs[1].title)).not.toBeInTheDocument();
    expect(within(panel).queryByText(courseLabs[2].title)).not.toBeInTheDocument();
  });

  it('puts the two most recently opened catalog items first without recommendation fallbacks', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      'qyvora_recent_labs',
      JSON.stringify([practicalLab.id, courseLabs[0].id]),
    );
    renderCard({ [courseLabs[0].id]: 65 });

    await user.click(screen.getByRole('tab', { name: /Recent/ }));
    const panel = screen.getByRole('tabpanel');
    const learningLinks = within(panel).getAllByRole('link');

    expect(learningLinks[0]).toHaveAttribute('href', practicalLab.route);
    expect(learningLinks[1]).toHaveAttribute('href', courseLabs[0].route);
    expect(within(panel).queryByText(courseLabs[1].title)).not.toBeInTheDocument();
    expect(within(panel).getAllByText(courseLabs[0].description).length).toBeGreaterThan(0);
  });

  it('resolves saved practical Labs and bootcamps', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      'qyvora_saved_labs',
      JSON.stringify([practicalLab.id, `bootcamp:${bootcamp.id}`]),
    );
    renderCard({}, [bootcamp]);

    await user.click(screen.getByRole('tab', { name: /Saved/ }));
    const panel = screen.getByRole('tabpanel');
    expect(within(panel).getByText(practicalLab.title)).toBeInTheDocument();
    expect(within(panel).getByText(bootcamp.title)).toBeInTheDocument();
    expect(
      within(panel).queryByRole('button', { name: `Remove ${practicalLab.title} from saved learning` }),
    ).not.toBeInTheDocument();
  });

  it('supports arrow-key navigation between learning tabs', async () => {
    const user = userEvent.setup();
    renderCard({});

    await user.click(screen.getByRole('tab', { name: /Current/ }));
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: /Recent/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'my-learning-tab-recent');
  });
});
