import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasswordInput from '../PasswordInput';

describe('PasswordInput', () => {
  it('renders a password input with type="password"', () => {
    const { container } = render(<PasswordInput name="password" />);
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
  });

  it('toggles to text input when show button is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<PasswordInput name="password" />);

    const toggleBtn = screen.getByRole('button', { name: /show password/i });
    expect(toggleBtn).toHaveAttribute('aria-pressed', 'false');

    await user.click(toggleBtn);

    const input = container.querySelector('input');
    expect(input).toHaveAttribute('type', 'text');
    expect(toggleBtn).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();
  });

  it('accepts and displays typed input', async () => {
    const user = userEvent.setup();
    render(<PasswordInput name="password" />);

    const input = screen.getByPlaceholderText('••••••••');
    await user.type(input, 'secret123');
    expect(input).toHaveValue('secret123');
  });

  it('has required attribute by default', () => {
    const { container } = render(<PasswordInput name="password" />);
    expect(container.querySelector('input')).toBeRequired();
  });

  it('can disable required', () => {
    const { container } = render(<PasswordInput name="password" required={false} />);
    expect(container.querySelector('input')).not.toBeRequired();
  });
});
