import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from '../guard/role.guard';

import { DashboardComponent } from './dashboard.component';

import { ApartamentsListComponent } from './apartment-management/containers/apartaments-list/apartaments-list.component';
import { CreateApartamentComponent } from './apartment-management/containers/create-apartament/create-apartament.component';
import { ViewApartmentComponent } from './apartment-management/containers/view-apartment/view-apartment.component';

import { UsersListComponent } from './user-management/containers/users-list/users-list.component';
import { CreateUserComponent } from './user-management/containers/create-user/create-user.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      { path: '', redirectTo: '/apartments', pathMatch: 'full' },
      { path: 'apartments', component: ApartamentsListComponent },
      { path: 'apartments/create', component: CreateApartamentComponent },
      { path: 'apartments/edit/:id', component: CreateApartamentComponent, data: { isEdit: true } },
      { path: 'apartments/view/:id', component: ViewApartmentComponent },

      { path: 'users', component: UsersListComponent, canActivate: [RoleGuard] },
      { path: 'users/create', component: CreateUserComponent, canActivate: [RoleGuard] },
      { path: 'users/edit/:id', component: CreateUserComponent, canActivate: [RoleGuard], data: { isEdit: true } }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
