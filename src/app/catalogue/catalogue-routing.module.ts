import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { AddCatalogueComponent } from './add-catalogue/add-catalogue.component';
import { AuthGuard } from '../helpers/auth.guard';
import { IRole } from '../models/role';
import { EditCatalogueComponent } from './edit-catalogue/edit-catalogue.component';

const routes: Routes = [
    {path: '',component:CatalogueComponent},
    {path: 'add-catalogue',
        component:AddCatalogueComponent,
        canActivate: [AuthGuard],
        data: { roles: [IRole.Admin] } 
    },
    { path: 'catalogue/edit-catalogue/:id', component: EditCatalogueComponent },   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CatalogueRoutingModule { }