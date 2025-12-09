import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { HTTPEDResItf, HTTPResItf } from '@core/coverage/interface/http.itf';
import { globalMlabItf, MlabFormItf, MlabListItf } from '@core/coverage/interface/mlab.itf';
import { environment } from 'src/environments/environment';

interface PdfResponseItf {
  key: string;
  value: string;
}

@Injectable({
  providedIn: 'root',
})
export class MlabService {
  private _http = inject(HttpClient);
  private get _apikey() {
    return localStorage.getItem('apikey') ?? '';
  }

  create(body: MlabFormItf) {
    return this._http.post(`${environment.api_url}/sap/sample`, body, {
      headers: { Authorization: `Bearer ${this._apikey}` },
    });
  }

  getPdf(paramsData: {
    folio: string;
    fecha: string;
    hora: string;
    lote: string;
    area: string;
    material: string;
    compartimento: string;
    analisisRequerido: string;
    nombreOperador: string;
    codigoVehiculo: string;
    loteInspeccion: string;
    puntoMuestreo: string;
  }): Observable<HTTPResItf<PdfResponseItf>> {
    let params = new HttpParams()
      .set('folio', paramsData.folio)
      .set('fecha', paramsData.fecha)
      .set('hora', paramsData.hora)
      .set('lote', paramsData.lote)
      .set('area', paramsData.area)
      .set('material', paramsData.material)
      .set('compartimento', paramsData.compartimento)
      .set('analisisRequerido', paramsData.analisisRequerido)
      .set('nombreOperador', paramsData.nombreOperador)
      .set('codigoVehiculo', paramsData.codigoVehiculo)
      .set('loteInspeccion', paramsData.loteInspeccion)
      .set('puntoMuestreo', paramsData.puntoMuestreo);
    return this._http.get<HTTPResItf<PdfResponseItf>>(`${environment.portal_url}/lab/sample/pdf`, {
      params,
    });
  }

  getList(paramsData: {
    year: string;
    page: number;
    limit: number;
  }): Observable<HTTPResItf<HTTPEDResItf<MlabListItf[]>>> {
    let params = new HttpParams()
      .set('year', paramsData.year)
      .set('page', String(paramsData.page))
      .set('limit', String(paramsData.limit));
    return this._http.get<HTTPResItf<HTTPEDResItf<MlabListItf[]>>>(
      `${environment.api_url}/sap/sample`,
      {
        params,
        headers: { Authorization: `Bearer ${this._apikey}` },
      },
    );
  }

  getData(paramsData: {
    query: string;
    page: number;
    limit: number;
    filter?: string;
    filter2?: string;
  }): Observable<HTTPResItf<HTTPEDResItf<globalMlabItf[]>>> {
    let params = new HttpParams()
      .set('query', paramsData.query)
      .set('page', String(paramsData.page))
      .set('limit', String(paramsData.limit));

    if (paramsData.filter) params = params.set('filter', paramsData.filter);
    if (paramsData.filter2) params = params.set('filter2', paramsData.filter2);

    return this._http.get<HTTPResItf<HTTPEDResItf<globalMlabItf[]>>>(
      `${environment.api_url}/sap/catalogs`,
      {
        headers: { Authorization: `Bearer ${this._apikey}` },
        params,
      },
    );
  }

  private fetchCatalog<T>(
    query: string,
    page: number,
    limit: number,
    filter?: string,
    filter2?: string,
  ): Observable<T[]> {
    let params = new HttpParams()
      .set('query', query)
      .set('page', String(page))
      .set('limit', String(limit));

    if (filter) params = params.set('filter', filter);
    if (filter2) params = params.set('filter2', filter2);

    return this._http
      .get<HTTPResItf<HTTPEDResItf<T[]>>>(`${environment.api_url}/sap/catalogs`, {
        headers: { Authorization: `Bearer ${this._apikey}` },
        params,
      })
      .pipe(map((res) => res.data.data));
  }

  getProcByArea(tipo: string, page: number, filter: string) {
    return this.fetchCatalog<globalMlabItf>('4', page, 9999, filter).pipe(
      map((rows) => rows.filter((r) => r.TIPO_ID === tipo)),
    );
  }

  getArea(filter: string, page: number) {
    return this.fetchCatalog<globalMlabItf>('1', page, 50, filter);
  }

  getProduct(filter: string, page: number) {
    return this.fetchCatalog<globalMlabItf>('2', page, 50, filter);
  }

  getAnalisis(filter: string, page: number) {
    return this.fetchCatalog<globalMlabItf>('3', page, 50, filter);
  }

  getOperators(filter: string, page: number) {
    return this.fetchCatalog<globalMlabItf>('5', page, 50, filter);
  }

  validateOperator(filter: string) {
    return this.fetchCatalog<globalMlabItf>('5', 1, 50, filter);
  }

  validateInspectionLot(filter: string) {
    return this.fetchCatalog<globalMlabItf>('6', 1, 50, filter);
  }

  validateFolioNum(filter: string, filter2: string) {
    return this.fetchCatalog<globalMlabItf>('7', 1, 50, filter, filter2);
  }
}
