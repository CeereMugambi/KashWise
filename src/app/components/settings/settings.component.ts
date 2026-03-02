import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { AccountService } from 'src/app/services';
import { IAccount, IRole } from 'src/app/models';

interface ToggleSetting {
  icon: string;
  title: string;
  desc: string;
  enabled: boolean;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit, OnDestroy {

  Role = IRole;
  account?: IAccount | null;
  isNavCollapsed = false;
  userInitials = '';

  activeTab = 'notifications';
  selectedTheme = 'light';
  selectedLanguage = 'en';
  selectedCurrency = 'KSH';
  defaultLocation = 'nairobi';
  settingsSaved = false;

  private systemThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  private systemThemeListener = (e: MediaQueryListEvent) => {
    if (this.selectedTheme === 'system') {
      this.applyTheme(e.matches ? 'dark' : 'light');
    }
  };

  tabs = [
    { key: 'notifications', label: 'Notifications', icon: 'notifications' },
    { key: 'appearance',    label: 'Appearance',    icon: 'palette'        },
    { key: 'privacy',       label: 'Privacy',       icon: 'shield'         },
    { key: 'orders',        label: 'Orders',        icon: 'receipt_long'   }
  ];

  notificationSettings: ToggleSetting[] = [
    { icon: 'email',          title: 'Email Notifications',        desc: 'Receive order updates via email',              enabled: true  },
    { icon: 'sms',            title: 'SMS Notifications',          desc: 'Get text messages for order status changes',   enabled: false },
    { icon: 'campaign',       title: 'Promotional Offers',         desc: 'Receive deals and special offers',             enabled: true  },
    { icon: 'inventory_2',    title: 'Stock Alerts',               desc: 'Notify when low-stock items are restocked',    enabled: true  },
    { icon: 'local_shipping', title: 'Delivery Updates',           desc: 'Real-time updates on your deliveries',         enabled: true  },
    { icon: 'rate_review',    title: 'Review Reminders',           desc: 'Prompt to review items you have purchased',    enabled: false }
  ];

  privacySettings: ToggleSetting[] = [
    { icon: 'visibility',  title: 'Profile Visibility',      desc: 'Allow others to view your public profile',     enabled: true  },
    { icon: 'analytics',   title: 'Usage Analytics',         desc: 'Help improve the app with anonymous data',     enabled: true  },
    { icon: 'cookie',      title: 'Personalization Cookies', desc: 'Allow cookies for a personalized experience',  enabled: true  },
    { icon: 'location_on', title: 'Location Access',         desc: 'Use your location for delivery suggestions',   enabled: false }
  ];

  orderSettings: ToggleSetting[] = [
    { icon: 'save',        title: 'Save Order History',          desc: 'Keep a record of all past orders',              enabled: true  },
    { icon: 'replay',      title: 'Quick Reorder',               desc: 'Enable one-click reordering of past items',     enabled: true  },
    { icon: 'receipt',     title: 'Auto-Print Receipt',          desc: 'Automatically print receipt after checkout',    enabled: false },
    { icon: 'local_offer', title: 'Apply Offers Automatically',  desc: 'Auto-apply eligible discounts at checkout',     enabled: true  }
  ];

  constructor(
    private accountService: AccountService,
    private renderer: Renderer2
  ) {
    this.accountService.account.subscribe(x => this.account = x);
  }

  ngOnInit(): void {
    this.setUserInitials();
    this.loadSavedSettings();

    // Listen for OS-level theme changes
    this.systemThemeMediaQuery.addEventListener('change', this.systemThemeListener);
  }

  ngOnDestroy(): void {
    this.systemThemeMediaQuery.removeEventListener('change', this.systemThemeListener);
  }

  // ================================
  // THEME
  // ================================

  onThemeChange(theme: 'light' | 'dark' | 'system'): void {
    this.selectedTheme = theme;
    if (theme === 'system') {
      const isDark = this.systemThemeMediaQuery.matches;
      this.applyTheme(isDark ? 'dark' : 'light');
    } else {
      this.applyTheme(theme);
    }
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    const body = document.body;
    if (theme === 'dark') {
      this.renderer.addClass(body, 'dark-theme');
      this.renderer.removeClass(body, 'light-theme');
    } else {
      this.renderer.addClass(body, 'light-theme');
      this.renderer.removeClass(body, 'dark-theme');
    }
  }

  // ================================
  // SAVE / LOAD
  // ================================

  saveSettings(): void {
    const settings = {
      theme:           this.selectedTheme,
      language:        this.selectedLanguage,
      currency:        this.selectedCurrency,
      defaultLocation: this.defaultLocation,
      notifications:   this.notificationSettings.map(s => s.enabled),
      privacy:         this.privacySettings.map(s => s.enabled),
      orders:          this.orderSettings.map(s => s.enabled)
    };
    localStorage.setItem('appSettings', JSON.stringify(settings));
    this.settingsSaved = true;
    setTimeout(() => this.settingsSaved = false, 3000);
  }

  loadSavedSettings(): void {
    const raw = localStorage.getItem('appSettings');
    if (!raw) return;
    try {
      const s = JSON.parse(raw);
      if (s.theme) {
        this.selectedTheme = s.theme;
        this.onThemeChange(s.theme as 'light' | 'dark' | 'system');
      }      if (s.language)          this.selectedLanguage  = s.language;
      if (s.currency)          this.selectedCurrency  = s.currency;
      if (s.defaultLocation)   this.defaultLocation   = s.defaultLocation;
      if (s.notifications)     s.notifications.forEach((v: boolean, i: number) => { if (this.notificationSettings[i]) this.notificationSettings[i].enabled = v; });
      if (s.privacy)           s.privacy.forEach((v: boolean, i: number)       => { if (this.privacySettings[i])       this.privacySettings[i].enabled = v; });
      if (s.orders)            s.orders.forEach((v: boolean, i: number)         => { if (this.orderSettings[i])         this.orderSettings[i].enabled = v; });
    } catch {
      // corrupted settings — ignore
    }
  }

  clearHistory(): void {
    if (confirm('Clear all activity history? This cannot be undone.')) {
      console.log('History cleared');
    }
  }

  // ================================
  // NAV
  // ================================

  setUserInitials(): void {
    const account = this.accountService.accountValue;
    if (account?.firstName && account?.lastName) {
      this.userInitials = `${account.firstName.charAt(0)}${account.lastName.charAt(0)}`.toUpperCase();
    } else {
      this.accountService.account.subscribe(acc => {
        if (acc?.firstName && acc?.lastName) {
          this.userInitials = `${acc.firstName.charAt(0)}${acc.lastName.charAt(0)}`.toUpperCase();
        }
      });
    }
  }

  toggleNav(): void { this.isNavCollapsed = !this.isNavCollapsed; }
  logout(): void { this.accountService.logout(); }
}