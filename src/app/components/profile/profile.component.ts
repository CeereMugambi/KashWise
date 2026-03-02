import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services';
import { IAccount, IRole } from 'src/app/models';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPwd = control.get('newPassword')?.value;
  const confirmPwd = control.get('confirmPassword')?.value;
  return newPwd && confirmPwd && newPwd !== confirmPwd ? { mismatch: true } : null;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  Role = IRole;
  account?: IAccount | null;
  isNavCollapsed = false;
  userInitials = '';
  firstName = '';
  lastName = '';

  profileImageUrl: string | null = null;
  uploadError = '';

  isEditing = false;
  saving = false;
  savedSuccess = false;

  updatingProfile = false;
  confirmSuccess = false;

  changingPassword = false;
  passwordSuccess = false;
  passwordError = '';
  passwordSubmitted = false;

  showCurrentPwd = false;
  showNewPwd = false;
  showConfirmPwd = false;

  totalOrders = 14;
  pendingOrders = 2;
  totalSold = 18450;
  memberSince = '2024';

  // default locked — admin must unlock
  isProfileLocked = true;

  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountService: AccountService
  ) {
    this.accountService.account.subscribe(x => this.account = x);
  }

  ngOnInit(): void {
    this.setUserInitials();
    this.buildForms();
    this.loadSavedPhoto();
  }

  // ================================
  // PROFILE PICTURE
  // ================================

  triggerFileInput(): void {
    if (this.isProfileLocked) return;
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    this.uploadError = '';
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.uploadError = 'Please select a valid image file (JPG, PNG, GIF, etc.)';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.uploadError = 'Image must be smaller than 5MB';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.profileImageUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  removePhoto(): void {
    this.profileImageUrl = null;
    localStorage.removeItem('profileImage');
  }

  loadSavedPhoto(): void {
    const saved = localStorage.getItem('profileImage');
    if (saved) this.profileImageUrl = saved;

    // check if admin has unlocked this specific account
    const adminUnlocked = localStorage.getItem('adminUnlockedProfile');
    const currentAccountId = String(this.accountService.accountValue?.id);
    const isAdminUnlocked = adminUnlocked === currentAccountId;

    if (isAdminUnlocked) {
      this.isProfileLocked = false;
    } else {
      this.isProfileLocked = true;
      this.profileForm?.disable();
    }
  }

  // ================================
  // CONFIRM NEW DETAILS
  // — user clicks this when done editing
  // — notifies admin and locks profile
  // ================================

  confirmNewDetails(): void {
    this.updatingProfile = true;
  
    // Capture the edited values from the form
    const updatedDetails = {
      firstName: this.profileForm.value.firstName || this.firstName,
      lastName:  this.profileForm.value.lastName  || this.lastName,
      email:     this.profileForm.value.email     || this.account?.email,
      phone:     this.profileForm.value.phone     || '',
      location:  this.profileForm.value.location  || ''
    };
  
    // Update local display
    this.firstName = updatedDetails.firstName;
    this.lastName  = updatedDetails.lastName;
    this.userInitials = `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
  
    // Persist photo
    if (this.profileImageUrl) {
      localStorage.setItem('profileImage', this.profileImageUrl);
    } else {
      localStorage.removeItem('profileImage');
    }
  
    const currentAccount = this.accountService.accountValue;
  
    // Save the pending updated details so the review page can display them
    localStorage.setItem('pendingProfileUpdate', JSON.stringify({
      accountId: String(currentAccount?.id),
      ...updatedDetails
    }));
  
    // Write notification for admin
    const notification = {
      accountId:    String(currentAccount?.id),
      accountName:  `${updatedDetails.firstName} ${updatedDetails.lastName}`,
      accountEmail: updatedDetails.email,
      timestamp:    new Date().toISOString(),
      message:      'User has confirmed their updated profile details. Please review and lock the profile.'
    };
    localStorage.setItem('adminProfileNotification', JSON.stringify(notification));
  
    // Clear admin unlock — profile goes back to pending admin review
    localStorage.removeItem('adminUnlockedProfile');
  
    setTimeout(() => {
      this.updatingProfile = false;
      this.isEditing = false;
      this.profileForm.disable();
      this.confirmSuccess = true;
      this.isProfileLocked = true;
      setTimeout(() => this.confirmSuccess = false, 4000);
    }, 800);
  }

  // ================================
  // PROFILE LOCK — user can only lock, admin unlocks
  // ================================

  toggleProfileLock(): void {
    if (!this.isProfileLocked) {
      // user locks their own profile
      this.isProfileLocked = true;
      this.isEditing = false;
      this.profileForm.disable();
      localStorage.removeItem('adminUnlockedProfile');
    } else {
      // locked — show message, only admin can unlock
      this.uploadError = 'Your profile is locked. An Administrator must unlock it before you can make changes.';
      setTimeout(() => this.uploadError = '', 4000);
    }
  }

  // ================================
  // FORMS
  // ================================

  buildForms(): void {
    const acc = this.accountService.accountValue;
    this.profileForm = this.fb.group({
      firstName:  [acc?.firstName || '', Validators.required],
      lastName:   [acc?.lastName  || '', Validators.required],
      email:      [acc?.email     || '', [Validators.required, Validators.email]],
      phone:      [''],
      location:   ['Nairobi, Kenya']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword:     ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });

    this.profileForm.disable();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.savedSuccess = false;
    if (this.isEditing) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
      const acc = this.accountService.accountValue;
      this.profileForm.patchValue({
        firstName: acc?.firstName || '',
        lastName:  acc?.lastName  || '',
        email:     acc?.email     || ''
      });
    }
  }

  onSave(): void {
    if (this.profileForm.invalid) return;
    this.saving = true;
    setTimeout(() => {
      this.firstName = this.profileForm.value.firstName;
      this.lastName  = this.profileForm.value.lastName;
      this.userInitials = `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
      this.saving = false;
      this.savedSuccess = true;
      this.isEditing = false;
      this.profileForm.disable();
      setTimeout(() => this.savedSuccess = false, 3000);
    }, 800);
  }

  // ================================
  // CHANGE PASSWORD
  // ================================

  onChangePassword(): void {
    this.passwordSubmitted = true;
    this.passwordError = '';
    this.passwordSuccess = false;

    if (this.passwordForm.invalid) return;

    const { currentPassword, newPassword } = this.passwordForm.value;
    const account = this.accountService.accountValue;

    if (!account) {
      this.passwordError = 'No active session found. Please log in again.';
      return;
    }

    if (currentPassword === newPassword) {
      this.passwordError = 'New password must be different from your current password.';
      return;
    }

    this.changingPassword = true;

    this.accountService.login(account.email!, currentPassword).subscribe({
      next: () => {
        this.accountService.update(String(account.id), { password: newPassword }).subscribe({
          next: () => {
            this.changingPassword = false;
            this.passwordSuccess = true;
            this.passwordForm.reset();
            this.passwordSubmitted = false;

            setTimeout(() => {
              this.passwordSuccess = false;
              this.accountService.logout();
            }, 2000);
          },
          error: (err: any) => {
            this.changingPassword = false;
            this.passwordError = err?.error?.message || 'Failed to update password. Please try again.';
          }
        });
      },
      error: () => {
        this.changingPassword = false;
        this.passwordError = 'Current password is incorrect.';
      }
    });
  }

  // ================================
  // PASSWORD STRENGTH
  // ================================

  get passwordStrength(): number {
    const pwd = this.passwordForm.get('newPassword')?.value || '';
    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd)) score += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;
    return score;
  }

  get strengthClass(): string {
    const s = this.passwordStrength;
    if (s <= 25) return 'weak';
    if (s <= 50) return 'fair';
    if (s <= 75) return 'good';
    return 'strong';
  }

  get strengthLabel(): string {
    const map: Record<string, string> = { weak: 'Weak', fair: 'Fair', good: 'Good', strong: 'Strong' };
    return map[this.strengthClass];
  }

  confirmDeleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      localStorage.removeItem('profileImage');
      this.accountService.logout();
    }
  }

  setUserInitials(): void {
    const account = this.accountService.accountValue;
    if (account?.firstName && account?.lastName) {
      this.firstName = account.firstName;
      this.lastName  = account.lastName;
      this.userInitials = `${account.firstName.charAt(0)}${account.lastName.charAt(0)}`.toUpperCase();
    } else {
      this.accountService.account.subscribe(acc => {
        if (acc?.firstName && acc?.lastName) {
          this.firstName = acc.firstName;
          this.lastName  = acc.lastName;
          this.userInitials = `${acc.firstName.charAt(0)}${acc.lastName.charAt(0)}`.toUpperCase();
        }
      });
    }
  }

  toggleNav(): void { this.isNavCollapsed = !this.isNavCollapsed; }
  logout(): void { this.accountService.logout(); }
}