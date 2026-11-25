import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient,
              private router: Router) {}

  login(email: string, motPasse: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`,
      { email, motPasse });
  }

  saveToken(token: string, role: string, nom: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('nom', nom);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getNom(): string {
    return localStorage.getItem('nom') || 'Admin';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'ROLE_ADMIN';
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }


}
