import { createReducer, on } from '@ngrx/store';
import { User } from '../../core/models';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// SSR-safe localStorage access: `localStorage` doesn't exist on the server.
const safeStorage: Storage | null =
  typeof localStorage !== 'undefined' ? localStorage : null;

const initialState: AuthState = {
  user: null,
  token: safeStorage?.getItem('accessToken') ?? null,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,

  on(AuthActions.login, AuthActions.register, state => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, AuthActions.registerSuccess, (state, { response }) => {
    safeStorage?.setItem('accessToken', response.accessToken);
    safeStorage?.setItem('refreshToken', response.refreshToken);
    return {
      ...state,
      user: response.user,
      token: response.accessToken,
      loading: false,
      error: null,
    };
  }),

  on(AuthActions.loginFailure, AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AuthActions.logout, state => {
    safeStorage?.removeItem('accessToken');
    safeStorage?.removeItem('refreshToken');
    return { ...state, user: null, token: null };
  }),
);