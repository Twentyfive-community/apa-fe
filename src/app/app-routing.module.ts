import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {CustomAuthGuard} from "twenty-signin";

const routes: Routes = [

  {
    path: 'dashboard',
    loadChildren: () => import('./modules-admin/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [CustomAuthGuard]
  },
  {
    path: 'catalogue',
    loadChildren: () => import('./modules-client/catalogue/catalogue.module').then(m => m.CatalogueModule),
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
