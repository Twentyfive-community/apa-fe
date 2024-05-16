import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TwentyfiveNavbarModule} from "twentyfive-nav";
import {TwentyfiveSidebarModule} from "twentyfive-sidebar";
import {TwentyfiveAccordionTableModule} from "twentyfive-accordion-table";
import {CollapseModule} from "ngx-bootstrap/collapse";
import {TwentyfiveTableModule} from "twentyfive-table";
import {TwentyfiveInputModule} from "twentyfive-input";
import {GenericButtonModule} from "generic-buttons";
import { CategoryEditComponent } from './category-edit/category-edit.component';
import {TwentyfiveModalGenericComponentModule} from "twentyfive-modal-generic-component";
import { GenericCardComponent } from './generic-card/generic-card.component';

@NgModule({
  declarations: [
    CategoryEditComponent,
    GenericCardComponent,
  ],
  imports: [
    CommonModule,
    TwentyfiveNavbarModule,
    TwentyfiveSidebarModule,
    TwentyfiveAccordionTableModule,
    CollapseModule,
    TwentyfiveTableModule,
    TwentyfiveInputModule,
    GenericButtonModule,
    TwentyfiveModalGenericComponentModule
  ],
  exports: [
    CommonModule,
    TwentyfiveNavbarModule,
    TwentyfiveSidebarModule,
    TwentyfiveAccordionTableModule,
    CollapseModule,
    TwentyfiveTableModule,
    TwentyfiveInputModule,
    GenericButtonModule,
    GenericCardComponent,
  ]
})
export class SharedModule {
}
