import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Utils} from "../shared/utils/utils";
import {Customer} from "../models/Customer";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private baseUrl: string = `${environment.backendUrl}/customers`;
  private saveUrl: string = `${this.baseUrl}/save`;
  private getAllUrl: string = `${this.baseUrl}/getAllCustomers`;
  private changeStatusUrl: string = `${this.baseUrl}/changeStatus`;

  constructor(private http: HttpClient) {
  }

  getAllCustomer(page: number, size: number, column: string, direction: string) {
    let p = Utils.createHttpParams({'page': page, 'size': size, 'sortColumn': column, 'sortDirection': direction});
    return this.http.get(`${this.getAllUrl}`, {params: p});
  }

  getCustomerDetails(id: string){
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getCustomerByKeycloakId(kcId:string){
    return this.http.get(`${this.baseUrl}/details/byKeycloakId/${kcId}`)
  }

  saveCustomer(customer: Customer) {
    return this.http.post(`${this.saveUrl}`, customer);
  }

  saveCustomerClient(id:string,firstName:string, lastName:string, phoneNumber: string){
    return this.http.post(`${this.saveUrl}/client`, {"id":id,"firstName":firstName,"lastName":lastName, "phoneNumber":phoneNumber});
  }

  changeStatusCustomer(id: string){
    return this.http.get(`${this.changeStatusUrl}/${id}`);
  }

  deleteAccount(id: string){
    return this.http.delete(`${this.baseUrl}/delete-from-user/${id}`);
  }

  //Dipendenti
  getAllEmployees(page: number, size: number, column: string, direction: string){
    let p = Utils.createHttpParams({'page': page, 'size': size, 'sortColumn': column, 'sortDirection': direction});
    return this.http.get(`${this.baseUrl}/getAllEmployees`, {params: p});
  }


}
