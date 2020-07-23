import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { AuthService } from '../../auth.service';

import { UserModel } from 'src/app/shared/models/user.model';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public user$: Observable<UserModel>;

  public loginForm: FormGroup;
  public loginInvalid = false;

  public error$: Observable<any>;
  public unsubscribe$: Subject<void> = new Subject();

  constructor(private formBuilder: FormBuilder, private authService: AuthService, public router: Router) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z0-9]{8,}'),
      ])),
    });

    this.user$ = this.authService.user$;
    this.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.router.navigate(['/']);
    });

    this.error$ = this.authService.error;
    this.error$.subscribe(error => {
      if (!error) {
        return;
      }

      this.loginForm.markAsUntouched();
      this.loginInvalid = true;
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loginInvalid = false;
    this.authService.login(this.loginForm.value);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
