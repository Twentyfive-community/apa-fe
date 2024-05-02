import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {CustomerListComponent} from "./pages/customer-list/customer-list.component";
import {CustomerDetailsComponent} from "./pages/customer-details/customer-details.component";
import {CustomerEditComponent} from "./pages/customer-edit/customer-edit.component";

const routes: Routes = [
  {path: '', redirectTo: 'ordini', pathMatch: 'full'},
  {
  path: '',
  component: DashboardComponent,
  children: [
    {path: 'clienti', component: CustomerListComponent, data: {title: 'Clienti'}},
    {path: 'dettagliClienti/:id', component: CustomerDetailsComponent, data: {title: 'Dettagli Cliente'}},
    {path: 'editingClienti', component: CustomerEditComponent, data: {title: 'Crea Cliente'}},
    {path: 'editingClienti/:id', component: CustomerEditComponent, data: {title: 'Modifica Cliente'}},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
