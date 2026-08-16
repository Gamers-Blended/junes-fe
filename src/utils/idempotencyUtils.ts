/**
 * Generates a unique idempotency key.
 * Prefers crypto.randomUUID() (cryptographically strong, RFC 4122 v4).
 * Falls back to a timestamp+random string for older runtimes.
 */
export function generateIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 10);
  return `${timestamp}-${random}`;
}
