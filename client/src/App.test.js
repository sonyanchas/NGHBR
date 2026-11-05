import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { AppRouter } from './App';

jest.mock('axios');

beforeAll(() => {
  URL.createObjectURL = jest.fn(() => 'blob:profile-preview');
  URL.revokeObjectURL = jest.fn();
});

beforeEach(() => {
  axios.get.mockResolvedValue({
    data: {
      tasks: [{
        id: 'test-listing',
        category: 'cleaning',
        title: 'Home cleaning',
        taskerName: 'Wanjiru M.',
        location: 'Nairobi',
        price: 1500,
      }],
    },
  });
  axios.post.mockReset();
});

const fillRegistrationFields = (container) => {
  const inputs = container.querySelectorAll('input:not([type="file"])');
  ['Jane', 'Doe', 'jane@example.com', '0712345678', 'password123'].forEach((value, index) => {
    fireEvent.change(inputs[index], { target: { value } });
  });
};

test('starts on the homepage and opens the login screen from the tasker modal', async () => {
  render(<AppRouter />);

  expect(screen.getByText(/Rest easy, while we do the work/i)).toBeInTheDocument();
  expect(screen.getByText(/Pay by card or M-Pesa/i)).toBeInTheDocument();
  expect(screen.getByText(/Know the price upfront/i)).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/Choose a task/i), { target: { value: 'cleaning' } });
  fireEvent.click(screen.getByRole('button', { name: /Search/i }));
  fireEvent.click(await screen.findByText(/Wanjiru M\./i));
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

test('homepage task search remains a dropdown', () => {
  render(<AppRouter />);

  const taskSelect = screen.getByLabelText(/Choose a task/i);
  expect(taskSelect.tagName).toBe('SELECT');
  fireEvent.change(taskSelect, { target: { value: 'cleaning' } });
  expect(taskSelect).toHaveValue('cleaning');
});

test('My Tasks uses sidebar tabs to switch between current and completed bookings', async () => {
  const taskBookings = [
    { bookingId: 'current-booking', title: 'Current cleaning', category: 'cleaning', status: 'pending', amount: 1500 },
    { bookingId: 'completed-booking', title: 'Completed tutoring', category: 'tutoring', status: 'completed', amount: 2000 },
  ];
  axios.get.mockImplementation((url) => Promise.resolve({
    data: { tasks: url === '/api/profile/tasks' ? taskBookings : [] },
  }));
  axios.post.mockResolvedValue({
    data: {
      success: true,
      name: 'Jane Doe',
      role: 'customer',
      accessToken: 'test-access-token',
      user: { user_metadata: { name: 'Jane Doe', role: 'customer' } },
    },
  });
  render(<AppRouter />);

  fireEvent.click(screen.getByRole('button', { name: /Login \/ Register/i }));
  const inputs = document.querySelectorAll('input');
  fireEvent.change(inputs[0], { target: { value: 'jane@example.com' } });
  fireEvent.change(inputs[1], { target: { value: 'password123' } });
  fireEvent.submit(inputs[1].closest('form'));
  fireEvent.click(await screen.findByRole('button', { name: 'My Tasks' }));

  expect(await screen.findByText('Current cleaning')).toBeInTheDocument();
  expect(screen.queryByText('Completed tutoring')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Completed' }));

  expect(await screen.findByText('Completed tutoring')).toBeInTheDocument();
  expect(screen.queryByText('Current cleaning')).not.toBeInTheDocument();
});

test('registration uploads an optional profile photo with the account details', async () => {
  axios.post.mockResolvedValue({ data: { message: 'Registration created' } });
  const { container } = render(<AppRouter />);

  fireEvent.click(screen.getByRole('button', { name: /Login \/ Register/i }));
  fireEvent.click(screen.getByRole('button', { name: /^Register$/i }));
  fillRegistrationFields(container);
  const photo = new File(['image'], 'profile.png', { type: 'image/png' });
  fireEvent.change(screen.getByLabelText(/Profile photo/i), { target: { files: [photo] } });
  fireEvent.submit(container.querySelector('form'));

  await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
    '/register',
    expect.any(FormData)
  ));
  expect(axios.post.mock.calls[0][1].get('avatar')).toBe(photo);
});

test('existing users can upload a profile photo from Account Information', async () => {
  axios.post.mockImplementation((url) => Promise.resolve(
    url === '/login'
      ? {
          data: {
            success: true,
            name: 'Jane Doe',
            role: 'customer',
            accessToken: 'test-access-token',
            user: { user_metadata: { name: 'Jane Doe', role: 'customer' } },
          },
        }
      : { data: { success: true, avatar_url: 'https://example.com/avatar.png?v=1' } }
  ));
  render(<AppRouter />);

  fireEvent.click(screen.getByRole('button', { name: /Login \/ Register/i }));
  const inputs = document.querySelectorAll('input');
  fireEvent.change(inputs[0], { target: { value: 'jane@example.com' } });
  fireEvent.change(inputs[1], { target: { value: 'password123' } });
  fireEvent.submit(inputs[1].closest('form'));
  fireEvent.click(await screen.findByRole('button', { name: 'Profile' }));

  const photo = new File(['image'], 'profile.webp', { type: 'image/webp' });
  fireEvent.change(screen.getByLabelText('Profile photo'), { target: { files: [photo] } });
  expect(await screen.findByRole('img', { name: "Jane Doe's profile" })).toHaveAttribute(
    'src',
    'https://example.com/avatar.png?v=1'
  );
  expect(axios.post).toHaveBeenLastCalledWith(
    '/api/profile/avatar',
    expect.any(FormData),
    { headers: { Authorization: 'Bearer test-access-token' } }
  );
});

test('customer registration does not ask for or submit a location', async () => {
  axios.post.mockResolvedValue({ data: { message: 'Registration created' } });
  const { container } = render(<AppRouter />);

  fireEvent.click(screen.getByRole('button', { name: /Login \/ Register/i }));
  fireEvent.click(screen.getByRole('button', { name: /^Register$/i }));
  expect(screen.queryByText('Location')).not.toBeInTheDocument();

  fillRegistrationFields(container);
  fireEvent.submit(container.querySelector('form'));

  await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
    '/register',
    expect.not.objectContaining({ location: expect.anything() })
  ));
  expect(await screen.findByText(/Check your email/i)).toBeInTheDocument();
});

test('Neighbor registration keeps its selected city', async () => {
  axios.post.mockResolvedValue({ data: { message: 'Registration created' } });
  const { container } = render(<AppRouter />);

  fireEvent.click(screen.getByRole('button', { name: /Become a Neighbor/i }));
  fireEvent.change(screen.getByLabelText(/Your city/i), { target: { value: 'Nairobi' } });
  fireEvent.change(screen.getByLabelText(/Task category/i), { target: { value: 'cleaning' } });
  fireEvent.click(screen.getByRole('button', { name: /Get started/i }));
  fireEvent.click(screen.getByRole('button', { name: /I’m new to NGHBR/i }));
  expect(screen.getByText('Location')).toBeInTheDocument();

  fillRegistrationFields(container);
  fireEvent.submit(container.querySelector('form'));

  await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
    '/register',
    expect.objectContaining({ role: 'tasker', location: 'Nairobi' })
  ));
  expect(await screen.findByText(/Check your email/i)).toBeInTheDocument();
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
