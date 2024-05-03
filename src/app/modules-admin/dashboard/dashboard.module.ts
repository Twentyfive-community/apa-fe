import {NgModule} from "@angular/core";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {DashboardRoutingModule} from "./dashboard-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {OrderListComponent} from "./pages/order-list/order-list.component";
import {GenericButtonModule} from "generic-buttons";
import { OrderEditComponent } from './pages/order-edit/order-edit.component';
import { CompletedOrderComponent } from './pages/completed-order/completed-order.component';

@NgModule({
  declarations: [
    DashboardComponent,
    OrderListComponent,
    OrderEditComponent,
    CompletedOrderComponent,
  ],
  imports: [
    DashboardRoutingModule,
    SharedModule,
  ]
})
export class DashboardModule {
}
