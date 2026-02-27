/**
 * tests/smoke.spec.ts — Smoke tests do AltheiaSite
 *
 * Pré-requisito: servidor rodando em http://localhost:3000 (npm run dev)
 * Instalar browsers: npx playwright install chromium
 * Rodar: npm run test:e2e
 */

import { test, expect } from "@playwright/test";

// ─── Páginas públicas ────────────────────────────────────────────────────────

test("home page carrega", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBeLessThan(400);
  await expect(page).toHaveTitle(/Alth/i);
});

test("listagem de produtos carrega", async ({ page }) => {
  const res = await page.goto("/products");
  expect(res?.status()).toBeLessThan(400);
  // Deve ter pelo menos um heading
  await expect(page.locator("h1, h2").first()).toBeVisible();
});

test("página Sobre Nós carrega", async ({ page }) => {
  const res = await page.goto("/sobre-nos");
  expect(res?.status()).toBeLessThan(400);
});

test("página Vídeos carrega", async ({ page }) => {
  const res = await page.goto("/videos");
  expect(res?.status()).toBeLessThan(400);
});

test("página Loja carrega", async ({ page }) => {
  const res = await page.goto("/loja");
  expect(res?.status()).toBeLessThan(400);
});

test("carrinho carrega (redireciona ou exibe vazio)", async ({ page }) => {
  const res = await page.goto("/cart");
  // Pode redirecionar para sign-in ou exibir carrinho vazio
  expect(res?.status()).toBeLessThan(500);
});

// ─── Auth ────────────────────────────────────────────────────────────────────

test("página de login do Clerk abre", async ({ page }) => {
  const res = await page.goto("/sign-in");
  expect(res?.status()).toBeLessThan(400);
  // Clerk insere um formulário de login
  await expect(page.locator("form, [data-clerk-component]").first()).toBeVisible({ timeout: 8000 });
});

test("admin redireciona para login se não autenticado", async ({ page }) => {
  await page.goto("/admin");
  // Deve redirecionar para sign-in
  await expect(page).toHaveURL(/sign-in|login/i, { timeout: 8000 });
});

// ─── APIs ────────────────────────────────────────────────────────────────────

test("API newsletter retorna 400 para email vazio", async ({ request }) => {
  const res = await request.post("/api/newsletter", {
    data: { email: "" },
  });
  expect(res.status()).toBeGreaterThanOrEqual(400);
});

test("API newsletter retorna sucesso para email válido", async ({ request }) => {
  const res = await request.post("/api/newsletter", {
    data: { email: `smoke-test-${Date.now()}@test.com` },
  });
  // 200 ou 409 (já inscrito)
  expect([200, 201, 409]).toContain(res.status());
});

test("API check-payment retorna 404 para ID inválido", async ({ request }) => {
  const res = await request.get(
    "/api/check-payment?paymentId=invalid-id&orderId=00000000-0000-0000-0000-000000000000"
  );
  expect(res.status()).toBe(404);
});

test("API frete retorna erro para CEP inválido", async ({ request }) => {
  const res = await request.get("/api/frete?cep=00000&quantidade=1");
  expect(res.status()).toBe(400);
  const json = await res.json();
  expect(json.error).toBeTruthy();
});

test("API frete responde para CEP válido", async ({ request }) => {
  const res = await request.get("/api/frete?cep=01310100&quantidade=1");
  // Pode ser 200 mesmo que Correios não responda (retorna nulls)
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json).toHaveProperty("pac");
  expect(json).toHaveProperty("sedex");
});

// ─── SEO / Meta ──────────────────────────────────────────────────────────────

test("sitemap.xml é acessível", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain("<urlset");
});

test("robots.txt é acessível", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.status()).toBe(200);
});

// ─── 404 ─────────────────────────────────────────────────────────────────────

test("página 404 customizada aparece", async ({ page }) => {
  const res = await page.goto("/pagina-que-nao-existe-xyz-123");
  expect(res?.status()).toBe(404);
});
