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
    return this.http.get(`${this.baseUrl}/getAll`, {params: p});
  }

  getOrderDetails(id: string) {
    return this.http.get(`${this.baseUrl}/details/${id}`)
  }

  completeOrder(id: string) {
    return this.http.post(`${this.baseUrl}/complete/${id}`, null)
  }

  cancelOrder(id: string) {
    return this.http.post(`${this.baseUrl}/cancel/${id}`,null)
  }

}
