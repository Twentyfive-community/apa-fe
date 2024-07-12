import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

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
}
