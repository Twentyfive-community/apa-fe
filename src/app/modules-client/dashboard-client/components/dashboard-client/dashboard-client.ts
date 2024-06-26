import {Component, OnInit} from '@angular/core';
import {NavbarTheme} from "twentyfive-style";
import {CustomerDetails} from "../../../../models/Customer";
import {SigningKeycloakService} from "twentyfive-keycloak-new";
import {CustomerService} from "../../../../services/customer.service";
import {LoadingService} from "../../../../services/loading.service";
import {delay} from "rxjs";

@Component({
  selector: 'app-dashboard-client',
  templateUrl: './dashboard-client.html',
  styleUrl: './dashboard-client.scss'
})
export class DashboardClient implements OnInit{

  loading: boolean = false;

  customer:CustomerDetails =new CustomerDetails()
  customerIdkc : string = ''

  navbarItems: any[] = [
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

  notLoggedItem: any[] = [
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

  adminItems: any[] = [
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


  constructor(private signingKeycloakService: SigningKeycloakService,
              private customerService:CustomerService,
              private loadingService: LoadingService) {
  }


  ngOnInit(): void{
    this.loadUserProfile();
    this.listenToLoading()
  }

  listenToLoading(): void {
    this.loadingService.loading$
      .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        this.loading = loading;
      });
  }


  assignItems(){
    let keycloakService = this.signingKeycloakService as any;

    if(keycloakService.loggedUserRoles().includes('admin')) {
      return this.adminItems
    } else if (keycloakService.loggedUserRoles().includes('customer')) {
      return this.navbarItems
    } else {
      return this.notLoggedItem
    }
  }

  private loadUserProfile() {
    let keycloakService = this.signingKeycloakService as any;

    this.customerIdkc = keycloakService.keycloakService._userProfile.id;

    if (this.customerIdkc) {
      this.customerService.getCustomerByKeycloakId(this.customerIdkc).subscribe((res: any) => {
        this.customer = res;
      });
    }
  }


  protected readonly NavbarTheme = NavbarTheme;
}
