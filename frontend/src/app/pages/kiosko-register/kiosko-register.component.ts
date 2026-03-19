import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClientsApiService } from '../../core/api/clients-api.service';

@Component({
  selector: 'app-kiosko-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  template: `
    @if (!embedded) {
      <div class="container" style="max-width: 520px;">
        <mat-card style="border-radius: 16px;">
          <mat-card-title>{{ title }}</mat-card-title>
          <mat-card-content>
            <p style="margin-top: 6px; opacity: .8;">Completa tus datos para obtener tu turno.</p>
            <ng-container [ngTemplateOutlet]="formTpl" />
          </mat-card-content>
        </mat-card>
      </div>
    } @else {
      <div>
        <h2 style="margin: 0 0 6px 0;">{{ title }}</h2>
        <p style="margin: 0 0 14px 0; opacity: .8;">Completa tus datos para obtener tu turno.</p>
        <ng-container [ngTemplateOutlet]="formTpl" />
      </div>
    }

    <ng-template #formTpl>
      <form [formGroup]="form" class="row" style="flex-direction: column; align-items: stretch;">
        <mat-form-field appearance="outline">
          <mat-label>DNI</mat-label>
          <input matInput formControlName="dni" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre" />
        </mat-form-field>
        <button mat-raised-button color="primary" type="button" (click)="submit()" [disabled]="form.invalid || loading">
          Registrar
        </button>
      </form>
    </ng-template>
  `,
})
export class KioskoRegisterComponent {
  @Input() title = 'Registro (Kiosko)';
  @Input() embedded = false;

  loading = false;

  readonly form = new FormGroup({
    dni: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(5)] }),
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
  });

  constructor(private readonly api: ClientsApiService, private readonly snack: MatSnackBar) {}

  submit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;

    this.api.kioskRegister(this.form.getRawValue()).subscribe({
      next: (res) => {
        this.snack.open(res.message ?? 'Registro exitoso. ¡Gracias! Revisa la pantalla de turnos.', 'Cerrar', {
          duration: 3500,
        });
        this.form.reset({ dni: '', nombre: '' });
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'No se pudo registrar.';
        this.snack.open(msg, 'Cerrar', { duration: 3000 });
      },
      complete: () => (this.loading = false),
    });
  }
}
