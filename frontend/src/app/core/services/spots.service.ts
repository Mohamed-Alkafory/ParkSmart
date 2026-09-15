import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Spot, SpotStatus } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class SpotsService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/spots';

  getByParking(parkingId: string): Observable<ApiResponse<Spot[]>> {
    return this.http.get<ApiResponse<Spot[]>>(`${this.apiUrl}/parking/${parkingId}`);
  }

  getAll(): Observable<ApiResponse<Spot[]>> {
    return this.http.get<ApiResponse<Spot[]>>(`${this.apiUrl}/`);
  }

  create(parkingId: string, spotNumber: string): Observable<ApiResponse<Spot>> {
    return this.http.post<ApiResponse<Spot>>(`${this.apiUrl}/`, { parkingId, spotNumber });
  }

  updateStatus(id: string, status: SpotStatus): Observable<ApiResponse<Spot>> {
    return this.http.put<ApiResponse<Spot>>(`${this.apiUrl}/${id}/status`, { status });
  }

  delete(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
