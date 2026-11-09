import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AchievementsSection from '../AchievementsSection';

describe('AchievementsSection', () => {
  it('renders earned course badges based on completedCourseIds', () => {
    render(
      <AchievementsSection
        completedCourseIds={['linux-terminal-101', 'burp-suite-101']}
      />
    );

    // Verify course badges render
    expect(screen.getByRole('button', { name: /linux terminal 101/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /burp suite/i })).toBeInTheDocument();
  });

  it('renders earned lab badges based on completedLabIds', () => {
    render(
      <AchievementsSection
        completedLabIds={['privesc', 'sqli']}
      />
    );

    expect(screen.getByRole('button', { name: /privilege escalation/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sql injection/i })).toBeInTheDocument();
  });

  it('groups completed courses and hands-on labs under one Labs tab without duplicates', () => {
    render(
      <AchievementsSection
        completedCourseIds={['linux-terminal-101']}
        completedLabIds={['linux-terminal-101', 'privesc']}
      />
    );

    const labsTab = screen.getByRole('tab', { name: /labs \(2\)/i });
    fireEvent.click(labsTab);

    expect(screen.getByRole('button', { name: /linux terminal 101/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /privilege escalation/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /linux terminal 101/i })).toHaveLength(1);
    expect(screen.queryByRole('tab', { name: /courses/i })).not.toBeInTheDocument();
  });

  it('renders skill achievements from the API-shaped prop (LEARN-BUG-001)', () => {
    render(
      <AchievementsSection
        skillAchievements={[
          {
            skill: 'web',
            label: 'Web Security',
            color: '#F59E0B',
            scenariosCompleted: 4,
            rarity: 'rare',
          },
        ]}
      />
    );

    expect(screen.getByText('Web Security')).toBeInTheDocument();
    expect(screen.getByText(/Rare · 4/)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /skills \(1\)/i })).toBeInTheDocument();
  });

  it('does not render zero-scenario skill rows', () => {
    render(
      <AchievementsSection
        skillAchievements={[
          {
            skill: 'linux',
            label: 'Linux / Terminal',
            color: '#60A5FA',
            scenariosCompleted: 0,
            rarity: 'common',
          },
        ]}
      />
    );

    expect(screen.queryByText('Linux / Terminal')).not.toBeInTheDocument();
    expect(screen.getByText(/no achievements recorded yet/i)).toBeInTheDocument();
  });

  it('handles empty achievements state cleanly without broken containers', () => {
    render(<AchievementsSection />);
    expect(screen.getByText(/no achievements recorded yet/i)).toBeInTheDocument();
  });
});
