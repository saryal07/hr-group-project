import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import {
  HousingService,
  Housing,
  FacilityReport,
} from '../../../services/housing.service';

@Component({
  selector: 'app-housing-details',
  templateUrl: './housing-details.component.html',
  styleUrls: ['./housing-details.component.css'],
})
export class HousingDetailsComponent implements OnInit, OnChanges {
  @Input() house!: Housing;

  // Facility Reports
  facilityReports: FacilityReport[] = [];
  reportsLoading = false;
  reportsError = '';

  // Pagination
  currentPage = 1;
  pageSize = 5;
  totalReports = 0;
  totalPages = 0;
  // Add property for Material paginator (0-based)
  currentPageIndex = 0;

  // UI States
  selectedReportId: string | null = null;
  newComment = '';
  addingComment = false;

  constructor(
    private housingService: HousingService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.house) {
      this.loadFacilityReports();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['house'] && changes['house'].currentValue) {
      // Reset pagination when house changes
      this.currentPage = 1;
      this.currentPageIndex = 0;
      this.loadFacilityReports();
    }
  }

  loadFacilityReports(): void {
    if (!this.house._id) return;

    this.reportsLoading = true;
    this.reportsError = '';

    this.housingService
      .getFacilityReports(this.house._id, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.facilityReports = response.data;
          this.totalReports = response.pagination.totalReports;
          this.totalPages = response.pagination.totalPages;
          // Update the page index for Material paginator (0-based)
          this.currentPageIndex = this.currentPage - 1;
          this.reportsLoading = false;
        },
        error: (error) => {
          this.reportsLoading = false;
          this.reportsError = 'Failed to load facility reports';
          console.error('Error loading facility reports:', error);
          this.snackBar.open('Failed to load facility reports', 'Close', {
            duration: 5000,
          });
        },
      });
  }

  onPageChange(event: PageEvent): void {
    // Angular Material paginator is 0-based, but our API is 1-based
    this.currentPageIndex = event.pageIndex;
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadFacilityReports();
  }

  toggleReportDetails(reportId: string): void {
    this.selectedReportId =
      this.selectedReportId === reportId ? null : reportId;
  }

  addComment(reportId: string): void {
    if (!this.newComment.trim()) {
      this.snackBar.open('Please enter a comment', 'Close', { duration: 3000 });
      return;
    }

    this.addingComment = true;

    this.housingService.addComment(reportId, this.newComment).subscribe({
      next: (comment) => {
        this.addingComment = false;
        this.newComment = '';
        this.loadFacilityReports(); // Refresh to show new comment
        this.snackBar.open('Comment added successfully', 'Close', {
          duration: 3000,
        });
      },
      error: (error) => {
        this.addingComment = false;
        console.error('Error adding comment:', error);
        this.snackBar.open('Failed to add comment', 'Close', {
          duration: 5000,
        });
      },
    });
  }

  updateReportStatus(reportId: string, newStatus: string): void {
    this.housingService.updateReportStatus(reportId, newStatus).subscribe({
      next: (updatedReport) => {
        this.loadFacilityReports(); // Refresh to show updated status
        this.snackBar.open(`Report status updated to ${newStatus}`, 'Close', {
          duration: 3000,
        });
      },
      error: (error) => {
        console.error('Error updating report status:', error);
        this.snackBar.open('Failed to update report status', 'Close', {
          duration: 5000,
        });
      },
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Open':
        return 'warn';
      case 'In Progress':
        return 'accent';
      case 'Resolved':
        return 'primary';
      default:
        return 'primary';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'High':
        return 'warn';
      case 'Medium':
        return 'accent';
      case 'Low':
        return 'primary';
      default:
        return 'primary';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getOccupancyPercentage(): number {
    if (this.house.facility.beds === 0) return 0;
    return (this.house.employees.length / this.house.facility.beds) * 100;
  }

  getOccupancyColor(): string {
    const percentage = this.getOccupancyPercentage();
    if (percentage >= 90) return 'warn';
    if (percentage >= 70) return 'accent';
    return 'primary';
  }

  // Employee profile navigation
  viewEmployeeProfile(employeeId: string): void {
    // Navigate to the correct route (singular "profile")
    this.router.navigate(['/hr/employee-profile', employeeId]).then(() => {
      this.snackBar.open('Opening employee profile', 'Close', {
        duration: 2000,
      });
    });
  }

  // TrackBy functions for better performance
  trackByReportId(index: number, report: FacilityReport): string {
    return report._id || index.toString();
  }

  trackByEmployeeId(index: number, employee: any): string {
    return employee._id || index.toString();
  }
}
