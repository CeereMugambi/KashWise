import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services';
import { IAccount, IRole, Product } from 'src/app/models';
import { MOCK_PRODUCTS } from 'src/assets/data/mock-products';

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
    'Bread',
    'Dairy',
    'Beverages',
    'Snacks',
    'Produce',
    'Grains & Cereals'
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
      // Core fields
      category:     ['', Validators.required],
      productName:  ['', Validators.required],
      brand:        ['', Validators.required],
      size:         [''],
      price:        [null, [Validators.required, Validators.min(0.01)]],
      quantity:     [null, [Validators.required, Validators.min(0)]],
      entryDate:    ['', Validators.required],
      imageUrl:     [''],
      description:  [''],
      // Bread
      breadType:    [''],
      sliced:       [''],
      // Dairy
      fatContent:   [''],
      expiryDate:   [''],
      // Beverages
      flavour:      [''],
      volume:       [''],
      // Snacks
      weight:       [''],
      flavourType:  [''],
      // Produce
      origin:       [''],
      organic:      [false],
      // Grains & Cereals
      grainType:    [''],
      servingSize:  ['']
    });
  }

  get f() { return this.productForm.controls; }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.imageError = false;

    // show existing products in this category as reference
    this.existingSubcategories = [
      ...new Set(
        MOCK_PRODUCTS
          .filter(p => p.category === category)
          .map(p => p.productName)
      )
    ];
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.productForm.invalid) return;

    // check for duplicate in same category
    const formValue = this.productForm.value;
    const isDuplicate = MOCK_PRODUCTS.some(
      p =>
        p.productName.toLowerCase() === formValue.productName.toLowerCase() &&
        p.category === formValue.category
    );

    if (isDuplicate) {
      this.f['productName'].setErrors({ duplicate: true });
      return;
    }

    this.submitting = true;

    // build new product spreading only relevant category fields
    const newProduct: Product = {
      id: MOCK_PRODUCTS.length + 1,
      productName: formValue.productName,
      category: formValue.category,
      brand: formValue.brand,
      size: formValue.size,
      price: formValue.price,
      quantity: formValue.quantity,
      entryDate: this.formatDate(formValue.entryDate),
      imageUrl: formValue.imageUrl || 'assets/product-images/default.jpg',
      description: formValue.description,

      ...(formValue.category === 'Bread' && {
        breadType: formValue.breadType,
        sliced: formValue.sliced
      }),
      ...(formValue.category === 'Dairy' && {
        fatContent: formValue.fatContent,
        expiryDate: formValue.expiryDate
          ? this.formatDate(formValue.expiryDate)
          : undefined
      }),
      ...(formValue.category === 'Beverages' && {
        flavour: formValue.flavour,
        volume: formValue.volume
      }),
      ...(formValue.category === 'Snacks' && {
        weight: formValue.weight,
        flavourType: formValue.flavourType
      }),
      ...(formValue.category === 'Produce' && {
        origin: formValue.origin,
        organic: formValue.organic
      }),
      ...(formValue.category === 'Grains & Cereals' && {
        grainType: formValue.grainType,
        servingSize: formValue.servingSize
      })
    };

    MOCK_PRODUCTS.push(newProduct);

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