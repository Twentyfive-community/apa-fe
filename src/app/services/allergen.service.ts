import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Utils} from "../shared/utils/utils";
import {Customer} from "../models/Customer";

@Injectable({
  providedIn: 'root'
})
export class AllergenService {

  private baseUrl: string = `${environment.backendUrl}/allergens`;


  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get(`${this.baseUrl}/getAll`);
  }







}
