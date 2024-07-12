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
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import { GenericCardComponent } from './generic-card/generic-card.component';
import { CartProductCardComponent } from './cart-product-card/cart-product-card.component';
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import { ApaSpinnerComponent } from './apa-spinner/apa-spinner.component';
import {TwentyfiveSpinnerModule} from "twentyfive-spinner";
import { NoItemCardComponent } from './no-item-card/no-item-card.component';

@NgModule({
  declarations: [
    CategoryEditComponent,
    GenericCardComponent,
    CartProductCardComponent,
    ApaSpinnerComponent,
    NoItemCardComponent,
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
    TwentyfiveModalGenericComponentModule,
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
    FormsModule,
    RouterLink,
    TooltipModule,
    TwentyfiveSpinnerModule,
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
    CartProductCardComponent,
    ApaSpinnerComponent,
    NoItemCardComponent,
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
  ]
})
export class SharedModule {
}
