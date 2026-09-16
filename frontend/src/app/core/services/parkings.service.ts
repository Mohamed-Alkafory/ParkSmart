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

  /** POST /api/parkings — owner only, token added by the interceptor. */
  create(payload: {
    name: string;
    address: string;
    pricePerHour: number;
    lat: number;
    lng: number;
  }): Observable<ApiResponse<Parking>> {
    return this.http.post<ApiResponse<Parking>>(this.apiUrl, payload);
  }

  /** PUT /api/parkings/:id — owning owner only. lat+lng must be sent together. */
  update(
    id: string,
    payload: { name?: string; address?: string; pricePerHour?: number; lat?: number; lng?: number },
  ): Observable<ApiResponse<Parking>> {
    return this.http.put<ApiResponse<Parking>>(`${this.apiUrl}/${id}`, payload);
  }

  /** DELETE /api/parkings/:id — rejected with 409 if active bookings or spots remain. */
  delete(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
