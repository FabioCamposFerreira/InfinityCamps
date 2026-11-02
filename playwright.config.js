import { defineConfig } from '@playwright/test'

const baseURL = process.env.BASE_URL || 'http://localhost:3000'

export default defineConfig({
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL,
    headless: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  // Sobe só o Astro: os testes simulam as rotas /api/* do Worker com page.route.
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npm run dev:astro',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 120_000,
      },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
})
