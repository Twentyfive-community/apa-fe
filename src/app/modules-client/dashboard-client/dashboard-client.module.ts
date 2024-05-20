import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {DashboardClient} from "./components/dashboard-client/dashboard-client";
import {DashboardClientRoutingModule} from "./dashboard-client-routing.module";
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {CatalogueComponent} from "./pages/catalogue/catalogue.component";
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import {UserEditComponent} from "./pages/user-edit/user-edit.component";
import { UserOrderComponent } from './pages/user-order/user-order.component';

@NgModule({
  declarations: [
    DashboardClient,
    CatalogueComponent,
    UserProfileComponent,
    UserEditComponent,
    UserOrderComponent,
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
