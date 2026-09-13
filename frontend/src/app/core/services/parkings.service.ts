import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Parking } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ParkingsService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/parkings';

  getAll(): Observable<ApiResponse<Parking[]>> {
    // TODO 1: send GET to `${this.apiUrl}/` (public, no token needed).
    //   Use: return this.http.get<ApiResponse<Parking[]>>(this.apiUrl).
    //   Note from Phase 1: backend fetchAllParkings() is still a TODO stub,
    //   so expect an empty/undefined data until backend implements it.
    throw new Error('Not implemented — see TODO 1');
  }

  getNearby(lat: number, lng: number, maxDistance?: number): Observable<ApiResponse<Parking[]>> {
    // TODO 2: send GET to `${this.apiUrl}/nearby?lat=&lng=&maxDistance=`
    //   Backend requires query params lat + lng, optional maxDistance (default 5000 meters).
    //   Use: new HttpParams().set('lat', ...).set('lng', ...) and this.http.get(url, { params }).
    //   Note: backend fetchNearbyParkings() is also still a TODO stub.
    throw new Error('Not implemented — see TODO 2');
  }

  create(payload: { name: string; address: string; pricePerHour: number; lat: number; lng: number }): Observable<ApiResponse<Parking>> {
    // TODO 3: send POST to `${this.apiUrl}/` with exact body
    //   { name, address, pricePerHour, lat, lng }.
    //   Protected: requires requireAuth + requireRole('owner') — token is added by the interceptor.
    //   Use: return this.http.post<ApiResponse<Parking>>(this.apiUrl, payload).
    throw new Error('Not implemented — see TODO 3');
  }
}
