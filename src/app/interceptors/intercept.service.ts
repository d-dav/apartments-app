import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class InterceptService implements HttpInterceptor {

  constructor(
    public toastr: ToastrService,
    private authService: AuthService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `JWT ${token}`,
        }
      });
    }
    return next.handle(request)
      .pipe(tap(
        (event: any) => { },
        (response: HttpErrorResponse) => {
          this.toastr.error(response.error ? response.error.data : 'Unknown error');
        })
      );
  }
}
