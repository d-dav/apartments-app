import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';

import { UserRoles } from '../shared/models/user-role';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, public toastr: ToastrService) { }

  canActivate(): boolean {
    const user = this.authService.getUser();
    if (user.role !== UserRoles.admin) {
      this.toastr.warning(`You don't have the right privileges to access this page`)
      return false;
    }

    return true;
  }

}
