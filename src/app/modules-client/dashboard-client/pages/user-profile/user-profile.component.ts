import {Component, OnInit} from '@angular/core';
import { ButtonSizeTheme, ButtonTheme } from 'twentyfive-style';
import {TwentyfiveModalService} from "twentyfive-modal";
import {CustomerService} from "../../../../services/customer.service";
import {Router} from "@angular/router";
import {SigningKeycloakService} from "twentyfive-keycloak-new";
import {Customer, CustomerDetails} from "../../../../models/Customer";
import {KeycloakCustomService} from "../../../../services/keycloak.services";
import {KeycloakPasswordRecoveryService} from "../../../../services/passwordrecovery.service";
declare var bootstrap: any;
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit{
  customer:CustomerDetails =new CustomerDetails()
  customerIdkc :string =''

  constructor(private signingKeycloakService: SigningKeycloakService,
              private router: Router,
              private passwordRecoveryService: KeycloakPasswordRecoveryService,
              private customerService:CustomerService,
              private modalService: TwentyfiveModalService) {
  }

  ngOnInit(): void {
    this.loadBootstrapJS();
    this.getCustomer();
  }

  protected readonly ButtonTheme = ButtonTheme;

  private getCustomer() {
    let keycloackService=(this.signingKeycloakService)as any;
    this.customerIdkc=keycloackService.keycloakService._userProfile.id;
    if(this.customerIdkc!=null){
      this.customerService.getCustomerByKeycloakId(this.customerIdkc).subscribe( (res:any) =>{
        this.customer = res
      })
    }
  }
  loadBootstrapJS(): void {
    if (!document.querySelector('script[src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }

  makeLogout() {
    this.modalService.openModal(
      'Hai deciso di uscire! Confermi?',
      'Occhio!',
      'Annulla',
      'Conferma',
      {
        size: 'md',
        showIcon: true,
        onConfirm: () => this.exit()
      })

  }
  //
  exit() {
    this.signingKeycloakService.signout();
  }

  protected readonly ButtonSizeTheme = ButtonSizeTheme;

  goToEdit() {
    this.router.navigate(['../catalogo/modifica-profilo',this.customerIdkc]);
  }

  goToActiveOrders() {
    if (this.customer.activeOrdersCount=='0'){
      const contactModal = new bootstrap.Modal(document.getElementById('contactModal'), {
        keyboard: false
      });
      contactModal.show();
    }
    else this.router.navigate(['../catalogo/ordini',this.customer.id],{queryParams:{activeOrders:true}});

  }

  goToCompletedOrders() {
    if (this.customer.completedOrdersCount=='0'){
      const contactModal = new bootstrap.Modal(document.getElementById('contactModal'), {
        keyboard: false
      });
      contactModal.show();
    }
    else this.router.navigate(['../catalogo/ordini',this.customer.id],{queryParams:{activeOrders:false}});

  }

  resetPassword() {
    this.modalService.openModal(
      'Se continui verrà inviata una e-mail a '+this.customer.email+' con un link da cui potrai cambiare la password relativa al tuo account. Vuoi procedere?',
      'Reset Password',
      'Annulla',
      'Conferma',
      {
        size: 'md',
        onConfirm: (() => {
          this.router.navigate(['../catalogo/profilo']);
          this.passwordRecoveryService.sendPasswordResetEmail(this.customerIdkc).subscribe({
            next: () => {
              console.log('Email di recupero password inviata con successo.');
            },
            error: (error) => {
              console.log('Errore durante l\'invio dell\'email di recupero.');
            }
          });
          const emailConfirmationModal = new bootstrap.Modal(document.getElementById('emailConfirmationModal'), {
            keyboard: false
          });
          emailConfirmationModal.show();
        })
      });

  }
}
