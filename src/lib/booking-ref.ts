/** Unambiguous alphabet — no 0/O, 1/I */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateBookingRef(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += ALPHABET[bytes[i]! % ALPHABET.length];
  }
  return `SAS-${code}`;
}
