/**
 * GET /api/frete?cep=01310100&quantidade=2
 *
 * Calcula frete via Correios usando as configurações do SiteSettings.
 * Retorna opções PAC e SEDEX com preço e prazo estimado.
 */

import { NextRequest, NextResponse } from "next/server";
import { calcularFrete } from "@/lib/correios";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cepDestino = searchParams.get("cep") ?? "";
  const quantidade = parseInt(searchParams.get("quantidade") ?? "1", 10);

  if (!/^\d{8}$/.test(cepDestino.replace(/\D/g, ""))) {
    return NextResponse.json({ error: "CEP inválido" }, { status: 400 });
  }

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
    select: { cepOrigem: true, pesoMedioProduto: true },
  });

  const cepOrigem = settings?.cepOrigem ?? "01310100";
  const pesoUnitario = settings?.pesoMedioProduto ?? 300;
  const pesoTotal = pesoUnitario * Math.max(1, quantidade);

  const result = await calcularFrete(cepDestino, pesoTotal, cepOrigem);

  return NextResponse.json(result);
}
