import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import SignIn from '../../pages/SignIn';

const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  useHistory: () => ({
    push: mockedHistoryPush,
  }),
}));

jest.mock('../../hooks/auth', () => ({
  useAuth: () => ({
    signIn: mockedSignIn,
  }),
}));

jest.mock('../../hooks/toast', () => ({
  useToast: () => ({
    addToast: mockedAddToast,
  }),
}));

interface StatusError extends Error {
  request?: {
    status?: number;
  };
}

describe('SignIn Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedSignIn.mockClear();
    mockedAddToast.mockClear();
  });

  it('should be able to sign in', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Senha');
    const submitButton = getByText('Entrar');

    fireEvent.change(emailInput, { target: { value: 'jhondoe@example.com' } });
    fireEvent.change(passwordInput, {
      target: { value: '123456' },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should not be able to sign in with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Senha');
    const submitButton = getByText('Entrar');

    fireEvent.change(emailInput, { target: { value: 'not-valid-email' } });
    fireEvent.change(passwordInput, {
      target: { value: '123456' },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should display an error if connection fails', async () => {
    mockedSignIn.mockImplementation(() => {
      const error: StatusError = new Error();

      error.request = {
        status: 0,
      };

      throw error;
    });

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Senha');
    const submitButton = getByText('Entrar');

    fireEvent.change(emailInput, { target: { value: 'jhondoe@example.com' } });
    fireEvent.change(passwordInput, {
      target: { value: '123456' },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });

  it('should display an error if login fails', async () => {
    mockedSignIn.mockImplementation(() => {
      const error: StatusError = new Error();

      error.request = {
        status: 400,
      };

      throw error;
    });

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Senha');
    const submitButton = getByText('Entrar');

    fireEvent.change(emailInput, { target: { value: 'jhondoe@example.com' } });
    fireEvent.change(passwordInput, {
      target: { value: '123456' },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });

  it('should display an error if server fails', async () => {
    mockedSignIn.mockImplementation(() => {
      const error: StatusError = new Error();

      error.request = {
        status: 500,
      };

      throw error;
    });

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Senha');
    const submitButton = getByText('Entrar');

    fireEvent.change(emailInput, { target: { value: 'jhondoe@example.com' } });
    fireEvent.change(passwordInput, {
      target: { value: '123456' },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
