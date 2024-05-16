import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {roleAuthGuard} from "./guard/role-auth.guard";
import {CustomAuthGuard} from "twentyfive-keycloak-new";

const routes: Routes = [

  {
    path: 'dashboard',
    loadChildren: () => import('./modules-admin/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [CustomAuthGuard, roleAuthGuard]
  },
  {
    path: 'catalogo',
    loadChildren: () => import('./modules-client/catalog/catalog.module').then(m => m.CatalogModule),
    canActivate: [CustomAuthGuard]
  },
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
