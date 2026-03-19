import { Component, OnDestroy, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Subscription, timer } from 'rxjs';
import { ClientsApiService, ClienteRow } from '../../core/api/clients-api.service';
import { PageHeaderComponent } from '../../shared/page-header.component';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule,
    PageHeaderComponent,
  ],
  template: `
    <app-page-header title="Panel del agente" subtitle="Clientes asignados y acciones de atención.">
      <button mat-raised-button color="primary" type="button" (click)="assign()">
        <mat-icon>person_search</mat-icon>
        Asignar cliente
      </button>
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
              <mat-option value="Asignado">Asignado</mat-option>
              <mat-option value="Atendido">Atendido</mat-option>
              <mat-option value="No Atendido">No Atendido</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-raised-button type="button" (click)="load()">Buscar</button>
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
          <!-- <ng-container matColumnDef="estado">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let c">{{ c.estado }}</td>
          </ng-container> -->
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
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let c" style="white-space: nowrap;">
              <button
                mat-button
                type="button"
                color="primary"
                (click)="setStatus(c, 'Atendido')"
                [disabled]="c.estado !== 'Asignado'"
              >
                Atendido
              </button>
              <button
                mat-button
                type="button"
                color="warn"
                (click)="setStatus(c, 'No Atendido')"
                [disabled]="c.estado !== 'Asignado'"
              >
                No atendido
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
export class AgentClientsComponent implements OnDestroy {
  readonly columns = ['fecha', 'dni', 'nombre', 'estado', 'actions'];
  private readonly sub = new Subscription();
  private readonly rowsSig = signal<ClienteRow[]>([]);
  readonly rows = this.rowsSig.asReadonly();
  private loadingList = false;

  readonly filters = new FormGroup({
    dni: new FormControl('', { nonNullable: true }),
    nombre: new FormControl('', { nonNullable: true }),
    estado: new FormControl('', { nonNullable: true }),
  });

  constructor(private readonly api: ClientsApiService, private readonly snack: MatSnackBar) {
    this.sub.add(timer(0, 5000).subscribe(() => this.load()));
  }

  load(): void {
    if (this.loadingList) return;
    this.loadingList = true;
    const { dni, nombre, estado } = this.filters.getRawValue();
    this.api.agentList({ dni, nombre, estado }).subscribe({
      next: (res) => this.rowsSig.set(res.data),
      error: () => {
        this.loadingList = false;
        this.snack.open('No se pudo cargar clientes.', 'Cerrar', { duration: 3000 });
      },
      complete: () => (this.loadingList = false),
    });
  }

  assign(): void {
    this.api.assignNext().subscribe({
      next: (res) => {
        if (res.data) {
          this.snack.open(`Asignado: ${res.data.dni} - ${res.data.nombre}`, 'Cerrar', { duration: 3000 });
          this.load();
          return;
        }
        this.snack.open(res.message ?? 'Sin clientes nuevos.', 'Cerrar', { duration: 2500 });
      },
      error: () => this.snack.open('No se pudo asignar.', 'Cerrar', { duration: 3000 }),
    });
  }

  setStatus(cliente: ClienteRow, estado: 'Atendido' | 'No Atendido'): void {
    this.api.updateStatus(cliente.id, estado).subscribe({
      next: () => {
        this.snack.open('Estado actualizado.', 'Cerrar', { duration: 2000 });
        this.load();
      },
      error: () => this.snack.open('No se pudo actualizar el estado.', 'Cerrar', { duration: 3000 }),
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
