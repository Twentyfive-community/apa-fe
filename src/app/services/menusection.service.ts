import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {MenuSection} from "../models/Menu";

@Injectable({
  providedIn: 'root'
})
export class MenusectionService {
  private baseUrl: string = `${environment.backendUrl}/menuSections`;


  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get(`${this.baseUrl}/getAll`);
  }
  getById(id: string) {
    return this.http.get(`${this.baseUrl}/getById/${id}`);
  }

  save(menuSection:MenuSection){
    return this.http.post(`${this.baseUrl}/save`, menuSection);
  }
  updateById(id:string, menuSection:MenuSection){
    return this.http.patch(`${this.baseUrl}/updateById/${id}`, menuSection)
  }
  deleteById(id:string){
    return this.http.delete(`${this.baseUrl}/deleteById/${id}`);
  }
}
