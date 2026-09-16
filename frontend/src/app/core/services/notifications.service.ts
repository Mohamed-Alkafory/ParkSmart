import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, AppNotification } from '../models/api.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/notifications`;

  /** GET /api/notifications — current user's notifications, newest first. */
  getMine(): Observable<ApiResponse<AppNotification[]>> {
    return this.http.get<ApiResponse<AppNotification[]>>(this.apiUrl);
  }

  /** PATCH /api/notifications/read-all — backend returns { success, message } with no data. */
  markAllAsRead(): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(`${this.apiUrl}/read-all`, {});
  }

  /** PATCH /api/notifications/:id/read — marks one notification as read. */
  markAsRead(id: string): Observable<ApiResponse<AppNotification>> {
    return this.http.patch<ApiResponse<AppNotification>>(`${this.apiUrl}/${id}/read`, {});
  }
}