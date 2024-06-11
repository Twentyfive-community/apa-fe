import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {DashboardClient} from "./components/dashboard-client/dashboard-client";
import {DashboardClientRoutingModule} from "./dashboard-client-routing.module";
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {CatalogueComponent} from "./pages/catalogue/catalogue.component";
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import {UserEditComponent} from "./pages/user-edit/user-edit.component";
import { TrayCustomizedComponent } from './pages/tray-customized/tray-customized.component';
import { UserOrderComponent } from './pages/user-order/user-order.component';
import { UserOrderDetailComponent } from './pages/user-order-detail/user-order-detail.component';
import {ProductDetailsComponent} from "./pages/product-details/product-details.component";
import {TwentyfiveDropdownModule} from "twentyfive-dropdown";
import {FormsModule} from "@angular/forms";
import {TwentyfiveDatepickerModule} from "twentyfive-datepicker";
import {TwentyfiveTimepickerModule} from "twentyfive-timepicker";
import { CustomCakeComponent } from './pages/custom-cake/custom-cake.component';
import { UserCartComponent } from './pages/user-cart/user-cart.component';
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {TwentyfiveAutocompleteSyncAsyncModule} from "twentyfive-autocomplete-sync-async";

@NgModule({
  declarations: [
    DashboardClient,
    CatalogueComponent,
    UserProfileComponent,
    UserEditComponent,
    UserOrderComponent,
    UserOrderDetailComponent,
    ProductDetailsComponent,
    CustomCakeComponent,
    TrayCustomizedComponent,
    UserCartComponent
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
        TwentyfiveTimepickerModule,
        TooltipModule,
        TwentyfiveAutocompleteSyncAsyncModule
    ]
})
export class DashboardClientModule {
}
