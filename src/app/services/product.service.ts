import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Utils} from "../shared/utils/utils";
import {Customer} from "../models/Customer";
import {ProductToEdit} from "../models/Product";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseKgUrl: string = `${environment.backendUrl}/productsKg`;
  private baseWeightedUrl: string = `${environment.backendUrl}/productsWeighted`;
  private baseTrayUrl: string = `${environment.backendUrl}/trays`;

  constructor(private http: HttpClient) {
  }

  getAllKg(idCategory: string,page: number, size: number,sortColumn: string,sortDirection:string) {
    let p = Utils.createHttpParams({'idCategory': idCategory,'page': page, 'size': size,'sortColumn': sortColumn,'sortDirection': sortDirection});
    return this.http.get(`${this.baseKgUrl}/getAll`, {params: p});
  }

  getByIdKg(id:string){
    return this.http.get(`${this.baseKgUrl}/getById/${id}`);
  }

  disableByIdKg(id:string){
    let p = Utils.createHttpParams({'id':id});
    return this.http.get(`${this.baseKgUrl}/disableById`,{params: p});
  }

  activateByIdKg(id:string){
    let p = Utils.createHttpParams({'id':id});
    return this.http.get(`${this.baseKgUrl}/activateById`,{params: p});
  }
  getAllWeighted(idCategory: string,page: number, size: number,sortColumn: string,sortDirection:string) {
    let p = Utils.createHttpParams({'idCategory': idCategory,'page': page, 'size': size,'sortColumn': sortColumn,'sortDirection': sortDirection});
    return this.http.get(`${this.baseWeightedUrl}/getAll`, {params: p});
  }

  getByIdWeighted(id:string){
    return this.http.get(`${this.baseWeightedUrl}/getById/${id}`);
  }
  getAllTrays(idCategory:string,page: number, size: number,sortColumn: string,sortDirection:string){
    let p = Utils.createHttpParams({'idCategory':idCategory,'page': page, 'size': size,'sortColumn': sortColumn,'sortDirection': sortDirection});
    return this.http.get(`${this.baseTrayUrl}/getAll`, {params: p});
  }
  getByIdTray(id:string){
    return this.http.get(`${this.baseTrayUrl}/getById/${id}`);
  }

  saveWeighted(product:ProductToEdit){
    return this.http.post(`${this.baseWeightedUrl}/save`,product);
  }
  saveKg(product:ProductToEdit){
    return this.http.post(`${this.baseKgUrl}/save`,product);

  }

  saveTray(product:ProductToEdit){
    return this.http.post(`${this.baseTrayUrl}/save`,product);

  }
}
