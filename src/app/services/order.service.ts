import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Utils} from "../shared/utils/utils";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl: string = `${environment.backendUrl}/orders`;

  constructor(private http: HttpClient) {
  }

  getAll(page: number, size: number) {
    let p = Utils.createHttpParams({'page': page, 'size': size});
    return this.http.get(`${this.baseUrl}`, {params: p});
  }

}
