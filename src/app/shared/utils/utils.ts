import {HttpHeaders, HttpParams} from "@angular/common/http";

export class Utils {
  constructor() {
  }
  static createHttpParams(params: any) {
    let q: any = new HttpParams();
    for (let key in params) {
      q = q.append(key, params[key]);
    }
    return q;
  }
  static createHttpHeaders(params: any) {
    let q: any = new HttpHeaders();
    for (let key in params) {
      q = q.append(key, params[key]);
    }
    return q;
  }
}
