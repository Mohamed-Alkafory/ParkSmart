import { Injectable } from '@angular/core';
import { TOKEN_KEY } from '../guards/auth.guard';
import { USER_KEY } from '../guards/owner.guard';
import { User } from '../models/api.models';

/**
 * StorageService — single localStorage abstraction for the JWT token
 * and the current user. Centralizes the keys shared by the guards,
 * navbar, interceptors and AuthService.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  setToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // storage unavailable — leave session in memory only
    }
  }

  clearToken(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // storage unavailable — nothing to remove
    }
  }

  getUser(): User | null {
    try {
      const stored = localStorage.getItem(USER_KEY);
      if (!stored) {
        return null;
      }
      const user = JSON.parse(stored) as User;
      return user?.email ? user : null;
    } catch {
      return null;
    }
  }

  setUser(user: User): void {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // storage unavailable — session stays in memory
    }
  }

  clear(): void {
    this.clearToken();
    try {
      localStorage.removeItem(USER_KEY);
    } catch {
      // storage unavailable — nothing to remove
    }
  }
}