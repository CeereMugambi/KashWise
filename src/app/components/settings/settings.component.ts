import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services';
import { IRole } from 'src/app/models';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit {

  Role = IRole;
  account: any;
  userInitials = '';
  isNavCollapsed = false;

  activeTab = '';
  settingsSaved = false;

  selectedTheme = 'dark';
  selectedLanguage = 'en';
  selectedCurrency = 'KSH';
  defaultPortfolioView = 'overview';
  riskTolerance = 'moderate';

  tabs = [
    { key: 'notifications', label: 'Notifications', icon: 'notifications' },
    { key: 'appearance',    label: 'Appearance',    icon: 'palette'       },
    { key: 'privacy',       label: 'Privacy',       icon: 'shield'        },
    { key: 'investments',   label: 'Investments',   icon: 'trending_up'   }
  ];

  notificationSettings = [
    { icon: 'trending_up',  title: 'Portfolio Alerts',    desc: 'Notify me of significant portfolio changes',      enabled: true  },
    { icon: 'price_change', title: 'Price Movements',     desc: 'Alerts when assets move beyond set thresholds',   enabled: true  },
    { icon: 'receipt_long', title: 'Transaction Updates', desc: 'Receive updates when transactions are processed', enabled: true  },
    { icon: 'analytics',    title: 'Performance Reports', desc: 'Weekly and monthly portfolio summaries',          enabled: false },
    { icon: 'security',     title: 'Security Alerts',     desc: 'Notify me of account security events',           enabled: true  },
    { icon: 'email',        title: 'Email Digest',        desc: 'Daily digest of portfolio activity',             enabled: false }
  ];

  privacySettings = [
    { icon: 'visibility_off', title: 'Profile Visibility', desc: 'Make your profile visible to other users',   enabled: false },
    { icon: 'analytics',      title: 'Usage Analytics',    desc: 'Help improve the app by sharing usage data', enabled: true  },
    { icon: 'cookie',         title: 'Performance Cookies',desc: 'Allow cookies for a better experience',      enabled: true  },
    { icon: 'fingerprint',    title: 'Two-Factor Auth',    desc: 'Require 2FA on every login',                 enabled: false }
  ];

  investmentSettings = [
    { icon: 'show_chart',        title: 'Auto-Rebalancing Alerts', desc: 'Notify when portfolio drifts from target',    enabled: true  },
    { icon: 'lightbulb',         title: 'Investment Suggestions',  desc: 'Receive AI-powered investment insights',      enabled: true  },
    { icon: 'currency_exchange', title: 'Dividend Tracking',       desc: 'Track and notify for dividend payouts',       enabled: true  },
    { icon: 'lock_clock',        title: 'Lock-in Reminders',       desc: 'Remind me when lock-in periods are expiring', enabled: false }
  ];

  constructor(
    private router: Router,
    private accountService: AccountService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.account = this.accountService.accountValue;
    const first = this.account?.firstName?.[0] ?? '';
    const last  = this.account?.lastName?.[0]  ?? '';
    this.userInitials = (first + last).toUpperCase();

    // Set after init so *ngIf evaluates with a fully ready view
    setTimeout(() => {
      this.activeTab = 'notifications';
      this.cdr.detectChanges();
    });
  }

  setTab(key: string): void {
    this.activeTab = key;
    this.cdr.detectChanges();
  }

  toggleNav(): void {
    this.isNavCollapsed = !this.isNavCollapsed;
  }

  onThemeChange(theme: string): void {
    this.selectedTheme = theme;
  }

  clearHistory(): void {
    // implement clear history logic
  }

  saveSettings(): void {
    this.settingsSaved = true;
    setTimeout(() => this.settingsSaved = false, 3000);
  }

  logout(): void {
    this.accountService.logout();
    this.router.navigate(['/account/login']);
  }
}