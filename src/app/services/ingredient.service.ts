import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Utils} from "../shared/utils/utils";
import {Customer} from "../models/Customer";
import {Ingredient, IngredientToSave} from "../models/Ingredient";

@Injectable({
  providedIn: 'root'
})
export class IngredientService {

  private baseUrl: string = `${environment.backendUrl}/ingredients`;


  constructor(private http: HttpClient) {
  }

  getAll(idCategory: string, page: number, size: number, column: string, direction: string) {
    let p = Utils.createHttpParams({'idCategory': idCategory, 'page': page, 'size': size, 'sortColumn': column, 'sortDirection': direction});
    return this.http.get(`${this.baseUrl}/getAll`, {params: p});
  }

  disableIngredient(id: string){
    return this.http.get(`${this.baseUrl}/disableById/${id}`);
  }

  getIngredientById(id: string){
    return this.http.get(`${this.baseUrl}/getById/${id}`);
  }


  activeIngredient(id: string){
    return this.http.get(`${this.baseUrl}/activateById/${id}`);
  }

  saveIngredient(ingredient: IngredientToSave){
    return this.http.post(`${this.baseUrl}/save`,ingredient);
  }








}
