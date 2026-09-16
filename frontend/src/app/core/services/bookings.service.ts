import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Booking, BookingStatus } from '../models/api.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/bookings`;

  create(
    parkingId: string,
    startTime: string,
    durationHours: number,
    spotId?: string,
  ): Observable<ApiResponse<Booking>> {
    return this.http.post<ApiResponse<Booking>>(this.apiUrl, {
      parkingId,
      startTime,
      durationHours,
      ...(spotId ? { spotId } : {}),
    });
  }

  getMine(): Observable<ApiResponse<Booking[]>> {
    return this.http.get<ApiResponse<Booking[]>>(`${this.apiUrl}/my`);
  }

  updateStatus(id: string, status: BookingStatus): Observable<ApiResponse<Booking>> {
    return this.http.patch<ApiResponse<Booking>>(`${this.apiUrl}/${id}/status`, { status });
  }

  getOwnerBookings(): Observable<ApiResponse<Booking[]>> {
    return this.http.get<ApiResponse<Booking[]>>(`${this.apiUrl}/owner`);
  }

  getAllBookings(): Observable<ApiResponse<Booking[]>> {
    return this.http.get<ApiResponse<Booking[]>>(this.apiUrl);
  }
}
