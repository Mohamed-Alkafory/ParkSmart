// ─── ParkSmart shared API + domain models ───
// These interfaces mirror the backend Mongoose models + unified response shape exactly.
// No logic here — types only.

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export type UserRole = 'driver' | 'owner' | 'admin';

export interface User {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface Parking {
  _id?: string;
  name: string;
  address: string;
  ownerId: string;
  pricePerHour: number;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat] — backend order matters!
  };
  rating: number;
  imageUrl?: string | null;
}

export type SpotStatus = 'available' | 'booked';

export interface Spot {
  _id?: string;
  parkingId: string;
  spotNumber: string; // e.g. "A1", "B2"
  status: SpotStatus;
}

export type BookingStatus = 'active' | 'completed' | 'cancelled';

export interface Booking {
  _id?: string;
  userId: string;
  spotId: string | { _id: string; spotNumber: string };
  parkingId: string | { _id: string; name: string; address: string };
  startTime: string;
  durationHours: number;
  totalPrice: number;
  status: BookingStatus;
  statusHistory?: { status: string; changedAt: string }[];
}

export interface Review {
  _id?: string;
  userId: string;
  parkingId: string;
  rating: number; // 1..5
  comment?: string;
}

export type NotificationType = 'booking' | 'cancelled' | 'reminder';

export interface AppNotification {
  _id?: string;
  userId: string;
  bookingId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt?: string;
}
