import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {OrderComponent} from "./pages/order/order.component";

const routes: Routes = [
  {path: '', redirectTo: 'ordini', pathMatch: 'full'},
  {
  path: '',
  component: DashboardComponent,
  children: [
    {path: 'ordini', component: OrderComponent, data: {title: 'Ordini'}},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
