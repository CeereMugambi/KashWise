import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { IRole } from 'src/app/models';
import { AccountService } from 'src/app/services';

@Component({
  selector: 'app-review-profile',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.sass']
})
export class ReviewComponent implements OnInit {
  accountId: string = '';
  account: any = null;
  notification: any = null;
  pendingUpdate: any = null;
  isLocking: boolean = false;
  isLocked: boolean = false;
  lockError: string = '';

  isNavCollapsed: boolean = false;
  userInitials: string = '';
  currentAccount = this.accountService.accountValue;
  Role = IRole;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.accountId = this.route.snapshot.paramMap.get('id') || '';

    // Load notification
    const raw = localStorage.getItem('adminProfileNotification');
    if (raw) {
      try { this.notification = JSON.parse(raw); }
      catch { this.notification = null; }
    }

    // Load pending update the user submitted
    const pendingRaw = localStorage.getItem('pendingProfileUpdate');
    if (pendingRaw) {
      try {
        const parsed = JSON.parse(pendingRaw);
        if (parsed.accountId === this.accountId) {
          this.pendingUpdate = parsed;
        }
      } catch {
        this.pendingUpdate = null;
      }
    }

    // Load current account data from backend
    if (this.accountId) {
      this.accountService.getById(this.accountId)
        .pipe(first())
        .subscribe({
          next: (account) => {
            this.account = account;
            if (this.pendingUpdate) {
              this.account = { ...this.account, ...this.pendingUpdate };
            }
          },
          error: () => {
            this.accountService.getAll()
              .pipe(first())
              .subscribe(accounts => {
                this.account = accounts.find((a: any) => a.id === this.accountId) || null;
                if (this.account && this.pendingUpdate) {
                  this.account = { ...this.account, ...this.pendingUpdate };
                }
              });
          }
        });
    }

    this.setUserInitials();
  }

  // ================================
  // NAV
  // ================================
  toggleNav(): void { this.isNavCollapsed = !this.isNavCollapsed; }
  logout(): void { this.accountService.logout(); }

  setUserInitials(): void {
    const acc = this.accountService.accountValue;
    if (acc?.firstName && acc?.lastName) {
      this.userInitials = `${acc.firstName.charAt(0)}${acc.lastName.charAt(0)}`.toUpperCase();
    } else {
      this.accountService.account.subscribe(a => {
        if (a?.firstName && a?.lastName) {
          this.userInitials = `${a.firstName.charAt(0)}${a.lastName.charAt(0)}`.toUpperCase();
        }
      });
    }
  }

  // ================================
  // REVIEW ACTIONS
  // ================================

  lockAndReturn(): void {
    this.isLocking = true;
    this.lockError = '';

    if (this.pendingUpdate) {
      const updatePayload: any = {
        firstName: this.pendingUpdate.firstName,
        lastName:  this.pendingUpdate.lastName,
        email:     this.pendingUpdate.email
      };

      this.accountService.update(this.accountId, updatePayload)
        .pipe(first())
        .subscribe({
          next: () => {
            this.finalizeLock();
          },
          error: (err: any) => {
            this.isLocking = false;
            this.lockError = err?.error?.message || 'Failed to save changes. Please try again.';
          }
        });
    } else {
      this.finalizeLock();
    }
  }

  private finalizeLock(): void {
    // Clear all localStorage flags
    const unlockedId = localStorage.getItem('adminUnlockedProfile');
    if (unlockedId === this.accountId) {
      localStorage.removeItem('adminUnlockedProfile');
    }

    localStorage.setItem('profileLocked', 'true');
    localStorage.removeItem('adminProfileNotification');
    localStorage.removeItem('pendingProfileUpdate');

    this.isLocked = true;

    // Redirect to /list (not login) after short confirmation delay
    setTimeout(() => {
      this.router.navigate(['/list']);
    }, 1200);
  }

  goBack(): void {
    this.router.navigate(['/list']);
  }

  // ================================
  // HELPERS
  // ================================

  getInitials(account: any): string {
    if (!account) return '';
    return `${account.firstName?.charAt(0) || ''}${account.lastName?.charAt(0) || ''}`.toUpperCase();
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }

  isChanged(field: string): boolean {
    if (!this.pendingUpdate || !this.account) return false;
    return this.pendingUpdate[field] !== undefined;
  }
}