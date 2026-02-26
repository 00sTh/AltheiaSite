"use client";

import { useTransition, useState } from "react";
import { updateSiteSettings } from "@/actions/admin";
import type { SiteSettings } from "@prisma/client";

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateSiteSettings(formData);
      setMsg(
        result.success
          ? { ok: true, text: "Configurações salvas com sucesso!" }
          : { ok: false, text: result.error ?? "Erro ao salvar" }
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const labelStyle = {
    color: "rgba(200,187,168,0.7)",
    fontSize: "0.72rem",
    fontWeight: 600 as const,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    display: "block" as const,
    marginBottom: "0.375rem",
  };

  const inputStyle = {
    backgroundColor: "#0F2E1E",
    border: "1px solid rgba(201,162,39,0.2)",
    borderRadius: "0.75rem",
    color: "#F5F0E6",
    padding: "0.625rem 1rem",
    width: "100%",
    fontSize: "0.875rem",
  };

  const sectionTitle = (title: string) => (
    <div
      className="pb-3 mb-5 border-b"
      style={{ borderColor: "rgba(201,162,39,0.15)" }}
    >
      <h2 className="font-serif text-lg font-semibold" style={{ color: "#C9A227" }}>
        {title}
      </h2>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {msg && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{
            backgroundColor: msg.ok ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            color: msg.ok ? "#4ADE80" : "#F87171",
            border: `1px solid ${msg.ok ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
          }}
        >
          {msg.text}
        </div>
      )}

      {/* Hero Section */}
      <div>
        {sectionTitle("Hero (Página Inicial)")}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label style={labelStyle}>Título principal</label>
            <input name="heroTitle" defaultValue={settings.heroTitle} style={inputStyle} />
          </div>
          <div className="md:col-span-2">
            <label style={labelStyle}>Subtítulo</label>
            <textarea
              name="heroSubtitle"
              defaultValue={settings.heroSubtitle}
              rows={2}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
          <div>
            <label style={labelStyle}>URL da imagem do hero</label>
            <input
              name="heroImageUrl"
              type="url"
              defaultValue={settings.heroImageUrl ?? ""}
              style={inputStyle}
              placeholder="https://..."
            />
          </div>
          <div>
            <label style={labelStyle}>URL do vídeo do hero (fallback)</label>
            <input
              name="heroVideoUrl"
              type="url"
              defaultValue={settings.heroVideoUrl ?? ""}
              style={inputStyle}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
          <div>
            <label style={labelStyle}>Vídeo esquerdo — Split Hero (YouTube ou MP4)</label>
            <input
              name="leftVideoUrl"
              type="url"
              defaultValue={settings.leftVideoUrl ?? ""}
              style={inputStyle}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
          <div>
            <label style={labelStyle}>Vídeo direito — Split Hero (YouTube ou MP4)</label>
            <input
              name="rightVideoUrl"
              type="url"
              defaultValue={settings.rightVideoUrl ?? ""}
              style={inputStyle}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
          <div className="md:col-span-2">
            <label style={labelStyle}>URL do logo PNG transparente (centro do hero)</label>
            <input
              name="heroLogoUrl"
              type="url"
              defaultValue={settings.heroLogoUrl ?? ""}
              style={inputStyle}
              placeholder="https://... (PNG com fundo transparente)"
            />
            <p className="mt-1.5 text-xs" style={{ color: "rgba(200,187,168,0.4)" }}>
              Se vazio, exibe o texto "Althéia" em Playfair Display. Recomendado: PNG 680×240px.
            </p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div>
        {sectionTitle("Sobre Nós")}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label style={labelStyle}>Título da seção</label>
            <input name="aboutTitle" defaultValue={settings.aboutTitle} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>URL da imagem</label>
            <input
              name="aboutImageUrl"
              type="url"
              defaultValue={settings.aboutImageUrl ?? ""}
              style={inputStyle}
              placeholder="https://..."
            />
          </div>
          <div className="md:col-span-2">
            <label style={labelStyle}>Texto da página Sobre Nós</label>
            <textarea
              name="aboutText"
              defaultValue={settings.aboutText}
              rows={6}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div>
        {sectionTitle("Vídeos")}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label style={labelStyle}>URL do vídeo em destaque</label>
            <input
              name="featuredVideoUrl"
              type="url"
              defaultValue={settings.featuredVideoUrl ?? ""}
              style={inputStyle}
              placeholder="https://youtube.com/..."
            />
          </div>
          <div>
            <label style={labelStyle}>Título do vídeo</label>
            <input
              name="featuredVideoTitle"
              defaultValue={settings.featuredVideoTitle}
              style={inputStyle}
            />
          </div>
          <div className="md:col-span-2">
            <label style={labelStyle}>Descrição do vídeo</label>
            <textarea
              name="featuredVideoDesc"
              defaultValue={settings.featuredVideoDesc}
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div>
        {sectionTitle("Redes Sociais")}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <label style={labelStyle}>Instagram</label>
            <input
              name="instagramUrl"
              type="url"
              defaultValue={settings.instagramUrl ?? ""}
              style={inputStyle}
              placeholder="https://instagram.com/altheia"
            />
          </div>
          <div>
            <label style={labelStyle}>YouTube</label>
            <input
              name="youtubeUrl"
              type="url"
              defaultValue={settings.youtubeUrl ?? ""}
              style={inputStyle}
              placeholder="https://youtube.com/@altheia"
            />
          </div>
          <div>
            <label style={labelStyle}>Twitter / X</label>
            <input
              name="twitterUrl"
              type="url"
              defaultValue={settings.twitterUrl ?? ""}
              style={inputStyle}
              placeholder="https://x.com/altheia"
            />
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div>
        {sectionTitle("Newsletter")}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label style={labelStyle}>Título da newsletter</label>
            <input
              name="newsletterTitle"
              defaultValue={settings.newsletterTitle}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Subtítulo</label>
            <input
              name="newsletterSubtitle"
              defaultValue={settings.newsletterSubtitle ?? ""}
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* SEO */}
      <div>
        {sectionTitle("SEO")}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label style={labelStyle}>Meta title (máx 70 caracteres)</label>
            <input
              name="metaTitle"
              maxLength={70}
              defaultValue={settings.metaTitle ?? ""}
              style={inputStyle}
              placeholder="Altheia — A Verdade da Beleza"
            />
          </div>
          <div>
            <label style={labelStyle}>Frete grátis a partir de (R$)</label>
            <input
              name="shippingFreeThreshold"
              type="number"
              min="0"
              step="1"
              defaultValue={settings.shippingFreeThreshold}
              style={inputStyle}
            />
          </div>
          <div className="md:col-span-2">
            <label style={labelStyle}>Meta description (máx 160 caracteres)</label>
            <textarea
              name="metaDescription"
              maxLength={160}
              defaultValue={settings.metaDescription ?? ""}
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              placeholder="Cosméticos de luxo formulados com a pureza da ciência e da natureza."
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="px-8 py-3 rounded-xl text-sm font-semibold tracking-wider transition-all duration-200 disabled:opacity-50 hover:shadow-[0_0_20px_rgba(201,162,39,0.3)]"
        style={{ backgroundColor: "#C9A227", color: "#0A3D2F" }}
      >
        {isPending ? "Salvando..." : "Salvar configurações"}
      </button>
    </form>
  );
}
