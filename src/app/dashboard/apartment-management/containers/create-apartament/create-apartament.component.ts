import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { ApartmentService } from '../../services/apartment.service';

import { ApartmentStatuses } from '../../models/apartment-status';
import { ActivatedRoute, Router } from '@angular/router';
import { ApartmentModel } from '../../models/apartment.model';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-create-apartament',
  templateUrl: './create-apartament.component.html',
  styleUrls: ['./create-apartament.component.scss']
})
export class CreateApartamentComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('addressInput') addressInput: ElementRef;
  public loading$: Observable<boolean>;

  public apartmentForm: FormGroup;

  public apartmentStatuses = ApartmentStatuses;

  public apartment: ApartmentModel;
  public isEdit = false;

  private unsubscribe$: Subject<void> = new Subject();
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private apartmentService: ApartmentService,
  ) {
    this.loading$ = this.apartmentService.loading$;

    this.apartmentForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])),
      floorAreaSize: new FormControl('', Validators.required),
      pricePerMonth: new FormControl('', Validators.required),
      numberOfRooms: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      latitude: new FormControl('', Validators.required),
      longitude: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required), // Available or Rented
    });
  }

  ngOnInit(): void {
    this.route.data.pipe(take(1)).subscribe(data => {
      this.isEdit = data.isEdit;

      if (this.isEdit) {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) {
          this.router.navigate(['/appartments']);
        }

        this.apartment = this.apartmentService.getApartment();
        if (!this.apartment || (this.apartment._id !== id)) {
          this.subscribeToApartment();
          this.apartmentService.loadApartment(id);
        } else {
          this.patchForm();
        }
      }
    });
  }

  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }

  subscribeToApartment(): void {
    this.apartmentService.selectedApartment$.pipe(takeUntil(this.unsubscribe$)).subscribe(apartment => {
      if (!apartment) {
        return;
      }

      this.apartment = apartment;
      this.patchForm();
    });
  }

  patchForm(): void {
    this.apartmentForm.patchValue(this.apartment);
  }

  onSubmit(): void {
    if (this.apartmentForm.invalid) {
      return;
    }

    if (this.isEdit) {
      this.apartmentService.updateApartment(this.apartment._id, this.apartmentForm.value);
    } else {
      this.apartmentService.createApartment(this.apartmentForm.value);
    }
  }

  private getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.addressInput.nativeElement,
      {
        componentRestrictions: { country: 'US' },
        types: ['address']
      });
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      console.log(place);
    });
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
