import { Injectable } from '@angular/core';
import { TOKEN_KEY } from '../guards/auth.guard';
import { USER_KEY } from '../guards/owner.guard';
import { User } from '../models/api.models';

/**
 * StorageService — thin localStorage wrapper.
 * Pattern follows navbar.ts + guards (TOKEN_KEY / USER_KEY).
 *
 * TODO (team):
 *  1. getToken(): string | null — read TOKEN_KEY (copy getToken() from auth.guard).
 *  2. setToken(token: string): void + clearToken(): void.
 *  3. getUser(): User | null (JSON.parse, try/catch like navbar ngOnInit).
 *  4. setUser(user: User): void + clear(): void (both keys).
 *  5. Refactor AuthService + guards + navbar to inject this service (optional cleanup).
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  // TODO: implement getToken/setToken/clearToken/getUser/setUser/clear per notes above.
  // Hint: wrap every localStorage access in try/catch (SSR/storage-unavailable safe).
  getToken(): string | null {
    throw new Error('Not implemented — see TODO 1');
  }
  setToken(_token: string): void {
    throw new Error('Not implemented — see TODO 2');
  }
  getUser(): User | null {
    throw new Error('Not implemented — see TODO 3');
  }
  setUser(_user: User): void {
    throw new Error('Not implemented — see TODO 4');
  }
  clear(): void {
    void TOKEN_KEY;
    void USER_KEY;
    throw new Error('Not implemented — see TODO 5');
  }
}
