import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {MenuItem, MenuItemToAdd} from "../models/Menu";
import {Utils} from "../shared/utils/utils";
import {ProductToEdit} from "../models/Product";

@Injectable({
  providedIn: 'root'
})
export class MenuitemService {

  private baseUrl: string = `${environment.backendUrl}/menuItems`;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(`${this.baseUrl}/getAll`);
  }

  getAllByIdCategory(id: string) {
    return this.http.get(`${this.baseUrl}/getAllByIdCategory/${id}`)
  }
  getAllByIdCategoryPaginated(idCategory: string,page: number, size: number,sortColumn: string,sortDirection:string) {
    let p = Utils.createHttpParams({'idCategory': idCategory,'page': page, 'size': size,'sortColumn': sortColumn,'sortDirection': sortDirection});
    return this.http.get(`${this.baseUrl}/getAllByIdCategoryPaginated`, {params: p})
  }

  getById(id:string){
    return this.http.get(`${this.baseUrl}/getById/${id}`)
  }
  updateById(id:string, menuItem:MenuItemToAdd){
    return this.http.patch(`${this.baseUrl}/updateById/${id}`, menuItem)
  }
  save(menuItem:ProductToEdit){
    return this.http.post(`${this.baseUrl}/save`, menuItem);
  }
  activateOrDisable(id: string) {
    return this.http.get(`${this.baseUrl}/activateOrDisable/${id}`);
  }
  deleteById(id:string) {
    return this.http.delete(`${this.baseUrl}/deleteById/${id}`);

  }
}
