/**
 * src/lib/correios.ts — Cálculo de frete via API dos Correios
 *
 * Usa a API pública webservice.correios.com.br para calcular PAC e SEDEX.
 * Não requer contrato. Configurar nas SiteSettings:
 *   cepOrigem       — CEP do remetente (padrão: 01310100)
 *   pesoMedioProduto — peso estimado por produto em gramas (padrão: 300)
 */

export interface FreteResult {
  pac: number | null;
  sedex: number | null;
  prazoPac: number | null;
  prazoSedex: number | null;
  erro?: string;
}

function sanitizeCep(cep: string): string {
  return cep.replace(/\D/g, "").slice(0, 8);
}

// Código dos serviços Correios (sem contrato)
const COD_PAC = "04510";
const COD_SEDEX = "04014";

export async function calcularFrete(
  cepDestino: string,
  pesoGramas: number,
  cepOrigem: string = "01310100"
): Promise<FreteResult> {
  const cepD = sanitizeCep(cepDestino);
  const cepO = sanitizeCep(cepOrigem);

  if (cepD.length !== 8 || cepO.length !== 8) {
    return { pac: null, sedex: null, prazoPac: null, prazoSedex: null, erro: "CEP inválido" };
  }

  // Peso mínimo 300g para a API Correios
  const pesoKg = Math.max(pesoGramas, 300) / 1000;

  const calcServico = async (codigo: string): Promise<{ valor: number | null; prazo: number | null }> => {
    try {
      const url = new URL("https://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx/CalcPrecoPrazo");
      url.searchParams.set("nCdEmpresa", "");
      url.searchParams.set("sDsSenha", "");
      url.searchParams.set("nCdServico", codigo);
      url.searchParams.set("sCepOrigem", cepO);
      url.searchParams.set("sCepDestino", cepD);
      url.searchParams.set("nVlPeso", String(pesoKg));
      url.searchParams.set("nCdFormato", "1"); // caixa/pacote
      url.searchParams.set("nVlComprimento", "16");
      url.searchParams.set("nVlAltura", "10");
      url.searchParams.set("nVlLargura", "11");
      url.searchParams.set("nVlDiametro", "0");
      url.searchParams.set("sCdMaoPropria", "n");
      url.searchParams.set("nVlValorDeclarado", "0");
      url.searchParams.set("sCdAvisoRecebimento", "n");

      const res = await fetch(url.toString(), {
        signal: AbortSignal.timeout(6000),
        next: { revalidate: 3600 }, // cache 1h (Next.js fetch cache)
      });

      if (!res.ok) return { valor: null, prazo: null };

      const xml = await res.text();

      // Extrair Valor e PrazoEntrega do XML
      const valorMatch = xml.match(/<Valor>([\d,.]+)<\/Valor>/);
      const prazoMatch = xml.match(/<PrazoEntrega>(\d+)<\/PrazoEntrega>/);
      const erroMatch = xml.match(/<Erro>(\d+)<\/Erro>/);

      // Código de erro != 0 significa erro
      if (erroMatch && erroMatch[1] !== "0") {
        return { valor: null, prazo: null };
      }

      const valor = valorMatch
        ? parseFloat(valorMatch[1].replace(".", "").replace(",", "."))
        : null;
      const prazo = prazoMatch ? parseInt(prazoMatch[1], 10) : null;

      return { valor, prazo };
    } catch {
      return { valor: null, prazo: null };
    }
  };

  const [pac, sedex] = await Promise.all([
    calcServico(COD_PAC),
    calcServico(COD_SEDEX),
  ]);

  return {
    pac: pac.valor,
    sedex: sedex.valor,
    prazoPac: pac.prazo,
    prazoSedex: sedex.prazo,
  };
}
