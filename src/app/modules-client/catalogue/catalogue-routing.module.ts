import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {CatalogueComponent} from "./components/catalogue/catalogue.component";
import {UserProfileComponent} from "./components/pages/user-profile/user-profile.component";
import {UserProfileEditComponent} from "./components/pages/user-edit/user-profile-edit.component";

const routes: Routes = [
  {path: '', redirectTo: 'catalogue', pathMatch: 'full'},
  {path: 'catalogue', component: CatalogueComponent},
  {path:'profilo', component: UserProfileComponent},
  {path:'modifica-profilo/:id', component: UserProfileEditComponent}
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogueRoutingModule {
}
