/**
 * src/lib/blob.ts — Abstração para upload de imagens
 *
 * Atualmente usa placeholder local.
 * Para produção, substituir por Vercel Blob:
 *
 *   npm install @vercel/blob
 *   import { put } from "@vercel/blob";
 *
 * Adicionar ao .env.local:
 *   BLOB_READ_WRITE_TOKEN="vercel_blob_..."
 */

export interface UploadResult {
  url: string;
  pathname: string;
}

/**
 * Faz upload de um arquivo de imagem.
 *
 * @param file - Arquivo de imagem (Buffer ou File/Blob)
 * @param filename - Nome desejado para o arquivo
 * @returns URL pública da imagem
 *
 * @example
 * const { url } = await uploadImage(buffer, "produto-01.jpg");
 */
export async function uploadImage(
  file: Buffer | Blob,
  filename: string
): Promise<UploadResult> {
  // ── PLACEHOLDER — substituir por Vercel Blob em produção ──────────────
  // const blob = await put(`products/${filename}`, file, {
  //   access: "public",
  //   contentType: "image/jpeg",
  // });
  // return { url: blob.url, pathname: blob.pathname };

  // Simulação local para desenvolvimento
  console.warn(
    `[blob] uploadImage chamado com "${filename}" — configure Vercel Blob para produção`
  );

  return {
    url: `https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600`,
    pathname: `products/${filename}`,
  };
}

/**
 * Remove uma imagem pelo pathname.
 *
 * @param pathname - Caminho retornado pelo uploadImage
 */
export async function deleteImage(pathname: string): Promise<void> {
  // ── PLACEHOLDER ───────────────────────────────────────────────────────
  // import { del } from "@vercel/blob";
  // await del(pathname);

  console.warn(`[blob] deleteImage("${pathname}") — configure Vercel Blob`);
}
