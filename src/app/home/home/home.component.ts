import { Component } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from 'src/app/models';
import { MOCK_PRODUCTS } from 'src/assets/data/mock-products';
import { AccountService } from 'src/app/services';




@Component({ 
  selector:'home',
  templateUrl: 'home.component.html',
  styleUrls: [ 'home.component.sass'],
  encapsulation: ViewEncapsulation.None 
})

export class HomeComponent {

  // isNavCollapsed = false;
  productName: string = '';
  entryDate: Date | null = null;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  userInitials: string = '';


  displayedColumns: string[] = ['image', 'id', 'productName', 'quantity', 'price', 'entryDate', 'actions'];

  constructor(private http: HttpClient,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.products = MOCK_PRODUCTS;
    this.filteredProducts = MOCK_PRODUCTS;
  }


// toggleNav(): void {
//   this.isNavCollapsed = !this.isNavCollapsed;
// }

setUserInitials(): void {
  const account = this.accountService.accountValue;
  if (account) {
    const first = account.firstName?.charAt(0) ?? '';
    const last = account.lastName?.charAt(0) ?? '';
    this.userInitials = `${first}${last}`.toUpperCase();
  } else {
    this.userInitials = '?';
  }
}
onSubmit(): void {
  this.filteredProducts = this.products.filter(p => {
    const matchesName = p.productName.toLowerCase()
      .includes(this.productName.toLowerCase());
    const matchesDate = this.entryDate
      ? p.entryDate === this.formatDate(this.entryDate)
      : true;
    return matchesName && matchesDate;
  });
}

formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
}
    

  