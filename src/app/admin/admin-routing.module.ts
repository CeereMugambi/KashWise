import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { EditAdminComponent } from './edit-admin/edit-admin.component';
import { ReviewComponent } from './review/review.component';


const routes: Routes = [
    
       {path:'list',component:ListComponent},
       {path:'add',component:EditAdminComponent},
       { path: 'list/edit/:id', component: EditAdminComponent },
       { path: 'list/review/:id', component: ReviewComponent }
       

       


      
        
        
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }