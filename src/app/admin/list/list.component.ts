import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs/operators';
import { IRole } from 'src/app/models';

import { AccountService } from 'src/app/services';

@Component({ selector: 'app-list',
templateUrl: './list.component.html',
styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {
    accounts?: any[];
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();searchQuery: string = '';
    roleFilter: string = '';
    filteredAccounts: any[] = [];
    isNavCollapsed: boolean = false;
    userInitials = '';
    firstName = '';
    account = this.accountService.accountValue;
    Role = IRole;

    

    constructor(private accountService: AccountService) { }

    ngOnInit() {
      this.accountService.getAll()
        .pipe(first())
        .subscribe(accounts => {
          this.accounts = accounts;
          this.dataSource.data = this.accounts;
          this.filteredAccounts = this.accounts;
        });

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