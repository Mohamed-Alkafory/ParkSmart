import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, AuthPayload, User } from '../models/api.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  // Backend base from Phase 1: app.use('/api/auth', ...) on http://localhost:5000
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // TODO 1: create a signal to hold the current user (initial value null).
  //   Use: signal<User | null>(null).
  readonly currentUser = signal<User | null>(null);

  // TODO 2: create a signal or computed to expose the JWT token.
  //   Hint: read/write localStorage key 'parksmart_token'. Do NOT write the code yet.

  register(name: string, email: string, password: string, phone?: string): Observable<ApiResponse<User>> {
    // TODO 3: send POST to `${this.apiUrl}/register`
    //   with body shape exactly { name, email, password, phone? }.
    //   Required by backend: name, email, password. Phone is optional.
    //   Use: return this.http.post<ApiResponse<User>>(url, body).
    throw new Error('Not implemented — see TODO 3');
  }

  login(email: string, password: string): Observable<ApiResponse<AuthPayload>> {
    // TODO 4: send POST to `${this.apiUrl}/login`
    //   with body shape exactly { email, password }.
    //   Backend returns { success, data: { token, user } }.
    //   Use: return this.http.post<ApiResponse<AuthPayload>>(url, body).
    throw new Error('Not implemented — see TODO 4');
  }

  logout(): void {
    // TODO 5: remove 'parksmart_token' from localStorage and
    //   set the currentUser signal back to null using .set().
    throw new Error('Not implemented — see TODO 5');
  }
}
