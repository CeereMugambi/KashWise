import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/services';
import { IAccount, IRole, Product } from 'src/app/models';
import { allProducts } from 'src/assets/data/mock-products';

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
  subtotal: number;
}

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.sass']
})
export class ProductDetailComponent implements OnInit {

  Role = IRole;
  account?: IAccount | null;
  isNavCollapsed = false;
  userInitials = '';
  firstName = '';

  product: Product | null = null;
  productNotFound = false;

  images: string[] = [];
  currentImageIndex = 0;

  selectedSize = '';
  selectedQuantity = 1;
  sizeOptions: { size: string; quantity: number }[] = [];

  // Cart
  showCart = false;
  cartItems: CartItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
    if (isNaN(id)) { this.productNotFound = true; return; }

    const found = allProducts.find(p => p.id === id) as Product;
    if (!found) { this.productNotFound = true; return; }

    this.product = found;

    this.images = [
      found.imageUrl,
      `https://placehold.co/600x400/008080/fff?text=${encodeURIComponent(found.productName)}+View+2`,
      `https://placehold.co/600x400/003333/fff?text=${encodeURIComponent(found.productName)}+View+3`,
    ];

    const sameCategoryProducts = allProducts.filter(p => p.category === found.category);
    const seen = new Set<string>();
    this.sizeOptions = sameCategoryProducts
      .filter(p => { if (seen.has(p.size)) return false; seen.add(p.size); return true; })
      .map(p => ({ size: p.size, quantity: p.quantity }));

    this.selectedSize = found.size;
  }

  get selectedSizeOption() {
    return this.sizeOptions.find(s => s.size === this.selectedSize);
  }

  get maxQuantity(): number {
    return this.selectedSizeOption?.quantity ?? this.product?.quantity ?? 0;
  }

  get cartTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  }

  get cartCount(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  selectSize(size: string): void {
    this.selectedSize = size;
    this.selectedQuantity = 1;
  }

  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
  }

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }

  incrementQty(): void {
    if (this.selectedQuantity < this.maxQuantity) this.selectedQuantity++;
  }

  decrementQty(): void {
    if (this.selectedQuantity > 1) this.selectedQuantity--;
  }

  addToCart(): void {
    if (!this.product) return;

    const existing = this.cartItems.find(
      i => i.product.id === this.product!.id && i.size === this.selectedSize
    );

    if (existing) {
      existing.quantity += this.selectedQuantity;
      existing.subtotal = existing.quantity * existing.product.price;
    } else {
      this.cartItems.push({
        product: this.product,
        size: this.selectedSize,
        quantity: this.selectedQuantity,
        subtotal: this.selectedQuantity * this.product.price
      });
    }

    this.showCart = true;
  }

  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
    if (this.cartItems.length === 0) this.showCart = false;
  }

  updateCartQty(index: number, delta: number): void {
    const item = this.cartItems[index];
    const newQty = item.quantity + delta;
    if (newQty < 1) { this.removeFromCart(index); return; }
    item.quantity = newQty;
    item.subtotal = newQty * item.product.price;
  }

  closeCart(): void {
    this.showCart = false;
    this.router.navigate(['/home']);
  }

  proceedToCheckout(): void {
     this.router.navigate(['/receipt'], {
      state: {
        cartItems: this.cartItems,
        total: this.cartTotal,
        orderDate: new Date().toISOString()
      }
    });
  }
  addMoreItems(): void {
    this.showCart = false;
    this.router.navigate(['/home']);
  }


  goBack(): void {
    this.router.navigate(['/home']);
  }

  toggleNav(): void { this.isNavCollapsed = !this.isNavCollapsed; }
  logout(): void { this.accountService.logout(); }

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
}