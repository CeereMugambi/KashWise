import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { AccountService } from 'src/app/services';
import { AlertService } from 'src/app/services';
import { MustMatch } from 'src/app/helpers';
import { first } from 'rxjs/operators';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.sass']
})
export class RegistrationFormComponent implements OnInit {

  @Input() isAdmin: boolean = false;
  @Input() isUpdateMode: boolean = false;
  @Input() isUpdate: boolean = false;
  @Output() changeRouteEvent = new EventEmitter<void>();
  @Output() updateSuccess = new EventEmitter<void>();

  account = this.accountService.accountValue!;
  form!: FormGroup;
  submitting = false;
  submitted = false;
  hidePassword = true;
  hideConfirmPassword = true;
  deleting = false;
  id?: string;

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPassword() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private dialog: MatDialog
  ) {}

  noSpecialChars(control: AbstractControl) {
    const pattern = /^[a-zA-Z0-9]*$/;
    if (!pattern.test(control.value)) {
      return { specialChars: true };
    }
    return null;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      firstName: ['', [Validators.required, this.noSpecialChars]],
      lastName: ['', [Validators.required, this.noSpecialChars]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [this.isAdmin, Validators.requiredTrue]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

    this.id = this.route.snapshot.params['id'];
    this.isUpdate = !!this.id;
    this.isUpdateMode = this.isUpdate;

    if (this.isAdmin) {
      this.form.addControl('role', new FormControl('', Validators.required));
    }

    if (this.isUpdate && this.id) {
      this.accountService.getById(this.id)
        .pipe(first())
        .subscribe(account => {
          this.f['title'].setValue(account.title);
          this.f['firstName'].setValue(account.firstName);
          this.f['lastName'].setValue(account.lastName);
          this.f['email'].setValue(account.email);
          if (this.isAdmin) {
            this.f['role'].setValue(account.role);
          }
        });
    }
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();

    if (this.form.invalid) {
      return;
    }

    this.submitting = true;

    if (this.isUpdate && this.id) {
      // ← update the selected account by id
      this.accountService.update(this.id, this.form.value)
        .pipe(first())
        .subscribe({
          next: () => {
            this.alertService.success('Account updated successfully', {
              keepAfterRouteChange: true
            });
            this.updateSuccess.emit();
            this.router.navigate(['/list']);  // ← back to list
          },
          error: error => {
            this.alertService.error(error);
            this.submitting = false;
          }
        });

    } else if (this.isUpdate && !this.id) {
      // ← user updating their own profile (no id in route)
      this.accountService.update(this.account.id!, this.form.value)
        .pipe(first())
        .subscribe({
          next: () => {
            this.alertService.success('Profile updated successfully', {
              keepAfterRouteChange: true
            });
            this.updateSuccess.emit();
          },
          error: error => {
            this.alertService.error(error);
            this.submitting = false;
          }
        });

    } else {
      // ← register new account
      this.accountService.register(this.form.value)
        .pipe(first())
        .subscribe({
          next: () => {
            this.alertService.success('Registration successful', {
              keepAfterRouteChange: true
            });
            this.changeRouteEvent.emit();
            if (this.isAdmin) {
              this.router.navigate(['/list']);  // ← admin goes back to list
            } else {
              this.router.navigate(['../login'], { relativeTo: this.route }); // ← user goes to login
            }
          },
          error: error => {
            this.alertService.error(error);
            this.submitting = false;
          }
        });
    }
  }

  onDelete() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Account',
        message: 'Are you sure you want to delete this account? This action cannot be undone.'
      }
    });
  
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deleting = true;
        const deleteId = this.id ?? this.account.id!;
  
        this.accountService.delete(deleteId)
          .pipe(first())
          .subscribe({
            next: () => {
              this.alertService.success('Account deleted successfully', {
                keepAfterRouteChange: true
              });
              if (this.isAdmin) {
                this.router.navigate(['/list']);
              }
            },
            error: error => {
              this.alertService.error(error);
              this.deleting = false;
            }
          });
      }
    });
  }
}