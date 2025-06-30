import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { VisaStatusService, InProgressEmployee, AllOptEmployee } from '../../services/visa-status.service';
import { DocumentPreviewDialogComponent } from './document-preview-dialog/document-preview-dialog.component';

@Component({
  selector: 'app-visa-status-management',
  templateUrl: './visa-status-management.component.html',
  styleUrls: ['./visa-status-management.component.css']
})
export class VisaStatusManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Tab management
  selectedTabIndex = 0;

  // In Progress tab data
  inProgressEmployees: InProgressEmployee[] = [];
  inProgressDataSource = new MatTableDataSource<InProgressEmployee>();
  inProgressLoading = false;
  inProgressError = '';

  // All tab data
  allEmployees: AllOptEmployee[] = [];
  allDataSource = new MatTableDataSource<AllOptEmployee>();
  allLoading = false;
  allError = '';
  searchControl = new FormControl('');

  // Table columns
  inProgressColumns = ['employee', 'workAuthorization', 'nextStep', 'action'];
  allColumns = ['employee', 'workAuthorization', 'approvedDocuments', 'actions'];

  constructor(
    private visaStatusService: VisaStatusService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadInProgressEmployees();
    this.setupSearchListener();
  }

  ngAfterViewInit(): void {
    this.inProgressDataSource.paginator = this.paginator;
    this.inProgressDataSource.sort = this.sort;
    this.allDataSource.paginator = this.paginator;
    this.allDataSource.sort = this.sort;
  }

  onTabChange(event: MatTabChangeEvent): void {
    this.selectedTabIndex = event.index;
    if (event.index === 0) {
      this.loadInProgressEmployees();
    } else if (event.index === 1) {
      this.loadAllEmployees();
    }
  }

  setupSearchListener(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.loadAllEmployees(searchTerm || '');
    });
  }

  loadInProgressEmployees(): void {
    this.inProgressLoading = true;
    this.inProgressError = '';

    this.visaStatusService.getInProgressEmployees().subscribe({
      next: (response) => {
        this.inProgressEmployees = response.data;
        this.inProgressDataSource.data = this.inProgressEmployees;
        this.inProgressLoading = false;
      },
      error: (error) => {
        this.inProgressError = 'Failed to load in-progress employees. Please try again.';
        this.inProgressLoading = false;
        console.error('Error loading in-progress employees:', error);
      }
    });
  }

  loadAllEmployees(search?: string): void {
    this.allLoading = true;
    this.allError = '';

    this.visaStatusService.getAllOptEmployees(search).subscribe({
      next: (response) => {
        this.allEmployees = response.data;
        this.allDataSource.data = this.allEmployees;
        this.allLoading = false;
      },
      error: (error) => {
        this.allError = 'Failed to load employees. Please try again.';
        this.allLoading = false;
        console.error('Error loading all employees:', error);
      }
    });
  }

  openDocumentPreview(employee: InProgressEmployee): void {
    if (!employee.pendingDocument) return;

    const dialogRef = this.dialog.open(DocumentPreviewDialogComponent, {
      width: '90vw',
      maxWidth: '1200px',
      height: '90vh',
      data: {
        documentId: employee.pendingDocument.id,
        fileName: employee.pendingDocument.fileName,
        originalName: employee.pendingDocument.originalName,
        employeeName: employee.employee.fullName,
        employeeId: employee.employee.id,
        currentStep: employee.currentStep || 1
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh the data after approval/rejection
        this.loadInProgressEmployees();
        this.snackBar.open(
          `Document ${result.action} successfully`, 
          'Close', 
          { duration: 3000 }
        );
      }
    });
  }

  sendNotification(employee: InProgressEmployee): void {
    const message = `Reminder: ${employee.nextStep}`;
    
    this.visaStatusService.sendNotification({
      employeeId: employee.employee.id,
      message
    }).subscribe({
      next: (response) => {
        this.snackBar.open('Notification sent successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      },
      error: (error) => {
        this.snackBar.open('Failed to send notification. Please try again.', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        console.error('Error sending notification:', error);
      }
    });
  }

  previewDocument(document: any, employeeName: string): void {
    this.visaStatusService.getDocumentPreview(document.id).subscribe({
      next: (response) => {
        // Open document in new tab
        window.open(response.data.previewUrl, '_blank');
      },
      error: (error) => {
        this.snackBar.open('Failed to load document preview. Please try again.', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        console.error('Error loading document preview:', error);
      }
    });
  }

  downloadDocument(document: any): void {
    this.visaStatusService.getDocumentPreview(document.id).subscribe({
      next: (response) => {
        // Create a temporary link to download the file
        const link = document.createElement('a');
        link.href = response.data.previewUrl;
        link.download = document.originalName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      error: (error) => {
        this.snackBar.open('Failed to download document. Please try again.', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        console.error('Error downloading document:', error);
      }
    });
  }

  getDocumentTypeName(documentType: string): string {
    const typeNames: { [key: string]: string } = {
      'opt_receipt': 'OPT Receipt',
      'opt_ead': 'OPT EAD',
      'i_983': 'I-983',
      'i_20': 'I-20'
    };
    return typeNames[documentType] || documentType;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getDaysRemainingColor(days: number): string {
    if (days <= 30) return 'warn';
    if (days <= 90) return 'accent';
    return 'primary';
  }

  refreshData(): void {
    if (this.selectedTabIndex === 0) {
      this.loadInProgressEmployees();
    } else {
      this.loadAllEmployees(this.searchControl.value || '');
    }
  }
}
