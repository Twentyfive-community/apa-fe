import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardClient} from "./components/dashboard-client/dashboard-client";

const routes: Routes = [
  {
    path: '',
    component: DashboardClient,
    children: [
    ]
  }]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardClientRoutingModule {
}
