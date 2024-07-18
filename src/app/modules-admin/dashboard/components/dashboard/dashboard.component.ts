import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TwentyfiveModalService} from "twentyfive-modal";
import {filter, map, mergeMap} from "rxjs";
import { NavbarTheme } from 'twentyfive-style';
import {SigningKeycloakService} from "twentyfive-keycloak-new";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

  adminSidebarItems: any[] = [
    {
      title: "Ordini",
      icon: "bi bi-card-list",
      navigationUrl: "ordini",
      disableClick: false,
      labelColor: ""
    },
    {
      title: "Ordini Completati",
      icon: "bi bi-clipboard-check",
      navigationUrl: "ordini-completati",
      disableClick: false,
      labelColor: ""
    },
    {
      title: "Laboratorio",
      icon: "bi bi-cloud-fog",
      navigationUrl: "pasticceria",
      disableClick: false,
      labelColor: ""
    },
    {
      title: "Ingredienti",
      icon: "bi bi-egg",
      navigationUrl: "ingredienti",
      disableClick: false,
      labelColor: ""
    },
    {
      title: "Prodotti",
      icon: "bi bi-cake-fill",
      navigationUrl: "prodotti",
      disableClick: false,
      labelColor: ""
    },
    {
      title: "Clienti",
      icon: "bi bi-person-lines-fill",
      navigationUrl: "clienti",
      disableClick: false,
      labelColor: ""
    },
    {
      title: "Dipendenti",
      icon: "bi bi-person-fill-gear",
      navigationUrl: "dipendenti",
      disableClick: false,
      labelColor: ""
    },
    {
      title: "Catalogo",
      icon: "bi bi-journal-richtext",
      navigationUrl: "../catalogo",
      disableClick: false,
      labelColor: ""
    },
    {
      title: "Logout",
      icon: "bi bi-box-arrow-right",
      disableClick: true,
      labelColor: "",
      isLogout: true
    },
    {
      title: "Menù QR Bar",
      icon: "bi bi-qr-code-scan",
      navigationUrl: "menu",
      disableClick: false,
      labelColor: "menu"
    }
  ];

  bakerSidebarItems: any[] = [
    {
      title: "Laboratorio",
      icon: "bi bi-cloud-fog",
      navigationUrl: "pasticceria",
      disableClick: false,
      labelColor: ""
    },
    {
      title: "Logout",
      icon: "bi bi-box-arrow-right",
      disableClick: true,
      labelColor: "",
      isLogout: true
    }
  ];

  title: string = '';

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private modalService: TwentyfiveModalService,
              private keycloakService: SigningKeycloakService,
  ) { }

  ngOnInit(): void {
    this.router.events.pipe(
      // Utilize the 'map' operator to find the final child route
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      // Filter for primary outlet
      filter(route => route.outlet === 'primary'),
      // Extract route data
      mergeMap(route => route.data)
    ).subscribe(data => {
      // Update title from route data
      this.title = data['title'];
    });
  }



  checkTitle() {
    return this.title;
  }

  makeLogout(elem: any) {
    if (elem?.isLogout) {
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
  }

  assignItems() {
    let keycloakService = this.keycloakService as any;
    let roles = keycloakService.loggedUserRoles();

    if (roles.includes('admin')) {
      return this.adminSidebarItems;
    } else if (roles.includes('baker')) {
      return this.bakerSidebarItems;
    }

    return [];
  }

  exit() {
    this.keycloakService.signout();
    this.router.navigate(['../home']);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      // Evita la propagazione dell'evento di pressione del tasto TAB
      event.preventDefault();
    }
  }

  protected readonly NavbarTheme = NavbarTheme;
}
