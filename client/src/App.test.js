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

test('Become a Neighbor collects city and category before offering sign-in or sign-up', () => {
  render(<AppRouter />);

  fireEvent.click(screen.getByRole('button', { name: /Become a Neighbor/i }));
  fireEvent.change(screen.getByLabelText(/Your city/i), { target: { value: 'Nairobi' } });
  fireEvent.change(screen.getByLabelText(/Task category/i), { target: { value: 'cleaning' } });
  fireEvent.click(screen.getByRole('button', { name: /Get started/i }));

  expect(screen.getByText(/Have you used NGHBR before/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /I have an account/i }));
  expect(screen.getByText(/Welcome to NGHBR/i)).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /^Login$/i }).length).toBeGreaterThan(0);
});
