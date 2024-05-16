import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {CatalogComponent} from "./components/catalog/catalog.component";
import {CatalogRoutingModule} from "./catalog-routing.module";

@NgModule({
  declarations: [
    CatalogComponent,

  ],
  imports: [
    CatalogRoutingModule,
    SharedModule
  ]
})
export class CatalogModule {
}
