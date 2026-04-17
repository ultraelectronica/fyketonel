/** Persisted key so the same browser profile shares one contact rate-limit bucket. */
export const CONTACT_DEVICE_ID_STORAGE_KEY = "fyke_contact_device_id";

const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidContactDeviceId(id: unknown): id is string {
  return typeof id === "string" && id.length <= 64 && UUID_V4.test(id);
}

/**
 * Returns a stable UUID for this browser (localStorage, then sessionStorage).
 * Must run in the browser (e.g. from a client component event handler).
 */
export function getOrCreateContactDeviceId(): string {
  if (typeof window === "undefined") {
    throw new Error("getOrCreateContactDeviceId must run in the browser");
  }

  const tryRead = (store: Storage): string | null => {
    try {
      const v = store.getItem(CONTACT_DEVICE_ID_STORAGE_KEY);
      return v && isValidContactDeviceId(v) ? v : null;
    } catch {
      return null;
    }
  };

  const tryWrite = (store: Storage, id: string): boolean => {
    try {
      store.setItem(CONTACT_DEVICE_ID_STORAGE_KEY, id);
      return true;
    } catch {
      return false;
    }
  };

  const fromLocal = tryRead(localStorage);
  if (fromLocal) return fromLocal;

  const fromSession = tryRead(sessionStorage);
  if (fromSession) {
    tryWrite(localStorage, fromSession);
    return fromSession;
  }

  const id = crypto.randomUUID();
  if (tryWrite(localStorage, id)) return id;
  if (tryWrite(sessionStorage, id)) return id;

  return id;
}
