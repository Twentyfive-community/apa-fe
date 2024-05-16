import {Component, OnInit} from '@angular/core';
import {ButtonSizeTheme, ButtonTheme} from "twentyfive-style";
import {Customer} from "../../../../../models/Customer";
import {KeycloakCustomService} from "../../../../../services/keycloak.services";
import {CustomerService} from "../../../../../services/customer.service";
import {TwentyfiveModalService} from "twentyfive-modal";
import {SigningKeycloakService} from "twentyfive-keycloak-new";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit{
  customer:Customer =new Customer()
  customerIdkc :string =''

  constructor(private keycloakService: SigningKeycloakService,
              private router: Router,
              private customerService:CustomerService,
              private modalService: TwentyfiveModalService) {
  }

  ngOnInit(): void {
    this.getCustomer();
  }

  protected readonly ButtonTheme = ButtonTheme;

  private getCustomer() {
    let keycloackService=(this.keycloakService)as any;
    this.customerIdkc=keycloackService.keycloakService._userProfile.id;
    console.log(this.customerIdkc);
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
    this.keycloakService.signout();
  }

  protected readonly ButtonSizeTheme = ButtonSizeTheme;

  goToEdit() {
    this.router.navigate(['../catalogo/userEdit',this.customerIdkc]);
  }
}
