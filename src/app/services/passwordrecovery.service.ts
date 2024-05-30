import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { KeycloakService } from 'keycloak-angular';
import {SigningKeycloakService} from "twentyfive-keycloak-new";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class KeycloakPasswordRecoveryService {

  private baseUrl: string = `${environment.backendUrl}/customers`;


  constructor(private http: HttpClient) { }

  sendPasswordResetEmail(userId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.baseUrl}/reset-password/${userId}`, {}, { headers });
  }

}
