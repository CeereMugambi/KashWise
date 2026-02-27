import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { homeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { AccountModule } from '../account/account.module';
import { ComponentsModule } from '../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CatalogueModule } from '../catalogue/catalogue.module';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ReceiptComponent } from './receipt/receipt.component';



@NgModule({
  declarations: [
    HomeComponent,
    ProductDetailComponent,
    ReceiptComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    homeRoutingModule,
    AccountModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    CatalogueModule

  ],
  exports:[
    HomeComponent
  ]
})
export class HomeModule { }
