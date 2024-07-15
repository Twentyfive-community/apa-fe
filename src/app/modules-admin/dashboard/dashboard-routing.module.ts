import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {OrderListComponent} from "./pages/order-list/order-list.component";
import {OrderEditComponent} from "./pages/order-edit/order-edit.component";
import {CompletedOrderComponent} from "./pages/completed-order/completed-order.component";
import {CustomerListComponent} from "./pages/customer-list/customer-list.component";
import {CustomerDetailsComponent} from "./pages/customer-details/customer-details.component";
import {CustomerEditComponent} from "./pages/customer-edit/customer-edit.component";
import {IngredientListComponent} from "./pages/ingredient-list/ingredient-list.component";
import {IngredientEditComponent} from "./pages/ingredient-edit/ingredient-edit.component";
import {ProductListComponent} from "./pages/product-list/product-list.component";
import {ProductEditComponent} from "./pages/product-edit/product-edit.component";
import {EmployeeListComponent} from "./pages/employee-list/employee-list.component";
import {EmployeeEditComponent} from "./pages/employee-edit/employee-edit.component";
import {BakerListComponent} from "./pages/baker-list/baker-list.component";
import {GenericDeactivateGuard} from "./guards/generic-deactivate.guard";
import {MenuSectionListComponent} from "./pages/menu-section-list/menu-section-list.component";
import {MenuSectionDetailsComponent} from "./pages/menu-section-details/menu-section-details.component";

const routes: Routes = [
  {path: '', redirectTo: 'ordini', pathMatch: 'full'},
  {
  path: '',
  component: DashboardComponent,
  children: [
    {path: 'ordini', component: OrderListComponent, data: {title: 'Ordini'}},
    {path: 'modifica-ordine', component: OrderEditComponent, data:{title: 'Crea Ordine'}},
    {path: 'modifica-ordine/:id', component: OrderEditComponent, data:{title: 'Modifica Ordine'}},

    {path: 'ordini-completati', component: CompletedOrderComponent, data:{title: 'Ordini Completati'}},

    {path: 'pasticceria', component: BakerListComponent, data:{title: 'Pasticceria'}},

    {path: 'menu', component: MenuSectionListComponent, data:{title: 'Menù QR Bar'}},
    {path: 'menu/:id', component: MenuSectionDetailsComponent, data:{title: 'Menù QR Bar'}},

    {path: 'clienti', component: CustomerListComponent, data: {title: 'Clienti'}},
    {path: 'dettagliClienti/:id', component: CustomerDetailsComponent, data: {title: 'Dettagli Cliente'}},
    {path: 'editingClienti', component: CustomerEditComponent, data: {title: 'Crea Cliente'}, canDeactivate: [GenericDeactivateGuard]},
    {path: 'editingClienti/:id', component: CustomerEditComponent, data: {title: 'Modifica Cliente'}, canDeactivate: [GenericDeactivateGuard]},

    {path: 'prodotti', component: ProductListComponent, data: {title: 'Prodotti'}},
    {path: 'editingProdotti', component: ProductEditComponent, data: {title: 'Crea Prodotto'}, canDeactivate: [GenericDeactivateGuard]},
    {path: 'editingProdotti/:id', component: ProductEditComponent, data: {title: 'Modifica Prodotto'}, canDeactivate: [GenericDeactivateGuard]},

    {path: 'ingredienti', component: IngredientListComponent, data: {title: 'Ingredienti'}},
    {path: 'editingIngredienti', component: IngredientEditComponent, data: {title: 'Crea Ingrediente'}, canDeactivate: [GenericDeactivateGuard]},
    {path: 'editingIngredienti/:id', component: IngredientEditComponent, data: {title: 'Modifica Ingrediente'}, canDeactivate: [GenericDeactivateGuard]},

    {path: 'dipendenti', component: EmployeeListComponent, data: {title: 'Dipendenti'}},
    {path: 'crea-dipendente', component: EmployeeEditComponent, data: {title: 'Crea Dipendente'}, canDeactivate: [GenericDeactivateGuard]},
    {path: 'modifica-dipendente/:id', component: EmployeeEditComponent, data: {title: 'Modifica Dipendente'},  canDeactivate: [GenericDeactivateGuard]},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
