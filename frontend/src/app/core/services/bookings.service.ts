import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Booking, BookingStatus } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/bookings';

  create(parkingId: string, startTime: string, durationHours: number): Observable<ApiResponse<Booking>> {
    // TODO 1: send POST to `${this.apiUrl}/` with exact body
    //   { parkingId, startTime, durationHours }.
    //   Protected: requireAuth (any logged-in role). Backend auto-picks an
    //   available spot and computes totalPrice = pricePerHour * durationHours.
    //   Use: return this.http.post<ApiResponse<Booking>>(this.apiUrl, { parkingId, startTime, durationHours }).
    throw new Error('Not implemented — see TODO 1');
  }

  getMine(): Observable<ApiResponse<Booking[]>> {
    // TODO 2: send GET to `${this.apiUrl}/my` (protected).
    //   Backend populates parkingId (name, address) + spotId (spotNumber).
    //   Use: return this.http.get<ApiResponse<Booking[]>>(url).
    throw new Error('Not implemented — see TODO 2');
  }

  updateStatus(id: string, status: BookingStatus): Observable<ApiResponse<Booking>> {
    // TODO 3: send PATCH to `${this.apiUrl}/${id}/status` with exact body { status }.
    //   Allowed values only: 'active' | 'completed' | 'cancelled'.
    //   Protected: requireAuth — backend allows the booking owner, the parking owner, or admin (403 otherwise).
    //   Use: return this.http.patch<ApiResponse<Booking>>(url, { status }).
    throw new Error('Not implemented — see TODO 3');
  }

  getOwnerBookings(): Observable<ApiResponse<Booking[]>> {
    // TODO 4: send GET to `${this.apiUrl}/owner` (owner dashboard).
    //   Protected: requireAuth + requireRole('owner', 'admin').
    //   Backend returns bookings of the caller's parkings, populated with parking + spot + user.
    //   Use: return this.http.get<ApiResponse<Booking[]>>(url).
    throw new Error('Not implemented — see TODO 4');
  }

  getAllBookings(): Observable<ApiResponse<Booking[]>> {
    // TODO 5: send GET to `${this.apiUrl}/` (admin dashboard).
    //   Protected: requireAuth + requireRole('admin').
    //   Use: return this.http.get<ApiResponse<Booking[]>>(this.apiUrl).
    throw new Error('Not implemented — see TODO 5');
  }
}
