import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {DashboardClient} from "./components/dashboard-client/dashboard-client";
import {DashboardClientRoutingModule} from "./dashboard-client-routing.module";
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {CatalogueComponent} from "./pages/catalogue/catalogue.component";
import {ProductDetailsComponent} from "./pages/product-details/product-details.component";
import {TwentyfiveDropdownModule} from "twentyfive-dropdown";
import {FormsModule} from "@angular/forms";
import {TwentyfiveDatepickerModule} from "twentyfive-datepicker";
import {TwentyfiveTimepickerModule} from "twentyfive-timepicker";

@NgModule({
  declarations: [
    DashboardClient,
    CatalogueComponent,
    ProductDetailsComponent
  ],
  imports: [
    DashboardClientRoutingModule,
    SharedModule,
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
    TwentyfiveDropdownModule,
    FormsModule,
    TwentyfiveDatepickerModule,
    TwentyfiveTimepickerModule
  ]
})
export class DashboardClientModule {
}
