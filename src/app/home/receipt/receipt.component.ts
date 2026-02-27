import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services';
import { IAccount, IRole } from 'src/app/models';
import { CartItem } from '../product-detail/product-detail.component';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.sass']
})
export class ReceiptComponent implements OnInit {

  Role = IRole;
  account?: IAccount | null;
  isNavCollapsed = false;
  userInitials = '';
  firstName = '';

  cartItems: CartItem[] = [];
  total = 0;
  orderDate = '';
  orderId = '';

  constructor(
    private router: Router,
    private accountService: AccountService
  ) {
    this.accountService.account.subscribe(x => this.account = x);

    // Read state passed from product-detail
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as any;

    if (state) {
      this.cartItems = state.cartItems || [];
      this.total = state.total || 0;
      this.orderDate = state.orderDate || new Date().toISOString();
    } else {
      // If navigated directly with no state, redirect home
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.setUserInitials();
    this.orderId = this.generateOrderId();
  }

  generateOrderId(): string {
    return 'ORD-' + Date.now().toString(36).toUpperCase();
  }

  get formattedDate(): string {
    return new Date(this.orderDate).toLocaleDateString('en-KE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  continueShopping(): void {
    this.router.navigate(['/home']);
  }

  printReceipt(): void {
    window.print();
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