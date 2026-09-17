import { environment } from '../../../environments/environment';

/**
 * resolveImageUrl
 * Turns a stored image path into a displayable URL.
 * - null/undefined/empty → null (caller shows its placeholder instead)
 * - absolute URLs (http/https/data:) → returned as-is
 * - backend-relative paths ("/uploads/...") → prefixed with the
 *   backend origin derived from environment.apiUrl, never hardcoded.
 */
export function resolveImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^(https?:|data:)/i.test(path)) return path;
  const origin = environment.apiUrl.replace(/\/api\/?$/, '');
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}
