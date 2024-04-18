import {Component, OnInit} from '@angular/core';
import {Cookies} from "./cookies";
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements  OnInit {
  title = 'apa-fe';

  constructor(private cookies: Cookies) {
  }

  ngOnInit(): void {
    Cookies.showCookies(true);
  }


}
