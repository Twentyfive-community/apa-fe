import {Component, OnInit} from '@angular/core';
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

  sidebarItems: any[] = [
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
    }
  ]

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
  //
  exit() {
    this.keycloakService.signout();
    this.router.navigate(['../home']);
  }


  protected readonly NavbarTheme = NavbarTheme;
}
