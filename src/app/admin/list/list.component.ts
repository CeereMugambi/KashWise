import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { IRole } from 'src/app/models';
import { AccountService, AlertService } from 'src/app/services';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {
  @Input() isAdmin: boolean = false;


  accounts?: any[];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  searchQuery: string = '';
  roleFilter: string = '';
  statusFilter: string = '';           // ← new: for the lock status filter dropdown
  filteredAccounts: any[] = [];
  isNavCollapsed: boolean = false;
  userInitials = '';
  firstName = '';
  account = this.accountService.accountValue;
  Role = IRole;
  deleting = false;
  id?: string;

  

  unlockedAccountId: string | null = null;

  profileNotification: { accountId: string; accountName: string; accountEmail: string; timestamp: string; message: string } | null = null;

  constructor(private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private dialog: MatDialog
  ) {}

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

    const savedUnlocked = localStorage.getItem('adminUnlockedProfile');
    if (savedUnlocked) {
      this.unlockedAccountId = savedUnlocked;
    }

    if (!localStorage.getItem('profileLocked')) {
      localStorage.setItem('profileLocked', 'true');
    }
  }

  // ================================
  // COMPUTED GETTERS (for title stats)
  // ================================

  get adminCount(): number {
    return this.accounts?.filter(a => a.role === 'Admin').length ?? 0;
  }

  get userCount(): number {
    return this.accounts?.filter(a => a.role === 'User').length ?? 0;
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

  unlockProfileForEdit(accountId: string): void {
    this.unlockedAccountId = accountId;
    localStorage.setItem('adminUnlockedProfile', accountId);
    localStorage.setItem('profileLocked', 'false');
  }

  relockProfile(accountId: string): void {
    if (this.unlockedAccountId === accountId) {
      this.unlockedAccountId = null;
      localStorage.removeItem('adminUnlockedProfile');
      localStorage.setItem('profileLocked', 'true');
    }
  }

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
      const matchesSearch =
        fullName.includes(this.searchQuery.toLowerCase()) ||
        a.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesRole = this.roleFilter ? a.role === this.roleFilter : true;
      const matchesStatus = this.statusFilter              // ← new: filter by lock status
        ? this.statusFilter === 'unlocked'
          ? this.unlockedAccountId === a.id
          : this.unlockedAccountId !== a.id
        : true;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  confirmDelete(account: any): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '420px',
      panelClass: 'dark-dialog',
      data: {
        title: 'Delete Account',
        message: `Are you sure you want to delete ${account.firstName} ${account.lastName}? This action cannot be undone.`
      }
    });
  
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        // Mark this specific account as deleting for the spinner
        account.isDeleting = true;
  
        this.accountService.delete(account.id)
          .pipe(first())
          .subscribe({
            next: () => {
              // Remove from both arrays so table updates instantly
              this.accounts = this.accounts!.filter(a => a.id !== account.id);
              this.filteredAccounts = this.filteredAccounts.filter(a => a.id !== account.id);
              this.alertService.success('Account deleted successfully', {
                keepAfterRouteChange: true
              });
            },
            error: err => {
              this.alertService.error(err);
              account.isDeleting = false;
            }
          });
      }
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.roleFilter = '';
    this.statusFilter = '';             // ← new: reset status filter too
    this.filteredAccounts = this.accounts ?? [];
  }
}