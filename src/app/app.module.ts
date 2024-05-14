import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {provideSigningModule} from "twenty-signin";
import {environment} from "../environments/environment";
import { HomeComponent } from './components/home/home.component';
import {HttpClientModule} from "@angular/common/http";
import {provideToastr, ToastrModule} from "ngx-toastr";
import {RxStompServiceService} from "./services/rxstomp/rx-stomp-service.service";
import {rxStompServiceFactory} from "./services/rxstomp/stomp-factory";
import {CommonModule} from "@angular/common";
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    provideSigningModule(environment),
    HttpClientModule,
    ToastrModule.forRoot(),
    CommonModule,
  ],
  providers: [

    provideToastr({
      timeOut: 4000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    {
      provide: RxStompServiceService,
      useFactory: rxStompServiceFactory,
    }
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
