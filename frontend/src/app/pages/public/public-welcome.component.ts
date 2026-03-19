import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { KioskoRegisterComponent } from '../kiosko-register/kiosko-register.component';

@Component({
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatCardModule, MatDividerModule, MatIconModule, KioskoRegisterComponent],
	  styles: [
	    `
	      :host {
	        display: block;
	        min-height: 100vh;
	      }
	      .center {
	        min-height: 90vh;
	        display: flex;
	        align-items: center;
	        padding: 24px 0;
	      }
	      @media (max-height: 760px) {
	        .center {
	          align-items: flex-start;
	        }
	      }
	      .hero {
	        border-radius: 16px;
	        padding: 28px 22px;
	        color: white;
        background: radial-gradient(1200px circle at 20% 10%, #6d5efc 0%, #2d2a8f 40%, #12123b 100%);
        box-shadow: 0 18px 50px rgba(18, 18, 59, 0.25);
        margin-bottom: 16px;
      }
      .hero h1 {
        margin: 0 0 8px 0;
        font-weight: 700;
        letter-spacing: -0.4px;
      }
      .hero p {
        margin: 0;
        opacity: 0.9;
      }
      .grid {
        display: grid;
        grid-template-columns: 1.15fr 0.85fr;
        gap: 16px;
      }
      @media (max-width: 900px) {
        .grid {
          grid-template-columns: 1fr;
        }
      }
      .tips {
        padding: 18px;
        border-radius: 16px;
        background: white;
      }
      .tip {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        padding: 10px 0;
      }
      .tip mat-icon {
        margin-top: 2px;
        opacity: 0.85;
      }
      .cta {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 12px;
      }
    `,
	  ],
	  template: `
	    <div class="center">
	      <div class="container">
	      <section class="hero">
	        <h1>Bienvenido</h1>
	        <p>Registra tu DNI y Nombre para generar tu turno. Gracias por tu visita.</p>
	        <div class="cta">
          <a mat-stroked-button style="color: #fff; border-color: rgba(255,255,255,.55)" routerLink="/login">
            Ingresar (Admin/Agente)
          </a>
        </div>
      </section>

      <section class="grid">
        <mat-card style="border-radius: 16px;">
          <mat-card-content>
            <app-kiosko-register [embedded]="true" title="Registro de cliente"></app-kiosko-register>
          </mat-card-content>
        </mat-card>

        <div class="tips">
          <h3 style="margin: 0 0 6px 0;">¿Cómo funciona?</h3>
          <mat-divider></mat-divider>

          <div class="tip">
            <mat-icon>confirmation_number</mat-icon>
            <div>
              <div style="font-weight: 600;">1) Registro</div>
              <div style="opacity: .8;">Ingresa tu DNI y Nombre.</div>
            </div>
          </div>

          <div class="tip">
            <mat-icon>schedule</mat-icon>
            <div>
              <div style="font-weight: 600;">2) Espera</div>
              <div style="opacity: .8;">Tu turno queda en cola (FIFO).</div>
            </div>
          </div>

          <div class="tip">
            <mat-icon>support_agent</mat-icon>
            <div>
              <div style="font-weight: 600;">3) Atención</div>
              <div style="opacity: .8;">Tu turno aparecerá en la pantalla pública de turnos.</div>
            </div>
          </div>

          <div class="tip">
            <mat-icon>task_alt</mat-icon>
            <div>
              <div style="font-weight: 600;">4) Confirmación</div>
              <div style="opacity: .8;">Verás un mensaje de registro exitoso.</div>
            </div>
          </div>
        </div>
	      </section>
	      </div>
	    </div>
	  `,
	})
	export class PublicWelcomeComponent {}
