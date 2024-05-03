import {NgModule} from "@angular/core";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {DashboardRoutingModule} from "./dashboard-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {OrderListComponent} from "./pages/order-list/order-list.component";
import {GenericButtonModule} from "generic-buttons";
import { OrderEditComponent } from './pages/order-edit/order-edit.component';
import { CompletedOrderComponent } from './pages/completed-order/completed-order.component';
import {CustomerListComponent} from "./pages/customer-list/customer-list.component";
import { CustomerDetailsComponent } from './pages/customer-details/customer-details.component';
import { CustomerEditComponent } from './pages/customer-edit/customer-edit.component';

@NgModule({
  declarations: [
    DashboardComponent,
    OrderListComponent,
    OrderEditComponent,
    CompletedOrderComponent,
    CustomerListComponent,
    CustomerDetailsComponent,
    CustomerEditComponent,
  ],
  imports: [
    DashboardRoutingModule,
    SharedModule,
  ]
})
export class DashboardModule {
}
