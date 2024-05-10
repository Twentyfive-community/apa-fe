import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {CustomerListComponent} from "./pages/customer-list/customer-list.component";
import {CustomerDetailsComponent} from "./pages/customer-details/customer-details.component";
import {CustomerEditComponent} from "./pages/customer-edit/customer-edit.component";
import {IngredientListComponent} from "./pages/ingredient-list/ingredient-list.component";
import {IngredientEditComponent} from "./pages/ingredient-edit/ingredient-edit.component";

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
    {path: 'ingredienti', component: IngredientListComponent, data: {title: 'Ingredienti'}},
    {path: 'editingIngredienti', component: IngredientEditComponent, data: {title: 'Crea Ingrediente'}},
    {path: 'editingIngredienti/:id', component: IngredientEditComponent, data: {title: 'Modifica Ingrediente'}},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
