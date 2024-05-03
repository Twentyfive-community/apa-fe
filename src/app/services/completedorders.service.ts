import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Utils} from "../shared/utils/utils";

@Injectable({
  providedIn: 'root'
})
export class CompletedordersService {

  private baseUrl: string = `${environment.backendUrl}/completed_orders`;

  constructor(private http: HttpClient) {
  }

  getCompletedOrdersById(page: number, size: number, id:string) {
    let p = Utils.createHttpParams({'page': page, 'size': size});
    return this.http.get(`${this.baseUrl}/by-customer/${id}`, {params: p});
  }

  getDetailsOrderById(id: string){
    return this.http.get(`${this.baseUrl}/${id}`);
  }


}
