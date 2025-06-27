import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    console.log('LoginComponent loaded');
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        console.log('Login response:', res);
        const role = res.user?.role;
        console.log('User role:', role);
        
        this.authService.setSession(res.token, res.user);
        
        if (role === 'admin') {
          console.log('Redirecting to HR dashboard');
          this.router.navigate(['/hr']);
        } else {
          console.log('Redirecting to employee dashboard');
          this.router.navigate(['/employee']);
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error = err.error?.message || 'Login failed';
      },
    });
  }
}