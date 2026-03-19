import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UsersApiService } from '../../core/api/users-api.service';
import { AuthUser } from '../../core/auth/auth.types';
import { UserFormDialogComponent } from './user-form-dialog.component';
import { PageHeaderComponent } from '../../shared/page-header.component';

@Component({
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    PageHeaderComponent,
  ],
  template: `
    <app-page-header title="Usuarios" subtitle="Administración de administradores y agentes.">
      <button mat-raised-button color="primary" type="button" (click)="openCreate()">
        <mat-icon>person_add</mat-icon>
        Nuevo
      </button>
    </app-page-header>

    <mat-card class="page-card">
      <div class="table-wrap">
        <table mat-table [dataSource]="users()" style="width: 100%;">
          <ng-container matColumnDef="nombres">
            <th mat-header-cell *matHeaderCellDef>Nombres</th>
            <td mat-cell *matCellDef="let u">{{ u.nombres }}</td>
          </ng-container>

          <ng-container matColumnDef="login">
            <th mat-header-cell *matHeaderCellDef>Login</th>
            <td mat-cell *matCellDef="let u">{{ u.login }}</td>
          </ng-container>

          <ng-container matColumnDef="perfil">
            <th mat-header-cell *matHeaderCellDef>Perfil</th>
            <td mat-cell *matCellDef="let u">
              <span class="pill" [class.pill--admin]="u.perfil === 'Admin'" [class.pill--agente]="u.perfil === 'Agente'">
                <mat-icon style="font-size:16px; height:16px; width:16px;">{{ u.perfil === 'Admin' ? 'shield' : 'support_agent' }}</mat-icon>
                {{ u.perfil }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="ventanilla">
            <th mat-header-cell *matHeaderCellDef>Ventanilla</th>
            <td mat-cell *matCellDef="let u">{{ u.ventanilla ?? '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let u" style="white-space: nowrap;">
              <button mat-icon-button type="button" matTooltip="Editar" (click)="openEdit(u)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button type="button" color="warn" matTooltip="Eliminar" (click)="remove(u)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns"></tr>
        </table>
      </div>
    </mat-card>
  `,
})
export class AdminUsersComponent {
  readonly columns = ['nombres', 'login', 'perfil', 'ventanilla', 'actions'];
  private readonly usersSig = signal<AuthUser[]>([]);
  readonly users = computed(() => this.usersSig());

  constructor(
    private readonly api: UsersApiService,
    private readonly dialog: MatDialog,
    private readonly snack: MatSnackBar,
  ) {
    this.refresh();
  }

  refresh(): void {
    this.api.list({ page: 1, perPage: 50 }).subscribe({
      next: (res) => this.usersSig.set(res.data),
      error: () => this.snack.open('No se pudo cargar usuarios.', 'Cerrar', { duration: 3000 }),
    });
  }

  openCreate(): void {
    const ref = this.dialog.open(UserFormDialogComponent, { data: { mode: 'create' } });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.api
        .create({
          nombres: value.nombres,
          login: value.login,
          perfil: value.perfil,
          ventanilla: value.ventanilla,
          password: value.password,
        })
        .subscribe({
          next: () => {
            this.snack.open('Usuario creado.', 'Cerrar', { duration: 2000 });
            this.refresh();
          },
          error: (err) => {
            const msg = err?.error?.message ?? 'No se pudo crear.';
            this.snack.open(msg, 'Cerrar', { duration: 3000 });
          },
        });
    });
  }

  openEdit(user: AuthUser): void {
    const ref = this.dialog.open(UserFormDialogComponent, { data: { mode: 'edit', user } });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      const payload: Record<string, unknown> = {
        nombres: value.nombres,
        login: value.login,
        perfil: value.perfil,
        ventanilla: value.ventanilla,
      };
      if (value.password) payload['password'] = value.password;

      this.api.update(user.id, payload as any).subscribe({
        next: () => {
          this.snack.open('Usuario actualizado.', 'Cerrar', { duration: 2000 });
          this.refresh();
        },
        error: () => this.snack.open('No se pudo actualizar.', 'Cerrar', { duration: 3000 }),
      });
    });
  }

  remove(user: AuthUser): void {
    if (!confirm(`¿Eliminar a ${user.nombres}?`)) return;
    this.api.remove(user.id).subscribe({
      next: () => {
        this.snack.open('Usuario eliminado.', 'Cerrar', { duration: 2000 });
        this.refresh();
      },
      error: () => this.snack.open('No se pudo eliminar.', 'Cerrar', { duration: 3000 }),
    });
  }
}
