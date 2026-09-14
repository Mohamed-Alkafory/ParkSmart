import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Spot, SpotStatus } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class SpotsService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/spots';

  getByParking(parkingId: string): Observable<ApiResponse<Spot[]>> {
    // TODO 1: send GET to `${this.apiUrl}/parking/${parkingId}` (public).
    //   Use: return this.http.get<ApiResponse<Spot[]>>(url).
    throw new Error('Not implemented — see TODO 1');
  }

  getAll(): Observable<ApiResponse<Spot[]>> {
    // TODO 2: send GET to `${this.apiUrl}/` (admin overview).
    //   Protected: requireAuth + requireRole('admin').
    //   Backend populates parkingId (name, address), newest first.
    //   Use: return this.http.get<ApiResponse<Spot[]>>(this.apiUrl).
    throw new Error('Not implemented — see TODO 2');
  }

  create(parkingId: string, spotNumber: string): Observable<ApiResponse<Spot>> {
    // TODO 3: send POST to `${this.apiUrl}/` with exact body { parkingId, spotNumber }.
    //   Protected: requireAuth + requireRole('owner').
    //   Use: return this.http.post<ApiResponse<Spot>>(this.apiUrl, { parkingId, spotNumber }).
    throw new Error('Not implemented — see TODO 3');
  }

  updateStatus(id: string, status: SpotStatus): Observable<ApiResponse<Spot>> {
    // TODO 4: send PUT to `${this.apiUrl}/${id}/status` with exact body { status }.
    //   Allowed values only: 'available' | 'booked' (backend validates this).
    //   Protected: requireAuth + requireRole('owner').
    //   Use: return this.http.put<ApiResponse<Spot>>(url, { status }).
    throw new Error('Not implemented — see TODO 4');
  }

  delete(id: string): Observable<ApiResponse<null>> {
    // TODO 5: send DELETE to `${this.apiUrl}/${id}` (no body).
    //   Protected: requireAuth + requireRole('owner').
    //   Note: backend returns { success: true, message } with NO data field here.
    //   Use: return this.http.delete<ApiResponse<null>>(url).
    throw new Error('Not implemented — see TODO 5');
  }
}
