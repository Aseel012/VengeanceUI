# Browser tests

Run `npm ci`, `npx playwright install chromium`, then `npm run test:e2e`.
Playwright starts a local development server on port 3100.

To check a production build, run `npm run build` and `npm run start -- --port 3100`,
then `PLAYWRIGHT_BASE_URL=http://localhost:3100 npm run test:e2e`.
If you already have Chrome installed, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`
to its executable path instead of downloading Chromium.

The sidebar tests cover preserved page scroll, active-link visibility, reloads,
search, keyboard and new-tab navigation, browser history, scroll containment,
reduced motion, and responsive resizing.
