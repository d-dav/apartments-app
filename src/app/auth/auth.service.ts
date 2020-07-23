import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

import { Subject } from 'rxjs';

import { UserModel } from 'src/app/shared/models/user.model';
import { LoginRequest } from './models/login-request.model';
import { RegisterRequest } from './models/register-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user$ = new Subject<UserModel>();
  private user: UserModel;
  private token: string;

  public error = new Subject<any>();

  constructor(public http: HttpClient, public toastr: ToastrService, public router: Router) { }

  getUser(): UserModel {
    return { ...this.user };
  }

  getToken(): string {
    return this.token;
  }

  getIsAuthenticated(): boolean {
    return !!this.user;
  }

  checkUser() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user) {
      this.user = JSON.parse(user);
      this.token = JSON.parse(token);
      this.user$.next({ ...this.user });
    }
  }

  login(body: LoginRequest) {
    this.http.post(`${environment.apiUrl}/users/login`, body)
      .subscribe((res: { data: { token: string, user: UserModel }, success: number }) => {
        this.token = res.data.token;
        this.user = res.data.user;
        this.user$.next({ ...this.user });
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('token', JSON.stringify(this.token));
      }, error => {
        this.error.next({ ...error });
      });
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    this.user = null;
    this.token = null;
    this.user$.next({ ...this.user });

    this.router.navigate(['/login']);
  }

  register(body: RegisterRequest) {
    this.http.post(`${environment.apiUrl}/users/register`, body)
      .subscribe((res: { data: string, success: number }) => {
        this.toastr.success(res.data);
        this.router.navigate(['/login']);
      }, error => {
        this.toastr.error(error.data);
        this.error.next({ ...error });
      });
  }

}
