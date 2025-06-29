import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrDashboardComponent } from './hr-dashboard/hr-dashboard.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './hr/home/home.component';
import { EmployeeProfilesComponent } from './hr/employee-profiles/employee-profiles.component';
import { EmployeeProfileDetailComponent } from './hr/employee-profile-detail/employee-profile-detail.component';
import { VisaStatusManagementComponent } from './hr/visa-status-management/visa-status-management.component';
import { HiringManagementComponent } from './hr/hiring-management/hiring-management.component';
import { HousingManagementComponent } from './hr/housing-management/housing-management.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'hr', 
    component: HrDashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'employee-profiles', component: EmployeeProfilesComponent },
      { path: 'visa-status', component: VisaStatusManagementComponent },
      { path: 'hiring', component: HiringManagementComponent },
      { path: 'housing', component: HousingManagementComponent }
    ]
  },
  { path: 'hr/employee-profile/:id', component: EmployeeProfileDetailComponent },
  { path: 'employee', component: EmployeeDashboardComponent },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }