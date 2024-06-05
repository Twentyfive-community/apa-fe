import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Utils} from "../shared/utils/utils";
import {Customer} from "../models/Customer";
import {ProductToEdit} from "../models/Product";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseKgUrl: string = `${environment.backendUrl}/productsKg`;
  private baseWeightedUrl: string = `${environment.backendUrl}/productsWeighted`;
  private baseTrayUrl: string = `${environment.backendUrl}/trays`;
  private uploadProPicUrl = `${environment.ftpUrl}/uploadkkk/`;


  constructor(private http: HttpClient) {
  }

  getAllKg(idCategory: string,page: number, size: number,sortColumn: string,sortDirection:string) {
    let p = Utils.createHttpParams({'idCategory': idCategory,'page': page, 'size': size,'sortColumn': sortColumn,'sortDirection': sortDirection});
    return this.http.get(`${this.baseKgUrl}/getAll`, {params: p});
  }

  getAllKgActive(idCategory: string){
    let p = Utils.createHttpParams({'idCategory': idCategory});
    return this.http.get(`${this.baseKgUrl}/getAllActive`, {params: p});
  }

  getByIdKg(id:string){
    return this.http.get(`${this.baseKgUrl}/getById/${id}`);
  }

  disableByIdKg(id:string){
    return this.http.get(`${this.baseKgUrl}/disableById/${id}`);
  }

  activateByIdKg(id:string,booleanModal?:boolean){
    let p = Utils.createHttpParams({'booleanModal':booleanModal ? booleanModal : false});
    return this.http.get(`${this.baseKgUrl}/activateById/${id}`, {params: p});
  }

  getAllWeighted(idCategory: string,page: number, size: number,sortColumn: string,sortDirection:string) {
    let p = Utils.createHttpParams({'idCategory': idCategory,'page': page, 'size': size,'sortColumn': sortColumn,'sortDirection': sortDirection});
    return this.http.get(`${this.baseWeightedUrl}/getAll`, {params: p});
  }

  getAllForCustomizedTray(idCategory: string,page: number, size: number) {
    let p = Utils.createHttpParams({'idCategory': idCategory,'page': page, 'size': size});
    return this.http.get(`${this.baseWeightedUrl}/getAllForCustomizedTray`, {params: p});
  }
  getByIdWeighted(id:string){

    return this.http.get(`${this.baseWeightedUrl}/getById/${id}`);
  }
  disableByIdWeighted(id:string){
    return this.http.get(`${this.baseWeightedUrl}/disableById/${id}`);
  }

  activateByIdWeighted(id:string,booleanModal?:boolean){
    let p = Utils.createHttpParams({'booleanModal':booleanModal ? booleanModal : false});
    return this.http.get(`${this.baseWeightedUrl}/activateById/${id}`, {params: p});
  }
  getAllTrays(idCategory:string,page: number, size: number,sortColumn: string,sortDirection:string){
    let p = Utils.createHttpParams({'idCategory':idCategory,'page': page, 'size': size,'sortColumn': sortColumn,'sortDirection': sortDirection});
    return this.http.get(`${this.baseTrayUrl}/getAll`, {params: p});
  }

  getAllTraysActive(idCategory: string){
    let p = Utils.createHttpParams({'idCategory':idCategory});
    return this.http.get(`${this.baseTrayUrl}/getAllActive`, {params: p});
  }
  getByIdTray(id:string){
    return this.http.get(`${this.baseTrayUrl}/getById/${id}`);
  }


  activateOrDisableTray(id:string){
    return this.http.get(`${this.baseTrayUrl}/activateOrDisable/${id}`);
  }

  saveWeighted(product:ProductToEdit){
    return this.http.post(`${this.baseWeightedUrl}/save`,product);
  }
  saveKg(product:ProductToEdit){
    return this.http.post(`${this.baseKgUrl}/save`,product);
  }

  saveTray(product:ProductToEdit) {
    return this.http.post(`${this.baseTrayUrl}/save`, product);
  }

  getImageUrlByIdTray(id: string): Observable<string> {
    return this.http.get<string>(`${this.baseTrayUrl}/imageById/${id}`, { responseType: 'text' as 'json' });
  }

  uploadPic(file: File,name: string) {
    let path = `apa/products/${name}/`
    let formData = new FormData();
    formData.append('file', file)
    let h = new HttpHeaders();
    h.append('Content-type', 'multipart/form-data')
    return this.http.post(`${this.uploadProPicUrl}${path}`, formData, {headers: h, responseType: 'text'});
  }


  getImageUrlByIdKg(id: string): Observable<string> {
    return this.http.get<string>(`${this.baseKgUrl}/imageById/${id}`, { responseType: 'text' as 'json' });
  }
  getImageUrlByIdWeighted(id: string): Observable<string> {
    return this.http.get<string>(`${this.baseWeightedUrl}/imageById/${id}`, { responseType: 'text' as 'json' });
  }

}
