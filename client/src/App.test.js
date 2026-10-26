import { render, screen, fireEvent } from '@testing-library/react';
import { AppRouter } from './App';

test('starts on the homepage and opens the login screen from the tasker modal', () => {
  render(<AppRouter />);

  expect(screen.getByText(/Rest easy, while we do the work/i)).toBeInTheDocument();
  expect(screen.getByText(/Pay by card or M-Pesa/i)).toBeInTheDocument();
  expect(screen.getByText(/Know the price upfront/i)).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/Choose a task/i), { target: { value: 'cleaning' } });
  fireEvent.click(screen.getByRole('button', { name: /Search/i }));
  fireEvent.click(screen.getByText(/Wanjiru M\./i));
  fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

  expect(screen.getByText(/Welcome to NGHBR/i)).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /^Login$/i }).length).toBeGreaterThan(0);
});

test('opens the account screen from the combined login and register button', () => {
  render(<AppRouter />);

  fireEvent.click(screen.getByRole('button', { name: /Login \/ Register/i }));

  expect(screen.getByText(/Welcome to NGHBR/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /^Register$/i })).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /^Login$/i }).length).toBeGreaterThan(0);
});

test('shows the Caps Lock warning on the registration password field', () => {
  const { container } = render(<AppRouter />);

  fireEvent.click(screen.getByRole('button', { name: /Login \/ Register/i }));
  fireEvent.click(screen.getByRole('button', { name: /^Register$/i }));

  const passwordField = container.querySelector('input[type="password"]');
  const capsLockEvent = new KeyboardEvent('keydown', {
    key: 'A',
    bubbles: true,
  });
  Object.defineProperty(capsLockEvent, 'getModifierState', {
    value: (key) => key === 'CapsLock',
  });
  fireEvent(passwordField, capsLockEvent);

  expect(screen.getByText(/Caps Lock is ON/i)).toBeInTheDocument();
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
