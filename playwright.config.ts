import { defineConfig } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  use: {
    baseURL,
    browserName: "chromium",
    viewport: { width: 1280, height: 720 },
    trace: "retain-on-failure",
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    },
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3100",
    url: `${baseURL}/docs/install-nextjs`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
