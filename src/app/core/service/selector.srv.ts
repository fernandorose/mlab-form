import { inject, Injectable, Signal } from '@angular/core';
import { Observable, of } from 'rxjs';

import { globalMlabItf } from '@core/coverage/interface/mlab.itf';
import {
  compartimientoFurgon,
  compartimientoTolva,
  linea,
  muestra,
  transportista,
} from '@modMlab/coverage/data';
import { FieldNames } from '@modMlab/coverage/enums';
import { MlabService } from '@modMlab/service/mlab.srv';

@Injectable({ providedIn: 'root' })
export class DynamicSelectorService {
  private _mlabSrv = inject(MlabService);

  loadAreas = (page: number, filter: string) => this._mlabSrv.getArea(filter, page);
  loadAnalisis = (page: number, filter: string) => this._mlabSrv.getAnalisis(filter, page);
  loadProductos = (page: number, filter: string) => this._mlabSrv.getProduct(filter, page);
  loadOperators = (page: number, filter: string) => this._mlabSrv.getOperators(filter, page);
  loadProcedencia = (page: number, filter: string, selectedArea: Signal<globalMlabItf | null>) => {
    const areaObj = selectedArea();
    if (!areaObj) return of([]);
    return this._mlabSrv.getProcByArea(areaObj.NOMBRE, page, filter);
  };

  loadFromArray(arr: string[], filter: string): Observable<globalMlabItf[]> {
    const lower = filter.toLowerCase();
    const data = arr
      .filter((name) => name.toLowerCase().includes(lower))
      .map((name) => ({ ID: name, NOMBRE: name }) as globalMlabItf);

    return of(data);
  }

  getLoader(field: string, selectedArea: Signal<globalMlabItf | null>) {
    switch (field) {
      case FieldNames.AREA:
        return this.loadAreas;
      case FieldNames.ANALYSIS:
        return this.loadAnalisis;
      case FieldNames.PRODUCT:
        return this.loadProductos;
      case FieldNames.OPERATOR:
        return this.loadOperators;
      case FieldNames.ORIGIN:
        return (page: number, filter: string) => this.loadProcedencia(page, filter, selectedArea);
      case FieldNames.HOPPER_COMPARTMENT:
        return (page: number, filter: string) =>
          page === 1 ? this.loadFromArray(compartimientoTolva, filter) : of([]);
      case FieldNames.FREIGHT_CAR_COMPARTMENT:
        return (page: number, filter: string) =>
          page === 1 ? this.loadFromArray(compartimientoFurgon, filter) : of([]);
      case FieldNames.CARRIER:
        return (page: number, filter: string) =>
          page === 1 ? this.loadFromArray(transportista, filter) : of([]);
      case FieldNames.LINE:
        return (page: number, filter: string) =>
          page === 1 ? this.loadFromArray(linea, filter) : of([]);
      case FieldNames.SAMPLE_TYPE:
        return (page: number, filter: string) =>
          page === 1 ? this.loadFromArray(muestra, filter) : of([]);
    }

    return () => of([]);
  }
}
