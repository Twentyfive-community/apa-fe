import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Utils} from "../shared/utils/utils";
import {Customer} from "../models/Customer";
import {Category} from "../models/Category";

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
  getAllDisabled(types: string[]) {
    let p = Utils.createHttpParams({'types': types});
    return this.http.get(`${this.baseUrl}/getAllDisabled`, {params: p});
  }
  getById(id:string){
    return this.http.get(`${this.baseUrl}/getById/${id}`);
  }
  saveCategory(category: Category) {
    return this.http.post(`${this.baseUrl}/save`, category);
  }

  getCategory(id: string){
    return this.http.get(`${this.baseUrl}/getById/${id}`);
  }

  disableCategory(id: string){
    return this.http.get(`${this.baseUrl}/disableById/${id}`);
  }
  enableCategory(id: string){
    return this.http.get(`${this.baseUrl}/activateById/${id}`);
  }

  deleteCategory(id: string){
    return this.http.get(`${this.baseUrl}/deleteById/${id}`);
  }

  setOrderPriorities(priorities: { [key: string]: number }){
    return this.http.post<boolean>(`${this.baseUrl}/setOrderPriorities`, priorities);
  }






}
