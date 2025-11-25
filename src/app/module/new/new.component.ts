import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, of } from 'rxjs';
import { BasePaginationItf } from '../../core/coverage/interface/http.itf';
import { DynamicSelector } from '../../core/shared/components/dynamic-selector/dynamic-selector.component';
// Importa las configuraciones
import { DatePipe } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { RoundTimePipe } from '../../core/shared/pipes/round-time.pipe';
import {
  areaConfig,
  compartimientoFurgon,
  compartimientoTolva,
  fields,
  linea,
  muestra,
} from '../coverage/data';
import { globalMlabItf, MlabService } from '../service/mlab.service';

type AreaKey = keyof typeof areaConfig;
// Define los tipos de estructura de configuración para ayudar a TypeScript
type AreaConfigEntry = { BASE_FIELDS: string[]; CONDITIONAL_FIELDS?: Record<string, string[]> };

@Component({
  selector: 'app-new',
  imports: [ReactiveFormsModule, DynamicSelector, FeatherModule, RoundTimePipe, DatePipe],
  templateUrl: './new.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class New {
  private _fb = inject(FormBuilder);
  private _mlabSrv = inject(MlabService);
  private _paginationSignal = signal<BasePaginationItf>({
    order: 'desc',
    totData: 0,
    prvPage: 1,
    nowPage: 1,
    maxPage: 1,
    limPage: 25,
  });
  public paginationComputed = computed(() => this._paginationSignal());
  public allFields = fields;
  public currentTime = signal(this.getTimeString());
  public todayDate = signal(new Date());
  public frmData = this._fb.group({
    analisis: [[]],
    obs: [''],
    area: ['', [Validators.required]],
  });
  public dynForm: FormGroup<Record<string, any>> = this._fb.group({});
  public selectedArea = signal<globalMlabItf | null>(null);
  public selectedProcedenciaValue = signal<string | null>(null);

  ngOnInit(): void {
    this.scheduleNextUpdate();
  }

  public visibleFields = computed<string[]>(() => {
    const areaObj = this.selectedArea();
    const procedenciaValue = this.selectedProcedenciaValue();
    if (!areaObj || !areaObj.NOMBRE) return [];
    const areaKey = areaObj.NOMBRE.toUpperCase() as AreaKey;
    const config: AreaConfigEntry = areaConfig[areaKey] as AreaConfigEntry;
    if (!config || !config.BASE_FIELDS) return [];
    let requiredNames: string[] = [];
    if (config.CONDITIONAL_FIELDS) {
      const conditionalValue = procedenciaValue?.toUpperCase() ?? '';
      if (config.CONDITIONAL_FIELDS[conditionalValue]) {
        requiredNames = config.CONDITIONAL_FIELDS[conditionalValue];
      } else requiredNames = config.BASE_FIELDS;
    } else if (config.BASE_FIELDS) requiredNames = config.BASE_FIELDS;
    return Array.from(new Set(requiredNames));
  });

  private scheduleNextUpdate() {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ms = now.getMilliseconds();
    const nextMark = minutes < 30 ? 30 : 60;
    const minutesToNext = nextMark - minutes;
    const timeToNext = minutesToNext * 60000 - seconds * 1000 - ms;
    setTimeout(() => {
      this.currentTime.set(this.getTimeString());
      this.scheduleNextUpdate();
    }, timeToNext);
  }

  private getTimeString(): string {
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');
    return `${hh}:${mm}`;
  }

  loadAreas = (page: number, filter: string) => {
    return this._mlabSrv.getArea(filter, page);
  };

  loadAnalisis = (page: number, filter: string) => {
    return this._mlabSrv.getAnalisis(filter, page);
  };

  loadProductos = (page: number, filter: string) => {
    return this._mlabSrv.getProduct(filter, page);
  };

  loadCompartimientoTolva = (page: number) => {
    if (page === 1) {
      const data: globalMlabItf[] = compartimientoTolva.map(
        (name, index) =>
          ({
            ID: name,
            NOMBRE: name,
          }) as globalMlabItf,
      );

      return of(data);
    }
    return of([]);
  };

  loadCompartimientoFurgon = (page: number) => {
    if (page === 1) {
      const data: globalMlabItf[] = compartimientoFurgon.map(
        (name, index) =>
          ({
            ID: name,
            NOMBRE: name,
          }) as globalMlabItf,
      );

      return of(data);
    }
    return of([]);
  };

  loadLineas = (page: number) => {
    if (page === 1) {
      const data: globalMlabItf[] = linea.map(
        (name, index) =>
          ({
            ID: name,
            NOMBRE: name,
          }) as globalMlabItf,
      );

      return of(data);
    }
    return of([]);
  };

  loadTMuestra = (page: number) => {
    if (page === 1) {
      const data: globalMlabItf[] = muestra.map(
        (name, index) =>
          ({
            ID: name,
            NOMBRE: name,
          }) as globalMlabItf,
      );

      return of(data);
    }
    return of([]);
  };

  loadProcedencia = (page: number, filter: string) => {
    const areaObj = this.selectedArea();
    if (!areaObj) return of([]);

    return this._mlabSrv.getProcByArea(areaObj.NOMBRE, page, filter).pipe(
      map((list) => {
        return list;
      }),
    );
  };

  getSelectorLoader = (field: string) => {
    if (field === 'producto') return this.loadProductos;
    if (field === 'procedencia') return this.loadProcedencia;
    if (field === 'compartimientotolva') return this.loadCompartimientoTolva;
    if (field === 'compartimientofurgon') return this.loadCompartimientoFurgon;
    if (field === 'linea') return this.loadLineas;
    if (field === 'tmuestra') return this.loadTMuestra;
    return () => of([]);
  };

  onSelectorSelected(field: string, item: globalMlabItf) {
    const valueToSet = field === 'compartimientotolva' ? item.NOMBRE : item.ID;
    this.dynForm.get(field)?.setValue(valueToSet);
    if (field === 'producto') this.onProductoSelected(item);
    if (field === 'procedencia') this.onProcedenciaSelected(item);
  }

  onAreaSelected(area: globalMlabItf) {
    this.dynForm.reset();
    this.frmData.reset();
    this.frmData.controls['area'].setValue(area.ID);
    this.selectedArea.set(area);
    this.selectedProcedenciaValue.set(null);
    this.syncFormControls(this.visibleFields());
  }

  onProductoSelected(item: globalMlabItf) {
    this.dynForm.get('producto')?.setValue(item.ID);
  }

  onProcedenciaSelected(item: globalMlabItf) {
    this.dynForm.get('procedencia')?.setValue(item.ID);
    this.selectedProcedenciaValue.set(item.NOMBRE?.toUpperCase() ?? null);
    this.syncFormControls(this.visibleFields());
  }

  syncFormControls(visibles: string[]) {
    visibles.forEach((name) => {
      if (!this.dynForm.get(name)) {
        const fieldConfig = this.allFields.find((f) => f.name === name);
        const initialValue = fieldConfig?.type === 'selector' ? null : '';

        this.dynForm.addControl(name, this._fb.control(initialValue, Validators.required));
      }
    });

    Object.keys(this.dynForm.controls).forEach((key) => {
      if (!visibles.includes(key)) this.dynForm.removeControl(key);
    });
  }

  isFieldMultiple(fieldName: string): boolean {
    const multipleFields = ['compartimientofurgon', 'compartimientotolva'];
    return multipleFields.includes(fieldName);
  }
}
