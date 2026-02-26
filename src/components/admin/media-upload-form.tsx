"use client";

import { useState, useTransition, useRef } from "react";
import { Upload, Link2, Loader2, X } from "lucide-react";
import { createMediaAsset } from "@/actions/admin";

interface MediaUploadFormProps {
  onSuccess?: () => void;
}

export function MediaUploadForm({ onSuccess }: MediaUploadFormProps) {
  const [tab, setTab] = useState<"image" | "video">("image");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setPreview(URL.createObjectURL(f));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("type", tab === "image" ? "IMAGE" : "VIDEO");

    startTransition(async () => {
      const result = await createMediaAsset(formData);
      if (result.success) {
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        (e.target as HTMLFormElement).reset();
        onSuccess?.();
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

  return (
    <div
      className="rounded-2xl p-6"
      style={{ backgroundColor: "#0A2419", border: "1px solid rgba(201,162,39,0.15)" }}
    >
      <h2 className="font-serif text-lg font-semibold mb-4" style={{ color: "#C9A227" }}>
        Adicionar mídia
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(["image", "video"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all"
            style={{
              backgroundColor: tab === t ? "#C9A227" : "rgba(201,162,39,0.08)",
              color: tab === t ? "#0A3D2F" : "#C8BBA8",
              border: `1px solid ${tab === t ? "#C9A227" : "rgba(201,162,39,0.2)"}`,
            }}
          >
            {t === "image" ? "Imagem" : "Vídeo (URL)"}
          </button>
        ))}
      </div>

      {error && (
        <div
          className="rounded-xl px-4 py-2 text-sm mb-4"
          style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#F87171", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label style={labelStyle}>Nome (opcional)</label>
          <input name="name" style={inputStyle} placeholder="Nome para identificação" />
        </div>

        {tab === "image" ? (
          <div>
            <label style={labelStyle}>Arquivo de imagem</label>
            {preview && (
              <div className="relative mb-2 inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Preview" className="h-24 w-24 object-cover rounded-xl" />
                <button
                  type="button"
                  onClick={() => { setPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
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
              />
            </label>
          </div>
        ) : (
          <div>
            <label style={labelStyle}>URL do vídeo (YouTube, Vimeo, MP4)</label>
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 shrink-0" style={{ color: "rgba(201,162,39,0.5)" }} />
              <input
                name="url"
                type="url"
                style={inputStyle}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 hover:shadow-[0_0_20px_rgba(201,162,39,0.3)]"
          style={{ backgroundColor: "#C9A227", color: "#0A3D2F" }}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {isPending ? "Salvando..." : tab === "image" ? "Fazer upload" : "Salvar URL"}
        </button>
      </form>
    </div>
  );
}
