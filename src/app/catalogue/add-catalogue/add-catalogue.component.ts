import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services';
import { IAccount, IRole, Product } from 'src/app/models';
import { allProducts } from 'src/assets/data/mock-products';
@Component({
  selector: 'app-add-catalogue',
  templateUrl: './add-catalogue.component.html',
  styleUrls: ['./add-catalogue.component.sass']
})
export class AddCatalogueComponent implements OnInit {

  Role = IRole;
  account?: IAccount | null;
  isNavCollapsed = false;
  userInitials = '';

  productForm!: FormGroup;
  submitting = false;
  submitted = false;
  imageError = false;
  selectedCategory = '';
  existingSubcategories: string[] = [];

  categories = [
    'bread',
    'dairy_products',
    'beverages',
    'fresh_produce',
    'cereals'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountService: AccountService
  ) {
    this.accountService.account.subscribe(x => this.account = x);
  }

  ngOnInit(): void {
    this.setUserInitials();
    this.buildForm();
  }

  buildForm(): void {
    this.productForm = this.fb.group({
      // Core
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

  get f() { return this.productForm.controls; }

    onCategoryChange(category: string): void {
      this.selectedCategory = category;
      this.imageError = false;
    
      this.existingSubcategories = [
        ...new Set(
          allProducts
            .filter(p => p.category === category)
            .map(p => p.productName)
        )
      ];
    }
    onSubmit(): void {
      this.submitted = true;
      if (this.productForm.invalid) return;
    
      const formValue = this.productForm.value;
    
      const isDuplicate = allProducts.some(
        p =>
          p.productName.toLowerCase() === formValue.productName.toLowerCase() &&
          p.category === formValue.category
      );
    
      if (isDuplicate) {
        this.f['productName'].setErrors({ duplicate: true });
        return;
      }
    
      this.submitting = true;
    
      const newProduct: Product = {
        id: allProducts.length + 1,
        productName: formValue.productName,
        category: formValue.category,
        brand: formValue.brand,
        size: formValue.size,
        price: formValue.price,
        quantity: formValue.quantity,
        entryDate: this.formatDate(formValue.entryDate),
        imageUrl: formValue.imageUrl || 'assets/product-images/default.jpg',
        description: formValue.description,
    
        ...(formValue.category === 'bread' && {
          breadType: formValue.breadType,
          sliced: formValue.sliced === 'Sliced'
        }),
        ...(formValue.category === 'dairy_products' && {
          dairyType: formValue.dairyType,
          fatContent: formValue.fatContent,
          expiryDate: formValue.expiryDate
            ? this.formatDate(formValue.expiryDate)
            : undefined
        }),
        ...(formValue.category === 'beverages' && {
          beverageType: formValue.beverageType,
          flavour: formValue.flavour,
          volume: formValue.volume
        }),
        ...(formValue.category === 'fresh_produce' && {
          produceType: formValue.produceType,
          origin: formValue.origin,
          organic: formValue.organic
        }),
        ...(formValue.category === 'cereals' && {
          cerealType: formValue.cerealType,
          grainType: formValue.grainType
        })
      } as Product;
    
      allProducts.push(newProduct as any);
    
      setTimeout(() => {
        this.submitting = false;
        this.router.navigate(['/catalogue']);
      }, 800);
    }
  formatDate(date: any): string {
    if (!date) return '';
    if (typeof date === 'string') return date;
    return new Date(date).toISOString().split('T')[0];
  }

  toggleNav(): void {
    this.isNavCollapsed = !this.isNavCollapsed;
  }

  logout(): void {
    this.accountService.logout();
  }

  setUserInitials(): void {
    const account = this.accountService.accountValue;
    if (account?.firstName && account?.lastName) {
      this.userInitials = `${account.firstName.charAt(0)}${account.lastName.charAt(0)}`.toUpperCase();
    } else {
      this.accountService.account.subscribe(acc => {
        if (acc?.firstName && acc?.lastName) {
          this.userInitials = `${acc.firstName.charAt(0)}${acc.lastName.charAt(0)}`.toUpperCase();
        }
      });
    }
  }
}