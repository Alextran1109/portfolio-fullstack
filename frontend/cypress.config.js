import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'cypress';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    env: {
      apiUrl: 'http://localhost:3000/api',
    },
    setupNodeEvents(on) {
      on('after:run', (results) => {
        const dir = path.join(__dirname, 'cypress', 'reports');
        fs.mkdirSync(dir, { recursive: true });
        const outPath = path.join(dir, 'e2e-results.json');
        fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
      });
    },
  },
});
