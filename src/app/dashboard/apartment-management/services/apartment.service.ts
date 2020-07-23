import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

import { ApartmentModel } from '../models/apartment.model';

@Injectable({
  providedIn: 'root'
})
export class ApartmentService {
  public loading$: Subject<boolean> = new Subject();

  public apartments$: Subject<ApartmentModel[]> = new Subject();
  public selectedApartment$: Subject<ApartmentModel> = new Subject();

  private apartments: ApartmentModel[];
  private selectedApartment: ApartmentModel;
  constructor(private http: HttpClient, public toastr: ToastrService, public router: Router) { }

  getApartments(): ApartmentModel[] {
    return this.apartments;
  }

  getApartment(): ApartmentModel {
    return this.selectedApartment;
  }

  loadApartments() {
    this.loading$.next(true);
    this.http.get(`${environment.apiUrl}/apartments`).subscribe(
      (res: { data: ApartmentModel[]; success: number }) => {
        this.apartments = res.data;
        this.apartments$.next(this.apartments.slice());

        this.loading$.next(false);
      },
      (res: HttpErrorResponse) => {
        this.loading$.next(false);
      });
  }

  loadApartment(id: string) {
    this.loading$.next(true);
    this.http.get(`${environment.apiUrl}/apartments/${id}`).subscribe(
      (res: { data: ApartmentModel; success: number }) => {
        this.selectedApartment = res.data;
        this.selectedApartment$.next({ ...this.selectedApartment });

        this.loading$.next(false);
      },
      (res: HttpErrorResponse) => {
        this.loading$.next(false);
      });
  }

  selectApartment(apartment: ApartmentModel) {
    this.selectedApartment = apartment;
    this.selectedApartment$.next({ ...this.selectedApartment });
  }

  createApartment(body: ApartmentModel) {
    this.loading$.next(true);
    this.http.post(`${environment.apiUrl}/apartments`, body).subscribe(
      (res: { data: ApartmentModel; success: number }) => {
        this.selectedApartment = res.data;
        this.selectedApartment$.next({ ...this.selectedApartment });

        if (this.apartments.length) {
          this.apartments.push(this.selectedApartment);
          this.apartments$.next(this.apartments.slice());
        }

        this.loading$.next(false);
        this.router.navigate(['/apartments/view', this.selectedApartment._id]);
      },
      (res: HttpErrorResponse) => {
        this.loading$.next(false);
      });
  }

  updateApartment(id: string, body: ApartmentModel) {
    this.loading$.next(true);
    this.http.put(`${environment.apiUrl}/apartments/${id}`, body).subscribe(
      (res: { data: string; success: number }) => {
        this.toastr.success(res.data);
        this.loading$.next(false);

        this.selectedApartment = { ...this.selectedApartment, ...body };
        this.selectedApartment$.next({ ...this.selectedApartment });

        if (this.apartments && this.apartments.length) {
          this.apartments = this.apartments.map(ap => ap._id === body._id ? { ...ap, ...body } : ap);
          this.apartments$.next({ ...this.apartments });
        }

        this.router.navigate(['/apartments/view', this.selectedApartment._id]);
      },
      (res: HttpErrorResponse) => {
        this.loading$.next(false);
      });
  }

  deleteApartment(id: string) {
    this.loading$.next(true);
    this.http.delete(`${environment.apiUrl}/apartments/${id}`).subscribe(
      (res: { data: string; success: number }) => {
        this.toastr.success(res.data);

        this.apartments = this.apartments.filter(ap => ap._id !== id);
        this.apartments$.next(this.apartments.slice());

        this.loading$.next(false);
      },
      (res: HttpErrorResponse) => {
        this.loading$.next(false);
      });
  }
}
