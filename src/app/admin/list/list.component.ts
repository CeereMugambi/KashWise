import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs/operators';
import { IRole } from 'src/app/models';
import { AccountService } from 'src/app/services';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {
  accounts?: any[];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  searchQuery: string = '';
  roleFilter: string = '';
  filteredAccounts: any[] = [];
  isNavCollapsed: boolean = false;
  userInitials = '';
  firstName = '';
  account = this.accountService.accountValue;
  Role = IRole;

  // The account currently UNLOCKED for editing (null = all locked by default)
  unlockedAccountId: string | null = null;

  // notification from user confirming their details
  profileNotification: { accountId: string; accountName: string; accountEmail: string; timestamp: string; message: string } | null = null;

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.accountService.getAll()
      .pipe(first())
      .subscribe(accounts => {
        this.accounts = accounts;
        this.dataSource.data = this.accounts;
        this.filteredAccounts = this.accounts;
      });

    this.setUserInitials();
    this.loadNotification();

    // Restore any previously unlocked account from localStorage
    const savedUnlocked = localStorage.getItem('adminUnlockedProfile');
    if (savedUnlocked) {
      this.unlockedAccountId = savedUnlocked;
    }

    // Ensure global lock state defaults to locked
    if (!localStorage.getItem('profileLocked')) {
      localStorage.setItem('profileLocked', 'true');
    }
  }

  // ================================
  // NOTIFICATION
  // ================================

  loadNotification(): void {
    const raw = localStorage.getItem('adminProfileNotification');
    if (raw) {
      try {
        this.profileNotification = JSON.parse(raw);
      } catch {
        this.profileNotification = null;
      }
    }
  }

  dismissNotification(): void {
    this.profileNotification = null;
    localStorage.removeItem('adminProfileNotification');
  }

  // Admin reviews and locks the profile after reviewing
  lockAfterReview(): void {
    if (this.profileNotification) {
      const notifiedId = this.profileNotification.accountId;
      if (this.unlockedAccountId === notifiedId) {
        this.unlockedAccountId = null;
        localStorage.removeItem('adminUnlockedProfile');
      }
      localStorage.setItem('profileLocked', 'true');
      this.dismissNotification();
    }
  }

  // ================================
  // UNLOCK / RELOCK
  // ================================

  // By default all accounts are LOCKED. Admin clicks the lock badge to UNLOCK.
  unlockProfileForEdit(accountId: string): void {
    this.unlockedAccountId = accountId;
    localStorage.setItem('adminUnlockedProfile', accountId);
    localStorage.setItem('profileLocked', 'false');
  }

  // Admin re-locks the currently unlocked account
  relockProfile(accountId: string): void {
    if (this.unlockedAccountId === accountId) {
      this.unlockedAccountId = null;
      localStorage.removeItem('adminUnlockedProfile');
      localStorage.setItem('profileLocked', 'true');
    }
  }

  // Helper: is this account the current admin's own account?
  isAdminOwnAccount(accountId: string): boolean {
    return this.account?.id === accountId;
  }

  // ================================
  // STANDARD METHODS
  // ================================

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

  onSearch(): void {
    this.filteredAccounts = this.accounts!.filter(a => {
      const fullName = `${a.firstName} ${a.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(this.searchQuery.toLowerCase()) ||
        a.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesRole = this.roleFilter ? a.role === this.roleFilter : true;
      return matchesSearch && matchesRole;
    });
  }

  deleteAccount(id: string) {
    const account = this.accounts!.find(x => x.id === id);
    if (account) {
      account.isDeleting = true;
      this.accountService.delete(id)
        .pipe(first())
        .subscribe(() => {
          this.accounts = this.accounts!.filter(x => x.id !== id);
          this.filteredAccounts = this.filteredAccounts.filter(x => x.id !== id);
          this.dataSource.data = this.accounts;
        });
    }
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.roleFilter = '';
    this.filteredAccounts = this.accounts ?? [];
  }
}