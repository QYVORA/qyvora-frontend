import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SocialLinks from '../SocialLinks';

describe('SocialLinks', () => {
  it('renders verified GitHub link when public', () => {
    render(
      <SocialLinks
        githubUsername="hunter1"
        githubPublic
      />
    );
    const link = screen.getByRole('link', { name: /github/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://github.com/hunter1');
  });

  it('hides GitHub when not public and no override', () => {
    const { container } = render(
      <SocialLinks
        githubUsername="hunter1"
        githubPublic={false}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('normalizes social links without protocols', () => {
    render(
      <SocialLinks
        twitter="@operator_zero"
        linkedin="in/cyber-pro"
        website="https://portfolio.dev"
      />
    );
    const xLink = screen.getByRole('link', { name: /x/i });
    expect(xLink).toHaveAttribute('href', 'https://x.com/operator_zero');

    const inLink = screen.getByRole('link', { name: /linkedin/i });
    expect(inLink).toHaveAttribute('href', 'https://linkedin.com/in/in/cyber-pro');
  });
});
