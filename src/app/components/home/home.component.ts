import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {ButtonSizeTheme, ButtonTheme} from "twentyfive-style";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private router: Router) {
  }

  goTo() {
    this.router.navigate(['../dashboard']);
  }

  protected readonly ButtonTheme = ButtonTheme;
  protected readonly ButtonSizeTheme = ButtonSizeTheme;
}
