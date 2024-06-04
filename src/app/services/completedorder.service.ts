import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Utils} from "../shared/utils/utils";
import {HttpClient, HttpParams} from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";
import {Order} from "../models/Order";

@Injectable({
  providedIn: 'root'
})
export class CompletedorderService {

  private baseUrl: string = `${environment.backendUrl}/completed_orders`;

  constructor(private http: HttpClient) {
  }

  getAll(page: number, size: number, column: string, direction: string) {
    let p = Utils.createHttpParams({'page': page, 'size': size, 'sortColumn': column, 'sortDirection': direction});
    return this.http.get(`${this.baseUrl}/getAll`, {params: p});
  }

  getOrderDetails(id: string) {
    return this.http.get(`${this.baseUrl}/${id}`)
  }

  restoreOrder(id: string) {
    return this.http.post(`${this.baseUrl}/restore/${id}`, null)
  }

  getCompletedOrdersByCustomer(userId: string, page: number = 0, size: number = 10): Observable<any> {
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


}
