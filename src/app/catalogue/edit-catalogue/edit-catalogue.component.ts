import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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

  editingProduct: Product | null = null;
  productNotFound = false;
  submitting = false;
  submitted = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService
  ) {
    this.accountService.account.subscribe(x => this.account = x);
  }

  ngOnInit(): void {
    this.setUserInitials();
    this.loadProduct();
  }

  loadProduct(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (isNaN(id)) {
      this.productNotFound = true;
      return;
    }

    const found = allProducts.find(p => p.id === id);

    if (!found) {
      this.productNotFound = true;
      return;
    }

    this.editingProduct = found as Product;
  }

  onFormSubmit(formValue: any): void {
    this.submitted = true;
    if (!this.editingProduct) return;

    this.submitting = true;

    const idx = allProducts.findIndex(p => p.id === this.editingProduct!.id);

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
          expiryDate: formValue.expiryDate
            ? this.formatDate(formValue.expiryDate)
            : undefined
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