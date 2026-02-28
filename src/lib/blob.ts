/**
 * src/lib/blob.ts — Upload de imagens
 *
 * Providers (em ordem de prioridade):
 *  1. Cloudinary (CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET)
 *  2. Vercel Blob  (BLOB_READ_WRITE_TOKEN) — requer store pública
 *  3. Local        (public/uploads/) — apenas dev
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
  // ── 1. Cloudinary ──────────────────────────────────────────────────────────
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    const { v2: cloudinary } = await import("cloudinary");

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key:    process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const buffer =
      file instanceof Buffer ? file : Buffer.from(await (file as Blob).arrayBuffer());

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "altheia", resource_type: "image" },
          (err, res) => {
            if (err || !res) return reject(err ?? new Error("Cloudinary upload falhou"));
            resolve(res as { secure_url: string; public_id: string });
          }
        );
        stream.end(buffer);
      }
    );

    return { url: result.secure_url, pathname: result.public_id };
  }

  // ── 2. Vercel Blob (requer store pública) ─────────────────────────────────
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`uploads/${filename}`, file, { access: "public" });
    return { url: blob.url, pathname: blob.pathname };
  }

  // ── 3. Fallback local: public/uploads/ (apenas dev) ───────────────────────
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
    const buffer =
      file instanceof Buffer ? file : Buffer.from(await (file as Blob).arrayBuffer());
    const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
    await fs.writeFile(path.join(uploadsDir, safe), buffer);
    return { url: `/uploads/${safe}`, pathname: `uploads/${safe}` };
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "EROFS" || code === "EACCES") {
      throw new Error(
        "Configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET para upload em produção."
      );
    }
    throw err;
  }
}

export async function deleteImage(pathname: string): Promise<void> {
  // ── Cloudinary ─────────────────────────────────────────────────────────────
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    const { v2: cloudinary } = await import("cloudinary");
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key:    process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    // pathname é o public_id no Cloudinary
    if (!pathname.startsWith("/uploads/") && !pathname.startsWith("uploads/")) {
      await cloudinary.uploader.destroy(pathname);
    }
    return;
  }

  // ── Vercel Blob ─────────────────────────────────────────────────────────────
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { del } = await import("@vercel/blob");
    await del(pathname);
    return;
  }

  // ── Local ──────────────────────────────────────────────────────────────────
  try {
    await fs.unlink(path.join(process.cwd(), "public", pathname));
  } catch {
    // arquivo pode não existir
  }
}
