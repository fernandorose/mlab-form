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

@Injectable({
  providedIn: 'root',
})
export class MlabService {
  private _http = inject(HttpClient);
  private _apikey = 'sk_service_def456uvw012';
  private readonly _url = 'http://localhost:3010/v1/api';

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

  getQueryData(query: string, page: number, limit: number) {
    return this.getData({ query, page, limit });
  }

  getProcByArea(tipo: string, page: number, filter: string) {
    return this.getData({ query: '4', page, limit: 999, filter }).pipe(
      map((res) => {
        const rows = res.data.data;
        return rows.filter((r) => r.TIPO_ID === tipo);
      }),
    );
  }

  // getCatalog(url: string, page: number = 1, filter: string = ''): Observable<globalMlabItf[]> {
  //   let params = new HttpParams().set('PageNumber', page).set('PageSize', 10);

  //   if (filter) params = params.set('Search', filter);

  //   return this._http.get<globalMlabItf[]>(url, {
  //     headers: this.getBasicHeaders(),
  //     params,
  //   });
  // }

  getArea(filter: string, page: number): Observable<globalMlabItf[]> {
    return this.getData({ query: '1', filter, page, limit: 50 }).pipe(map((res) => res.data.data));
  }

  getProduct(filter: string, page: number): Observable<globalMlabItf[]> {
    return this.getData({ query: '2', filter, page, limit: 50 }).pipe(map((res) => res.data.data));
  }

  getAnalisis(filter: string, page: number): Observable<globalMlabItf[]> {
    return this.getData({ query: '3', filter, page, limit: 50 }).pipe(map((res) => res.data.data));
  }
}
