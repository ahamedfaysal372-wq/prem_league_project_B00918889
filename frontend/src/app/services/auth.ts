import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { ApiService } from './api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  register(data: { name: string; username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiService.baseUrl}/auth/register`, data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiService.baseUrl}/auth/login`, data).pipe(
      tap((res: any) => {
        if (res.access_token) {
          localStorage.setItem('token', res.access_token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiService.baseUrl}/auth/me`);
  }

  isAdmin(): boolean {
    const user = localStorage.getItem('user');
    if (!user) return false;
    try {
      return JSON.parse(user).role === 'admin';
    } catch {
      return false;
    }
  }

  saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): User | null {
    const user = localStorage.getItem('user');
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }
}