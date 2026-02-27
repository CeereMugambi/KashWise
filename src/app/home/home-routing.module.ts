import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ReceiptComponent } from './receipt/receipt.component';

const routes: Routes = [
    {
       path: '',component:HomeComponent
    },
    { path: 'product-detail/:id', component: ProductDetailComponent },
    { path: 'receipt', component: ReceiptComponent }
   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class homeRoutingModule { }