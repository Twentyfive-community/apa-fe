import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {DashboardClient} from "./components/dashboard-client/dashboard-client";
import {DashboardClientRoutingModule} from "./dashboard-client-routing.module";

@NgModule({
  declarations: [
    DashboardClient,

  ],
  imports: [
    DashboardClientRoutingModule,
    SharedModule
  ]
})
export class DashboardClientModule {
}
