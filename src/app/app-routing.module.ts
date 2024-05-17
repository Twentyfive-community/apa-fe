import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {roleAuthGuard} from "./guard/role-auth.guard";
import {CustomAuthGuard} from "twentyfive-keycloak-new";
import {TwentyfiveNotFoundComponent} from "twentyfive-not-found";

const routes: Routes = [

  {
    path: 'dashboard',
    loadChildren: () => import('./modules-admin/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [CustomAuthGuard, roleAuthGuard]
  },
  {
    path: 'catalogo',
    loadChildren: () => import('./modules-client/dashboard-client/dashboard-client.module').then(m => m.DashboardClientModule),
    canActivate: [CustomAuthGuard]
  },
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', component: TwentyfiveNotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
