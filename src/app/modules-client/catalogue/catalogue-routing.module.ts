import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {CatalogueComponent} from "./components/catalogue/catalogue.component";
import {UserProfileComponent} from "./components/pages/user-profile/user-profile.component";
import {CustomerEditComponent} from "./components/pages/user-edit/customer-edit.component";

const routes: Routes = [
  {path: '', redirectTo: 'catalogue', pathMatch: 'full'},
  {path: 'catalogue', component: CatalogueComponent},
  {path:'profilo', component: UserProfileComponent},
  {path:'modifica-profilo/:id', component: CustomerEditComponent}
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogueRoutingModule {
}
