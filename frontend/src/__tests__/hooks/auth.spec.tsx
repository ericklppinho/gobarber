import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';

import { AuthProvider, useAuth } from '../../hooks/auth';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

const response = {
  user: {
    id: 'user123',
    name: 'John Doe',
    email: 'johndoe@example.com',
    avatar_url: 'image-test.jpg',
  },
  token: 'token-123',
};

const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
  switch (key) {
    case '@GoBarber:token':
      return response.token;
    case '@GoBarber:user':
      return JSON.stringify(response.user);
    default:
      return null;
  }
});

describe('Auth Hook', () => {
  beforeEach(() => {
    setItemSpy.mockClear();
  });

  it('should be able to sign in', async () => {
    apiMock.onPost('sessions').reply(200, response);

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'johndoe@example.com',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith('@GoBarber:token', response.token);
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(response.user),
    );

    expect(api.defaults.headers.authorization).toEqual(
      `Bearer ${response.token}`,
    );

    expect(result.current.user.email).toEqual('johndoe@example.com');
  });

  it('should restore saved data from storage when auth inits', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return response.token;
        case '@GoBarber:user':
          return JSON.stringify(response.user);
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(api.defaults.headers.authorization).toEqual(
      `Bearer ${response.token}`,
    );

    expect(result.current.user.email).toEqual(response.user.email);
  });

  it('should be able to sign out', () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    });

    expect(removeItemSpy).toHaveBeenCalledWith('@GoBarber:token');
    expect(removeItemSpy).toHaveBeenCalledWith('@GoBarber:user');

    expect(api.defaults.headers.authorization).toBeUndefined();

    expect(result.current.user).toBeUndefined();
  });

  it('should be able to update user data', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.updateUser(response.user);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(response.user),
    );

    expect(result.current.user).toEqual(response.user);
  });
});
