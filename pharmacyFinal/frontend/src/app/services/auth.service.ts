import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

export interface LoginResponse {
  token: string;
  expiration: string;
}

export interface User {
  email: string;
  role: string;
  id: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('http://localhost:5035/api/auth/login', {
        Email: email,
        Password: password,
      })
      .pipe(
        // ✅ FIXED
        tap((response) => {
          localStorage.setItem(TOKEN_KEY, response.token);
          const user: User = {
            email,
            role: this.getRoleFromToken(response.token),
            id: this.getIdFromToken(response.token),
          };
          localStorage.setItem(USER_KEY, JSON.stringify(user));
          this.userSubject.next(user);
        })
      );
  }

  // ✅ FIXED REGISTER
  register(registerData: {
    email: string;
    password: string;
    fullName: string;
    role: string;
  }): Observable<any> {
    return this.http.post('http://localhost:5035/api/auth/register', {
      Email: registerData.email,
      Password: registerData.password,
      FullName: registerData.fullName,
      Role: registerData.role,
    });
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  getRole(): string {
    const user = this.getUser();
    return user?.role || '';
  }

  private loadUserFromStorage() {
    const token = this.getToken();
    const userStr = localStorage.getItem(USER_KEY);
    if (token && userStr) {
      const user: User = JSON.parse(userStr);
      this.userSubject.next(user);
    }
  }

  private getRoleFromToken(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['role'] || 'Customer';
    } catch {
      return 'Customer';
    }
  }

  private getIdFromToken(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['id'] || '';
    } catch {
      return '';
    }
  }
}
