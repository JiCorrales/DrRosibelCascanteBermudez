import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithRouter, screen } from '../test-utils.jsx';
import FAQ from '../../sections/FAQ.jsx';
import { FAQS } from '../../data.js';

describe('FAQ section', () => {
  it('renders all question titles', () => {
    renderWithRouter(<FAQ />);
    FAQS.forEach(({ q }) => {
      expect(screen.getByRole('button', { name: new RegExp(q, 'i') })).toBeInTheDocument();
    });
  });

  it('opens the first question by default', () => {
    renderWithRouter(<FAQ />);
    const firstBtn = screen.getByRole('button', { name: new RegExp(FAQS[0].q, 'i') });
    expect(firstBtn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(FAQS[0].a)).toBeVisible();
  });

  it('toggles a question on click and closes the previous one', async () => {
    const user = userEvent.setup();
    renderWithRouter(<FAQ />);

    const second = screen.getByRole('button', { name: new RegExp(FAQS[1].q, 'i') });
    expect(second).toHaveAttribute('aria-expanded', 'false');

    await user.click(second);

    expect(second).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(FAQS[1].a)).toBeVisible();

    const first = screen.getByRole('button', { name: new RegExp(FAQS[0].q, 'i') });
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(FAQS[0].a)).not.toBeInTheDocument();
  });

  it('closes the currently open question when clicked again', async () => {
    const user = userEvent.setup();
    renderWithRouter(<FAQ />);

    const first = screen.getByRole('button', { name: new RegExp(FAQS[0].q, 'i') });
    await user.click(first);
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(FAQS[0].a)).not.toBeInTheDocument();
  });
});
