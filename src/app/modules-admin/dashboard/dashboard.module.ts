import {NgModule} from "@angular/core";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {DashboardRoutingModule} from "./dashboard-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {CustomerListComponent} from "./pages/customer-list/customer-list.component";
import { CustomerDetailsComponent } from './pages/customer-details/customer-details.component';
import { CustomerEditComponent } from './pages/customer-edit/customer-edit.component';
import { IngredientListComponent } from './pages/ingredient-list/ingredient-list.component';
import { IngredientEditComponent } from './pages/ingredient-edit/ingredient-edit.component';
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {TwentyfiveDropdownModule} from "twentyfive-dropdown";
import {FormsModule} from "@angular/forms";
import {TwentyfiveChipModule} from "twentyfive-chip";
import {TwentyfiveCheckboxModule} from "twentyfive-checkbox";

@NgModule({
  declarations: [
    DashboardComponent,
    CustomerListComponent,
    CustomerDetailsComponent,
    CustomerEditComponent,
    IngredientListComponent,
    IngredientEditComponent,
  ],
    imports: [
        DashboardRoutingModule,
        SharedModule,
        NgbDropdown,
        NgbDropdownToggle,
        NgbDropdownMenu,
        TwentyfiveDropdownModule,
        FormsModule,
        TwentyfiveChipModule,
        TwentyfiveCheckboxModule,
    ]
})
export class DashboardModule {
}
