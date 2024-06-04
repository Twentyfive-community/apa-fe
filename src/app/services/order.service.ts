import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Utils} from "../shared/utils/utils";
import {Order} from "../models/Order";
import {catchError, map, Observable, throwError} from "rxjs";

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

  cancelOrderUser(id: string) {
    return this.http.post(`${this.baseUrl}/cancel/${id}`,null)
  }

  getActiveOrdersByCustomer(userId: string, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.baseUrl}/by-customer/${userId}`, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching orders', error);
          return throwError(() => new Error('Error fetching orders'));
        })
      );
  }

  print(id: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Accept': 'application/pdf'
    });
    return this.http.get(`${this.baseUrl}/print/${id}`, { headers: headers, responseType: 'blob' });
  }}
