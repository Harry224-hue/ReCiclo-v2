import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire('/home/juanpa/Documentos/ReCiclo-version-1/ReCiclo-version-1/.tmp-tools/package.json');
const { chromium } = require('playwright-core');

const ROOT = '/home/juanpa/Documentos/ReCiclo-versión-de-pruebas-v2';
const EMULADOR_DIR = join(ROOT, 'public', 'emulador');
const MUSEO_DIR = join(ROOT, 'public', 'museo');
const CAPTURAS_DIR = join(ROOT, 'public', 'capturas');
const CHROME_PATH = '/home/juanpa/Documentos/ReCiclo-version-1/ReCiclo-version-1/.tmp-tools/browsers/chromium-1248/chrome-linux64/chrome';

mkdirSync(MUSEO_DIR, { recursive: true });
mkdirSync(CAPTURAS_DIR, { recursive: true });

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.json': 'application/json',
};

// 1. Iniciar servidor estático ligero
const server = createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = join(EMULADOR_DIR, urlPath);

  if (!existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const ext = extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  res.end(readFileSync(filePath));
});

await new Promise((resolve) => server.listen(5499, '127.0.0.1', resolve));
console.log('Servidor de emuladores listo en http://127.0.0.1:5499');

// 2. Iniciar Chromium
const browser = await chromium.launch({
  executablePath: CHROME_PATH,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
});

const VERSIONS = Array.from({ length: 10 }, (_, i) => `v2.${i}`);
const heights = {};

for (const id of VERSIONS) {
  console.log(`\nCapturando ${id}...`);
  const url = `http://127.0.0.1:5499/${id}/index.html`;

  // --- Desktop ---
  const dCtx = await browser.newContext({
    viewport: { width: 1200, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: 'dark',
  });
  const dPage = await dCtx.newPage();
  await dPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await dPage.waitForTimeout(1800);

  const desktopPng = join(MUSEO_DIR, `${id}.png`);
  const desktopWebp = join(MUSEO_DIR, `${id}.webp`);
  await dPage.screenshot({ path: desktopPng, fullPage: true });

  const pageHeight = await dPage.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
  heights[id] = pageHeight;
  console.log(`  ✓ Desktop capturado (${pageHeight}px de altura) -> ${id}.png`);
  await dCtx.close();

  // Convertir a WebP
  try {
    execSync(`ffmpeg -y -i "${desktopPng}" -c:v libwebp -quality 85 "${desktopWebp}"`, { stdio: 'ignore' });
    console.log(`  ✓ Convertido a WebP -> ${id}.webp`);
  } catch (e) {
    console.warn(`  ⚠ Falló conversión a WebP: ${e.message}`);
  }

  // --- Mobile ---
  const mCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    colorScheme: 'dark',
  });
  const mPage = await mCtx.newPage();
  await mPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mPage.waitForTimeout(1800);

  const mobilePng = join(MUSEO_DIR, `${id}-mobile.png`);
  await mPage.screenshot({ path: mobilePng });
  console.log(`  ✓ Mobile capturado -> ${id}-mobile.png`);
  await mCtx.close();

  // Copiar a public/capturas
  copyFileSync(desktopPng, join(CAPTURAS_DIR, `${id}.png`));
  copyFileSync(mobilePng, join(CAPTURAS_DIR, `${id}-mobile.png`));
}

await browser.close();
server.close();

console.log('\nAlturas capturadas para museum.ts:');
console.log(JSON.stringify(heights, null, 2));
console.log('\nCapturas de Fase 2 completadas exitosamente.');
