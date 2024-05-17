import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {DashboardClient} from "./components/dashboard-client/dashboard-client";
import {DashboardClientRoutingModule} from "./dashboard-client-routing.module";
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {CatalogueComponent} from "./pages/catalogue/catalogue.component";

@NgModule({
  declarations: [
    DashboardClient,
    CatalogueComponent,
  ],
  imports: [
    DashboardClientRoutingModule,
    SharedModule,
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle
  ]
})
export class DashboardClientModule {
}
