import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Review } from '../models/api.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/reviews`;

  getByParking(parkingId: string): Observable<ApiResponse<Review[]>> {
    return this.http.get<ApiResponse<Review[]>>(`${this.apiUrl}/parking/${parkingId}`);
  }

  create(parkingId: string, rating: number, comment?: string): Observable<ApiResponse<Review>> {
    return this.http.post<ApiResponse<Review>>(this.apiUrl, { parkingId, rating, comment });
  }
}
  create(parkingId: string, rating: number, comment?: string): Observable<ApiResponse<Review>> {
    // TODO 2: send POST to `${this.apiUrl}/` with exact body { parkingId, rating, comment? }.
    //   Required: parkingId + rating (1..5). Comment is optional.
    //   Protected: requireAuth (any role).
    //   Note: backend addReview() is still a TODO stub.
    //   Use: return this.http.post<ApiResponse<Review>>(this.apiUrl, { parkingId, rating, comment }).
    throw new Error('Not implemented — see TODO 2');
  }
}
