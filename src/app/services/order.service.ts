import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Utils} from "../shared/utils/utils";
import {Order} from "../models/Order";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl: string = `${environment.backendUrl}/orders`;

  constructor(private http: HttpClient) {
  }

  getAll(page: number, size: number, column: string, direction: string): Observable<Order[]> {
    let p = Utils.createHttpParams({'page': page, 'size': size, 'sortColumn': column, 'sortDirection': direction});
    return this.http.get<Order[]>(`${this.baseUrl}/getAll`, {params: p});
  }

  getOrderDetails(id: string) {
    return this.http.get(`${this.baseUrl}/details/${id}`)
  }

  completeOrder(id: string) {
    return this.http.post(`${this.baseUrl}/complete/${id}`, null)
  }

  cancelOrder(id: string) {
    return this.http.post(`${this.baseUrl}/adminCancel/${id}`,null)
  }

}
