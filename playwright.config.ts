import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config para smoke tests do AltheiaSite.
 * Requer servidor em execução (use baseURL correto).
 *
 * Para instalar browsers: npx playwright install chromium
 * Para rodar: npm run test:e2e
 */

const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    // Não-autenticado por padrão
    storageState: undefined,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Não inicia servidor automaticamente — rodar `npm run dev` antes
  // webServer: { command: "npm run dev", url: BASE_URL, reuseExistingServer: true },
});
