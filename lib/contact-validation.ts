export const CONTACT_EMAIL_MAX_LENGTH = 320;
export const CONTACT_MESSAGE_MAX_LENGTH = 5000;

const SIMPLE_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const HTML_ESCAPE_LOOKUP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeContactEmail(value: unknown): string {
  return normalizeString(value);
}

export function normalizeContactMessage(value: unknown): string {
  return normalizeString(value).replace(/\r\n?/g, "\n");
}

export function isValidContactEmail(email: string): boolean {
  return (
    email.length > 0 &&
    email.length <= CONTACT_EMAIL_MAX_LENGTH &&
    SIMPLE_EMAIL_REGEX.test(email)
  );
}

export function isValidContactMessage(message: string): boolean {
  return message.length > 0 && message.length <= CONTACT_MESSAGE_MAX_LENGTH;
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPE_LOOKUP[char]);
}
