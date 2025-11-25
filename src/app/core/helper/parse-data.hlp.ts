import { HTTPEDResItf, HTTPResItf } from '../coverage/interface/http.itf';

export class ParseDataHlp {
  public static parseData<T>(signalFn: (value: T[]) => void, res: HTTPResItf<HTTPEDResItf<T[]>>) {
    if (res?.ok && Array.isArray(res?.data?.data)) {
      signalFn(res.data.data);
    } else {
      signalFn([]);
    }
  }
}
