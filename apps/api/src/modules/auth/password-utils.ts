import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function comparePasswordHash(password: string, stored: string) {
  if (!stored) {
    return false;
  }

  const [salt, hash] = stored.split(":");
  if (!salt || !hash) {
    return false;
  }

  try {
    const candidate = scryptSync(password, salt, 64);
    const storedBuffer = Buffer.from(hash, "hex");

    if (storedBuffer.length !== candidate.length) {
      return false;
    }

    return timingSafeEqual(candidate, storedBuffer);
  } catch {
    return false;
  }
}
