import { Component,} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/services';

@Component({ 
  templateUrl: 'edit-admin.component.html',
  styleUrls: ['./edit-admin.component.sass'],
 })

export class EditAdminComponent {
    title = 'Create Account';
    isAddMode = true;
  id?: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;
    this.title = this.isAddMode ? 'Create Account' : 'Edit Account';
  }

  onChangeRoute(): void {
    this.router.navigate(['/list']);
  }
}
