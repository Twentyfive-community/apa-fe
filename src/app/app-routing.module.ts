import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import { CatalogueComponent } from './modules-client/dashboard-client/pages/catalogue/catalogue.component';
import {roleAuthGuard} from "./guard/role-auth.guard";
import {CustomAuthGuard} from "twentyfive-keycloak-new";
import {TwentyfiveNotFoundComponent} from "twentyfive-not-found";
import {BakerListComponent} from "./modules-admin/dashboard/pages/baker-list/baker-list.component";
import {catalogueGuard} from "./guard/catalogue.guard";
import {MenuComponent} from "./components/menu/menu.component";
import {NotFoundWrapperComponent} from "./components/not-found-wrapper/not-found-wrapper.component";

const routes: Routes = [

  {
    path: 'dashboard',
    loadChildren: () => import('./modules-admin/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [CustomAuthGuard, roleAuthGuard]
  },
  {
    path: 'catalogo',
    loadChildren: () => import('./modules-client/dashboard-client/dashboard-client.module').then(m => m.DashboardClientModule),
    canActivate: [CustomAuthGuard, catalogueGuard]
  },
  {path: 'menu', component: MenuComponent},
  {path: '', redirectTo: 'catalogo', pathMatch: 'full'},
  {path: '**', component: NotFoundWrapperComponent, data: {routerLink: '/catalogo' }}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
