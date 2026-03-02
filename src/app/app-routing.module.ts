import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './helpers';
import { IRole } from './models';

const AccountModule = () => import('./account/account.module').then(x => x.AccountModule);
const ComponentsModule = () => import('./components/components.module').then(x => x.ComponentsModule);
const HomeModule = ()=>import('./home/home.module').then(x=>x.HomeModule)
const AdminModule = ()=>import('./admin/admin.module').then(x=>x.AdminModule)
const CatalogueModule= ()=>import('./catalogue/catalogue.module').then(x=>x.CatalogueModule)


const routes: Routes = [
  {path:'account',loadChildren:AccountModule},
  {path:'admin',loadChildren:AdminModule, canActivate: [AuthGuard], data: { roles: [IRole.Admin] } },
  {path:'components',loadChildren:ComponentsModule},
  {path:'home',loadChildren:HomeModule, canActivate: [AuthGuard] },
  {path:'catalogue',loadChildren:CatalogueModule },
 




  //Unrecognised routes redirect
  { path: 'subnavbar', redirectTo: './', pathMatch: "full" },
  { path: '', redirectTo: 'welcome', pathMatch: "full" },
  { path: '**', redirectTo: 'Welcome' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
