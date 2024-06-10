// ingredient.guard.ts
import { Injectable } from '@angular/core';
import {CanDeactivate} from '@angular/router';
import { Observable } from 'rxjs';
import { TwentyfiveModalService } from 'twentyfive-modal';
import {ProductEditComponent} from "../pages/product-edit/product-edit.component";

@Injectable({
  providedIn: 'root'
})
export class ProductGuard implements CanDeactivate<ProductEditComponent> {

  constructor(private modalService: TwentyfiveModalService) {}

  canDeactivate(component: ProductEditComponent): Observable<boolean> | boolean {
   if (component.navigationType === "back") {
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
