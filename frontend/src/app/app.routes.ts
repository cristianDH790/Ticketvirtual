import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';
import { ShellComponent } from './layout/shell.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { MonitorClientsComponent } from './pages/monitor-clients/monitor-clients.component';
import { AgentClientsComponent } from './pages/agent-clients/agent-clients.component';
import { HomeRedirectComponent } from './pages/home-redirect/home-redirect.component';
import { PublicWelcomeComponent } from './pages/public/public-welcome.component';
import { PublicTurnosComponent } from './pages/public/public-turnos.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'kiosko', component: PublicWelcomeComponent },
  // Pantalla pública (TV) para mostrar turnos sin registro.
  { path: 'pantalla', component: PublicTurnosComponent },
  // Compatibilidad (si ya usabas este link)
  { path: 'kiosko/turnos', redirectTo: 'pantalla', pathMatch: 'full' },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', component: HomeRedirectComponent },
      {
        path: 'admin/users',
        component: AdminUsersComponent,
        canActivate: [roleGuard],
        data: { roles: ['Admin'] },
      },
      {
        path: 'monitor',
        component: MonitorClientsComponent,
        canActivate: [roleGuard],
        data: { roles: ['Admin'] },
      },
      {
        path: 'agent/clients',
        component: AgentClientsComponent,
        canActivate: [roleGuard],
        data: { roles: ['Agente'] },
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
