import {NgModule} from "@angular/core";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {DashboardRoutingModule} from "./dashboard-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {OrderListComponent} from "./pages/order-list/order-list.component";
import {GenericButtonModule} from "generic-buttons";

@NgModule({
  declarations: [
    DashboardComponent,
    OrderListComponent,
  ],
  imports: [
    DashboardRoutingModule,
    SharedModule,
    GenericButtonModule,
  ]
})
export class DashboardModule {
}
