import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardClient} from "./components/dashboard-client/dashboard-client";
import {CatalogueComponent} from "./pages/catalogue/catalogue.component";

const routes: Routes = [
  {path: '', redirectTo: 'catalogo', pathMatch: 'full'},
  {
    path: '',
    component: DashboardClient,
    children: [
      {path: 'catalogo', component: CatalogueComponent, data: {title: 'Catalogo'}}
    ]
  }]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardClientRoutingModule {
}
