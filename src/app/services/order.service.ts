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
  getAllWithStatus(page: number, size: number, column: string, direction: string, status: string): Observable<Order[]> {
    let p = Utils.createHttpParams({'page': page, 'size': size, 'sortColumn': column, 'sortDirection': direction,'status': status});
    return this.http.get<Order[]>(`${this.baseUrl}/getAllWithStatus`, {params: p});
  }

  getOrderDetails(id: string) {
    return this.http.get(`${this.baseUrl}/details/${id}`)
  }
  getAllStatuses() {
    return this.http.get(`${this.baseUrl}/getAllStatuses`);
  }
  changeOrderStatus(id:string,status:string) {
    let p = Utils.createHttpParams({'status':status})
    return this.http.get(`${this.baseUrl}/changeOrderStatus/${id}`, {params: p});
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
