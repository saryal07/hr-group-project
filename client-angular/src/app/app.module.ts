import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HrDashboardComponent } from './hr-dashboard/hr-dashboard.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './hr/home/home.component';
import { EmployeeProfilesComponent } from './hr/employee-profiles/employee-profiles.component';
import { EmployeeProfileDetailComponent } from './hr/employee-profile-detail/employee-profile-detail.component';
import { VisaStatusManagementComponent } from './hr/visa-status-management/visa-status-management.component';
import { HiringManagementComponent } from './hr/hiring-management/hiring-management.component';
import { HousingManagementComponent } from './hr/housing-management/housing-management.component';
import { HrApplicationViewComponent } from './hr/hiring-management/hr-application-view/hr-application-view.component';
import { HousingSummaryComponent } from './hr/housing-management/housing-summary/housing-summary.component';
import { HousingDetailsComponent } from './hr/housing-management/housing-details/housing-details.component';
import { FacilityReportComponent } from './hr/housing-management/facility-report/facility-report.component';
import { AddHouseDialogComponent } from './hr/housing-management/housing-summary/add-house-dialog/add-house-dialog.component';
import { DocumentPreviewDialogComponent } from './hr/visa-status-management/document-preview-dialog/document-preview-dialog.component';
import { SafePipe } from './pipes/safe.pipe';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HrDashboardComponent,
    EmployeeDashboardComponent,
    LoginComponent,
    HomeComponent,
    EmployeeProfilesComponent,
    EmployeeProfileDetailComponent,
    VisaStatusManagementComponent,
    HiringManagementComponent,
    HousingManagementComponent,
    HrApplicationViewComponent,
    HousingSummaryComponent,
    HousingDetailsComponent,
    FacilityReportComponent,
    AddHouseDialogComponent,
    DocumentPreviewDialogComponent,
    SafePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatExpansionModule,
    MatChipsModule,
    MatBadgeModule,
    MatDividerModule,
    MatProgressBarModule,
    MatTableModule,
    MatMenuModule,
    MatSortModule,
    MatTabsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
