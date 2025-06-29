import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HousingService, Housing } from '../../../../services/housing.service';

@Component({
  selector: 'app-add-house-dialog',
  templateUrl: './add-house-dialog.component.html',
  styleUrls: ['./add-house-dialog.component.css'],
})
export class AddHouseDialogComponent {
  houseForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private housingService: HousingService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddHouseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.houseForm = this.fb.group({
      address: ['', [Validators.required, Validators.minLength(5)]],
      landlord: this.fb.group({
        fullName: ['', [Validators.required, Validators.minLength(2)]],
        phone: [
          '',
          [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)],
        ],
        email: ['', [Validators.required, Validators.email]],
      }),
      facility: this.fb.group({
        beds: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
        mattresses: [
          1,
          [Validators.required, Validators.min(0), Validators.max(20)],
        ],
        tables: [
          1,
          [Validators.required, Validators.min(0), Validators.max(10)],
        ],
        chairs: [
          2,
          [Validators.required, Validators.min(0), Validators.max(50)],
        ],
      }),
    });
  }

  onSubmit(): void {
    if (this.houseForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const houseData = this.houseForm.value;

    this.housingService.createHouse(houseData).subscribe({
      next: (newHouse) => {
        this.loading = false;
        this.snackBar.open('House added successfully!', 'Close', {
          duration: 3000,
        });
        this.dialogRef.close(newHouse);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error creating house:', error);
        this.snackBar.open('Failed to add house. Please try again.', 'Close', {
          duration: 5000,
        });
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.houseForm.controls).forEach((key) => {
      const control = this.houseForm.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach((nestedKey) => {
          control.get(nestedKey)?.markAsTouched();
        });
      }
    });
  }

  // Validation helper methods
  getFieldError(fieldPath: string): string {
    const control = this.houseForm.get(fieldPath);
    if (control?.errors && control.touched) {
      if (control.errors['required'])
        return `${fieldPath.split('.').pop()} is required`;
      if (control.errors['email']) return 'Please enter a valid email address';
      if (control.errors['pattern']) return 'Please enter a valid phone number';
      if (control.errors['minlength'])
        return `Minimum length is ${control.errors['minlength'].requiredLength}`;
      if (control.errors['min'])
        return `Minimum value is ${control.errors['min'].min}`;
      if (control.errors['max'])
        return `Maximum value is ${control.errors['max'].max}`;
    }
    return '';
  }

  hasFieldError(fieldPath: string): boolean {
    const control = this.houseForm.get(fieldPath);
    return !!(control?.errors && control.touched);
  }
}
