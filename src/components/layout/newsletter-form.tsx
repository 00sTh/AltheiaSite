"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setState("success");
        setEmail("");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <p className="text-sm" style={{ color: "#4ADE80" }}>
        ✓ Inscrito! Bem-vindo(a) à família Altheia.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          disabled={state === "loading"}
          className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none"
          style={{
            backgroundColor: "rgba(201,162,39,0.08)",
            border: "1px solid rgba(201,162,39,0.2)",
            color: "#F5F0E6",
          }}
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="px-5 py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all disabled:opacity-50"
          style={{ backgroundColor: "#C9A227", color: "#0A3D2F" }}
        >
          {state === "loading" ? "..." : "OK"}
        </button>
      </div>
      {state === "error" && (
        <p className="text-xs" style={{ color: "#F87171" }}>
          Erro ao se inscrever. Tente novamente.
        </p>
      )}
    </form>
  );
}
