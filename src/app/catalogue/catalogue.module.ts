import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { AccountModule } from '../account/account.module';
import { ComponentsModule } from '../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { AddCatalogueComponent } from './add-catalogue/add-catalogue.component';
import { CatalogueRoutingModule } from './catalogue-routing.module';
import { EditCatalogueComponent } from './edit-catalogue/edit-catalogue.component';



@NgModule({
  declarations: [
    CatalogueComponent,
    AddCatalogueComponent,
    EditCatalogueComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AccountModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    CatalogueRoutingModule
  ],
  exports:[
    CatalogueComponent
]
})
export class CatalogueModule { }
