import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, AuthPayload, User } from '../models/api.models';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);

  // Backend base from Phase 1: app.use('/api/auth', ...) on backendUrl
  private readonly apiUrl = `${environment.backendUrl}/api/auth`;

  readonly currentUser = signal<User | null>(null);

  register(name: string, email: string, password: string, phone?: string): Observable<ApiResponse<User>> {
    const body = { name, email, password, ...(phone ? { phone } : {}) };
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/register`, body);
  }

  login(email: string, password: string): Observable<ApiResponse<AuthPayload>> {
    return this.http.post<ApiResponse<AuthPayload>>(`${this.apiUrl}/login`, { email, password });
  }

  logout(): void {
    this.storage.clear();
    this.currentUser.set(null);
  }
}