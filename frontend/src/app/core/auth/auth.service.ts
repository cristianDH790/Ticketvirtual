import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUser } from './auth.types';

const TOKEN_KEY = 'tq_token';
const USER_KEY = 'tq_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenSig = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly userSig = signal<AuthUser | null>(
    localStorage.getItem(USER_KEY) ? (JSON.parse(localStorage.getItem(USER_KEY)!) as AuthUser) : null,
  );

  readonly token = computed(() => this.tokenSig());
  readonly user = computed(() => this.userSig());
  readonly isAuthenticated = computed(() => !!this.tokenSig());

  constructor(private readonly router: Router) {}

  setSession(token: string, user: AuthUser): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.tokenSig.set(token);
    this.userSig.set(user);
  }

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.tokenSig.set(null);
    this.userSig.set(null);
    this.router.navigateByUrl('/login');
  }
}

