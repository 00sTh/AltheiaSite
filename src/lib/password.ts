import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

/** Gera hash seguro da senha. Retorna "salt:hash" (hex). */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${hash.toString("hex")}`;
}

/** Verifica senha contra hash armazenado. Timing-safe. */
export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  try {
    const hash = (await scryptAsync(password, salt, 64)) as Buffer;
    const keyBuf = Buffer.from(key, "hex");
    return timingSafeEqual(hash, keyBuf);
  } catch {
    return false;
  }
}
