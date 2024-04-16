import {NgModule} from "@angular/core";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {DashboardRoutingModule} from "./dashboard-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {OrderComponent} from "./pages/order/order.component";

@NgModule({
  declarations: [
    DashboardComponent,
    OrderComponent,
  ],
  imports: [
    DashboardRoutingModule,
    SharedModule,
  ]
})
export class DashboardModule {
}
