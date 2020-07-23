import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ApartmentService } from '../../services/apartment.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ApartmentModel } from '../../models/apartment.model';
import { ApartmentStatuses } from '../../models/apartment-status';

@Component({
  selector: 'app-view-apartment',
  templateUrl: './view-apartment.component.html',
  styleUrls: ['./view-apartment.component.scss']
})
export class ViewApartmentComponent implements OnInit, OnDestroy {
  public apartment: ApartmentModel;
  public apartmentStatuses = ApartmentStatuses;

  private unsubscribe$: Subject<void> = new Subject();
  constructor(private apartmentService: ApartmentService, public route: ActivatedRoute, public router: Router) {
    this.apartment = this.apartmentService.getApartment();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/apartments']);
    }

    if (!this.apartment || (this.apartment && this.apartment._id !== id)) {
      this.subscribeToApartment();
      this.apartmentService.loadApartment(id);
    }
  }

  subscribeToApartment(): void {
    this.apartmentService.selectedApartment$.pipe(takeUntil(this.unsubscribe$)).subscribe(apartment => {
      this.apartment = apartment;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
