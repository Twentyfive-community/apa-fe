import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardClient} from "./components/dashboard-client/dashboard-client";
import {CatalogueComponent} from "./pages/catalogue/catalogue.component";
import {UserProfileComponent} from "./pages/user-profile/user-profile.component";
import {UserEditComponent} from "./pages/user-edit/user-edit.component";
import {TrayCustomizedComponent} from "./pages/tray-customized/tray-customized.component";
import {UserOrderDetailComponent} from "./pages/user-order-detail/user-order-detail.component";
import {UserCartComponent} from "./pages/user-cart/user-cart.component";
import {UserOrderComponent} from "./pages/user-order/user-order.component";

const routes: Routes = [
  {path: '', redirectTo: '', pathMatch: 'full'},
  {
    path: '',
    component: DashboardClient,
    children: [
      {path: '', component: CatalogueComponent, data: {title: 'Catalogo'}},
      {path:'profilo',component:UserProfileComponent, data: {title: 'Profilo'}},
      {path:'modifica-profilo/:id',component:UserEditComponent, data: {title: 'ModificaProfilo'}},
      {path:'ordini/:id',component: UserOrderComponent, data: {title: 'VisualizzaOrdiniProfilo'}},
      {path:'dettaglio-ordine/:id',component: UserOrderDetailComponent, data: {title: 'DettaglioOrdine'}},
      {path:'vassoio-personalizzato',component: TrayCustomizedComponent, data: {title: 'Vassoio Personalizzato'}},
      {path:'dettaglio-ordine/:id',component: UserOrderDetailComponent, data: {title: 'DettaglioOrdine'}},
      {path: 'carrello', component: UserCartComponent, data: {title: 'Carrello'}},
    ]
  }]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardClientRoutingModule {
}
