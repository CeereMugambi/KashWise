import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from 'src/app/models';

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
  subtotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  get cartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  get cartCount(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  get cartTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  }

  addToCart(product: Product, size: string, quantity: number): void {
    const current = [...this.cartItems];
    const existing = current.find(i => i.product.id === product.id && i.size === size);

    if (existing) {
      existing.quantity += quantity;
      existing.subtotal = existing.quantity * product.price;
    } else {
      current.push({
        product,
        size,
        quantity,
        subtotal: quantity * product.price
      });
    }

    this.cartItemsSubject.next(current);
  }

  updateQuantity(index: number, delta: number): void {
    const current = [...this.cartItems];
    const item = current[index];
    const newQty = item.quantity + delta;

    if (newQty < 1) {
      this.removeItem(index);
      return;
    }

    item.quantity = newQty;
    item.subtotal = newQty * item.product.price;
    this.cartItemsSubject.next(current);
  }

  removeItem(index: number): void {
    const current = [...this.cartItems];
    current.splice(index, 1);
    this.cartItemsSubject.next(current);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
  }
}