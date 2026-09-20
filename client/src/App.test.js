import { render, screen, fireEvent } from '@testing-library/react';
import { AppRouter } from './App';

test('starts on the homepage and opens the login screen from the tasker modal', () => {
  render(<AppRouter />);

  expect(screen.getByText(/How can we make your life easier\?/i)).toBeInTheDocument();

  fireEvent.click(screen.getByText(/Wanjiru M\./i));
  fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

  expect(screen.getByText(/Welcome to TaskBoy/i)).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /^Login$/i }).length).toBeGreaterThan(0);
});
