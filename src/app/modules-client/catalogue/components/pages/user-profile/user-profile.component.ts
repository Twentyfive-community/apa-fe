import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { CustomerDetails} from "../../../../../models/Customer";
import {SigningKeycloakService} from "twentyfive-keycloak-new";
import {CustomerService} from "../../../../../services/customer.service";
import {ButtonSizeTheme, ButtonTheme} from "twentyfive-style";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class UserProfileComponent implements OnInit{
  customerId: string ='';
  customer : CustomerDetails = new CustomerDetails();

  constructor (private keycloakService:SigningKeycloakService,
               private customerService:CustomerService,
               private router:Router){

  }

  ngOnInit(): void {
        this.getKeycloakId();
        this.getCustomer();
    }



  getKeycloakId(){
    let keycloakService = (this.keycloakService)as any;
    this.customerId = keycloakService.keycloakService._userProfile.id;
  }

  getCustomer(){
    this.customerService.getCustomerByKeycloakId(this.customerId).subscribe((res:any) =>{
      this.customer=res;
    });
  }

  goToEdit(){
    this.router.navigate(['/catalogue/modifica-profilo', this.customerId])
  }




  protected readonly ButtonTheme = ButtonTheme;
  protected readonly ButtonSize = ButtonSizeTheme;
}


