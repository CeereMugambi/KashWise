import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models';
import { allProducts } from 'src/assets/data/mock-products';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.sass']
})
export class ProductFormComponent implements OnInit, OnChanges {
 // If a product is passed in → edit mode. If null → add mode.
 @Input() product: Product | null = null;
 @Input() submitted = false;
 @Input() submitting = false;

 @Output() formSubmit = new EventEmitter<any>();

 productForm!: FormGroup;
 selectedCategory = '';
 imageError = false;
 existingSubcategories: string[] = [];

 categories = [
   'bread',
   'dairy_products',
   'beverages',
   'fresh_produce',
   'cereals'
 ];

 get isEditMode(): boolean {
   return !!this.product;
 }

 get f() { return this.productForm.controls; }

 constructor(private fb: FormBuilder) {}

 ngOnInit(): void {
   this.buildForm();
   if (this.product) {
     this.prefill(this.product);
   }
 }

 ngOnChanges(): void {
   if (this.productForm && this.product) {
     this.prefill(this.product);
   }
 }

 buildForm(): void {
   this.productForm = this.fb.group({
     category:     ['', Validators.required],
     productName:  ['', Validators.required],
     brand:        ['', Validators.required],
     size:         [''],
     price:        [null, [Validators.required, Validators.min(0.01)]],
     quantity:     [null, [Validators.required, Validators.min(0)]],
     entryDate:    ['', Validators.required],
     imageUrl:     [''],
     description:  [''],
     expiryDate:   [''],
     // Bread
     breadType:    [''],
     sliced:       [''],
     // Dairy
     dairyType:    [''],
     fatContent:   [''],
     // Beverages
     beverageType: [''],
     flavour:      [''],
     volume:       [''],
     // Fresh Produce
     produceType:  [''],
     origin:       [''],
     organic:      [false],
     // Cereals
     cerealType:   [''],
     grainType:    ['']
   });
 }

 prefill(product: Product): void {
   this.selectedCategory = product.category;
   this.productForm.patchValue({
     category:    product.category,
     productName: product.productName,
     brand:       product.brand,
     size:        product.size,
     price:       product.price,
     quantity:    product.quantity,
     entryDate:   product.entryDate,
     imageUrl:    product.imageUrl,
     description: product.description ?? '',
     expiryDate:  (product as any).expiryDate ?? '',
     breadType:   (product as any).breadType ?? '',
     sliced:      (product as any).sliced === true ? 'Sliced' : (product as any).sliced === false ? 'Unsliced' : '',
     dairyType:   (product as any).dairyType ?? '',
     fatContent:  (product as any).fatContent ?? '',
     beverageType:(product as any).beverageType ?? '',
     flavour:     (product as any).flavour ?? '',
     volume:      (product as any).volume ?? '',
     produceType: (product as any).produceType ?? '',
     origin:      (product as any).origin ?? '',
     organic:     (product as any).organic ?? false,
     cerealType:  (product as any).cerealType ?? '',
     grainType:   (product as any).grainType ?? ''
   });
 }

 onCategoryChange(category: string): void {
   this.selectedCategory = category;
   this.imageError = false;

   if (!this.isEditMode) {
     this.existingSubcategories = [
       ...new Set(
         allProducts
           .filter(p => p.category === category)
           .map(p => p.productName)
       )
     ];
   }
 }

 onSubmit(): void {
   if (this.productForm.invalid) return;
   this.formSubmit.emit(this.productForm.value);
 }

 formatDate(date: any): string {
   if (!date) return '';
   if (typeof date === 'string') return date;
   return new Date(date).toISOString().split('T')[0];
 }
}

