/**
 * JWT Token Utilities
 * Safe base64url decoding and expiration validation in browser
 */

export interface JwtPayload {
  sub?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

/**
 * Safely decodes a JWT token payload without external libraries
 */
export function decodeJwt(token: string | null): JwtPayload | null {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Checks if a JWT token is expired.
 * Includes a 5-second buffer to prevent race conditions during network latency.
 */
export function isTokenExpired(token: string | null, bufferSeconds = 5): boolean {
  if (!token) return true;

  const payload = decodeJwt(token);
  if (!payload || !payload.exp) {
    return true;
  }

  // payload.exp is in seconds, Date.now() is in milliseconds
  const expirationMs = payload.exp * 1000;
  const bufferMs = bufferSeconds * 1000;

  return Date.now() >= expirationMs - bufferMs;
}

/**
 * Returns remaining milliseconds until token expiration, or 0 if expired
 */
export function getTokenTimeRemainingMs(token: string | null): number {
  if (!token) return 0;

  const payload = decodeJwt(token);
  if (!payload || !payload.exp) return 0;

  const remaining = payload.exp * 1000 - Date.now();
  return remaining > 0 ? remaining : 0;
}
