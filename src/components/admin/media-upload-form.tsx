"use client";

import { useState, useTransition, useRef } from "react";
import { Upload, Link2, Loader2, X, Image as ImageIcon, Film, Info } from "lucide-react";
import { createMediaAsset } from "@/actions/admin";

export function MediaUploadForm() {
  const [tab, setTab] = useState<"image" | "video">("image");
  const [imageMode, setImageMode] = useState<"file" | "url">("url");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setPreview(URL.createObjectURL(f));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const formData = new FormData(e.currentTarget);
    formData.set("type", tab === "image" ? "IMAGE" : "VIDEO");
    if (tab === "image") formData.set("imageMode", imageMode);

    startTransition(async () => {
      const result = await createMediaAsset(formData);
      if (result.success) {
        setPreview(null);
        setSuccess(true);
        if (fileInputRef.current) fileInputRef.current.value = "";
        formRef.current?.reset();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error ?? "Erro ao salvar");
      }
    });
  }

  const inputStyle = {
    backgroundColor: "#0F2E1E",
    border: "1px solid rgba(201,162,39,0.2)",
    borderRadius: "0.75rem",
    color: "#F5F0E6",
    padding: "0.625rem 1rem",
    width: "100%",
    fontSize: "0.875rem",
  };

  const labelStyle = {
    color: "rgba(200,187,168,0.7)",
    fontSize: "0.72rem",
    fontWeight: 600 as const,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    display: "block" as const,
    marginBottom: "0.375rem",
  };

  const tabBtn = (active: boolean) => ({
    padding: "0.375rem 1rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: 600 as const,
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
    transition: "all 0.2s",
    backgroundColor: active ? "#C9A227" : "rgba(201,162,39,0.08)",
    color: active ? "#0A3D2F" : "#C8BBA8",
    border: `1px solid ${active ? "#C9A227" : "rgba(201,162,39,0.2)"}`,
    cursor: "pointer" as const,
  });

  return (
    <div
      className="rounded-2xl p-6"
      style={{ backgroundColor: "#0A2419", border: "1px solid rgba(201,162,39,0.15)" }}
    >
      <h2 className="font-serif text-lg font-semibold mb-4" style={{ color: "#C9A227" }}>
        Adicionar mídia
      </h2>

      {/* Tabs — Imagem / Vídeo */}
      <div className="flex gap-2 mb-5">
        <button type="button" onClick={() => setTab("image")} style={tabBtn(tab === "image")}>
          <span className="flex items-center gap-1.5">
            <ImageIcon className="h-3.5 w-3.5" /> Imagem
          </span>
        </button>
        <button type="button" onClick={() => setTab("video")} style={tabBtn(tab === "video")}>
          <span className="flex items-center gap-1.5">
            <Film className="h-3.5 w-3.5" /> Vídeo
          </span>
        </button>
      </div>

      {/* Feedback */}
      {error && (
        <div
          className="rounded-xl px-4 py-2 text-sm mb-4"
          style={{
            backgroundColor: "rgba(239,68,68,0.1)",
            color: "#F87171",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          className="rounded-xl px-4 py-2 text-sm mb-4"
          style={{
            backgroundColor: "rgba(74,222,128,0.1)",
            color: "#4ADE80",
            border: "1px solid rgba(74,222,128,0.2)",
          }}
        >
          Mídia salva com sucesso!
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        {/* Nome */}
        <div>
          <label style={labelStyle}>Nome (opcional)</label>
          <input name="name" style={inputStyle} placeholder="Nome para identificação" />
        </div>

        {/* ── IMAGEM ── */}
        {tab === "image" && (
          <>
            {/* Sub-tabs: URL / Arquivo */}
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setImageMode("url")}
                className="text-xs px-3 py-1 rounded-lg transition-all"
                style={{
                  backgroundColor: imageMode === "url" ? "rgba(201,162,39,0.2)" : "transparent",
                  color: imageMode === "url" ? "#C9A227" : "rgba(200,187,168,0.5)",
                  border: `1px solid ${imageMode === "url" ? "rgba(201,162,39,0.4)" : "rgba(201,162,39,0.1)"}`,
                }}
              >
                Colar URL
              </button>
              <button
                type="button"
                onClick={() => setImageMode("file")}
                className="text-xs px-3 py-1 rounded-lg transition-all"
                style={{
                  backgroundColor: imageMode === "file" ? "rgba(201,162,39,0.2)" : "transparent",
                  color: imageMode === "file" ? "#C9A227" : "rgba(200,187,168,0.5)",
                  border: `1px solid ${imageMode === "file" ? "rgba(201,162,39,0.4)" : "rgba(201,162,39,0.1)"}`,
                }}
              >
                Upload arquivo
              </button>
            </div>

            {imageMode === "url" ? (
              <div>
                <label style={labelStyle}>URL da imagem</label>
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 shrink-0" style={{ color: "rgba(201,162,39,0.5)" }} />
                  <input
                    name="imageUrl"
                    type="url"
                    style={inputStyle}
                    placeholder="https://exemplo.com/imagem.jpg"
                    required
                  />
                </div>
                <p className="text-xs mt-1.5" style={{ color: "rgba(200,187,168,0.4)" }}>
                  Use imagens do Cloudinary, Unsplash, Imgur, ou qualquer CDN público.
                </p>
              </div>
            ) : (
              <div>
                <label style={labelStyle}>Arquivo de imagem</label>
                {/* Aviso se não tiver Vercel Blob configurado */}
                <div
                  className="flex items-start gap-2 rounded-xl p-3 mb-3 text-xs"
                  style={{
                    backgroundColor: "rgba(201,162,39,0.06)",
                    border: "1px solid rgba(201,162,39,0.15)",
                    color: "rgba(200,187,168,0.6)",
                  }}
                >
                  <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "#C9A227" }} />
                  <span>
                    Upload de arquivo requer{" "}
                    <strong style={{ color: "#C9A227" }}>Vercel Blob</strong> configurado
                    (env var <code style={{ color: "#C8BBA8" }}>BLOB_READ_WRITE_TOKEN</code>).
                    Se não tiver, use a opção{" "}
                    <button
                      type="button"
                      onClick={() => setImageMode("url")}
                      className="underline"
                      style={{ color: "#C9A227" }}
                    >
                      Colar URL
                    </button>
                    .
                  </span>
                </div>
                {preview && (
                  <div className="relative mb-2 inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Preview" className="h-24 w-24 object-cover rounded-xl" />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#F87171", color: "white" }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <label
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer transition-all py-6 hover:border-[#C9A227]"
                  style={{ borderColor: "rgba(201,162,39,0.3)" }}
                >
                  <Upload className="h-5 w-5" style={{ color: "#C9A227" }} />
                  <span className="text-xs" style={{ color: "rgba(200,187,168,0.6)" }}>
                    Clique para selecionar (JPG, PNG, WebP)
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    required
                  />
                </label>
              </div>
            )}
          </>
        )}

        {/* ── VÍDEO ── */}
        {tab === "video" && (
          <div>
            <label style={labelStyle}>URL do vídeo</label>
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 shrink-0" style={{ color: "rgba(201,162,39,0.5)" }} />
              <input
                name="url"
                type="url"
                style={inputStyle}
                placeholder="https://youtube.com/watch?v=..."
                required
              />
            </div>
            <div
              className="flex items-start gap-2 rounded-xl p-3 mt-3 text-xs"
              style={{
                backgroundColor: "rgba(201,162,39,0.06)",
                border: "1px solid rgba(201,162,39,0.15)",
                color: "rgba(200,187,168,0.6)",
              }}
            >
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "#C9A227" }} />
              <span>
                Recomendado usar <strong style={{ color: "#C8BBA8" }}>YouTube</strong> ou{" "}
                <strong style={{ color: "#C8BBA8" }}>Vimeo</strong>. Upload direto de arquivo
                de vídeo não é suportado — vídeos pesam centenas de MB e prejudicam a performance
                do site.
              </span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 hover:shadow-[0_0_20px_rgba(201,162,39,0.3)]"
          style={{ backgroundColor: "#C9A227", color: "#0A3D2F" }}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : tab === "image" && imageMode === "file" ? (
            <Upload className="h-4 w-4" />
          ) : (
            <Link2 className="h-4 w-4" />
          )}
          {isPending
            ? "Salvando..."
            : tab === "image" && imageMode === "file"
            ? "Fazer upload"
            : "Salvar URL"}
        </button>
      </form>
    </div>
  );
}
