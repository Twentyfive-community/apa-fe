import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class SettingService {

  private baseSettingUrl: string = `${environment.backendUrl}/settings`;

  constructor(private http:HttpClient) {
  }


  get(){
    return this.http.get(`${this.baseSettingUrl}/get`);
  }

  isAlertOn(){
    return this.http.get(`${this.baseSettingUrl}/alert`);
  }

  getAllLocations(){
    return this.http.get(`${this.baseSettingUrl}/getAllLocations`);
  }

  getAllRoles() {
    return this.http.get(`${this.baseSettingUrl}/getAllRoles`);
  }
}
