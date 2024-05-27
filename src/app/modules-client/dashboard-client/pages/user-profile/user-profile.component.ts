import {Component, OnInit} from '@angular/core';
import { ButtonSizeTheme, ButtonTheme } from 'twentyfive-style';
import {TwentyfiveModalService} from "twentyfive-modal";
import {CustomerService} from "../../../../services/customer.service";
import {Router} from "@angular/router";
import {SigningKeycloakService} from "twentyfive-keycloak-new";
import {Customer, CustomerDetails} from "../../../../models/Customer";
import {KeycloakCustomService} from "../../../../services/keycloak.services";
import {KeycloakPasswordRecoveryService} from "../../../../services/passwordrecovery.service";

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
    this.router.navigate(['../catalogo/ordini',this.customer.id],{queryParams:{activeOrders:true}});

  }

  goToCompletedOrders() {
    this.router.navigate(['../catalogo/ordini',this.customer.id],{queryParams:{activeOrders:false}});

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
        })
      });

  }
}
