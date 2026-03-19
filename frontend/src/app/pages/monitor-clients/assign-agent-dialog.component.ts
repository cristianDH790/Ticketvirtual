import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsersApiService } from '../../core/api/users-api.service';
import { AuthUser } from '../../core/auth/auth.types';

export interface AssignAgentDialogData {
  clienteNombre: string;
}

@Component({
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <h2 mat-dialog-title>Asignar agente</h2>
    <div mat-dialog-content>
      <div style="opacity:.8; margin-bottom: 12px;">Cliente: <b>{{ data.clienteNombre }}</b></div>

      @if (loading) {
        <div style="display:flex; align-items:center; gap:10px; padding: 10px 0;">
          <mat-spinner diameter="20"></mat-spinner>
          <span>Cargando agentes…</span>
        </div>
      } @else {
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Agente</mat-label>
          <mat-select [formControl]="agentId">
            @for (a of agentes; track a.id) {
              <mat-option [value]="a.id">{{ a.nombres }} @if (a.ventanilla) { · {{ a.ventanilla }} }</mat-option>
            }
          </mat-select>
        </mat-form-field>
      }
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button type="button" (click)="close()">Cancelar</button>
      <button mat-raised-button color="primary" type="button" (click)="submit()" [disabled]="agentId.invalid || loading">
        Asignar
      </button>
    </div>
  `,
})
export class AssignAgentDialogComponent {
  readonly data = inject<AssignAgentDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AssignAgentDialogComponent>);
  private readonly usersApi = inject(UsersApiService);

  agentes: AuthUser[] = [];
  loading = true;
  readonly agentId = new FormControl<number | null>(null, { validators: [Validators.required] });

  constructor() {
    this.usersApi.list({ page: 1, perPage: 200, perfil: 'Agente' }).subscribe({
      next: (res) => {
        this.agentes = res.data ?? [];
        this.loading = false;
      },
      error: () => {
        this.agentes = [];
        this.loading = false;
      },
    });
  }

  close(): void {
    this.dialogRef.close(null);
  }

  submit(): void {
    if (this.agentId.invalid || this.loading) return;
    this.dialogRef.close({ usuario_id: this.agentId.value });
  }
}

