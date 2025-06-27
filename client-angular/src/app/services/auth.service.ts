import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '/api/auth';
  private userSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        this.setSession(res.token, res.user);
      })
    );
  }

  setSession(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  getCurrentUser() {
    return this.userSubject.value || JSON.parse(localStorage.getItem('user') || 'null');
  }

  logout() {
    localStorage.clear();
    this.userSubject.next(null);
  }

  isHR(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  isEmployee(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'employee';
  }
}