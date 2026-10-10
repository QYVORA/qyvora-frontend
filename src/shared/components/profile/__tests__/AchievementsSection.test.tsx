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

  it('allows category tab filtering', () => {
    render(
      <AchievementsSection
        completedCourseIds={['linux-terminal-101']}
        completedLabIds={['privesc']}
      />
    );

    const coursesTab = screen.getByRole('tab', { name: /courses \(1\)/i });
    fireEvent.click(coursesTab);

    expect(screen.getByRole('button', { name: /linux terminal 101/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /privilege escalation/i })).not.toBeInTheDocument();
  });

  it('handles empty achievements state cleanly without broken containers', () => {
    render(<AchievementsSection />);
    expect(screen.getByText(/no achievements recorded yet/i)).toBeInTheDocument();
  });
});
