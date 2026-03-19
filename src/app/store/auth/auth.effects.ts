import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';
import { AuthResponse } from '../../core/models';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  // Use `inject()` to avoid referencing instance fields before Angular
  // assigns constructor parameter properties (important for SSR/runtime).
  private readonly actions$ = inject(Actions);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ email, password }) =>
        this.apiService.post<AuthResponse>('/auth/login', { email, password }).pipe(
          map(response => AuthActions.loginSuccess({ response })),
          catchError(error =>
            of(AuthActions.loginFailure({ error: error.error?.message || 'Login failed' }))
          ),
        )
      ),
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/dashboard'])),
      ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ name, email, password }) =>
        this.apiService.post<AuthResponse>('/auth/register', { name, email, password }).pipe(
          map(response => AuthActions.registerSuccess({ response })),
          catchError(error =>
            of(AuthActions.registerFailure({ error: error.error?.message || 'Registration failed' }))
          ),
        )
      ),
    )
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => this.router.navigate(['/dashboard'])),
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => this.router.navigate(['/auth/login'])),
      ),
    { dispatch: false }
  );
}