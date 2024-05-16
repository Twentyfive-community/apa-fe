import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {CatalogueComponent} from "./components/catalogue/catalogue.component";
import {CatalogueRoutingModule} from "./catalogue-routing.module";
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
    CatalogueComponent,

  ],
    imports: [
        CatalogueRoutingModule,
        SharedModule,
        NgbDropdown,
        NgbDropdownMenu,
        NgbDropdownToggle
    ]
})
export class CatalogueModule {
}
