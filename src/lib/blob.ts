/**
 * src/lib/blob.ts — Abstração para upload de imagens
 *
 * Desenvolvimento: salva em public/uploads/ (servido estaticamente)
 * Produção Vercel: configure BLOB_READ_WRITE_TOKEN e instale @vercel/blob:
 *   npm install @vercel/blob
 *   BLOB_READ_WRITE_TOKEN="vercel_blob_..."
 */

import fs from "fs/promises";
import path from "path";

export interface UploadResult {
  url: string;
  pathname: string;
}

export async function uploadImage(
  file: Buffer | Blob,
  filename: string
): Promise<UploadResult> {
  // ── Vercel Blob (produção) ─────────────────────────────────────────────
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`uploads/${filename}`, file, { access: "public" });
    return { url: blob.url, pathname: blob.pathname };
  }

  // ── Fallback local: public/uploads/ ───────────────────────────────────
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  try {
    await fs.mkdir(uploadsDir, { recursive: true });

    const buffer =
      file instanceof Buffer ? file : Buffer.from(await (file as Blob).arrayBuffer());

    // Sanitize filename
    const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
    const filepath = path.join(uploadsDir, safe);
    await fs.writeFile(filepath, buffer);

    return { url: `/uploads/${safe}`, pathname: `uploads/${safe}` };
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "EROFS" || code === "EACCES") {
      throw new Error(
        "Upload de arquivo não disponível neste ambiente. Use uma URL de imagem no campo 'URLs de imagens'."
      );
    }
    throw err;
  }
}

export async function deleteImage(pathname: string): Promise<void> {
  // ── Vercel Blob (produção) ─────────────────────────────────────────────
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { del } = await import("@vercel/blob");
    await del(pathname);
    return;
  }

  // ── Fallback local ─────────────────────────────────────────────────────
  try {
    const filepath = path.join(process.cwd(), "public", pathname);
    await fs.unlink(filepath);
  } catch {
    // File may not exist
  }
}
