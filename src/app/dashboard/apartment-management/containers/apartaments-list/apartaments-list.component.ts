import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { ApartmentService } from '../../services/apartment.service';
import { AuthService } from 'src/app/auth/auth.service';

import { takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

import { ApartmentModel } from '../../models/apartment.model';
import { ApartmentStatuses } from '../../models/apartment-status';
import { UserModel } from 'src/app/shared/models/user.model';
import { UserRoles } from 'src/app/shared/models/user-role';

@Component({
  selector: 'app-apartaments-list',
  templateUrl: './apartaments-list.component.html',
  styleUrls: ['./apartaments-list.component.scss']
})
export class ApartamentsListComponent implements OnInit, OnDestroy {
  public loading$: Observable<boolean>;
  public displayedColumns: string[];
  public data: ApartmentModel[] = [];
  public user: UserModel;

  public userRoles = UserRoles;
  public apartmentStatuses = ApartmentStatuses;

  private unsubscribe$: Subject<void> = new Subject();
  constructor(private apartmentService: ApartmentService, private authService: AuthService, public router: Router) {
    this.displayedColumns = ['name', 'floorAreaSize', 'pricePerMonth', 'numberOfRooms', 'latitude', 'longitude', 'realtor', 'status', 'created', 'actions'];

    this.user = this.authService.getUser();
    this.loading$ = this.apartmentService.loading$;
    this.apartmentService.apartments$.pipe(takeUntil(this.unsubscribe$)).subscribe(apartments => {
      this.data = apartments;
    });
  }

  ngOnInit(): void {
    this.apartmentService.loadApartments();
  }

  onDelete(apartment: ApartmentModel): void {
    if (!apartment) {
      return;
    }

    this.apartmentService.deleteApartment(apartment._id);
  }

  onView(apartment: ApartmentModel): void {
    if (!apartment) {
      return;
    }

    this.apartmentService.selectApartment(apartment);
    this.router.navigate(['/apartments/view', apartment._id]);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
