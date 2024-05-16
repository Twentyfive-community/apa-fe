import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {SigningKeycloakService} from "twentyfive-keycloak-new";

export const roleAuthGuard: CanActivateFn = (route, state) => {
  const keycloakService = inject(SigningKeycloakService);
  const router =  inject(Router);

  const userRoles: string[] = keycloakService.loggedUserRoles();

  if (userRoles.includes('admin')) {
    return true;
  }

  if (userRoles.includes('customer')) {
    router.navigate(['/catalogo']);
    return false;
  }

  return true;
};
