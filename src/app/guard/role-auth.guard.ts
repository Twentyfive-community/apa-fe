import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {SigningKeycloakService} from "twentyfive-keycloak-new";

export const roleAuthGuard: CanActivateFn = (route, state) => {
  const keycloakService = inject(SigningKeycloakService);
  const router =  inject(Router);

  const userRoles: string[] = keycloakService.loggedUserRoles();
  const requestedUrl: string = state.url;


  if (userRoles.includes('admin')) {
    return true;
  }

  if (userRoles.includes('baker')) {
    if (requestedUrl.includes('/dashboard/pasticceria')) {
      return true;
    } else {
      router.navigate(['/dashboard/pasticceria']);
      return false;
    }
  }

  if (userRoles.includes('customer')) {
    router.navigate(['/catalogo']);
    return false;
  }

  return true;
};
