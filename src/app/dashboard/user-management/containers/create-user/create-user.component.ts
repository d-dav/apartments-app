import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, Observable } from 'rxjs';
import { UserService } from '../../services/user.service';

import { UserModel } from 'src/app/shared/models/user.model';
import { UserRoles } from 'src/app/shared/models/user-role';
import { take, takeUntil } from 'rxjs/operators';
import { ErrorStateMatcher } from '@angular/material/core';

class DifferentPasswordsStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl): boolean {
    return !!(control && control.parent && control.parent.hasError('differentPasswords') && control.touched);
  }
}

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit, AfterViewInit {
  public loading$: Observable<boolean>;

  public userForm: FormGroup;
  public userRoles = UserRoles;

  public user: UserModel;
  public isEdit = false;

  public passwordMatcher = new DifferentPasswordsStateMatcher();

  private unsubscribe$: Subject<void> = new Subject();
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
  ) {
    this.loading$ = this.userService.loading$;

    this.userForm = this.formBuilder.group({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      password: new FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9]{8,}')])),
      confirmPassword: new FormControl(''),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      role: new FormControl('', Validators.required),
      verified: new FormControl('', Validators.required),
    }, { validators: this.checkPasswords });
  }

  ngOnInit(): void {
    this.route.data.pipe(take(1)).subscribe(data => {
      this.isEdit = data.isEdit;

      if (this.isEdit) {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) {
          this.router.navigate(['/users']);
        }

        this.user = this.userService.getUser();
        if (!this.user || (this.user._id !== id)) {
          this.subscribeToUser();
          this.userService.loadUser(id);
        } else {
          this.patchForm();
        }
      }
    });
  }

  ngAfterViewInit() {
    this.subscribeToUser();
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmPassword');

    return password === confirmPassword.value ? null : { differentPasswords: true };
  }

  subscribeToUser(): void {
    this.userService.selectedUser$.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      if (!user) {
        return;
      }

      this.user = user;
      this.patchForm();
    });
  }

  patchForm(): void {
    this.userForm.patchValue(this.user);
    this.userForm.get('password').reset();
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    const { confirmPassword, ...body } = this.userForm.value;

    if (this.isEdit) {
      this.userService.updateUser(this.user._id, body);
    } else {
      this.userService.createUser(body);
    }
  }

}
