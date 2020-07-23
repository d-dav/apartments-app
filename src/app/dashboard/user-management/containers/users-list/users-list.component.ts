import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { UserService } from '../../services/user.service';
import { AuthService } from 'src/app/auth/auth.service';

import { UserModel } from 'src/app/shared/models/user.model';
import { UserRoles } from 'src/app/shared/models/user-role';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnDestroy {
  public loading$: Observable<boolean>;

  public user: UserModel;
  public userRoles = UserRoles;

  public displayedColumns: string[];
  public data: UserModel[] = [];

  private unsubscribe$: Subject<void> = new Subject();
  constructor(private userService: UserService, private authService: AuthService, public router: Router) {
    this.displayedColumns = ['name', 'email', 'role', 'verified', 'actions'];

    this.loading$ = this.userService.loading$;
    this.user = this.authService.getUser();

    this.userService.users$.pipe(takeUntil(this.unsubscribe$)).subscribe(users => {
      this.data = users;
    });
  }

  ngOnInit(): void {
    this.userService.loadUsers();
  }

  onDelete(user: UserModel): void {
    if (!user) {
      return;
    }

    this.userService.deleteUser(user._id);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
