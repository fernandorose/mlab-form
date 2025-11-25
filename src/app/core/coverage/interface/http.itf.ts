export interface HTTPResItf<T> {
  status: string;
  ok: string;
  message: string;
  data: T;
}

export interface HTTPEDResItf<T> {
  token?: string;
  page: number;
  data: T;
  total: number;
  pages: number;
}

export interface BasePaginationItf {
  order: 'desc' | 'asc';
  totData: number;
  prvPage?: number;
  nowPage: number;
  maxPage: number;
  limPage: number;
  orderBy?: string;
}
