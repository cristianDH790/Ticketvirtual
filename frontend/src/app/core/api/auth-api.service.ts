import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthUser } from '../auth/auth.types';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private readonly http: HttpClient) {}

  login(payload: { login: string; password: string }) {
    return this.http.post<{ token: string; user: AuthUser }>(`${environment.apiBaseUrl}/auth/login`, payload);
  }

  me() {
    return this.http.get<{ user: AuthUser }>(`${environment.apiBaseUrl}/auth/me`);
  }
}

