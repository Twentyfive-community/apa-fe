import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TwentyfiveNavbarModule} from "twentyfive-nav";
import {TwentyfiveSidebarModule} from "twentyfive-sidebar";
import {CollapseModule} from "ngx-bootstrap/collapse";
import {TwentyfiveTableModule} from "twentyfive-table";
import {GenericButtonModule} from "generic-buttons";
import {TwentyfiveAccordionTableModule} from "twentyfive-accordion-table";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TwentyfiveAccordionTableModule,
    TwentyfiveNavbarModule,
    TwentyfiveSidebarModule,
    TwentyfiveTableModule,
    CollapseModule,
    GenericButtonModule,
  ],
  exports: [
    CommonModule,
    TwentyfiveAccordionTableModule,
    TwentyfiveNavbarModule,
    TwentyfiveSidebarModule,
    TwentyfiveTableModule,
    CollapseModule,
    GenericButtonModule,
  ]
})
export class SharedModule {
}
