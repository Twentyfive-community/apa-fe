import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {CatalogueComponent} from "./components/catalogue/catalogue.component";
import {CatalogueRoutingModule} from "./catalogue-routing.module";
import { UserProfileComponent } from './components/pages/user-profile/user-profile.component';
import { CustomerEditComponent } from './components/pages/user-edit/customer-edit.component';

@NgModule({
  declarations: [
    CatalogueComponent,
    UserProfileComponent,
    CustomerEditComponent,

  ],
  imports: [
    CatalogueRoutingModule,
    SharedModule
  ]
})
export class CatalogueModule {
}
