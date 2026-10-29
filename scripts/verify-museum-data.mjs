import { existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const museumTsPath = join(ROOT, 'src', 'data', 'museum.ts');

const { MUSEUM_VERSIONS, MUSEUM_COUNT } = await import(museumTsPath);

let failed = false;
function assert(cond, msg) {
  if (!cond) {
    console.error(`❌ ERROR: ${msg}`);
    failed = true;
  }
}

console.log(`Verificando catálogo del museo (${MUSEUM_COUNT} versiones encontradas)...`);

assert(MUSEUM_COUNT === 30, `Se esperaban 30 versiones pero se encontraron ${MUSEUM_COUNT}`);
assert(MUSEUM_VERSIONS.length === 30, `MUSEUM_VERSIONS.length no coincide (${MUSEUM_VERSIONS.length})`);

const phases = new Set(MUSEUM_VERSIONS.map(v => v.phase));
assert(phases.has('v0') && phases.has('v1') && phases.has('v2'), `Faltan fases: ${Array.from(phases)}`);

for (let i = 0; i < 30; i++) {
  const v = MUSEUM_VERSIONS[i];
  assert(v.id, `Versión en índice ${i} no tiene id`);
  assert(v.title, `Versión ${v.id} no tiene título`);
  assert(v.why, `Versión ${v.id} no tiene justificación ('why')`);
  assert(Array.isArray(v.added), `Versión ${v.id} 'added' debe ser array`);
  assert(Array.isArray(v.removed), `Versión ${v.id} 'removed' debe ser array`);
  assert(typeof v.height === 'number' && v.height > 0, `Versión ${v.id} tiene altura inválida (${v.height})`);

  // Verificar que existen las capturas en public/museo
  const webpPath = join(ROOT, 'public', 'museo', v.screenshot);
  const mobilePngPath = join(ROOT, 'public', 'museo', v.screenshotMobile);
  assert(existsSync(webpPath), `No existe captura webp para ${v.id}: ${webpPath}`);
  assert(existsSync(mobilePngPath), `No existe captura mobile para ${v.id}: ${mobilePngPath}`);

  // Verificar que existe el emulador
  const emuPath = join(ROOT, 'public', 'emulador', v.id, 'index.html');
  assert(existsSync(emuPath), `No existe index.html del emulador para ${v.id}: ${emuPath}`);

  // Verificar que existe el subproyecto de código fuente
  const sourcePath = join(ROOT, 'versiones', v.id, 'EVIDENCIA_VERSION.md');
  assert(existsSync(sourcePath), `No existe subproyecto de código fuente para ${v.id}: ${sourcePath}`);
}

if (failed) {
  process.exit(1);
} else {
  console.log('✅ Todas las 30 versiones verificadas exitosamente con capturas, emuladores y código fuente.');
}
