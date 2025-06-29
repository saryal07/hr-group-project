import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OnboardingApplication } from './onboarding-model';

@Component({
  selector: 'app-hr-application-view',
  templateUrl: './hr-application-view.component.html',
})
export class HrApplicationViewComponent implements OnInit {
  application!: OnboardingApplication;
  documents: any[] = [];
  loading = true;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const employeeId = this.route.snapshot.paramMap.get('id');
    if (!employeeId) {
      console.error('No employee ID found in route.');
      return;
    }

    this.fetchApplication(employeeId);
  }

  // Fetch the onboarding application by employee ID
  fetchApplication(employeeId: string) {
    this.http.get<{ employee: OnboardingApplication }>(`/api/hr/onboarding/${employeeId}`)
      .subscribe({
        next: (response) => {
          this.application = response.employee;
          this.fetchDocuments(employeeId);
        },
        error: (err) => {
          console.error('Error fetching onboarding application:', err);
          this.loading = false;
        }
      });
  }

  // Fetch uploaded documents for the employee
  fetchDocuments(employeeId: string) {
    this.http.get<any>(`/api/hr/documents/employee/${employeeId}`)
      .subscribe({
        next: (res) => {
          this.documents = res.data || [];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching documents:', err);
          this.loading = false;
        }
      });
  }

  // Open document in a new tab
  openDocument(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }

  approveApplication() {
    this.http.put(`/api/hr/onboarding/${this.application._id}`, { status: 'Approved' })
      .subscribe({
        next: () => {
          alert('Application approved.');
          window.close(); // or router.navigate if opened in same tab
        },
        error: err => {
          console.error('Approval failed:', err);
          alert('Failed to approve application.');
        }
      });
  }

  openRejectionPrompt() {
    const hrFeedback = prompt('Feedback for rejection:');
    if (hrFeedback !== null) {
      this.rejectApplication(hrFeedback);
    }
  }

  rejectApplication(hrFeedback: string) {
    this.http.put(`/api/hr/onboarding/${this.application._id}`, { status: 'Rejected', hrFeedback })
      .subscribe({
        next: () => {
          alert('Application rejected.');
          window.close(); // or router.navigate
        },
        error: err => {
          console.error('Rejection failed:', err);
          alert('Failed to reject application.');
        }
      });
  }

}