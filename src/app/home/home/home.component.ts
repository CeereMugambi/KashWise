import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ViewEncapsulation } from '@angular/core';
import { Product, IRole } from 'src/app/models';
import { allProducts } from 'src/assets/data/mock-products';
import { AccountService, CartService } from 'src/app/services';
import { Router } from '@angular/router';

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
export class HomeComponent implements OnInit, OnDestroy {

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

  // ← reactive cart state
  cartCount = 0;
  hasCartItems = false;

  private cartSub!: Subscription;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.products = allProducts;
    this.categories = [...new Set(this.products.map(p => p.category))];
    this.setUserInitials();
    this.buildGroupedResults();

    // ← subscribe so cart count updates reactively
    this.cartSub = this.cartService.cartItems$.subscribe(items => {
      this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
      this.hasCartItems = this.cartCount > 0;
      console.log('Cart updated on home:', this.cartCount);
    });
  }

  ngOnDestroy(): void {
    this.cartSub?.unsubscribe();
  }

  goToCart(): void {
    const lastItem = this.cartService.cartItems[0];
    if (lastItem) {
      this.router.navigate(['/product-detail', lastItem.product.id]);
    }
  }

  // ... rest of your methods unchanged ...
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

  toggleNav(): void { this.isNavCollapsed = !this.isNavCollapsed; }
  logout(): void { this.accountService.logout(); }

  onSearchChange(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.suggestions = query
      ? this.products.filter(p => p.productName.toLowerCase().includes(query)).slice(0, 6)
      : [];
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

    const groupMap = new Map<string, Product[]>();
    filtered.forEach(p => {
      if (!groupMap.has(p.category)) groupMap.set(p.category, []);
      groupMap.get(p.category)!.push(p);
    });

    this.groupedResults = Array.from(groupMap.entries()).map(([category, products]) => ({
      category, products
    }));
  }

  selectSuggestion(product: Product): void {
    this.searchQuery = product.productName;
    this.suggestions = [];
    this.showSuggestions = false;
    this.buildGroupedResults();
  }

  hideSuggestions(): void {
    setTimeout(() => { this.showSuggestions = false; }, 200);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.suggestions = [];
    this.buildGroupedResults();
  }

  addToOrder(product: Product): void {
    this.router.navigate(['/product-detail', product.id]);
  }
}