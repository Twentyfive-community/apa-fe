import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {CatalogueComponent} from "./components/catalogue/catalogue.component";

const routes: Routes = [
  {path: '', redirectTo: 'catalogue', pathMatch: 'full'},
  {path: 'catalogue', component: CatalogueComponent}
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogueRoutingModule {
}
