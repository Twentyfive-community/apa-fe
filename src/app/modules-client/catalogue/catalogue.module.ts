import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {CatalogueComponent} from "./components/catalogue/catalogue.component";
import {CatalogueRoutingModule} from "./catalogue-routing.module";

@NgModule({
  declarations: [
    CatalogueComponent,

  ],
  imports: [
    CatalogueRoutingModule,
    SharedModule
  ]
})
export class CatalogueModule {
}
