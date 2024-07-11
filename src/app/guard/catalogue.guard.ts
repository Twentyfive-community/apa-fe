import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {SigningKeycloakService} from "twentyfive-keycloak-new";

export const catalogueGuard: CanActivateFn = (route, state) => {
  const keycloakService = inject(SigningKeycloakService);
  const router =  inject(Router);

  const userRoles: string[] = keycloakService.loggedUserRoles();

  if (userRoles.includes('baker')) {
    router.navigate(['/dashboard/pasticceria']);
    return false;
  }

  return true;
};
