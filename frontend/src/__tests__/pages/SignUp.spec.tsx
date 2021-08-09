import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import SignUp from '../../pages/SignUp';

const mockedHistoryPush = jest.fn();
const mockedApiPost = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  useHistory: () => ({
    push: mockedHistoryPush,
  }),
}));

jest.mock('../../services/api', () => ({
  post: () => {
    mockedApiPost.call(mockedApiPost);
  },
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

describe('SignUp Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedApiPost.mockClear();
    mockedAddToast.mockClear();
  });

  it('should be able to sign up', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameInput = getByPlaceholderText('Nome');
    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Senha');
    const submitButton = getByText('Cadastrar');

    fireEvent.change(nameInput, { target: { value: 'Jhon Doe' } });
    fireEvent.change(emailInput, { target: { value: 'jhondoe@example.com' } });
    fireEvent.change(passwordInput, {
      target: { value: '123456' },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
    });
  });

  it('should not be able to sign up with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameInput = getByPlaceholderText('Nome');
    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Senha');
    const submitButton = getByText('Cadastrar');

    fireEvent.change(nameInput, { target: { value: 'Jhon Doe' } });
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
    mockedApiPost.mockImplementationOnce(() => {
      const error: StatusError = new Error();

      error.request = {
        status: 0,
      };

      throw error;
    });

    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameInput = getByPlaceholderText('Nome');
    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Senha');
    const submitButton = getByText('Cadastrar');

    fireEvent.change(nameInput, { target: { value: 'Jhon Doe' } });
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

  it('should display an error if sign up fails', async () => {
    mockedApiPost.mockImplementationOnce(() => {
      const error: StatusError = new Error();

      error.request = {
        status: 400,
      };

      throw error;
    });

    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameInput = getByPlaceholderText('Nome');
    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Senha');
    const submitButton = getByText('Cadastrar');

    fireEvent.change(nameInput, { target: { value: 'Jhon Doe' } });
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
    mockedApiPost.mockImplementationOnce(() => {
      const error: StatusError = new Error();

      error.request = {
        status: 500,
      };

      throw error;
    });

    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameInput = getByPlaceholderText('Nome');
    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Senha');
    const submitButton = getByText('Cadastrar');

    fireEvent.change(nameInput, { target: { value: 'Jhon Doe' } });
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
