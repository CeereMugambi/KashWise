import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { AccountModule } from '../account/account.module';
import { ComponentsModule } from '../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { AddCatalogueComponent } from './add-catalogue/add-catalogue.component';
import { CatalogueRoutingModule } from './catalogue-routing.module';



@NgModule({
  declarations: [
    CatalogueComponent,
    AddCatalogueComponent
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
