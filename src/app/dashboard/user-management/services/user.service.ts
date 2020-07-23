import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

import { UserModel } from 'src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public loading$: Subject<boolean> = new Subject();

  public users$: Subject<UserModel[]> = new Subject();
  public selectedUser$: Subject<UserModel> = new Subject();

  private users: UserModel[];
  private selectedUser: UserModel;
  constructor(private http: HttpClient, public toastr: ToastrService, public router: Router) { }

  getUsers(): UserModel[] {
    return this.users;
  }

  getUser(): UserModel {
    return this.selectedUser;
  }

  loadUsers() {
    this.loading$.next(true);
    this.http.get(`${environment.apiUrl}/users`).subscribe(
      (res: { data: UserModel[]; success: number }) => {
        this.users = res.data;
        this.users$.next(this.users.slice());

        this.loading$.next(false);
      },
      (res: HttpErrorResponse) => {
        this.loading$.next(false);
      });
  }

  loadUser(id: string) {
    this.loading$.next(true);
    this.http.get(`${environment.apiUrl}/users/${id}`).subscribe(
      (res: { data: UserModel; success: number }) => {
        this.selectedUser = res.data;
        this.selectedUser$.next({ ...this.selectedUser });

        this.loading$.next(false);
      },
      (res: HttpErrorResponse) => {
        this.loading$.next(false);
      });
  }

  selectUser(users: UserModel) {
    this.selectedUser = users;
    this.selectedUser$.next({ ...this.selectedUser });
  }

  createUser(body: UserModel) {
    this.loading$.next(true);
    this.http.post(`${environment.apiUrl}/users`, body).subscribe(
      (res: { data: UserModel; success: number }) => {
        this.selectedUser = res.data;
        this.selectedUser$.next({ ...this.selectedUser });

        if (this.users && this.users.length) {
          this.users.push(this.selectedUser);
          this.users$.next(this.users.slice());
        }

        this.loading$.next(false);
        this.router.navigate(['/users']);
      },
      (res: HttpErrorResponse) => {
        this.loading$.next(false);
      });
  }

  updateUser(id: string, body: UserModel) {
    this.loading$.next(true);
    this.http.put(`${environment.apiUrl}/users/${id}`, body).subscribe(
      (res: { data: string; success: number }) => {
        this.toastr.success(res.data);
        this.loading$.next(false);

        this.selectedUser = { ...this.selectedUser, ...body };
        this.selectedUser$.next({ ...this.selectedUser });

        if (this.users && this.users.length) {
          this.users = this.users.map(ap => ap._id === body._id ? { ...ap, ...body } : ap);
          this.users$.next({ ...this.users });
        }

        this.router.navigate(['/users']);
      },
      (res: HttpErrorResponse) => {
        this.loading$.next(false);
      });
  }

  deleteUser(id: string) {
    this.loading$.next(true);
    this.http.delete(`${environment.apiUrl}/users/${id}`).subscribe(
      (res: { data: string; success: number }) => {
        this.toastr.success(res.data);

        this.users = this.users.filter(ap => ap._id !== id);
        this.users$.next(this.users.slice());

        this.loading$.next(false);
      },
      (res: HttpErrorResponse) => {
        this.loading$.next(false);
      });
  }
}
