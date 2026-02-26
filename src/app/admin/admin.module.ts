import { NgModule,NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeAdminComponent } from './welcome-admin/welcome-admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { MaterialModule } from '../material/material.module';
import { ComponentsModule } from '../components/components.module';
import { ListComponent } from './list/list.component';
import { EditAdminComponent } from './edit-admin/edit-admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    WelcomeAdminComponent,
    ListComponent,
    EditAdminComponent,
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
    WelcomeAdminComponent,
    ListComponent
  ],
})
export class AdminModule { }
