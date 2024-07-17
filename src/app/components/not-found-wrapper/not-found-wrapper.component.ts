import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {SigningKeycloakService} from "twentyfive-keycloak-new";

@Component({
  selector: 'app-not-found-wrapper',
  template: `
    <lib-twentyfive-not-found
        [routerLink]="routerLink"
    ></lib-twentyfive-not-found>
  `
})
export class NotFoundWrapperComponent {
  routerLink: string;

  constructor(private route: ActivatedRoute) {
    this.routerLink = this.route.snapshot.data['routerLink'] || '/catalogo';
  }

  // ToDO:
  //  keycloakService.loggedUserRoles(); è vuoto,
  //  this.keycloakService.loggedUsername() dice che utente non è loggato!
  // routerLink: string = '';
  //
  //   let keycloakService = this.keycloakService as any;
  //   let roles = keycloakService.loggedUserRoles();
  //
  //   console.log(this.keycloakService.loggedUserRoles())
  //   console.log(this.keycloakService.loggedUsername()) //NOT WORK
  //
  //   console.log(roles)
  //
  //   if (roles.includes('admin')) {
  //     this.routerLink = '/dashboard/ordini';
  //   } else if (roles.includes('baker')) {
  //     this.routerLink = '/dashboard/pasticceria';
  //   } else {
  //     this.routerLink = '/catalogo';
  //   }
  //   console.log(this.routerLink)
  // }
}
