import { Component } from '@angular/core';
import {NavbarTheme} from "twentyfive-style";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent {

  navbarItems: any[] = [
    {
      title: "Profilo",
      icon: "bi bi-person",
      navigationUrl: "profilo",
      disableClick: false,
      labelColor: ""
    },
    {
      title: "Carrello",
      icon: "bi bi-cart",
      navigationUrl: "",
      disableClick: false,
      labelColor: ""
    },
  ]



    protected readonly NavbarTheme = NavbarTheme;
}
