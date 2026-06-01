import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../src/App';

describe('TinyTrip Studio app', () => {
  it('lets a consumer generate and save a tiny trip', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('heading', { name: /plan a tiny trip/i })).toBeInTheDocument();

    await user.clear(screen.getByLabelText(/city/i));
    await user.type(screen.getByLabelText(/city/i), 'Singapore');
    await user.selectOptions(screen.getByLabelText(/vibe/i), 'foodie');
    await user.clear(screen.getByLabelText(/budget/i));
    await user.type(screen.getByLabelText(/budget/i), '100');
    await user.click(screen.getByRole('button', { name: /generate trip/i }));

    expect(await screen.findByRole('heading', { name: /Singapore foodie tiny trip/i })).toBeInTheDocument();
    expect(screen.getAllByTestId('trip-stop').length).toBeGreaterThanOrEqual(3);

    await user.click(screen.getByRole('button', { name: /save this trip/i }));
    expect(screen.getByText(/saved trips/i)).toBeInTheDocument();
    expect(screen.getByText(/1 saved/i)).toBeInTheDocument();
  });
});
