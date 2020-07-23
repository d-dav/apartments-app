import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';

import { DashboardComponent } from './dashboard.component';

import { ApartamentsListComponent } from './apartment-management/containers/apartaments-list/apartaments-list.component';
import { CreateApartamentComponent } from './apartment-management/containers/create-apartament/create-apartament.component';
import { ViewApartmentComponent } from './apartment-management/containers/view-apartment/view-apartment.component';

import { UsersListComponent } from './user-management/containers/users-list/users-list.component';
import { CreateUserComponent } from './user-management/containers/create-user/create-user.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  declarations: [
    DashboardComponent,
    ApartamentsListComponent,
    CreateApartamentComponent,
    ViewApartmentComponent,
    UsersListComponent,
    CreateUserComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    DashboardRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule,
  ],
})
export class DashboardModule { }
