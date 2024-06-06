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
import {IngredientGuard} from "./guards/ingredient.guard";
import {ProductGuard} from "./guards/product.guard";
import {CustomerGuard} from "./guards/customer.guard";

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

    {path: 'clienti', component: CustomerListComponent, data: {title: 'Clienti'}},
    {path: 'dettagliClienti/:id', component: CustomerDetailsComponent, data: {title: 'Dettagli Cliente'}},
    {path: 'editingClienti', component: CustomerEditComponent, data: {title: 'Crea Cliente'}, canDeactivate: [CustomerGuard]},
    {path: 'editingClienti/:id', component: CustomerEditComponent, data: {title: 'Modifica Cliente'}, canDeactivate: [CustomerGuard]},

    {path: 'prodotti', component: ProductListComponent, data: {title: 'Prodotti'}},
    {path: 'editingProdotti', component: ProductEditComponent, data: {title: 'Crea Prodotto'}, canDeactivate: [ProductGuard]},
    {path: 'editingProdotti/:id', component: ProductEditComponent, data: {title: 'Modifica Prodotto'}, canDeactivate: [ProductGuard]},

    {path: 'ingredienti', component: IngredientListComponent, data: {title: 'Ingredienti'}},
    {path: 'editingIngredienti', component: IngredientEditComponent, data: {title: 'Crea Ingrediente'}, canDeactivate: [IngredientGuard]},
    {path: 'editingIngredienti/:id', component: IngredientEditComponent, data: {title: 'Modifica Ingrediente'}, canDeactivate: [IngredientGuard]},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
