import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as AuthActions from '../../../store/auth/auth.actions';
import {
  selectAuthLoading,
  selectAuthError,
} from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1>🛒 MarketHub</h1>
        <h2>Create Seller Account</h2>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Full Name</label>
            <input
              type="text"
              formControlName="name"
              placeholder="John Doe"
            />
            <span class="error"
              *ngIf="form.get('name')?.errors?.['required'] && form.get('name')?.touched">
              Name is required
            </span>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input
              type="email"
              formControlName="email"
              placeholder="seller@example.com"
            />
            <span class="error"
              *ngIf="form.get('email')?.errors?.['email'] && form.get('email')?.touched">
              Enter a valid email
            </span>
          </div>

          <div class="form-group">
            <label>Password</label>
            <input
              type="password"
              formControlName="password"
              placeholder="Min 6 characters"
            />
            <span class="error"
              *ngIf="form.get('password')?.errors?.['minlength'] && form.get('password')?.touched">
              Password must be at least 6 characters
            </span>
          </div>

          <div class="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              formControlName="confirmPassword"
              placeholder="Repeat password"
            />
            <span class="error"
              *ngIf="form.errors?.['mismatch'] && form.get('confirmPassword')?.touched">
              Passwords do not match
            </span>
          </div>

          <div class="error" *ngIf="error$ | async as error">{{ error }}</div>

          <button type="submit" [disabled]="form.invalid || (loading$ | async)">
            {{ (loading$ | async) ? 'Creating account...' : 'Register' }}
          </button>
        </form>

        <p>Already have an account? <a routerLink="/auth/login">Login</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
    }
    .auth-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    h1 { text-align: center; margin-bottom: 0.5rem; }
    h2 { text-align: center; color: #666; margin-bottom: 2rem; }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background: #ff6b35;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
    }
    button:disabled { opacity: 0.7; cursor: not-allowed; }
    .error { color: red; font-size: 0.875rem; margin-top: 0.25rem; }
    p { text-align: center; margin-top: 1rem; }
    a { color: #ff6b35; }
  `],
})
export class RegisterComponent {
  form: FormGroup;

  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.form = this.fb.group(
        {
          name: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', Validators.required],
        },
        { validators: this.passwordMatch },
      );

    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
  }

  passwordMatch(form: any) {
    const pass = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { name, email, password } = this.form.value;
      this.store.dispatch(
        AuthActions.register({
          name: name!,
          email: email!,
          password: password!,
        }),
      );
    }
  }
}