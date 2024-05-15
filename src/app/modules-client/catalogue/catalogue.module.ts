import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {CatalogueComponent} from "./components/catalogue/catalogue.component";
import {CatalogueRoutingModule} from "./catalogue-routing.module";
import { UserProfileComponent } from './components/pages/user-profile/user-profile.component';
import { UserProfileEditComponent } from './components/pages/user-edit/user-profile-edit.component';

@NgModule({
  declarations: [
    CatalogueComponent,
    UserProfileComponent,
    UserProfileEditComponent,

  ],
  imports: [
    CatalogueRoutingModule,
    SharedModule
  ]
})
export class CatalogueModule {
}
