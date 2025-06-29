import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HrEmployeeService, EmployeeProfile } from '../../services/hr-employee.service';

@Component({
  selector: 'app-employee-profile-detail',
  templateUrl: './employee-profile-detail.component.html',
  styleUrls: ['./employee-profile-detail.component.css']
})
export class EmployeeProfileDetailComponent implements OnInit {
  employee: EmployeeProfile | null = null;
  loading = false;
  error: string | null = null;
  employeeId: string = '';

  constructor(
    private route: ActivatedRoute,
    private hrEmployeeService: HrEmployeeService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.employeeId = params.get('id') || '';
      if (this.employeeId) {
        this.loadEmployeeProfile();
      }
    });
  }

  loadEmployeeProfile(): void {
    this.loading = true;
    this.error = null;

    this.hrEmployeeService.getEmployeeById(this.employeeId).subscribe({
      next: (response) => {
        this.employee = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading employee profile:', error);
        this.error = error.error?.message || 'Failed to load employee profile. Please try again.';
        this.loading = false;
      }
    });
  }

  formatDate(date: Date | string | null): string {
    if (!date) return 'Not provided';
    const d = new Date(date);
    return d.toLocaleDateString();
  }

  formatPhone(phone: string): string {
    if (!phone) return 'Not provided';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }

  getFullAddress(address: any): string {
    if (!address) return 'Not provided';
    const parts = [
      address.building,
      address.street,
      address.city,
      address.state,
      address.zip
    ].filter(part => part && part.trim());
    
    return parts.length > 0 ? parts.join(', ') : 'Not provided';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Approved': return 'primary';
      case 'Pending': return 'accent';
      case 'Rejected': return 'warn';
      default: return 'basic';
    }
  }

  closeTab(): void {
    window.close();
  }
} 