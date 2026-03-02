import { NgModule,NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { MaterialModule } from '../material/material.module';
import { ComponentsModule } from '../components/components.module';
import { ListComponent } from './list/list.component';
import { EditAdminComponent } from './edit-admin/edit-admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReviewComponent } from './review/review.component';


@NgModule({
  declarations: [
    ListComponent,
    EditAdminComponent,
    ReviewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    MaterialModule,
    ComponentsModule,
    ReactiveFormsModule

    ],

  exports:[
    ListComponent
  ],
})
export class AdminModule { }
