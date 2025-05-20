import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private token: string = '';
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;

  private userId: string = '';
  private userEmail: string = ''; 

  private authLoading = new Subject<boolean>();
  authLoading$ = this.authLoading.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  getToken(): string {
    return this.token;
  }

  getIsAuth(): boolean {
    return this.isAuthenticated;
  }

  getUserId(): string {
    return this.userId;
  }

  getUserEmail(): string {
    return this.userEmail;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  /* Sign up */
  CreateUser(email: string, password: string): void {
    const authData: AuthData = { email, password };
    this.authLoading.next(true);

    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe({
        next: () => {
          this.authLoading.next(false);
          this.router.navigate(['/login']);
        },
        error: () => this.authLoading.next(false)
      });
  }

  /* Login */
  loginUser(email: string, password: string): void {
    const authData: AuthData = { email, password };
    this.authLoading.next(true);

    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe({
        next: response => {
          this.authLoading.next(false);

          this.token = response.token;
          if (!this.token) return;

          const expiresInDuration = response.expiresIn;
          this.userId = response.userId;
          this.userEmail = email; 

          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);

          const expirationDate = new Date(
            new Date().getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(this.token, expirationDate, this.userId, this.userEmail); 
          this.router.navigate(['/']);
        },
        error: () => this.authLoading.next(false)
      });
  }

  /* Logout */
  logout(): void {
    this.token = '';
    this.userId = '';
    this.userEmail = ''; // ✅ Clear email
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);

    this.clearAuthData();
    this.router.navigate(['/']);
  }

  /* Auth Refresh */
  autoAuthUser(): void {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }

    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.userId = authInfo.userId;
      this.userEmail = authInfo.email; // ✅
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  changePassword(currentPassword: string, newPassword: string) {
  const payload = { currentPassword, newPassword };
  return this.http.post<{ message: string }>(
    'http://localhost:3000/api/user/change-password',
    payload,
    {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    }
  );
}

  /* Local Storage Handling */
  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string,
    email: string
  ): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('email', email); 
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('email'); 
  }

  private getAuthData():
    | { token: string; expirationDate: Date; userId: string; email: string }
    | undefined {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email'); 

    if (!token || !expiration || !userId || !email) {
      return;
    }

    return {
      token,
      expirationDate: new Date(expiration),
      userId,
      email
    };
  }

  private setAuthTimer(durationInSeconds: number): void {
    this.tokenTimer = setTimeout(() => this.logout(), durationInSeconds * 1000);
  }
}
