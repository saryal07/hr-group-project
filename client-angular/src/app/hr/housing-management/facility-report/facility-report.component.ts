import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  HousingService,
  FacilityReport,
  FacilityComment,
} from '../../../services/housing.service';

@Component({
  selector: 'app-facility-report',
  templateUrl: './facility-report.component.html',
  styleUrls: ['./facility-report.component.css'],
})
export class FacilityReportComponent implements OnInit {
  @Input() report!: FacilityReport;
  @Input() expanded = false;
  @Output() statusUpdated = new EventEmitter<FacilityReport>();
  @Output() commentAdded = new EventEmitter<void>();

  // Comment management
  newComment = '';
  addingComment = false;
  editingCommentId: string | null = null;
  editCommentText = '';
  updatingComment = false;

  constructor(
    private housingService: HousingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Component initialization if needed
  }

  // Status management
  updateStatus(newStatus: string): void {
    this.housingService
      .updateReportStatus(this.report._id, newStatus)
      .subscribe({
        next: (updatedReport) => {
          this.report.status = updatedReport.status;
          this.statusUpdated.emit(updatedReport);
          this.snackBar.open(`Status updated to ${newStatus}`, 'Close', {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error('Error updating status:', error);
          this.snackBar.open('Failed to update status', 'Close', {
            duration: 5000,
          });
        },
      });
  }

  // Comment management
  addComment(): void {
    if (!this.newComment.trim()) {
      this.snackBar.open('Please enter a comment', 'Close', { duration: 3000 });
      return;
    }

    this.addingComment = true;

    this.housingService.addComment(this.report._id, this.newComment).subscribe({
      next: (comment) => {
        this.addingComment = false;
        this.newComment = '';
        this.commentAdded.emit();
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

  startEditComment(comment: FacilityComment): void {
    this.editingCommentId = comment._id;
    this.editCommentText = comment.comment;
  }

  cancelEditComment(): void {
    this.editingCommentId = null;
    this.editCommentText = '';
  }

  updateComment(commentId: string): void {
    if (!this.editCommentText.trim()) {
      this.snackBar.open('Please enter a comment', 'Close', { duration: 3000 });
      return;
    }

    this.updatingComment = true;

    this.housingService
      .updateComment(this.report._id, commentId, this.editCommentText)
      .subscribe({
        next: (updatedComment) => {
          this.updatingComment = false;
          this.editingCommentId = null;
          this.editCommentText = '';
          this.commentAdded.emit(); // Refresh parent
          this.snackBar.open('Comment updated successfully', 'Close', {
            duration: 3000,
          });
        },
        error: (error) => {
          this.updatingComment = false;
          console.error('Error updating comment:', error);
          this.snackBar.open('Failed to update comment', 'Close', {
            duration: 5000,
          });
        },
      });
  }

  // Utility methods
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

  // Check if current user can edit comment
  canEditComment(comment: FacilityComment): boolean {
    // Get current user info from localStorage
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return false;

      const currentUser = JSON.parse(userStr);
      const currentUserId = currentUser.id;

      // HR can only edit their OWN comments (as per requirements)
      return comment.commentedBy._id === currentUserId;
    } catch (error) {
      console.warn('Could not parse user info for edit permissions:', error);
      return false;
    }
  }

  // TrackBy function for comments
  trackByCommentId(index: number, comment: FacilityComment): string {
    return comment._id || index.toString();
  }
}
