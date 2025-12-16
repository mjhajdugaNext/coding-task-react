import { defineConfig } from "@playwright/test";

export default defineConfig({
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  testDir: "tests/e2e",
  use: {
    baseURL: "http://127.0.0.1:3100",
    headless: true,
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: !process.env.CI,
    env: {
      MOCK_API: "true",
    },
    timeout: 120_000,
  },
});
