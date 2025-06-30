import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VisaStatusService } from '../../../services/visa-status.service';

export interface DocumentPreviewDialogData {
  documentId: string;
  fileName: string;
  originalName: string;
  employeeName: string;
  employeeId: string;
  currentStep: number;
}

@Component({
  selector: 'app-document-preview-dialog',
  templateUrl: './document-preview-dialog.component.html',
  styleUrls: ['./document-preview-dialog.component.css']
})
export class DocumentPreviewDialogComponent implements OnInit {
  previewUrl: string = '';
  loading = true;
  error = '';
  rejectForm: FormGroup;
  showRejectForm = false;
  processing = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DocumentPreviewDialogData,
    private dialogRef: MatDialogRef<DocumentPreviewDialogComponent>,
    private visaStatusService: VisaStatusService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.rejectForm = this.fb.group({
      feedback: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadDocumentPreview();
  }

  loadDocumentPreview(): void {
    this.loading = true;
    this.error = '';

    this.visaStatusService.getDocumentPreview(this.data.documentId).subscribe({
      next: (response) => {
        this.previewUrl = response.data.previewUrl;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load document preview. Please try again.';
        this.loading = false;
        console.error('Error loading document preview:', error);
      }
    });
  }

  approveDocument(): void {
    this.processing = true;
    
    this.visaStatusService.approveDocument(this.data.documentId).subscribe({
      next: (response) => {
        this.snackBar.open('Document approved successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.dialogRef.close({ action: 'approved', documentId: this.data.documentId });
      },
      error: (error) => {
        this.processing = false;
        this.snackBar.open('Failed to approve document. Please try again.', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        console.error('Error approving document:', error);
      }
    });
  }

  showRejectFormHandler(): void {
    this.showRejectForm = true;
  }

  rejectDocument(): void {
    if (this.rejectForm.valid) {
      this.processing = true;
      const feedback = this.rejectForm.get('feedback')?.value;

      this.visaStatusService.rejectDocument(this.data.documentId, feedback).subscribe({
        next: (response) => {
          this.snackBar.open('Document rejected successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.dialogRef.close({ 
            action: 'rejected', 
            documentId: this.data.documentId,
            feedback 
          });
        },
        error: (error) => {
          this.processing = false;
          this.snackBar.open('Failed to reject document. Please try again.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          console.error('Error rejecting document:', error);
        }
      });
    }
  }

  cancelReject(): void {
    this.showRejectForm = false;
    this.rejectForm.reset();
  }

  close(): void {
    this.dialogRef.close();
  }

  getStepName(stepOrder: number): string {
    const stepNames = {
      1: 'OPT Receipt',
      2: 'OPT EAD',
      3: 'I-983',
      4: 'I-20'
    };
    return stepNames[stepOrder as keyof typeof stepNames] || 'Unknown Step';
  }
} 