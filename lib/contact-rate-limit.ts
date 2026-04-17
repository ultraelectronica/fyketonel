const WINDOW_MS = 5 * 60 * 60 * 1000;
const MAX_SENDS = 3;

const buckets = new Map<string, number[]>();

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Reserves one send in the sliding window. Call undoContactReserve if the email fails to send.
 */
export function tryReserveContactSend(
  email: string,
): { ok: true } | { ok: false; retryAfterMs: number } {
  const key = normalizeEmail(email);
  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  const timestamps = (buckets.get(key) ?? []).filter((t) => t > cutoff);

  if (timestamps.length >= MAX_SENDS) {
    const oldest = Math.min(...timestamps);
    const retryAfterMs = Math.max(0, WINDOW_MS - (now - oldest));
    return { ok: false, retryAfterMs };
  }

  timestamps.push(now);
  buckets.set(key, timestamps);
  return { ok: true };
}

export function undoContactReserve(email: string): void {
  const key = normalizeEmail(email);
  const timestamps = buckets.get(key);
  if (!timestamps?.length) return;
  timestamps.pop();
  if (timestamps.length === 0) buckets.delete(key);
  else buckets.set(key, timestamps);
}
