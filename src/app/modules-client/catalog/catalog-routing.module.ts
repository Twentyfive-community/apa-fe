import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {CatalogComponent} from "./components/catalog/catalog.component";
import {UserProfileComponent} from "./components/pages/user-profile/user-profile.component";
import {UserEditComponent} from "./components/pages/user-edit/user-edit.component";
import {UserOrdersComponent} from "./components/pages/user-orders/user-orders.component";

const routes: Routes = [
  {path: '', redirectTo: 'profilo', pathMatch: 'full'},
  {
    path: '',
    component: CatalogComponent,
    children: [
      {path:'profilo',component:UserProfileComponent, data: {title: 'Profilo'}},
      {path:'userEdit/:id',component:UserEditComponent, data: {title: 'ModificaProfilo'}},
      {path:'ordini_utente/:id',component:UserOrdersComponent, data: {title: 'VisualizzaOrdiniProfilo'}}

    ]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule {

}
