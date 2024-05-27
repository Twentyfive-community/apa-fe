import { Injectable } from '@angular/core';
import { KeycloakService, KeycloakOptions } from 'keycloak-angular';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {catchError, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class KeycloakCustomService {

  private url_keycloak:string='http://80.211.123.141:9001';
  private realm:string='Antica-Pasticceria';
  private clientId:string='apa-app';
  private redirect_url:string="";

  constructor(private keycloakService: KeycloakService,private http: HttpClient) { }


  async initKeycloak() {
    const options: KeycloakOptions = {
      config: {
        url: this.url_keycloak, // Modifica con l'URL del tuo server Keycloak
        realm: this.realm, // Sostituisci con il nome del tuo realm
        clientId: this.clientId // Sostituisci con il tuo client ID
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        checkLoginIframe: false
      },
      bearerExcludedUrls: ['/assets', '/home'] // Esclude URL specifici dal controllo del token
    };

    try {
      await this.keycloakService.init(options);
      console.log('Keycloak is initialized.');
    } catch (error) {
      console.error('Error during Keycloak initialization:', error);
    }
  }

  async doLogin() {
    await this.keycloakService.login();
  }

  async doLogout() {
    await this.keycloakService.logout();
  }

  async getToken(): Promise<string> {
    try {
      const token: string = await this.keycloakService.getToken();
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return '';
    }
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.keycloakService.isLoggedIn();
  }

  getUserRoles(): string[] {
    return this.keycloakService.getUserRoles(true); // true per includere solo i ruoli realm
  }

  getUsername(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.keycloakService.loadUserProfile()
        .then(profile => {
          if (profile && profile.username) {
            resolve(profile.username);
          } else {
            resolve(null);  // Assicurarsi di risolvere con null piuttosto che undefined
          }
        })
        .catch(error => {
          console.error('Failed to load user profile', error);
          reject(error);  // Utilizzare reject per gli errori
        });
    });
  }



}
