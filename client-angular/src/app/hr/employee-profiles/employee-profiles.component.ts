import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HrEmployeeService, EmployeeSummary } from '../../services/hr-employee.service';

@Component({
  selector: 'app-employee-profiles',
  templateUrl: './employee-profiles.component.html',
  styleUrls: ['./employee-profiles.component.css']
})
export class EmployeeProfilesComponent implements OnInit {
  searchControl = new FormControl('');
  employees: EmployeeSummary[] = [];
  filteredEmployees: EmployeeSummary[] = [];
  loading = false;
  error: string | null = null;
  totalEmployees = 0;

  // Table columns to display
  displayedColumns: string[] = ['name', 'ssn', 'workAuthTitle', 'phone', 'email'];

  constructor(private hrEmployeeService: HrEmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.setupSearch();
  }

  loadEmployees(): void {
    this.loading = true;
    this.error = null;

    this.hrEmployeeService.getAllEmployees().subscribe({
      next: (response) => {
        this.employees = response.data;
        this.filteredEmployees = response.data;
        this.totalEmployees = response.count;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.error = 'Failed to load employees. Please try again.';
        this.loading = false;
      }
    });
  }

  setupSearch(): void {
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchTerm: string | null) => {
        const term = searchTerm || '';
        if (!term.trim()) {
          return of(this.employees);
        }
        
        this.loading = true;
        return this.hrEmployeeService.getAllEmployees(term);
      })
    ).subscribe({
      next: (result) => {
        if (Array.isArray(result)) {
          // Local filtering result
          this.filteredEmployees = result;
        } else {
          // API search result
          this.filteredEmployees = result.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching employees:', error);
        this.error = 'Search failed. Please try again.';
        this.loading = false;
      }
    });
  }

  openEmployeeProfile(employeeId: string): void {
    // Open employee profile in a new tab
    const url = `/hr/employee-profile/${employeeId}`;
    window.open(url, '_blank');
  }

  getSearchResultMessage(): string {
    const searchTerm = this.searchControl.value?.trim() || '';
    const count = this.filteredEmployees.length;
    
    if (!searchTerm) {
      return `Total employees: ${this.totalEmployees}`;
    }
    
    if (count === 0) {
      return `No employees found matching "${searchTerm}"`;
    } else if (count === 1) {
      return `1 employee found matching "${searchTerm}"`;
    } else {
      return `${count} employees found matching "${searchTerm}"`;
    }
  }

  formatSSN(ssn: string): string {
    if (!ssn) return 'Not provided';
    // Format SSN as XXX-XX-XXXX for privacy (show only last 4 digits)
    if (ssn.length >= 4) {
      return `***-**-${ssn.slice(-4)}`;
    }
    return ssn;
  }

  formatPhone(phone: string): string {
    if (!phone) return 'Not provided';
    // Format phone number
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }
}
