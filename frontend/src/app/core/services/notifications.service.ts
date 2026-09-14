import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, AppNotification } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/notifications';

  getMine(): Observable<ApiResponse<AppNotification[]>> {
    // TODO 1: send GET to `${this.apiUrl}/` (protected, sorted newest-first by backend).
    //   Use: return this.http.get<ApiResponse<AppNotification[]>>(this.apiUrl).
    throw new Error('Not implemented — see TODO 1');
  }

  markAllAsRead(): Observable<ApiResponse<null>> {
    // TODO 2: send PATCH to `${this.apiUrl}/read-all` with NO body.
    //   Backend returns { success: true, message } with NO data field.
    //   ⚠️ Route order matters on backend — call this exact path, not /:id/read.
    //   Use: return this.http.patch<ApiResponse<null>>(url, {}).
    throw new Error('Not implemented — see TODO 2');
  }

  markAsRead(id: string): Observable<ApiResponse<AppNotification>> {
    // TODO 3: send PATCH to `${this.apiUrl}/${id}/read` with NO body.
    //   Use: return this.http.patch<ApiResponse<AppNotification>>(url, {}).
    throw new Error('Not implemented — see TODO 3');
  }
}
