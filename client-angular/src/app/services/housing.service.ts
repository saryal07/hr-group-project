import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

// Interfaces based the backend models
export interface Housing {
  _id?: string;
  address: string;
  landlord: {
    fullName: string;
    phone: string;
    email: string;
  };
  facility: {
    beds: number;
    mattresses: number;
    tables: number;
    chairs: number;
  };
  employees: Employee[];
  createdAt?: string;
  updatedAt?: string;
}

// Employee interface
export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  preferredName?: string;
  username: string;
  email: string;
  cellPhone?: string;
  workPhone?: string;
  role?: string;
  car?: {
    make: string;
    model: string;
    color: string;
  };
  // Additional fields that might be useful
  profilePicUrl?: string;
  address?: {
    building: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface FacilityReport {
  _id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  category:
    | 'Maintenance'
    | 'Safety'
    | 'Utilities'
    | 'Cleaning'
    | 'Security'
    | 'Other';
  reportedBy: Employee;
  housing: string;
  comments: FacilityComment[];
  createdAt: string;
  updatedAt: string;
}

// FacilityComment interface
export interface FacilityComment {
  _id: string;
  comment: string;
  commentedBy: Employee;
  facilityReport: string;
  parentComment?: string;
  replies?: string[];
  isEdited: boolean;
  editedAt?: string;
  attachments?: Array<{
    filename: string;
    s3Key: string;
    uploadedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class HousingService {
  private apiUrl = '/api/hr';
  private facilityApiUrl = '/api/employee/facility-reports';

  // State management for housing list
  private housesSubject = new BehaviorSubject<Housing[]>([]);
  public houses$ = this.housesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get HTTP headers with auth token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  // ===== HOUSING CRUD OPERATIONS =====

  // Get all houses
  getHouses(): Observable<Housing[]> {
    return this.http
      .get<Housing[]>(`${this.apiUrl}/housing`, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((houses) => {
          console.log('✅ Houses loaded:', houses);
          this.housesSubject.next(houses);
        }),
        map((houses) => houses || []),
        catchError((error) => {
          console.error('❌ Error loading houses:', error);
          return throwError(() => error);
        })
      );
  }

  // Get single house by ID
  getHouse(id: string): Observable<Housing> {
    return this.http
      .get<Housing>(`${this.apiUrl}/housing/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('❌ Error loading house:', error);
          return throwError(() => error);
        })
      );
  }

  // Create new house
  createHouse(
    house: Omit<Housing, '_id' | 'createdAt' | 'updatedAt'>
  ): Observable<Housing> {
    return this.http
      .post<Housing>(`${this.apiUrl}/housing`, house, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((newHouse) => {
          console.log('✅ House created:', newHouse);
          // Update local state immediately
          const currentHouses = this.housesSubject.value;
          this.housesSubject.next([...currentHouses, newHouse]);
        }),
        catchError((error) => {
          console.error('❌ Error creating house:', error);
          return throwError(() => error);
        })
      );
  }

  // Update house
  updateHouse(id: string, house: Partial<Housing>): Observable<Housing> {
    // Use PUT endpoint with ID in URL, not body
    return this.http
      .put<Housing>(
        `${this.apiUrl}/housing/${id}`,
        house, // Only send house data, not { id, ...house }
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(
        tap((updatedHouse) => {
          console.log('✅ House updated:', updatedHouse);
          // Update local state immediately
          const currentHouses = this.housesSubject.value;
          const updatedHouses = currentHouses.map((h) =>
            h._id === id ? updatedHouse : h
          );
          this.housesSubject.next(updatedHouses);
        }),
        catchError((error) => {
          console.error('❌ Error updating house:', error);
          return throwError(() => error);
        })
      );
  }

  // Delete house
  deleteHouse(id: string): Observable<void> {
    // Use DELETE endpoint with ID in URL
    return this.http
      .delete<void>(`${this.apiUrl}/housing/${id}`, {
        // ID in URL, not body
        headers: this.getHeaders(),
      })
      .pipe(
        tap(() => {
          console.log('✅ House deleted:', id);
          // Update local state immediately instead of refreshing
          const currentHouses = this.housesSubject.value;
          const updatedHouses = currentHouses.filter(
            (house) => house._id !== id
          );
          this.housesSubject.next(updatedHouses);
        }),
        catchError((error) => {
          console.error('❌ Error deleting house:', error);
          return throwError(() => error);
        })
      );
  }

  // ===== FACILITY REPORTS OPERATIONS =====

  // Get facility reports for a specific housing
  getFacilityReports(
    housingId?: string,
    page: number = 1,
    limit: number = 5
  ): Observable<{
    data: FacilityReport[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalReports: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    let params = `page=${page}&limit=${limit}`;
    if (housingId) {
      params += `&housing=${housingId}`;
    }

    return this.http
      .get<any>(`${this.facilityApiUrl}?${params}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('❌ Error loading facility reports:', error);
          return throwError(() => error);
        })
      );
  }

  // Get single facility report
  getFacilityReport(reportId: string): Observable<FacilityReport> {
    return this.http
      .get<{ success: boolean; data: FacilityReport }>(
        `${this.facilityApiUrl}/${reportId}`,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error('❌ Error loading facility report:', error);
          return throwError(() => error);
        })
      );
  }

  // Add comment to facility report
  addComment(reportId: string, comment: string): Observable<FacilityComment> {
    return this.http
      .post<{ success: boolean; data: FacilityComment }>(
        `${this.facilityApiUrl}/${reportId}/comments`,
        { comment },
        { headers: this.getHeaders() }
      )
      .pipe(
        map((response) => response.data),
        tap((comment) => {
          console.log('✅ Comment added:', comment);
        }),
        catchError((error) => {
          console.error('❌ Error adding comment:', error);
          return throwError(() => error);
        })
      );
  }

  // Update comment
  updateComment(
    reportId: string,
    commentId: string,
    comment: string
  ): Observable<FacilityComment> {
    return this.http
      .put<{ success: boolean; data: FacilityComment }>(
        `${this.facilityApiUrl}/${reportId}/comments/${commentId}`,
        { comment },
        { headers: this.getHeaders() }
      )
      .pipe(
        map((response) => response.data),
        tap((comment) => {
          console.log('✅ Comment updated:', comment);
        }),
        catchError((error) => {
          console.error('❌ Error updating comment:', error);
          return throwError(() => error);
        })
      );
  }

  // Update facility report status (HR only)
  updateReportStatus(
    reportId: string,
    status: string
  ): Observable<FacilityReport> {
    return this.http
      .put<{ success: boolean; data: FacilityReport }>(
        `${this.facilityApiUrl}/${reportId}`,
        { status },
        { headers: this.getHeaders() }
      )
      .pipe(
        map((response) => response.data),
        tap((report) => {
          console.log('✅ Report status updated:', report);
        }),
        catchError((error) => {
          console.error('❌ Error updating report status:', error);
          return throwError(() => error);
        })
      );
  }

  // ===== UTILITY METHODS =====

  // Refresh houses list with better error handling
  private refreshHouses(): void {
    this.getHouses().subscribe({
      next: (houses) => {
        // Houses are already updated in the tap operator
      },
      error: (error) => {
        console.error('Failed to refresh houses:', error);
      },
    });
  }

  // Get current houses from cache
  getCurrentHouses(): Housing[] {
    return this.housesSubject.value;
  }

  // Search houses (client-side filtering for now)
  searchHouses(term: string): Housing[] {
    const houses = this.getCurrentHouses();
    if (!term.trim()) return houses;

    const searchTerm = term.toLowerCase();
    return houses.filter(
      (house) =>
        house.address.toLowerCase().includes(searchTerm) ||
        house.landlord.fullName.toLowerCase().includes(searchTerm) ||
        house.landlord.email.toLowerCase().includes(searchTerm)
    );
  }

  // Get houses by employee count
  getHousesByEmployeeCount(count: number): Housing[] {
    return this.getCurrentHouses().filter(
      (house) => house.employees.length === count
    );
  }

  // Calculate total capacity across all houses
  getTotalCapacity(): {
    totalBeds: number;
    totalEmployees: number;
    occupancyRate: number;
  } {
    const houses = this.getCurrentHouses();
    const totalBeds = houses.reduce(
      (sum, house) => sum + house.facility.beds,
      0
    );
    const totalEmployees = houses.reduce(
      (sum, house) => sum + house.employees.length,
      0
    );
    const occupancyRate =
      totalBeds > 0 ? (totalEmployees / totalBeds) * 100 : 0;

    return { totalBeds, totalEmployees, occupancyRate };
  }

  // Force refresh houses from server
  forceRefreshHouses(): Observable<Housing[]> {
    return this.getHouses();
  }
}
