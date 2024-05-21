import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardClient} from "./components/dashboard-client/dashboard-client";
import {CatalogueComponent} from "./pages/catalogue/catalogue.component";
import {UserProfileComponent} from "./pages/user-profile/user-profile.component";
import {UserEditComponent} from "./pages/user-edit/user-edit.component";
import {UserOrderComponent} from "./pages/user-orders/user-order.component";

const routes: Routes = [
  {path: '', redirectTo: '', pathMatch: 'full'},
  {
    path: '',
    component: DashboardClient,
    children: [
      {path: '', component: CatalogueComponent, data: {title: 'Catalogo'}},
      {path:'profilo',component:UserProfileComponent, data: {title: 'Profilo'}},
      {path:'modifica-profilo/:id',component:UserEditComponent, data: {title: 'ModificaProfilo'}},
      {path:'ordini/:id',component: UserOrderComponent, data: {title: 'VisualizzaOrdiniProfilo'}}
    ]
  }]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardClientRoutingModule {
}
