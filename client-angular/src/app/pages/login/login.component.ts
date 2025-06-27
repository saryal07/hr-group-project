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
        const role = res.user?.role;
        this.authService.setSession(res.token, res.user);
        if (role === 'admin') {
          this.router.navigate(['/hr']);
        } else {
          this.router.navigate(['/employee']);
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed';
      },
    });
  }
}