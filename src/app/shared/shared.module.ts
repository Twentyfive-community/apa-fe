import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TwentyfiveNavbarModule} from "twentyfive-nav";
import {TwentyfiveSidebarModule} from "twentyfive-sidebar";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TwentyfiveNavbarModule,
    TwentyfiveSidebarModule,
  ],
  exports: [
    CommonModule,
    TwentyfiveNavbarModule,
    TwentyfiveSidebarModule,
  ]
})
export class SharedModule {
}
