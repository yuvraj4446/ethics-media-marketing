import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: './',
  publicDir: 'public',
  plugins: [
    {
      name: 'copy-runtime-scripts',
      closeBundle() {
        const distJs = path.resolve(__dirname, 'dist/js');
        if (!fs.existsSync(distJs)) {
          fs.mkdirSync(distJs, { recursive: true });
        }
        const srcJs = path.resolve(__dirname, 'js/main.js');
        const destJs = path.resolve(distJs, 'main.js');
        fs.copyFileSync(srcJs, destJs);
        console.log('[build plugin] Successfully copied js/main.js to dist/js/main.js');
      }
    }
  ]
});
