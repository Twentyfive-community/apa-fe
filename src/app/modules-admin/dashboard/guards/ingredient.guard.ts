// ingredient.guard.ts
import { Injectable } from '@angular/core';
import {CanDeactivate} from '@angular/router';
import { Observable } from 'rxjs';
import { IngredientEditComponent } from '../pages/ingredient-edit/ingredient-edit.component';
import { TwentyfiveModalService } from 'twentyfive-modal';

@Injectable({
  providedIn: 'root'
})
export class IngredientGuard implements CanDeactivate<IngredientEditComponent> {

  constructor(private modalService: TwentyfiveModalService) {}

  canDeactivate(component: IngredientEditComponent): Observable<boolean> | boolean {
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
