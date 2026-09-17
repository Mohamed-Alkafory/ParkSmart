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

  /**
   * DELETE /api/parkings/:id — rejected with 409 on active bookings.
   * force=true also removes non-active booking history (spots, reviews, photo
   * always go with the parking). Past bookings stay, shown as deleted parking.
   */
  delete(id: string, force = false): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`, {
      params: force ? { force: 'true' } : {},
    });
  }

  /** POST /api/parkings/:id/image — owning owner only. Multipart field name is "image". */
  uploadImage(id: string, file: File): Observable<ApiResponse<Parking>> {
    const form = new FormData();
    form.append('image', file);
    return this.http.post<ApiResponse<Parking>>(`${this.apiUrl}/${id}/image`, form);
  }
}
