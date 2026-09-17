import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, User } from '../models/api.models';
import { environment } from '../../../environments/environment';

/**
 * Users API service.
 * Profile pages use it to read and update the signed-in user.
 */
@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/users`;

  getAll(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(this.apiUrl);
  }

  getById(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/${id}`);
  }

  updateProfile(id: string, name: string, phone?: string): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.apiUrl}/${id}`, { name, phone });
  }

  /**
   * Admin-only role change. Backend has no PATCH /:id/role — role is an
   * admin-whitelisted field on PATCH /:id (see user.service.js).
   */
  updateRole(id: string, role: User['role']): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.apiUrl}/${id}`, { role });
  }

  /** DELETE /:id — admin only. */
  delete(id: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.delete<ApiResponse<{ message: string }>>(`${this.apiUrl}/${id}`);
  }

  /** POST /:id/avatar — self or admin. Multipart field name is "image". */
  uploadAvatar(id: string, file: File): Observable<ApiResponse<User>> {
    const form = new FormData();
    form.append('image', file);
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/${id}/avatar`, form);
  }
}
