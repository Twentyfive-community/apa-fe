import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Utils} from "../shared/utils/utils";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CompletedorderService {

  private baseUrl: string = `${environment.backendUrl}/completed_orders`;

  constructor(private http: HttpClient) {
  }

  getAll(page: number, size: number) {
    let p = Utils.createHttpParams({'page': page, 'size': size});
    return this.http.get(`${this.baseUrl}/getAll`, {params: p});
  }

  getOrderDetails(id: string) {
    return this.http.get(`${this.baseUrl}/${id}`)
  }

  restoreOrder(id: string) {
    return this.http.post(`${this.baseUrl}/restore/${id}`, null)
  }

}
