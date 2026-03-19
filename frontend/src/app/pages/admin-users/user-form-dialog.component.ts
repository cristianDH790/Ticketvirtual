import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AuthUser } from '../../core/auth/auth.types';

export interface UserDialogData {
  mode: 'create' | 'edit';
  user?: AuthUser;
}

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Nuevo usuario' : 'Editar usuario' }}</h2>
    <div mat-dialog-content>
      <form [formGroup]="form" class="row" style="flex-direction: column; align-items: stretch;">
        <mat-form-field appearance="outline">
          <mat-label>Nombres</mat-label>
          <input matInput formControlName="nombres" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Login</mat-label>
          <input matInput formControlName="login" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Perfil</mat-label>
          <mat-select formControlName="perfil">
            <mat-option value="Admin">Admin</mat-option>
            <mat-option value="Agente">Agente</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Ventanilla</mat-label>
          <input matInput formControlName="ventanilla" placeholder="Ej. Ventanilla 1" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>{{ data.mode === 'create' ? 'Password' : 'Password (opcional)' }}</mat-label>
          <input matInput type="password" formControlName="password" />
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button type="button" (click)="close()">Cancelar</button>
      <button mat-raised-button color="primary" type="button" (click)="submit()" [disabled]="form.invalid">
        Guardar
      </button>
    </div>
  `,
})
export class UserFormDialogComponent {
  readonly data = inject<UserDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<UserFormDialogComponent>);

  readonly form = new FormGroup({
    nombres: new FormControl(this.data.user?.nombres ?? '', { nonNullable: true, validators: [Validators.required] }),
    login: new FormControl(this.data.user?.login ?? '', { nonNullable: true, validators: [Validators.required] }),
    perfil: new FormControl(this.data.user?.perfil ?? 'Agente', { nonNullable: true, validators: [Validators.required] }),
    ventanilla: new FormControl(this.data.user?.ventanilla ?? ''),
    password: new FormControl('', {
      nonNullable: true,
      validators: this.data.mode === 'create' ? [Validators.required, Validators.minLength(6)] : [],
    }),
  });

  close(): void {
    this.dialogRef.close(null);
  }

  submit(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this.dialogRef.close({
      ...value,
      ventanilla: value.ventanilla?.trim() === '' ? null : value.ventanilla,
      password: value.password?.trim() === '' ? null : value.password,
    });
  }
}

