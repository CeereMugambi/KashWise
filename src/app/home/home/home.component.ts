import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { IRole, IAccount} from 'src/app/models';
import { Investment, PortfolioSummary, ActivityItem } from 'src/app/models';
import { mockInvestments, mockPortfolioSummary, mockRecentActivities } from 'src/assets/data/mock-investments';
import { AccountService } from 'src/app/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {

  // ─── Auth & Nav ──────────────────────────────
  Role = IRole;
  account: IAccount | null = this.accountService.accountValue;
  isNavCollapsed = false;
  userInitials   = '';
  firstName      = '';

  // ─── Investment Data ─────────────────────────
  investments: Investment[]       = [];
  portfolioSummary!: PortfolioSummary;
  recentActivities: ActivityItem[] = [];

  constructor(
    private accountService: AccountService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.isNavCollapsed = window.innerWidth <= 1024;
    this.setUserInfo();
    this.loadInvestmentData();
  }

  // ─── Data Loading ─────────────────────────────

  private loadInvestmentData(): void {
    this.investments      = mockInvestments;
    this.portfolioSummary = mockPortfolioSummary;
    this.recentActivities = mockRecentActivities;
  }

  // ─── User Helpers ─────────────────────────────

  private setUserInfo(): void {
    const acc = this.accountService.accountValue;
    if (acc?.firstName && acc?.lastName) {
      this.firstName    = acc.firstName;
      this.userInitials = `${acc.firstName.charAt(0)}${acc.lastName.charAt(0)}`.toUpperCase();
    } else {
      this.accountService.account.subscribe(a => {
        if (a?.firstName && a?.lastName) {
          this.firstName    = a.firstName;
          this.userInitials = `${a.firstName.charAt(0)}${a.lastName.charAt(0)}`.toUpperCase();
        }
      });
    }
  }

  // ─── Nav ──────────────────────────────────────

  toggleNav(): void {
    this.isNavCollapsed = !this.isNavCollapsed;
  }

  logout(): void {
    this.accountService.logout();
  }

  // ─── Navigation Actions ───────────────────────

  viewAllInvestments(): void {
    this.router.navigate(['/portfolio']);
  }

  openNewInvestment(): void {
    this.router.navigate(['/portfolio/new']);
  }

  openTransfer(): void {
    this.router.navigate(['/transactions/transfer']);
  }

  downloadReport(): void {
    this.router.navigate(['/analytics/report']);
  }

  // ─── Formatting Helpers ───────────────────────

  formatCurrency(value: number | undefined): string {
    if (value === undefined) return 'KSH 0';
    return `KSH ${value.toLocaleString('en-KE')}`;
  }
  
  formatChange(changePercent: number | undefined): string {
    if (changePercent === undefined) return '0.0%';
    const sign = changePercent > 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(1)}%`;
  }
  
  isPositiveChange(changePercent: number | undefined): boolean {
    return (changePercent ?? 0) > 0;
  }
}