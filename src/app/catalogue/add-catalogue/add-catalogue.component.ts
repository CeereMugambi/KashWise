import { Component, OnInit } from '@angular/core';
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
  submitting = false;
  submitted = false;

  constructor(private router: Router, private accountService: AccountService) {
    this.accountService.account.subscribe(x => this.account = x);
  }

  ngOnInit(): void {
    this.setUserInitials();
  }

  onFormSubmit(formValue: any): void {
    this.submitted = true;

    const isDuplicate = allProducts.some(
      p =>
        p.productName.toLowerCase() === formValue.productName.toLowerCase() &&
        p.category === formValue.category
    );
    if (isDuplicate) return;

    this.submitting = true;

    const newProduct = {
      id: allProducts.length + 1,
      ...formValue,
      entryDate: this.formatDate(formValue.entryDate),
      imageUrl: formValue.imageUrl || 'assets/product-images/default.jpg',
      ...(formValue.category === 'bread' && { sliced: formValue.sliced === 'Sliced' }),
      ...(formValue.category === 'dairy_products' && {
        expiryDate: formValue.expiryDate ? this.formatDate(formValue.expiryDate) : undefined
      })
    };

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

  toggleNav(): void { this.isNavCollapsed = !this.isNavCollapsed; }
  logout(): void { this.accountService.logout(); }

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