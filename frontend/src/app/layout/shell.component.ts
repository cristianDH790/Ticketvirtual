import { Component, computed } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../core/auth/auth.service';

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  styles: [
    `
      .shell {
        min-height: 100vh;
      }
      .topbar {
        position: sticky;
        top: 0;
        z-index: 10;
        backdrop-filter: blur(8px);
      }
      .topbar mat-toolbar {
        background: linear-gradient(135deg, #2d2a8f, #6d5efc);
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 900;
        letter-spacing: -0.3px;
      }
      .brandBadge {
        width: 34px;
        height: 34px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.18);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .content {
        padding: 20px 0 30px;
      }
      .drawer {
        width: 270px;
      }
      .drawerHeader {
        padding: 16px 16px 12px;
      }
      .who {
        font-weight: 900;
      }
      .role {
        opacity: 0.75;
        margin-top: 4px;
      }
      .nav a.mat-mdc-list-item {
        border-radius: 12px;
        margin: 4px 10px;
      }
      .nav a.is-active {
        background: rgba(109, 94, 252, 0.14);
      }
      .navIcon {
        margin-right: 12px;
      }
    `,
  ],
  template: `
    <mat-sidenav-container class="shell">
      <mat-sidenav class="drawer" mode="side" opened>
        <div class="drawerHeader">
          <div class="brand" style="margin-bottom: 12px;">
            <div class="brandBadge"><mat-icon>confirmation_number</mat-icon></div>
            <div>Gestión de Colas</div>
          </div>
          <div class="who">{{ auth.user()?.nombres }}</div>
          <div class="role">
            {{ auth.user()?.perfil }} @if (auth.user()?.ventanilla) { · {{ auth.user()?.ventanilla }} }
          </div>
        </div>
        <mat-divider></mat-divider>

        <mat-nav-list class="nav">
          @if (isAdmin()) {
            <a mat-list-item routerLink="/monitor" routerLinkActive="is-active">
              <mat-icon class="navIcon">dashboard</mat-icon>
              Monitor
            </a>
            <a mat-list-item routerLink="/admin/users" routerLinkActive="is-active">
              <mat-icon class="navIcon">group</mat-icon>
              Usuarios
            </a>
          }

          @if (isAgente()) {
            <a mat-list-item routerLink="/agent/clients" routerLinkActive="is-active">
              <mat-icon class="navIcon">support_agent</mat-icon>
              Mis clientes
            </a>
          }
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <div class="topbar">
          <mat-toolbar>
            <span class="brand">
              <span style="opacity:.95;">Panel</span>
            </span>
            <span class="spacer"></span>
            <button mat-button [matMenuTriggerFor]="userMenu" matTooltip="Cuenta">
              <mat-icon>account_circle</mat-icon>
              {{ auth.user()?.login ?? auth.user()?.nombres }}
            </button>
            <mat-menu #userMenu="matMenu">
              <button mat-menu-item disabled>
                <mat-icon>badge</mat-icon>
                <span>{{ auth.user()?.perfil }}</span>
              </button>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Salir</span>
              </button>
            </mat-menu>
          </mat-toolbar>
        </div>

        <div class="container content">
          <router-outlet />
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
})
export class ShellComponent {
  readonly isAdmin = computed(() => this.auth.user()?.perfil === 'Admin');
  readonly isAgente = computed(() => this.auth.user()?.perfil === 'Agente');

  constructor(public readonly auth: AuthService) {}

  logout(): void {
    this.auth.clearSession();
  }
}
