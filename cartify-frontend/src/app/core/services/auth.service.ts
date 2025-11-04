import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://cartify-simple-shopping-cart-1.onrender.com/auth';
  private tokenKey = 'authToken';

  // ✅ BehaviorSubject to track login state
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  signup(payload: SignupRequest): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap((res) => {
        if (res.token) {
          this.setToken(res.token);
        }
      }),
      catchError(this.handleError)
    );
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((res) => {
        if (res) {
           localStorage.setItem('jwtToken', res.token);
          this.setToken(res); // assuming backend returns token as plain string
        }
      }),
      catchError(this.handleError)
    );
  }

  // ✅ Save token
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.loggedIn.next(true);
  }

  // ✅ Get token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // ✅ Check if token exists
  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // ✅ Public method for components
  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  // ✅ Logout
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn.next(false);
  }

  // ✅ Error handler
  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'Something went wrong, please try again.';
    if (error.error instanceof ErrorEvent) {
      errorMsg = `Error: ${error.error.message}`;
    } else {
      errorMsg = error.error?.message || `Server returned code ${error.status}`;
    }
    return throwError(() => errorMsg);
  }
}
