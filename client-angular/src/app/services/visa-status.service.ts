import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WorkAuthorization {
  title: string;
  startDate: string;
  endDate: string;
  daysRemaining: number;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  preferredName?: string;
  email: string;
  fullName: string;
}

export interface PendingDocument {
  id: string;
  fileName: string;
  originalName: string;
  uploadDate: string;
  hrFeedback?: string;
}

export interface InProgressEmployee {
  employee: Employee;
  workAuthorization: WorkAuthorization;
  nextStep: string;
  actionType: 'approve_reject' | 'send_notification';
  pendingDocument?: PendingDocument;
  currentStep?: number;
}

export interface ApprovedDocument {
  id: string;
  fileName: string;
  originalName: string;
  documentType: string;
  stepOrder: number;
  uploadDate: string;
  s3Key: string;
}

export interface AllOptEmployee {
  employee: Employee;
  workAuthorization: WorkAuthorization;
  approvedDocuments: ApprovedDocument[];
}

export interface DocumentPreview {
  previewUrl: string;
  fileName: string;
  originalName: string;
  documentType: string;
}

export interface NotificationRequest {
  employeeId: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VisaStatusService {
  private apiUrl = '/api/hr';

  constructor(private http: HttpClient) {}

  // Get employees with pending OPT documents (In Progress tab)
  getInProgressEmployees(): Observable<ApiResponse<InProgressEmployee[]>> {
    return this.http.get<ApiResponse<InProgressEmployee[]>>(`${this.apiUrl}/visa-status/in-progress`);
  }

  // Get all OPT employees with their documents (All tab)
  getAllOptEmployees(search?: string): Observable<ApiResponse<AllOptEmployee[]>> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<ApiResponse<AllOptEmployee[]>>(`${this.apiUrl}/visa-status/all`, { params });
  }

  // Send notification to employee
  sendNotification(request: NotificationRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/visa-status/send-notification`, request);
  }

  // Get document preview URL
  getDocumentPreview(documentId: string): Observable<ApiResponse<DocumentPreview>> {
    return this.http.get<ApiResponse<DocumentPreview>>(`${this.apiUrl}/documents/${documentId}/preview`);
  }

  // Approve document
  approveDocument(documentId: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/documents/${documentId}/approve`, {});
  }

  // Reject document
  rejectDocument(documentId: string, feedback: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/documents/${documentId}/reject`, { feedback });
  }

  // Get workflow summary (existing API)
  getWorkflowSummary(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/workflow-summary`);
  }
} 