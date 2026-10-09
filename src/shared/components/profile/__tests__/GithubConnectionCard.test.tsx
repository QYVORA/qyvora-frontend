import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GithubConnectionCard from '../GithubConnectionCard';

const put = vi.fn();
const post = vi.fn();
const goToGithubLink = vi.fn();
const addToast = vi.fn();

vi.mock('@/core/services/api', () => ({
  default: { put: (...a: unknown[]) => put(...a), post: (...a: unknown[]) => post(...a) },
}));

vi.mock('@/features/auth/oauth', () => ({
  goToGithubLink: (...a: unknown[]) => goToGithubLink(...a),
}));

vi.mock('@/core/contexts/ToastContext', () => ({
  useToast: () => ({ addToast }),
}));

const baseProps = {
  connected: false,
  username: '',
  profileUrl: '',
  isPublic: false,
  passwordSet: true,
  onChanged: vi.fn(),
};

describe('GithubConnectionCard', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    addToast.mockClear();
  });

  it('prompts to connect when no GitHub account is linked', async () => {
    const user = userEvent.setup();
    render(<GithubConnectionCard {...baseProps} />);

    expect(screen.queryByText(/Connected as/i)).not.toBeInTheDocument();
    const button = screen.getByRole('button', { name: /Connect GitHub/i });
    await user.click(button);
    expect(goToGithubLink).toHaveBeenCalledWith('/dashboard/profile');
  });

  it('shows the connected account, visibility toggle and actions', () => {
    render(
      <GithubConnectionCard
        {...baseProps}
        connected
        username="octocat"
        profileUrl="https://github.com/octocat"
        isPublic
      />,
    );

    expect(screen.getByText(/Connected as/i)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /@octocat/ });
    expect(link).toHaveAttribute('href', 'https://github.com/octocat');
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('button', { name: /Reconnect/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Disconnect/i })).toBeEnabled();
  });

  it('updates public visibility and refetches the profile', async () => {
    const user = userEvent.setup();
    const onChanged = vi.fn();
    put.mockResolvedValue({ data: {} });
    render(
      <GithubConnectionCard
        {...baseProps}
        connected
        username="octocat"
        profileUrl="https://github.com/octocat"
        onChanged={onChanged}
      />,
    );

    await user.click(screen.getByRole('switch'));
    await waitFor(() => expect(put).toHaveBeenCalledWith('/profile', { githubPublic: true }));
    expect(onChanged).toHaveBeenCalled();
  });

  it('blocks disconnect when no password is set', () => {
    render(
      <GithubConnectionCard
        {...baseProps}
        connected
        username="octocat"
        profileUrl="https://github.com/octocat"
        passwordSet={false}
      />,
    );

    expect(screen.getByRole('button', { name: /Disconnect/i })).toBeDisabled();
    expect(screen.getByText(/Set a password before disconnecting/i)).toBeInTheDocument();
  });
});
