import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HTTPEDResItf, HTTPResItf } from '../../core/coverage/interface/http.itf';

export interface globalMlabItf {
  MANDT: string;
  ID: string;
  NOMBRE: string;
  TIPO_ID: string;
}

export interface MlabFormItf {
  area: string;
  analysis: string[];
  sampling_date: string;
  sampling_time: string;
  delivery_date: string;
  delivery_time: string;
  remarks: string;
  product?: string;
  folio_number?: string;
  line?: string;
  operator?: string;
  origin?: string;
  sample_type?: string;
  inspection_lot?: string;
  package_code?: string;
  vehicle_type?: string;
  vehicle_code?: string;
  compartment?: string[];
  carrier?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class MlabService {
  private _http = inject(HttpClient);
  private _apikey = 'sk_service_def456uvw012';
  private readonly _url = 'http://localhost:3010/v1/api';

  create(body: MlabFormItf) {
    return this._http.post(`${this._url}/sap/sample`, body, {
      headers: { Authorization: `Bearer ${this._apikey}` },
    });
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

    return this._http.get<HTTPResItf<HTTPEDResItf<globalMlabItf[]>>>(`${this._url}/sap/catalogs`, {
      headers: { Authorization: `Bearer ${this._apikey}` },
      params,
    });
  }

  getProcByArea(tipo: string, page: number, filter: string) {
    return this.getData({ query: '4', page, limit: 999, filter }).pipe(
      map((res) => {
        const rows = res.data.data;
        return rows.filter((r) => r.TIPO_ID === tipo);
      }),
    );
  }

  getArea(filter: string, page: number): Observable<globalMlabItf[]> {
    return this.getData({ query: '1', filter, page, limit: 50 }).pipe(map((res) => res.data.data));
  }

  getProduct(filter: string, page: number): Observable<globalMlabItf[]> {
    return this.getData({ query: '2', filter, page, limit: 50 }).pipe(map((res) => res.data.data));
  }

  getAnalisis(filter: string, page: number): Observable<globalMlabItf[]> {
    return this.getData({ query: '3', filter, page, limit: 50 }).pipe(map((res) => res.data.data));
  }

  getOperators(filter: string, page: number): Observable<globalMlabItf[]> {
    return this.getData({ query: '5', filter, page, limit: 50 }).pipe(map((res) => res.data.data));
  }

  validateOperator(filter: string): Observable<globalMlabItf[]> {
    return this.getData({ query: '5', filter, page: 1, limit: 50 }).pipe(
      map((res) => res.data.data),
    );
  }

  validateInspectionLot(filter: string): Observable<globalMlabItf[]> {
    return this.getData({ query: '6', filter, page: 1, limit: 50 }).pipe(
      map((res) => res.data.data),
    );
  }

  validateFolioNum(filter: string, filter2: string): Observable<globalMlabItf[]> {
    return this.getData({ query: '7', filter, filter2, page: 1, limit: 50 }).pipe(
      map((res) => res.data.data),
    );
  }
}
