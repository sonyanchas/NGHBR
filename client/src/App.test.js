import { render, screen, fireEvent } from '@testing-library/react';
import { AppRouter } from './App';

test('starts on the homepage and opens the login screen from the tasker modal', () => {
  render(<AppRouter />);

  expect(screen.getByText(/Rest easy, while we do the work/i)).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/Choose a task/i), { target: { value: 'cleaning' } });
  fireEvent.click(screen.getByRole('button', { name: /Search/i }));
  fireEvent.click(screen.getByText(/Wanjiru M\./i));
  fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

  expect(screen.getByText(/Welcome to NGHBR/i)).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /^Login$/i }).length).toBeGreaterThan(0);
});
