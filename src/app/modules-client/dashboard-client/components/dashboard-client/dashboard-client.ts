import {Component, OnInit} from '@angular/core';
import {NavbarTheme} from "twentyfive-style";
import {CustomerDetails} from "../../../../models/Customer";
import {SigningKeycloakService} from "twentyfive-keycloak-new";
import {CustomerService} from "../../../../services/customer.service";

@Component({
  selector: 'app-dashboard-client',
  templateUrl: './dashboard-client.html',
  styleUrl: './dashboard-client.scss'
})
export class DashboardClient implements OnInit{


  customer:CustomerDetails =new CustomerDetails()
  customerIdkc : string = ''
  imAdmin: string=''
  navbarItems: any[] = [];
  adminItems: any[] = [];




  private updateNavbarItems() {
    if (this.customerIdkc !== '') {
      this.navbarItems = [
        {
          title: "Profilo",
          icon: "bi bi-person",
          navigationUrl: "profilo",
          disableClick: false,
          labelColor: "",
        },
        {
          title: "Carrello",
          icon: "bi bi-cart",
          navigationUrl: "carrello",
          disableClick: false,
          labelColor: "",
        },
      ];
    }
    else{
      this.navbarItems = [
        {
          title: "Profilo",
          icon: "bi bi-person",
          navigationUrl: "../dashboard",
          disableClick: false,
          labelColor: "",
        },
        {
          title: "Carrello",
          icon: "bi bi-cart",
          navigationUrl: "../dashboard",
          disableClick: false,
          labelColor: "",
        },
      ];
    }

    this.adminItems = [
      {
        title: "Admin",
        icon: "bi bi-motherboard",
        navigationUrl: "../dashboard",
        disableClick: false,
        labelColor: "",
      },
      {
        title: "Carrello",
        icon: "bi bi-cart",
        navigationUrl: "carrello",
        disableClick: false,
        labelColor: "",
      },
    ];
  }

  constructor(private signingKeycloakService: SigningKeycloakService,
              private customerService:CustomerService,) {
  }


  ngOnInit(): void{
    this.getCustomer()
    this.updateNavbarItems()
  }


  assignItems(){
    if(this.imAdmin)return this.adminItems;
    else return this.navbarItems;
  }

  private getCustomer() {
    let keycloackService=(this.signingKeycloakService)as any;
    this.customerIdkc=keycloackService.keycloakService._userProfile.id;
    console.log(keycloackService.keycloakService._userProfile.id);
    if(this.customerIdkc!=null){
      this.customerService.getCustomerByKeycloakId(this.customerIdkc).subscribe( (res:any) =>{
        this.customer = res
      })
    }
    //this.imAdmin=keycloackService.keycloakService._userProfile.role;
    this.imAdmin=keycloackService.loggedUserRoles().includes('admin');
    //verifica qui se l'utente è admin
  }

protected readonly NavbarTheme = NavbarTheme;
}
