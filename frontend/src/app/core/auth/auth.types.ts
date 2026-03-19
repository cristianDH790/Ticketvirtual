export type Perfil = 'Admin' | 'Agente';

export interface AuthUser {
  id: number;
  nombres: string;
  ventanilla: string | null;
  login?: string;
  perfil: Perfil;
}

