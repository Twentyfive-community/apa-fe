import {Component} from '@angular/core';
import {NavbarTheme} from "twentyfive-style";

@Component({
  selector: 'app-dashboard-client',
  templateUrl: './dashboard-client.html',
  styleUrl: './dashboard-client.scss'
})
export class DashboardClient{

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
    }
  ]

protected readonly NavbarTheme = NavbarTheme;
}
