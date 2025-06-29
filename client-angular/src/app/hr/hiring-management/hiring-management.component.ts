import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface InviteHistoryEntry {
  email: string;
  name: string;
  token: string;
  registered: boolean;
}

export interface OnboardingApplication {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  feedback?: string;
  documents: {
    name: string;
    url: string;
  }[];
}

@Component({
  selector: 'app-hiring-management',
  templateUrl: './hiring-management.component.html'
})
export class HiringManagementComponent implements OnInit {
  inviteForm: FormGroup;
  statusMsg = '';
  error = '';
  inviteHistory: InviteHistoryEntry[] = [];

  applications: { [key: string]: OnboardingApplication[] } = {
    Pending: [],
    Approved: [],
    Rejected: []
  };

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.inviteForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.fetchInviteHistory();
    this.fetchApplications();
  }

  fetchInviteHistory() {
    this.http.get<InviteHistoryEntry[]>('/api/hr/invite-history')
      .subscribe({
        next: (data) => this.inviteHistory = data,
        error: (err) => this.error = 'Failed to load invite history'
      });
  }

  async sendInviteEmail(email: string, token: string) {
    const registrationLink = `http://localhost:3000/register/${token}`;
    const templateParams = {
      to_email: email,
      registration_link: registrationLink,
      from_name: 'Team Sajan',
    };

    try {
      await emailjs.send(
        'service_coil04s',
        'template_lmo14vv',
        templateParams,
        '6uIIkOCqP5DkczqWy'
      );
    } catch (err) {
      console.error('Email failed:', err);
      throw new Error('Failed to send email');
    }
  }

  async onSubmit() {
    this.statusMsg = '';
    this.error = '';
    const { name, email } = this.inviteForm.value;

    try {
      const res: any = await this.http.post('/api/hr/invite', { name, email }).toPromise();
      const token = res.token;
      await this.sendInviteEmail(email, token);
      this.statusMsg = `Invite sent successfully to ${email}`;
      this.inviteForm.reset();
      this.fetchInviteHistory(); // Refresh the list
    } catch (err: any) {
      this.error = err?.error?.message || err.message || 'Something went wrong';
    }
  }

  fetchApplications() {
  ['Pending', 'Approved', 'Rejected'].forEach(status => {
    this.http.get<OnboardingApplication[]>(`/api/hr/onboarding?status=${status}`)
      .subscribe(data => this.applications[status] = data);
  });
}

viewApplication(id: string) {
  window.open(`/hr/onboarding/${id}`, '_blank');
}

approveApplication(id: string) {
  this.http.put(`/api/hr/onboarding/${id}`, { status: 'Approved' }).subscribe(() => this.fetchApplications());
}

openRejectionPrompt(appId: string) {
  const feedback = prompt('Feedback:');
  if (feedback !== null) {
    this.rejectApplication(appId, feedback);
  }
}

rejectApplication(appId: string, feedback: string) {
  this.http.put(`/api/hr/onboarding/${appId}`, { status: 'Rejected', feedback })
    .subscribe({
      next: () => {
        alert('Application rejected.');
        this.fetchApplications(); // reload
      },
      error: err => {
        console.error('Error rejecting application', err);
        alert('Failed to reject application.');
      }
    });
}
}