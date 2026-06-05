import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AccountCredentials, Token } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'cespga_token';
  private loggedIn = new BehaviorSubject<boolean>(this.isAuthenticated());

  loggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  signin(credentials: AccountCredentials): Observable<Token> {
    return this.http.post<Token>(`${environment.apiUrl}/auth/signin`, credentials).pipe(
      tap(token => {
        localStorage.setItem(this.TOKEN_KEY, JSON.stringify(token));
        this.loggedIn.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.loggedIn.next(false);
    this.router.navigate(['/dashboard']);
  }

  getToken(): Token | null {
    const data = localStorage.getItem(this.TOKEN_KEY);
    return data ? JSON.parse(data) : null;
  }

  getAccessToken(): string | null {
    return this.getToken()?.accessToken ?? null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return new Date(token.expiration) > new Date();
  }

  forgotPassword(username: string): Observable<string> {
    return this.http.post(`${environment.apiUrl}/auth/forgot-password`, { username }, { responseType: 'text' });
  }

  resetPassword(token: string, newPassword: string): Observable<string> {
    return this.http.post(`${environment.apiUrl}/auth/reset-password`, { token, newPassword }, { responseType: 'text' });
  }
}
