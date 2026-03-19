export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  accessToken: string;
  userId: string;
  expiresAt: number; // unix millis
}

const AUTH_STORAGE_KEY = 'markethub-seller:auth';

export class AuthService {
  // Note: this is a lightweight scaffold without NgRx/HttpClient deps.
  getSession(): AuthSession | null {
    try {
      if (typeof localStorage === 'undefined') return null;
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as AuthSession;
      if (!parsed?.accessToken || !parsed?.userId || !parsed?.expiresAt) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  hasValidSession(): boolean {
    const session = this.getSession();
    return !!session && session.expiresAt > Date.now();
  }

  getAccessToken(): string | null {
    const session = this.getSession();
    return session?.accessToken ?? null;
  }

  setSession(session: AuthSession): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  }

  clearSession(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  async login(_credentials: LoginCredentials): Promise<AuthSession> {
    // TODO: call ApiService here once backend endpoints are defined.
    // This placeholder exists so the file compiles as a scaffold.
    throw new Error('AuthService.login() not implemented yet');
  }
}

