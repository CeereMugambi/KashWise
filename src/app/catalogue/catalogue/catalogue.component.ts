import { Component } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAccount, IRole, Product } from 'src/app/models';
import { allProducts } from 'src/assets/data/mock-products';
import { AccountService } from 'src/app/services';


@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.sass']
})
export class CatalogueComponent {
  isNavCollapsed = false;
  productName: string = '';
  entryDate: Date | null = null;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  Role = IRole;
  account?: IAccount | null;
  firstName = '';
  userInitials = '';


  displayedColumns: string[] = ['image', 'id', 'productName', 'quantity', 'price', 'entryDate', 'actions'];

  constructor(private http: HttpClient,
    private accountService: AccountService
  ) {
    this.accountService.account.subscribe(x => this.account = x);
  }

  ngOnInit(): void {
    this.products = allProducts;
    this.filteredProducts = allProducts; 
    this.setUserInitials();
  
    this.displayedColumns = this.account?.role === IRole.Admin
      ? ['image', 'id', 'productName', 'quantity', 'price', 'entryDate', 'actions']
      : ['image', 'id', 'productName', 'quantity', 'price', 'entryDate'];
  }

toggleNav(): void {
  this.isNavCollapsed = !this.isNavCollapsed;
}

setUserInitials(): void {
  const account = this.accountService.accountValue;
  if (account?.firstName && account?.lastName) {
    this.firstName = account.firstName;
    this.userInitials = `${account.firstName.charAt(0)}${account.lastName.charAt(0)}`.toUpperCase();
  } else {
    this.accountService.account.subscribe(acc => {
      if (acc?.firstName && acc?.lastName) {
        this.firstName = acc.firstName;
        this.userInitials = `${acc.firstName.charAt(0)}${acc.lastName.charAt(0)}`.toUpperCase();
      }
    });
  }
}

onSearch(): void {
  this.applyFilters();
}

onDateChange(): void {
  this.applyFilters();
}

applyFilters(): void {
  this.filteredProducts = this.products.filter(p => {
    const matchesName = this.productName
      ? p.productName.toLowerCase().includes(this.productName.toLowerCase())
      : true;
    const matchesDate = this.entryDate
      ? p.entryDate === this.formatDate(this.entryDate)
      : true;
    return matchesName && matchesDate;
  });
}

clearFilters(): void {
  this.productName = '';
  this.entryDate = null;
  this.filteredProducts = this.products;
}

formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
logout(): void {
  this.accountService.logout();
}
}

