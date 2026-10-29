import { execSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const COMMITS = [
  {
    id: 'v2.0',
    commit: '2bcb5af',
    date: '18 de Octubre de 2026',
    title: 'Arquitectura Web Pura e Integración Continua (CI)',
    desc: 'Eliminación de dependencias y wrappers nativos de Electron y Android/Capacitor; pipeline automatizado con GitHub Actions (.github/workflows/build.yml); APIs web estándar y badge oficial v2.0 en navbar.'
  },
  {
    id: 'v2.1',
    commit: '8fb7f11',
    date: '18 de Octubre de 2026',
    title: 'Arquitectura Cloud y Funciones Serverless en Vercel',
    desc: 'Configuración de vercel.json con SPA rewrites limpios; endpoint serverless api/gemini.js para proteger la API Key de Google Gemini Vision en backend; compatibilidad Vite local y cloud.'
  },
  {
    id: 'v2.2',
    commit: '95f56e8',
    date: '21 de Octubre de 2026',
    title: 'Seguridad y Validación Estudiantil con Matrícula ITM',
    desc: 'Validación de número de control institucional en Login.tsx y Registro.tsx; control robusto de estados de sesión con Firebase Auth; primera estructuración ampliada de Tecnologias.tsx.'
  },
  {
    id: 'v2.3',
    commit: '9eda85d',
    date: '21 de Octubre de 2026',
    title: 'Isla Dinámica e Interfaz Adaptativa',
    desc: 'Creación de NotchIsland.tsx para alertas y estado del sistema; controles de contraste accesibles en ThemeContext.tsx; navegación ágil adaptable a móvil y escritorio.'
  },
  {
    id: 'v2.4',
    commit: '51c86e0',
    date: '21 de Octubre de 2026',
    title: 'Modularización de Ajustes y Perfil',
    desc: 'Extracción modular de ProfileHistoryAndResources.tsx y SettingsSecondaryTabs.tsx; desacoplamiento de estado y optimización de tiempos de carga en vistas de usuario.'
  },
  {
    id: 'v2.5',
    commit: '4d81f97',
    date: '21 de Octubre de 2026',
    title: 'Fundamentación Ambiental y Guía Operativa',
    desc: 'Rediseño editorial profundo de ComoFunciona.tsx con la guía de acondicionamiento de residuos; reestructuración de Impacto.tsx con métricas verificadas SEMARNAT/INEGI y alineación ODS.'
  },
  {
    id: 'v2.6',
    commit: 'c3de19d',
    date: '22 de Octubre de 2026',
    title: 'Catálogo de Tecnologías Institucionales (techCategories.ts)',
    desc: 'Estructuración de las 6 capas técnicas en techCategories.ts: IA, Frontend, Backend, Datos, Mapas y Normativa; fichas con versiones y licencias; apego a ITMORELIA-IT-AM-007 y LGPGIR 2026.'
  },
  {
    id: 'v2.7',
    commit: '17fcdec',
    date: '22 de Octubre de 2026',
    title: 'Historial Estudiantil y Métricas de Logro',
    desc: 'Panel avanzado de perfil con rachas, medallas de logro y estadísticas de residuos evitados; sincronización con Cloud Firestore y respaldo local en localStorage.'
  },
  {
    id: 'v2.8',
    commit: 'aa4a4cb',
    date: '28 de Octubre de 2026',
    title: 'El Museo de la Evolución y Marco Institucional',
    desc: 'Incorporación del visor histórico interactivo /museo con 20 versiones emulables en sandbox; pestañas institucionales ProjectFrameworkTabs.tsx y pie de página con TeamCredits (6-6-7).'
  },
  {
    id: 'v2.9',
    commit: '4e213dd',
    date: '28 de Octubre de 2026',
    title: 'Consolidación de Producción y Resiliencia en Campus',
    desc: 'Desactivación de Google Tag Manager para prevenir bloqueos ERR_BLOCKED_BY_CLIENT; suite histórica completa de 30 versiones catalogadas; rendimiento estable para redes universitarias.'
  },
];

const VERSIONES_DIR = join(ROOT, 'versiones');

for (const v of COMMITS) {
  const dir = join(VERSIONES_DIR, v.id);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });

  // 1. Extraer árbol de Git mediante git archive y tar en shell
  try {
    execSync(`git archive ${v.commit} | tar -x --exclude=public/emulador --exclude=versiones --exclude=docs --exclude=.github -C "${dir}"`, {
      cwd: ROOT,
      stdio: ['ignore', 'ignore', 'pipe']
    });
  } catch (err) {
    console.error(`Error extrayendo ${v.id}: ${err.stderr || err.message}`);
    continue;
  }

  // 2. Crear EVIDENCIA_VERSION.md
  const evidenciaContent = `# Evidencia ${v.id}: ${v.title}
- **Fecha:** ${v.date}
- **Commit de referencia:** \`${v.commit}\`
- **Hito principal:** ${v.title}
- **Descripción técnica:** ${v.desc}
- **Comando de prueba:**
  \`\`\`bash
  cd versiones/${v.id}
  npm run dev
  \`\`\`
`;
  writeFileSync(join(dir, 'EVIDENCIA_VERSION.md'), evidenciaContent, 'utf8');

  // 3. Asegurar base: './' en vite.config.ts si existe
  const viteCfg = join(dir, 'vite.config.ts');
  if (existsSync(viteCfg)) {
    let cfg = readFileSync(viteCfg, 'utf8');
    if (!cfg.includes("base: './'") && !cfg.includes('base: "./"')) {
      cfg = cfg.replace('defineConfig({', "defineConfig({\n  base: './',");
      writeFileSync(viteCfg, cfg, 'utf8');
    }
  }

  console.log(`✓ ${v.id} generado desde ${v.commit}`);
}
