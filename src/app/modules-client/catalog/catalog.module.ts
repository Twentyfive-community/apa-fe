import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {CatalogComponent} from "./components/catalog/catalog.component";
import {CatalogRoutingModule} from "./catalog-routing.module";
import { UserProfileComponent } from './components/pages/user-profile/user-profile.component';
import { UserEditComponent } from './components/pages/user-edit/user-edit.component';

@NgModule({
  declarations: [
    CatalogComponent,
    UserProfileComponent,
    UserEditComponent,

  ],
  imports: [
    CatalogRoutingModule,
    SharedModule
  ]
})
export class CatalogModule {
}
