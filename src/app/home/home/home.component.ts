import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Product,IRole } from 'src/app/models';
import { MOCK_PRODUCTS } from 'src/assets/data/mock-products';
import { AccountService } from 'src/app/services';
interface ProductGroup {
  category: string;
  products: Product[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  Role = IRole;
  account = this.accountService.accountValue;
  isNavCollapsed = false;
  userInitials = '';
  firstName = '';

  searchQuery = '';
  selectedCategory = '';
  showSuggestions = false;
  suggestions: Product[] = [];

  products: Product[] = [];
  groupedResults: ProductGroup[] = [];
  categories: string[] = [];

  order: { product: Product; quantity: number }[] = [];

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.products = MOCK_PRODUCTS;
    this.categories = [...new Set(this.products.map(p => p.category))];
    this.setUserInitials();
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

  toggleNav(): void {
    this.isNavCollapsed = !this.isNavCollapsed;
  }

  logout(): void {
    this.accountService.logout();
  }

  onSearchChange(): void {
    const query = this.searchQuery.toLowerCase().trim();

    if (!query && !this.selectedCategory) {
      this.suggestions = [];
      this.groupedResults = [];
      return;
    }

    // live suggestions
    this.suggestions = this.products
      .filter(p => p.productName.toLowerCase().includes(query))
      .slice(0, 6);

    this.buildGroupedResults();
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.buildGroupedResults();
  }

  buildGroupedResults(): void {
    const query = this.searchQuery.toLowerCase().trim();

    const filtered = this.products.filter(p => {
      const matchesSearch = query ? p.productName.toLowerCase().includes(query) : true;
      const matchesCategory = this.selectedCategory ? p.category === this.selectedCategory : true;
      return matchesSearch && matchesCategory;
    });

    // group by category
    const groupMap = new Map<string, Product[]>();
    filtered.forEach(p => {
      if (!groupMap.has(p.category)) {
        groupMap.set(p.category, []);
      }
      groupMap.get(p.category)!.push(p);
    });

    this.groupedResults = Array.from(groupMap.entries()).map(([category, products]) => ({
      category,
      products
    }));
  }

  selectSuggestion(product: Product): void {
    this.searchQuery = product.productName;
    this.suggestions = [];
    this.showSuggestions = false;
    this.buildGroupedResults();
  }

  hideSuggestions(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.suggestions = [];
    this.groupedResults = [];
  }

  addToOrder(product: Product): void {
    const existing = this.order.find(o => o.product.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.order.push({ product, quantity: 1 });
    }
    console.log('Order:', this.order);
  }
}