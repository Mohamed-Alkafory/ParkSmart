import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Parking } from '../models/api.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ParkingsService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/parkings`;

  getAll(): Observable<ApiResponse<Parking[]>> {
    return this.http.get<ApiResponse<Parking[]>>(this.apiUrl);
  }

  getMine(): Observable<ApiResponse<Parking[]>> {
    return this.http.get<ApiResponse<Parking[]>>(`${this.apiUrl}/mine`);
  }

  getById(id: string): Observable<ApiResponse<Parking>> {
    return this.http.get<ApiResponse<Parking>>(`${this.apiUrl}/${id}`);
  }

  getNearby(lat: number, lng: number, maxDistance?: number): Observable<ApiResponse<Parking[]>> {
    let params = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString());

    if (maxDistance !== undefined) {
      params = params.set('maxDistance', maxDistance.toString());
    }

    return this.http.get<ApiResponse<Parking[]>>(`${this.apiUrl}/nearby`, { params });
  }

  create(payload: { name: string; address: string; pricePerHour: number; lat: number; lng: number }): Observable<ApiResponse<Parking>> {
    // TODO 3: send POST to `${this.apiUrl}/` with exact body
    //   { name, address, pricePerHour, lat, lng }.
    //   Protected: requires requireAuth + requireRole('owner') — token is added by the interceptor.
    //   Use: return this.http.post<ApiResponse<Parking>>(this.apiUrl, payload).
    throw new Error('Not implemented — see TODO 3');
  }
}
