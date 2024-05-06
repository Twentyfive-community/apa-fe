import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Utils} from "../shared/utils/utils";
import {Customer} from "../models/Customer";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl: string = `${environment.backendUrl}/categories`;

  constructor(private http: HttpClient) {
  }

  getAll(types: string[]) {
    let p = Utils.createHttpParams({'types': types});
    return this.http.get(`${this.baseUrl}/getAll`, {params: p});
  }


}
