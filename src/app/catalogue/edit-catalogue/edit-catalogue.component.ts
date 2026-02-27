import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/services';
import { IAccount, IRole, Product } from 'src/app/models';
import { allProducts } from 'src/assets/data/mock-products';

@Component({
  selector: 'app-edit-catalogue',
  templateUrl: './edit-catalogue.component.html',
  styleUrls: ['./edit-catalogue.component.sass']
})
export class EditCatalogueComponent implements OnInit {

  Role = IRole;
  account?: IAccount | null;
  isNavCollapsed = false;
  userInitials = '';

  editForm!: FormGroup;
  submitting = false;
  submitted = false;
  imageError = false;
  selectedCategory = '';
  productId!: number;
  productNotFound = false;

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
    private route: ActivatedRoute,
    private accountService: AccountService
  ) {
    this.accountService.account.subscribe(x => this.account = x);
  }

  ngOnInit(): void {
    this.setUserInitials();
    this.buildForm();
    this.loadProduct();
  }

  buildForm(): void {
    this.editForm = this.fb.group({
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

  loadProduct(): void {
    // get id from route e.g. /catalogue/edit-catalogue/3
    const idParam = this.route.snapshot.paramMap.get('id');
    this.productId = Number(idParam);

    const product = allProducts.find(p => p.id === this.productId);

    if (!product) {
      this.productNotFound = true;
      return;
    }

    this.selectedCategory = product.category;

    // patch all base fields
    this.editForm.patchValue({
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
      // Bread
      breadType:   (product as any).breadType ?? '',
      sliced:      (product as any).sliced === true ? 'Sliced' : (product as any).sliced === false ? 'Unsliced' : '',
      // Dairy
      dairyType:   (product as any).dairyType ?? '',
      fatContent:  (product as any).fatContent ?? '',
      // Beverages
      beverageType:(product as any).beverageType ?? '',
      flavour:     (product as any).flavour ?? '',
      volume:      (product as any).volume ?? '',
      // Fresh Produce
      produceType: (product as any).produceType ?? '',
      origin:      (product as any).origin ?? '',
      organic:     (product as any).organic ?? false,
      // Cereals
      cerealType:  (product as any).cerealType ?? '',
      grainType:   (product as any).grainType ?? ''
    });
  }

  get f() { return this.editForm.controls; }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.imageError = false;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.editForm.invalid) return;

    this.submitting = true;
    const formValue = this.editForm.value;

    const idx = allProducts.findIndex(p => p.id === this.productId);
    if (idx > -1) {
      allProducts[idx] = {
        ...allProducts[idx],
        productName: formValue.productName,
        category:    formValue.category,
        brand:       formValue.brand,
        size:        formValue.size,
        price:       formValue.price,
        quantity:    formValue.quantity,
        entryDate:   this.formatDate(formValue.entryDate),
        imageUrl:    formValue.imageUrl || allProducts[idx].imageUrl,
        description: formValue.description,

        ...(formValue.category === 'bread' && {
          breadType: formValue.breadType,
          sliced:    formValue.sliced === 'Sliced'
        }),
        ...(formValue.category === 'dairy_products' && {
          dairyType:  formValue.dairyType,
          fatContent: formValue.fatContent,
          expiryDate: formValue.expiryDate ? this.formatDate(formValue.expiryDate) : undefined
        }),
        ...(formValue.category === 'beverages' && {
          beverageType: formValue.beverageType,
          flavour:      formValue.flavour,
          volume:       formValue.volume
        }),
        ...(formValue.category === 'fresh_produce' && {
          produceType: formValue.produceType,
          origin:      formValue.origin,
          organic:     formValue.organic
        }),
        ...(formValue.category === 'cereals' && {
          cerealType: formValue.cerealType,
          grainType:  formValue.grainType
        })
      } as any;
    }

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