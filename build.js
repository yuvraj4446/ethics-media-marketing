import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, 'dist');

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Building static production distribution...');

fs.copyFileSync(path.resolve(__dirname, 'index.html'), path.resolve(distDir, 'index.html'));
console.log('✓ Copied index.html -> dist/index.html');

copyDir(path.resolve(__dirname, 'css'), path.resolve(distDir, 'css'));
console.log('✓ Copied css/ -> dist/css/');

copyDir(path.resolve(__dirname, 'js'), path.resolve(distDir, 'js'));
console.log('✓ Copied js/ -> dist/js/');

copyDir(path.resolve(__dirname, 'assets'), path.resolve(distDir, 'assets'));
console.log('✓ Copied assets/ -> dist/assets/');

if (fs.existsSync(path.resolve(__dirname, 'public'))) {
  copyDir(path.resolve(__dirname, 'public'), distDir);
}

console.log('Build complete! dist/ contains exact static site structure.');
