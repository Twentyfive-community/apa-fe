import {CanDeactivate} from '@angular/router';
import {Injectable} from "@angular/core";
import {TwentyfiveModalService} from "twentyfive-modal";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GenericDeactivateGuard implements CanDeactivate<any> {
  constructor(private modalService: TwentyfiveModalService) {}

  // ToDo: FUNZIONA solo se clicchi prima o annulla o torna indietro
  // cliccando direttamente su sidebar non si attiva
  // probabile problema con navigationType che non viene contato come back

  canDeactivate(component: any): Observable<boolean> | boolean {
    if (component.hasChanges() && component.navigationType === "back") {
      return new Observable<boolean>((observer) => {
        this.modalService.openModal(
          'Procedendo in questo modo si perderanno i dati inseriti. Continuare?',
          'Esci',
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
