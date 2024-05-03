import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {OrderListComponent} from "./pages/order-list/order-list.component";
import {OrderEditComponent} from "./pages/order-edit/order-edit.component";
import {CompletedOrderComponent} from "./pages/completed-order/completed-order.component";

const routes: Routes = [
  {path: '', redirectTo: 'ordini', pathMatch: 'full'},
  {
  path: '',
  component: DashboardComponent,
  children: [
    {path: 'ordini', component: OrderListComponent, data: {title: 'Ordini'}},
    {path: 'modifica-ordine', component: OrderEditComponent, data:{title: 'Crea Ordine'}},
    {path: 'modifica-ordine/:id', component: OrderEditComponent, data:{title: 'Modifica Ordine'}},
    {path: 'ordini-completati', component: CompletedOrderComponent, data:{title: 'Ordini Completati'}}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
