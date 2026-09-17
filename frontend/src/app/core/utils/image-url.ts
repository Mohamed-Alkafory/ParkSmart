import { environment } from '../../../environments/environment';
import { Parking } from '../models/api.models';

/**
 * resolveImageUrl
 * Turns a stored image path into a displayable URL.
 */
export function resolveImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;

  if (/^(https?:|data:)/i.test(path)) {
    return path;
  }

  const origin = environment.apiUrl.replace(/\/api\/?$/, '');
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Fixed local image for each parking.
 */
const parkingImages: Record<string, string> = {
  '6aabcf818d58df91da5f8cb7': '/assets/parking/parking-1.jpg',
  '6aab006162a28214f1bfa6fd': '/assets/parking/parking-2.jpg',
  '6aaad9aa5e8a39e8c4cc5bfd': '/assets/parking/parking-3.jpg',
  '6aaabeaa4a47dd739ca3fc45': '/assets/parking/parking-4.jpg',
  '6aaabeaa4a47dd739ca3fc46': '/assets/parking/parking-5.jpg',
  '6aaabeaa4a47dd739ca3fc47': '/assets/parking/parking-6.jpg',
  '6aaabeaa4a47dd739ca3fc48': '/assets/parking/parking-7.jpg',
};

export function resolveParkingImage(
  parking: Parking | null | undefined
): string | null {
  if (!parking) return null;

  // If backend already has an image, use it.
  if (parking.imageUrl) {
    return resolveImageUrl(parking.imageUrl);
  }

  // Otherwise use the fixed local image.
  return parking._id ? parkingImages[parking._id] ?? null : null;
}