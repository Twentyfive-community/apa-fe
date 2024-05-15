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
  private getAllUrl: string = `${this.baseUrl}/getAll`;
  private changeStatusUrl: string = `${this.baseUrl}/changeStatus`;

  constructor(private http: HttpClient) {
  }

  getAll(page: number, size: number) {
    let p = Utils.createHttpParams({'page': page, 'size': size});
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


}
