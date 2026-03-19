import { Component, OnDestroy, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription, timer } from 'rxjs';
import { ClientsApiService, ClienteRow } from '../../core/api/clients-api.service';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { AssignAgentDialogComponent } from './assign-agent-dialog.component';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    PageHeaderComponent,
  ],
  template: `
    <app-page-header title="Monitor global" subtitle="Consulta y seguimiento de clientes (con filtros).">
      <button mat-stroked-button type="button" (click)="load()">
        <mat-icon>refresh</mat-icon>
        Actualizar
      </button>
    </app-page-header>

    <mat-card class="page-card">
      <div class="card-pad">
        <form [formGroup]="filters" class="row">
          <mat-form-field appearance="outline">
            <mat-label>DNI</mat-label>
            <input matInput formControlName="dni" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Nombre</mat-label>
            <input matInput formControlName="nombre" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Estado</mat-label>
            <mat-select formControlName="estado">
              <mat-option value="">Todos</mat-option>
              <mat-option value="Nuevo">Nuevo</mat-option>
              <mat-option value="Asignado">Asignado</mat-option>
              <mat-option value="Atendido">Atendido</mat-option>
              <mat-option value="No Atendido">No Atendido</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-raised-button color="primary" type="button" (click)="load()">Buscar</button>
        </form>
      </div>

      <div class="table-wrap">
        <table mat-table [dataSource]="rows()" style="width: 100%;">
          <ng-container matColumnDef="fecha">
            <th mat-header-cell *matHeaderCellDef>Registro</th>
            <td mat-cell *matCellDef="let c">{{ c.fecha_registro }}</td>
          </ng-container>
          <ng-container matColumnDef="dni">
            <th mat-header-cell *matHeaderCellDef>DNI</th>
            <td mat-cell *matCellDef="let c">{{ c.dni }}</td>
          </ng-container>
          <ng-container matColumnDef="nombre">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let c">{{ c.nombre }}</td>
          </ng-container>
          <ng-container matColumnDef="estado">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let c">
              <span
                class="pill"
                [class.pill--nuevo]="c.estado === 'Nuevo'"
                [class.pill--asignado]="c.estado === 'Asignado'"
                [class.pill--atendido]="c.estado === 'Atendido'"
                [class.pill--noatendido]="c.estado === 'No Atendido'"
              >
                {{ c.estado }}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="agente">
            <th mat-header-cell *matHeaderCellDef>Agente/Ventanilla</th>
            <td mat-cell *matCellDef="let c">
              {{ c.agente_nombres ?? '-' }} / {{ c.agente_ventanilla ?? '-' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let c" style="white-space: nowrap;">
              <button
                mat-icon-button
                type="button"
                matTooltip="Asignar/Reasignar agente"
                (click)="openAssign(c)"
                [disabled]="c.estado === 'Atendido' || c.estado === 'No Atendido'"
              >
                <mat-icon>person_add</mat-icon>
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
export class MonitorClientsComponent implements OnDestroy {
  readonly columns = ['fecha', 'dni', 'nombre', 'estado', 'agente', 'actions'];
  private readonly sub = new Subscription();
  private readonly rowsSig = signal<ClienteRow[]>([]);
  readonly rows = this.rowsSig.asReadonly();
  private loadingList = false;

  readonly filters = new FormGroup({
    dni: new FormControl('', { nonNullable: true }),
    nombre: new FormControl('', { nonNullable: true }),
    estado: new FormControl('', { nonNullable: true }),
  });

  constructor(
    private readonly api: ClientsApiService,
    private readonly snack: MatSnackBar,
    private readonly dialog: MatDialog,
  ) {
    this.sub.add(timer(0, 5000).subscribe(() => this.load()));
  }

  load(): void {
    if (this.loadingList) return;
    this.loadingList = true;
    const { dni, nombre, estado } = this.filters.getRawValue();
    this.api.adminList({ page: 1, perPage: 50, dni, nombre, estado }).subscribe({
      next: (res) => this.rowsSig.set(res.data),
      error: () => {
        this.loadingList = false;
        this.snack.open('No se pudo cargar clientes.', 'Cerrar', { duration: 3000 });
      },
      complete: () => (this.loadingList = false),
    });
  }

  openAssign(c: ClienteRow): void {
    const ref = this.dialog.open(AssignAgentDialogComponent, {
      data: { clienteNombre: `${c.dni} - ${c.nombre}` },
    });

    ref.afterClosed().subscribe((value) => {
      const usuarioId = value?.usuario_id as number | null | undefined;
      if (!usuarioId) return;

      this.api.adminAssignClient(c.id, usuarioId).subscribe({
        next: () => {
          this.snack.open('Agente asignado.', 'Cerrar', { duration: 2000 });
          this.load();
        },
        error: (err) => {
          const msg = err?.error?.message ?? 'No se pudo asignar el agente.';
          this.snack.open(msg, 'Cerrar', { duration: 3000 });
        },
      });
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
