import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiPager } from './api.types';
import { AuthUser } from '../auth/auth.types';

export interface UserListResponse {
  data: AuthUser[];
  pager: ApiPager;
}

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  constructor(private readonly http: HttpClient) {}

  list(params: { page?: number; perPage?: number; login?: string; perfil?: string }) {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && `${v}` !== '') httpParams = httpParams.set(k, `${v}`);
    });
    return this.http.get<UserListResponse>(`${environment.apiBaseUrl}/users`, { params: httpParams });
  }

  create(payload: { nombres: string; ventanilla?: string | null; login: string; password: string; perfil: string }) {
    return this.http.post<{ id: number }>(`${environment.apiBaseUrl}/users`, payload);
  }

  update(
    id: number,
    payload: Partial<{ nombres: string; ventanilla: string | null; login: string; password: string; perfil: string }>,
  ) {
    return this.http.put<{ updated: boolean }>(`${environment.apiBaseUrl}/users/${id}`, payload);
  }

  remove(id: number) {
    return this.http.delete(`${environment.apiBaseUrl}/users/${id}`);
  }
}

