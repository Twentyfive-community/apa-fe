// ingredient.guard.ts
import { Injectable } from '@angular/core';
import {CanDeactivate} from '@angular/router';
import { Observable } from 'rxjs';
import { TwentyfiveModalService } from 'twentyfive-modal';
import {CustomerEditComponent} from "../pages/customer-edit/customer-edit.component";

@Injectable({
  providedIn: 'root'
})
export class CustomerGuard implements CanDeactivate<CustomerEditComponent> {

  constructor(private modalService: TwentyfiveModalService) {}

  canDeactivate(component: CustomerEditComponent): Observable<boolean> | boolean {
    if (component.hasChanges()) {
      return new Observable<boolean>((observer) => {
        this.modalService.openModal(
          'Procedendo in questo modo si perderanno i dati inseriti. Continuare?',
          '',
          'Annulla',
          'Conferma',
          {
            size: 'md',
            onConfirm: () => {
              observer.next(true);
              observer.complete();
            }
          }
        );
      });
    }
    return true;
  }
}
