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
    if(this.imAdmin)return this.adminItems;
    else return this.navbarItems;
  }

  private loadUserProfile() {
    let keycloakService = this.signingKeycloakService as any;
    if(keycloakService.keycloakService._instance.authenticated){
      keycloakService.keycloakService.loadUserProfile().then((profile: any) => {
        this.customerIdkc = profile.id;
        if (this.customerIdkc != null) {
          this.customerService.getCustomerByKeycloakId(this.customerIdkc).subscribe((res: any) => {
            this.customer = res;
            this.updateNavbarItems(); // Aggiorna navbarItems dopo aver ottenuto il cliente
          });
        }

        this.imAdmin = keycloakService.loggedUserRoles().includes('admin');
        this.updateNavbarItems(); // Aggiorna navbarItems anche se l'utente è admin
      }).catch((err: any) => {
        console.error('Failed to load user profile', err);
        this.updateNavbarItems(); // Aggiorna navbarItems comunque per gestire il caso di errore
      });
    } else {
      this.updateNavbarItems();
    }
  }


  protected readonly NavbarTheme = NavbarTheme;
}
