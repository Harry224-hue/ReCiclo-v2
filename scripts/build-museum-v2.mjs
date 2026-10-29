import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

const ROOT = '/home/juanpa/Documentos/ReCiclo-versión-de-pruebas-v2';
const VERSIONES_DIR = join(ROOT, 'versiones');
const EMULADOR_DIR = join(ROOT, 'public', 'emulador');
const NODE_MODULES = join(ROOT, 'node_modules');
const VITE_BIN = join(NODE_MODULES, 'vite', 'bin', 'vite.js');

const VERSIONS = Array.from({ length: 10 }, (_, i) => `v2.${i}`);

mkdirSync(EMULADOR_DIR, { recursive: true });

const results = [];

for (const id of VERSIONS) {
  const vDir = join(VERSIONES_DIR, id);
  const appPath = join(vDir, 'src', 'App.tsx');
  const viteCfgPath = join(vDir, 'vite.config.ts');
  const distDir = join(vDir, 'dist');
  const targetDir = join(EMULADOR_DIR, id);
  const nmLink = join(vDir, 'node_modules');

  if (!existsSync(appPath)) {
    results.push({ id, ok: false, error: 'No existe App.tsx' });
    console.log(`✗ ${id}: no existe App.tsx`);
    continue;
  }

  let originalApp = readFileSync(appPath, 'utf8');
  let originalCfg = existsSync(viteCfgPath) ? readFileSync(viteCfgPath, 'utf8') : '';

  try {
    // 1. Crear enlace simbólico de node_modules
    if (existsSync(nmLink)) unlinkSync(nmLink);
    symlinkSync(NODE_MODULES, nmLink, 'dir');

    // 2. Parchear App.tsx con HashRouter
    let patchedApp = originalApp.replace(/BrowserRouter/g, 'HashRouter');
    writeFileSync(appPath, patchedApp, 'utf8');

    // 3. Parchear vite.config.ts con base: './'
    if (originalCfg) {
      let patchedCfg = originalCfg;
      if (!patchedCfg.includes("base: './'") && !patchedCfg.includes('base: "./"')) {
        patchedCfg = patchedCfg.replace('defineConfig({', "defineConfig({\n  base: './',");
      }
      writeFileSync(viteCfgPath, patchedCfg, 'utf8');
    }

    // 4. Compilar con Vite
    const res = spawnSync('node', [VITE_BIN, 'build'], {
      cwd: vDir,
      encoding: 'utf8',
      timeout: 120000,
    });

    if (res.status !== 0 || !existsSync(join(distDir, 'index.html'))) {
      const err = (res.stderr || res.stdout || 'Error desconocido').slice(-300);
      results.push({ id, ok: false, error: err });
      console.log(`✗ ${id}: error en build\n${err}`);
    } else {
      // 5. Copiar dist al directorio del emulador
      rmSync(targetDir, { recursive: true, force: true });
      mkdirSync(targetDir, { recursive: true });
      cpSync(distDir, targetDir, {
        recursive: true,
        filter: (src) => {
          // Excluir videos pesados o emuladores anidados
          const base = src.split('/').pop().toLowerCase();
          return !base.endsWith('.mp4') && base !== 'emulador';
        },
      });

      results.push({ id, ok: true });
      console.log(`✓ ${id} compilado e instalado en public/emulador/${id}`);
    }
  } catch (err) {
    results.push({ id, ok: false, error: String(err) });
    console.log(`✗ ${id}: excepción: ${err.message}`);
  } finally {
    // Restaurar archivos originales
    if (originalApp) writeFileSync(appPath, originalApp, 'utf8');
    if (originalCfg) writeFileSync(viteCfgPath, originalCfg, 'utf8');
    if (existsSync(nmLink)) unlinkSync(nmLink);
    if (existsSync(distDir)) rmSync(distDir, { recursive: true, force: true });
  }
}

const okCount = results.filter((r) => r.ok).length;
console.log(`\nResultado: ${okCount}/${VERSIONS.length} versiones listas.`);
