import {NgModule} from "@angular/core";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {DashboardRoutingModule} from "./dashboard-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {OrderListComponent} from "./pages/order-list/order-list.component";
import { OrderEditComponent } from './pages/order-edit/order-edit.component';
import { CompletedOrderComponent } from './pages/completed-order/completed-order.component';
import {CustomerListComponent} from "./pages/customer-list/customer-list.component";
import { CustomerDetailsComponent } from './pages/customer-details/customer-details.component';
import { CustomerEditComponent } from './pages/customer-edit/customer-edit.component';
import { IngredientListComponent } from './pages/ingredient-list/ingredient-list.component';
import { IngredientEditComponent } from './pages/ingredient-edit/ingredient-edit.component';
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {TwentyfiveDropdownModule} from "twentyfive-dropdown";
import {FormsModule} from "@angular/forms";
import {TwentyfiveChipModule} from "twentyfive-chip";
import {TwentyfiveCheckboxModule} from "twentyfive-checkbox";
import { ProductListComponent } from './pages/product-list/product-list.component';
import {NgbDropdownModule} from "@ng-bootstrap/ng-bootstrap";
import { ProductEditComponent } from './pages/product-edit/product-edit.component';
import {TwentyfiveAutocompleteSyncAsyncModule} from "twentyfive-autocomplete-sync-async";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import { OrderRedoComponent } from './pages/order-redo/order-redo.component';
import {TwentyfiveTimepickerModule} from "twentyfive-timepicker";
import {TwentyfiveDatepickerModule} from "twentyfive-datepicker";

@NgModule({
  declarations: [
    DashboardComponent,
    OrderListComponent,
    OrderEditComponent,
    CompletedOrderComponent,
    CustomerListComponent,
    CustomerDetailsComponent,
    CustomerEditComponent,
    ProductListComponent,
    ProductEditComponent,
    IngredientListComponent,
    IngredientEditComponent,
    OrderRedoComponent,
  ],
  imports: [
    DashboardRoutingModule,
    SharedModule,
    NgbDropdown,
    NgbDropdownModule,
    NgbDropdownToggle,
    NgbDropdownMenu,
    TwentyfiveDropdownModule,
    FormsModule,
    TwentyfiveChipModule,
    TwentyfiveCheckboxModule,
    TwentyfiveAutocompleteSyncAsyncModule,
    TooltipModule,
    TwentyfiveTimepickerModule,
    TwentyfiveDatepickerModule,
  ],
})
export class DashboardModule {
}
