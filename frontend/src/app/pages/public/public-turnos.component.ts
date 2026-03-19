import { CommonModule } from '@angular/common';
import { Component, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { map, Subscription, switchMap, timer } from 'rxjs';
import { ClientsApiService, ClienteRow } from '../../core/api/clients-api.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatSnackBarModule],
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
      }
      .screen {
        min-height: 100vh;
        padding: 22px 22px 26px;
      }
      .topbar {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        margin-bottom: 14px;
      }
      .spacer {
        flex: 1 1 auto;
      }
      .title {
        font-size: 26px;
        font-weight: 800;
        letter-spacing: -0.3px;
      }
      .sub {
        opacity: 0.75;
      }
      .right {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .clock {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        padding: 8px 12px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(109, 94, 252, 0.18);
        box-shadow: 0 10px 24px rgba(17, 24, 39, 0.08);
        line-height: 1.05;
      }
      .clockTime {
        font-size: 34px;
        font-weight: 900;
        letter-spacing: -0.6px;
        color: #12123b;
      }
      .clockDate {
        font-size: 12px;
        font-weight: 800;
        opacity: 0.75;
      }
      .layout {
        display: grid;
        grid-template-columns: 1fr 1fr 0.85fr;
        gap: 16px;
      }
      @media (max-width: 900px) {
        .layout {
          grid-template-columns: 1fr;
        }
        .clock {
          align-items: flex-start;
        }
      }
      .panel {
        border-radius: 16px;
        overflow: hidden;
      }
      .panelHeader {
        padding: 14px 16px;
        color: white;
        background: linear-gradient(135deg, #2d2a8f, #6d5efc);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .panelHeader .label {
        font-weight: 800;
      }
      .list {
        padding: 16px;
        background: white;
      }
      .bigRow {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 14px 14px;
        border-radius: 14px;
        background: #f4f6ff;
        border: 1px solid rgba(109, 94, 252, 0.15);
        margin-bottom: 10px;
      }
      .turno {
        font-size: 44px;
        font-weight: 900;
        letter-spacing: -0.8px;
        color: #2d2a8f;
        line-height: 1;
      }
      .vent {
        font-size: 22px;
        font-weight: 800;
        color: #12123b;
      }
      .name {
        opacity: 0.8;
      }
      .waitRow {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 10px 12px;
        border-bottom: 1px solid #eee;
      }
      .pill {
        background: rgba(45, 42, 143, 0.08);
        color: #2d2a8f;
        font-weight: 800;
        border-radius: 999px;
        padding: 6px 10px;
        min-width: 80px;
        text-align: center;
      }
      .empty {
        opacity: 0.7;
        padding: 10px 0;
      }
    `,
  ],
  template: `
    <div class="screen">
      <div class="topbar">
        <div>
          <div class="title">Turnos</div>
          <div class="sub">Pantalla pública. Se actualiza automáticamente cada 5 segundos.</div>
        </div>
        <span class="spacer"></span>
        <div class="right">
          <div class="clock" aria-label="Reloj">
            @if (now$ | async; as now) {
              <div class="clockTime">{{ now | date: 'shortTime' }}</div>
              <!-- <div class="clockDate">{{ now | date: 'fullDate' }}</div> -->
            }
          </div>
          <button mat-raised-button color="primary" type="button" (click)="refresh()">
            <mat-icon>refresh</mat-icon> Actualizar
          </button>
        </div>
      </div>

      <div class="layout">
        <mat-card class="panel">
          <div class="panelHeader">
            <div class="label">En atención</div>
            <div style="opacity: 0.9;">Asignado</div>
          </div>
          <div class="list">
            @if (atencion().length === 0) {
              <div class="empty">Aún no hay clientes en atención.</div>
            }
            @for (c of atencion(); track (c.turno ?? c.id)) {
              <div class="bigRow">
                <div>
                  <div class="turno">#{{ c.turno ?? c.id }}</div>
                  <div class="name">{{ c.nombre }}</div>
                </div>
                <div style="text-align: right;">
                  <div class="vent">{{ c.ventanilla ?? 'Ventanilla' }}</div>
                  <div class="name">{{ c.agente ?? '' }}</div>
                </div>
              </div>
            }
          </div>
        </mat-card>

        <mat-card class="panel">
          <div class="panelHeader" style="background: linear-gradient(135deg, #12123b, #2d2a8f);">
            <div class="label">En espera</div>
            <div style="opacity: 0.9;">Nuevo</div>
          </div>
          <div class="list">
            @if (espera().length === 0) {
              <div class="empty">No hay clientes en espera.</div>
            }
            @for (c of espera(); track (c.turno ?? c.id)) {
              <div class="waitRow">
                <div style="display: flex; flex-direction: column;">
                  <div style="font-weight: 700;">{{ c.nombre }}</div>
                  <div style="opacity: 0.7;">DNI: {{ c.dni }}</div>
                </div>
                <div class="pill">#{{ c.turno ?? c.id }}</div>
              </div>
            }
          </div>
        </mat-card>

        <mat-card class="panel">
          <div class="panelHeader" style="background: linear-gradient(135deg, #0e0f20, #12123b);">
            <div class="label">Turnos finalizados</div>
            <div style="opacity: 0.9;">Últimos</div>
          </div>
          <div class="list">
            @if (history().length === 0) {
              <div class="empty">Aún no hay turnos finalizados.</div>
            }
            @for (c of history(); track (c.turno ?? c.id)) {
              <div class="waitRow">
                <div style="display: flex; flex-direction: column;">
                  <div style="font-weight: 800;">#{{ c.turno ?? c.id }} · {{ c.estado }}</div>
                  <div style="opacity: 0.75;">{{ c.nombre }}</div>
                </div>
                <div style="opacity: 0.8; font-weight: 700;">{{ c.ventanilla ?? '-' }}</div>
              </div>
            }
          </div>
        </mat-card>
      </div>
    </div>
  `,
})
export class PublicTurnosComponent implements OnDestroy {
  private readonly sub = new Subscription();
  readonly atencion = signal<ClienteRow[]>([]);
  readonly espera = signal<ClienteRow[]>([]);
  readonly history = signal<ClienteRow[]>([]);
  readonly now$ = timer(0, 1000).pipe(map(() => new Date()));

  constructor(private readonly api: ClientsApiService, private readonly snack: MatSnackBar) {
    this.sub.add(
      timer(0, 5000)
        .pipe(switchMap(() => this.api.publicTurnos()))
        .subscribe({
          next: (res) => {
            const data = res.data ?? [];
            this.atencion.set(data.filter((x) => x.estado === 'Asignado'));
            this.espera.set(data.filter((x) => x.estado === 'Nuevo'));
            this.history.set((res.history ?? []).slice(0, 10));
          },
          error: () => this.snack.open('No se pudieron cargar los turnos.', 'Cerrar', { duration: 2500 }),
        }),
    );
  }

  refresh(): void {
    this.api.publicTurnos().subscribe({
      next: (res) => {
        const data = res.data ?? [];
        this.atencion.set(data.filter((x) => x.estado === 'Asignado'));
        this.espera.set(data.filter((x) => x.estado === 'Nuevo'));
        this.history.set((res.history ?? []).slice(0, 10));
      },
      error: () => this.snack.open('No se pudieron cargar los turnos.', 'Cerrar', { duration: 2500 }),
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

