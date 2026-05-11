import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithRouter, screen } from '../test-utils.jsx';
import Testimonios from '../../sections/Testimonios.jsx';
import { TESTIMS } from '../../data.js';

describe('Testimonios section', () => {
  it('shows the first testimonial by default', () => {
    renderWithRouter(<Testimonios />);
    expect(screen.getByText(TESTIMS[0].text)).toBeInTheDocument();
    expect(screen.getByText(TESTIMS[0].who)).toBeInTheDocument();
  });

  it('changes testimonial when a pagination dot is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Testimonios />);

    const thirdDot = screen.getByRole('button', { name: /testimonio 3/i });
    await user.click(thirdDot);

    expect(screen.getByText(TESTIMS[2].text)).toBeInTheDocument();
    expect(screen.queryByText(TESTIMS[0].text)).not.toBeInTheDocument();
    expect(thirdDot).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders one pagination dot per testimonial', () => {
    renderWithRouter(<Testimonios />);
    const dots = screen.getAllByRole('button', { name: /Mostrar testimonio/i });
    expect(dots).toHaveLength(TESTIMS.length);
  });
});
