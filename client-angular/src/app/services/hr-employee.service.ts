import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmployeeSummary {
  id: string;
  name: {
    first: string;
    middle: string;
    last: string;
    preferred: string;
  };
  fullName: string;
  email: string;
  phone: string;
  ssn: string;
  workAuthTitle: string;
  onboardingStatus: string;
}

export interface EmployeeProfile {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    middleName: string;
    preferredName: string;
    email: string;
    cellPhone: string;
    workPhone: string;
    ssn: string;
    dob: Date | null;
    gender: string;
  };
  address: any;
  citizenship: {
    isCitizen: boolean;
    citizenshipStatus: string;
    visa: any;
  };
  driversLicense: {
    hasLicense: boolean;
    number: string;
    expirationDate: Date | null;
    licenseUrl: string;
  };
  reference: any;
  emergencyContacts: any[];
  onboarding: {
    status: string;
    hrFeedback: string;
  };
  account: {
    username: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface EmployeeListResponse {
  success: boolean;
  count: number;
  data: EmployeeSummary[];
}

export interface EmployeeProfileResponse {
  success: boolean;
  data: EmployeeProfile;
}

@Injectable({
  providedIn: 'root'
})
export class HrEmployeeService {
  private apiUrl = '/api/hr/employees';

  constructor(private http: HttpClient) {}

  getAllEmployees(search?: string): Observable<EmployeeListResponse> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    
    return this.http.get<EmployeeListResponse>(this.apiUrl, { params });
  }

  getEmployeeById(id: string): Observable<EmployeeProfileResponse> {
    return this.http.get<EmployeeProfileResponse>(`${this.apiUrl}/${id}`);
  }
} 