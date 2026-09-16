import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, AppNotification } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/notifications';

  getMine(): Observable<ApiResponse<AppNotification[]>> {
    return this.http.get<ApiResponse<AppNotification[]>>(this.apiUrl);
  }

  markAllAsRead(): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(`${this.apiUrl}/read-all`, {});
  }

  markAsRead(id: string): Observable<ApiResponse<AppNotification>> {
    return this.http.patch<ApiResponse<AppNotification>>(`${this.apiUrl}/${id}/read`, {});
  }
}