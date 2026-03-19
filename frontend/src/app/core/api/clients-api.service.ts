import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiPager } from './api.types';

export type ClienteEstado = 'Nuevo' | 'Asignado' | 'Atendido' | 'No Atendido';

export interface ClienteRow {
  id: number;
  turno?: number | string;
  dni: string;
  nombre: string;
  fecha_registro: string;
  estado: ClienteEstado;
  usuario_id?: number | null;
  fecha_asignacion?: string | null;
  ventanilla?: string | null;
  agente?: string | null;
  agente_id?: number | null;
  agente_nombres?: string | null;
  agente_ventanilla?: string | null;
}

export interface ClientListResponse {
  data: ClienteRow[];
  pager: ApiPager;
}

@Injectable({ providedIn: 'root' })
export class ClientsApiService {
  constructor(private readonly http: HttpClient) {}

  adminList(params: { page?: number; perPage?: number; dni?: string; nombre?: string; estado?: string }) {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && `${v}` !== '') httpParams = httpParams.set(k, `${v}`);
    });
    return this.http.get<ClientListResponse>(`${environment.apiBaseUrl}/clients`, { params: httpParams });
  }

  agentList(params: { dni?: string; nombre?: string; estado?: string }) {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && `${v}` !== '') httpParams = httpParams.set(k, `${v}`);
    });
    return this.http.get<{ data: ClienteRow[] }>(`${environment.apiBaseUrl}/agent/clients`, { params: httpParams });
  }

  assignNext() {
    return this.http.post<{ data?: ClienteRow; message?: string }>(`${environment.apiBaseUrl}/agent/assign`, {});
  }

  updateStatus(id: number, estado: 'Atendido' | 'No Atendido') {
    return this.http.patch<{ updated: boolean }>(`${environment.apiBaseUrl}/clients/${id}/status`, { estado });
  }

  adminAssignClient(clienteId: number, usuarioId: number) {
    return this.http.patch<{ updated: boolean; data?: ClienteRow }>(`${environment.apiBaseUrl}/admin/clients/${clienteId}/assign`, {
      usuario_id: usuarioId,
    });
  }

  kioskRegister(payload: { dni: string; nombre: string }) {
    return this.http.post<{ id: number; message: string }>(`${environment.apiBaseUrl}/public/clients`, payload);
  }

  publicTurnos() {
    return this.http.get<{ data: ClienteRow[]; history?: ClienteRow[] }>(`${environment.apiBaseUrl}/public/turnos`);
  }
}
