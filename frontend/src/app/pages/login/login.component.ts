import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { AuthApiService } from '../../core/api/auth-api.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  styles: [
    `
      :host {
        display: grid;
        place-items: center;
        min-height: 90vh;
        padding: 24px;
      }
      .loginBox {
        width: min(440px, 100%);
      }
    `,
  ],
  template: `
    <div class="loginBox">
      <mat-card class="page-card" style="padding: 6px;">
        <mat-card-content>
          <div style="display:flex; align-items:center; gap:10px; margin: 6px 6px 12px;">
            <div
              style="width:42px; height:42px; border-radius: 14px; background: linear-gradient(135deg,#6d5efc,#2d2a8f); display:flex; align-items:center; justify-content:center; color:white;"
            >
              <mat-icon>lock</mat-icon>
            </div>
            <div>
              <div style="font-size: 18px; font-weight: 900;">Acceso</div>
              <div style="opacity:.75;">Administradores y agentes</div>
            </div>
          </div>

          <form [formGroup]="form" class="row" style="flex-direction: column; align-items: stretch; margin: 0 6px 6px;">
            <mat-form-field appearance="outline">
              <mat-label>Login</mat-label>
              <input matInput formControlName="login" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" />
            </mat-form-field>
            <button mat-raised-button color="primary" type="button" (click)="submit()" [disabled]="form.invalid || loading">
              Entrar
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class LoginComponent {
  loading = false;

  readonly form = new FormGroup({
    login: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(
    private readonly api: AuthApiService,
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly snack: MatSnackBar,
  ) {}

  submit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;

    this.api.login(this.form.getRawValue()).subscribe({
      next: ({ token, user }) => {
        this.auth.setSession(token, user);
        const target = user.perfil === 'Admin' ? '/monitor' : '/agent/clients';
        this.router.navigateByUrl(target);
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'No se pudo iniciar sesión.';
        this.snack.open(msg, 'Cerrar', { duration: 3000 });
        this.loading = false;
      },
      complete: () => (this.loading = false),
    });
  }
}
