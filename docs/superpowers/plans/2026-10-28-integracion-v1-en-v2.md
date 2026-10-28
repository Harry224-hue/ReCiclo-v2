# Integración de Versión 1 en Versión 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrar en `ReCiclo-versión-de-pruebas-v2` los módulos de portada institucional, Museo de 20 versiones, pie de página con créditos interactivos y documentación desarrollados en `ReCiclo-version-1`, preservando intactas todas las mejoras internas de la Versión 2.

**Architecture:** Integración selectiva de 3 vías sobre la base de `ReCiclo-versión-de-pruebas-v2`. Se copian los activos públicos y componentes exclusivos de la Versión 1 (`ProjectFrameworkTabs`, `museum/*`, `Museo`, `museum-teaser`, `footer`, `how-it-works`, `hero`, `proposal`, `scanner-cta`) y se fusionan quirúrgicamente los archivos compartidos (`App.tsx`, `navbar.tsx`, `assets.ts`, `PerformanceOptimizer.tsx`, `wasteData.ts`, `index.css`, `vite.config.ts`) sin alterar las vistas avanzadas de la Versión 2 (`Mapa`, `Escanear`, `Perfil`, `settings-modal`, `ComoFunciona`, `Impacto`, `Tecnologias`).

**Tech Stack:** React 19, TypeScript 5.7, Tailwind CSS 4, Framer Motion, React Router DOM 7, Vite 8.

**Spec:** [docs/superpowers/specs/2026-10-28-integracion-v1-en-v2-design.md](file:///home/juanpa/Documentos/ReCiclo-versión-de-pruebas-v2/docs/superpowers/specs/2026-10-28-integracion-v1-en-v2-design.md)

## Global Constraints
- Preservar íntegramente `src/pages/Mapa.tsx`, `src/pages/Escanear.tsx` (`ScanResultPanel.tsx`, `ContainerGuide.tsx`, `container-ui.tsx`), `src/pages/Perfil.tsx` (`ProfileHistoryAndResources.tsx`), `src/components/settings-modal.tsx` (`SettingsSecondaryTabs.tsx`), `src/pages/ComoFunciona.tsx`, `src/pages/Impacto.tsx` y `src/pages/Tecnologias.tsx` (`techCategories.ts`) de la Versión 2.
- No agregar dependencias de Electron o Capacitor al `package.json` de la Versión 2.
- No copiar las subcarpetas de código fuente `versiones/v1.0`–`v1.9` en la raíz del proyecto; únicamente los bundles estáticos de `public/emulador/` y capturas en `public/museo/` y `public/capturas/`.

## Review Focus
- **Ruta `/museo` sin barra de navegación duplicada**: Al navegar a `/museo`, `Navbar` debe retornar `null` mientras conserva su comportamiento de cristal y badge `v2.0` en el resto de las rutas.
- **Carga de capturas y emuladores del Museo**: `museumShotUrl` y `museumRunUrl` deben resolver a `public/museo/` y `public/emulador/` con `public/emulador/museum-sandbox.js` disponible.
- **Coexistencia de estilos CSS en `src/index.css`**: Los estilos de marcadores de mapa y escáner de la v2 (`.itm-station-marker`, `.scan-sweep`, `.scanner-aside`) deben coexistir sin conflicto con las clases `.museum-*` de la v1.
- **Integridad de exportaciones en `src/data/wasteData.ts`**: Las actualizaciones editoriales de `wasteData.ts` deben conservar todas las constantes consumidas por `ComoFunciona.tsx`, `Escanear.tsx` y `Mapa.tsx` (`CAMPUS_CONTAINERS_CATALOG`, `ITM_RSU_PROCEDURE`, `WASTE_DATABASE`, `ITM_DISPOSAL_POINTS`).
- **Compilación limpia de producción**: `npm run build` (`tsc -b && vite build`) debe finalizar con código `0` sin errores de tipos ni importaciones faltantes.

---

### Task 1: Activos Públicos del Museo y Documentación Institucional

**Files:**
- Create: `public/emulador/` (copiado desde `../ReCiclo-version-1/ReCiclo-version-1/public/emulador/`)
- Create: `public/museo/` (copiado desde `../ReCiclo-version-1/ReCiclo-version-1/public/museo/`)
- Create: `public/capturas/` (copiado desde `../ReCiclo-version-1/ReCiclo-version-1/public/capturas/`)
- Create: `DESIGN.md`, `BITACORA_RECICLO.md`, `HISTORIAL_VERSIONES.md`
- Modify: `src/constants/assets.ts`
- Modify: `vite.config.ts`

**Interfaces:**
- Produces: `export const MUSEUM_BASE = "${BASE}museo/"` en `src/constants/assets.ts` y archivos estáticos en `public/emulador/*`, `public/museo/*` y `public/capturas/*`.

- [ ] **Step 1: Copiar directorios `public/emulador`, `public/museo`, `public/capturas` y documentos raíz (`DESIGN.md`, `BITACORA_RECICLO.md`, `HISTORIAL_VERSIONES.md`) desde `ReCiclo-version-1`**
  Run: `cp -r ../ReCiclo-version-1/ReCiclo-version-1/public/emulador ../ReCiclo-version-1/ReCiclo-version-1/public/museo ../ReCiclo-version-1/ReCiclo-version-1/public/capturas public/ && cp ../ReCiclo-version-1/ReCiclo-version-1/DESIGN.md ../ReCiclo-version-1/ReCiclo-version-1/BITACORA_RECICLO.md ../ReCiclo-version-1/ReCiclo-version-1/HISTORIAL_VERSIONES.md .`
  Expected: Directorios `public/emulador`, `public/museo`, `public/capturas` y archivos `.md` presentes.

- [ ] **Step 2: Exportar `MUSEUM_BASE` en `src/constants/assets.ts` y actualizar `server.watch.ignored` en `vite.config.ts`**
  Añadir `export const MUSEUM_BASE = \`\${BASE}museo/\`;` en `src/constants/assets.ts` e ignorar `'public/emulador/**'` en `vite.config.ts`.

- [ ] **Step 3: Verificar existencia de activos clave del emulador y capturas**
  Run: `test -f public/emulador/museum-sandbox.js && test -f public/emulador/v1.9/index.html && test -f public/museo/v1.9.webp && echo OK`
  Expected: `OK`

---

### Task 2: Catálogo y Componentes del Museo de Versiones (`/museo`)

**Files:**
- Create: `src/data/museum.ts`
- Create: `src/components/museum/DeviceMockup.tsx`
- Create: `src/components/museum/Emulator.tsx`
- Create: `src/components/museum/VersionDialog.tsx`
- Create: `src/components/museum/VersionFrame.tsx`
- Create: `src/components/museum/museum-motion.css`
- Create: `src/components/museum/useStorageGuard.ts`
- Create: `src/pages/Museo.tsx`
- Create: `src/sections/museum-teaser.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `useTheme()` de `src/context/ThemeContext.tsx`, `SettingsModal` de `src/components/settings-modal.tsx`.
- Produces: `export default function Museo()` en `src/pages/Museo.tsx`, `export function MuseumTeaser()` en `src/sections/museum-teaser.tsx`, `MUSEUM_VERSIONS` en `src/data/museum.ts`.

- [ ] **Step 1: Copiar `src/data/museum.ts`, `src/components/museum/*`, `src/pages/Museo.tsx` y `src/sections/museum-teaser.tsx` desde `ReCiclo-version-1`**
  Run: `cp ../ReCiclo-version-1/ReCiclo-version-1/src/data/museum.ts src/data/ && cp -r ../ReCiclo-version-1/ReCiclo-version-1/src/components/museum src/components/ && cp ../ReCiclo-version-1/ReCiclo-version-1/src/pages/Museo.tsx src/pages/ && cp ../ReCiclo-version-1/ReCiclo-version-1/src/sections/museum-teaser.tsx src/sections/`

- [ ] **Step 2: Anexar las reglas `.museum-*` al final de `src/index.css` preservando intactas todas las reglas de mapa y escáner de la v2**
  Mantener las 285 líneas actuales de `src/index.css` (incluyendo `.itm-station-marker`, `.itm-user-marker`, `.itm-map-tooltip`, `.scan-sweep` y `.scanner-aside`) y añadir el bloque `.museum-hall`, `.museum-stage`, `.museum-shot`, `.museum-progress` y `.museum-dialog`.

- [ ] **Step 3: Verificar compilación de tipos de los componentes del Museo**
  Run: `npx tsc -b --noEmit`
  Expected: Salida limpia con código `0`.

---

### Task 3: Secciones de Portada, Marco Institucional, Footer y Fusión de Navegación

**Files:**
- Create: `src/components/ProjectFrameworkTabs.tsx`
- Modify: `src/sections/hero.tsx`
- Modify: `src/sections/how-it-works.tsx`
- Modify: `src/sections/proposal.tsx`
- Modify: `src/sections/scanner-cta.tsx`
- Modify: `src/components/footer.tsx`
- Modify: `src/components/PerformanceOptimizer.tsx`
- Modify: `src/data/wasteData.ts`
- Modify: `src/components/navbar.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `ProjectFrameworkTabs`, `MuseumTeaser`, `Museo`, `HowItWorks`, `Hero`, `Footer`.
- Produces: Portada `Home` actualizada y ruta `/museo` activa en `src/App.tsx`; barra `Navbar` oculta en `/museo`.

- [ ] **Step 1: Integrar `ProjectFrameworkTabs.tsx`, `hero.tsx`, `how-it-works.tsx`, `proposal.tsx`, `scanner-cta.tsx`, `footer.tsx`, `PerformanceOptimizer.tsx` y `wasteData.ts` desde `ReCiclo-version-1`**
  Run: `cp ../ReCiclo-version-1/ReCiclo-version-1/src/components/ProjectFrameworkTabs.tsx ../ReCiclo-version-1/ReCiclo-version-1/src/components/footer.tsx ../ReCiclo-version-1/ReCiclo-version-1/src/components/PerformanceOptimizer.tsx src/components/ && cp ../ReCiclo-version-1/ReCiclo-version-1/src/sections/hero.tsx ../ReCiclo-version-1/ReCiclo-version-1/src/sections/how-it-works.tsx ../ReCiclo-version-1/ReCiclo-version-1/src/sections/proposal.tsx ../ReCiclo-version-1/ReCiclo-version-1/src/sections/scanner-cta.tsx src/sections/ && cp ../ReCiclo-version-1/ReCiclo-version-1/src/data/wasteData.ts src/data/`

- [ ] **Step 2: Actualizar `src/components/navbar.tsx` y `src/App.tsx`**
  - En `src/components/navbar.tsx`: conservar íntegra la versión de la v2 y añadir `|| location.pathname === "/museo"` en la guarda de retorno temprano (`if (location.pathname === "/login" || location.pathname === "/registro" || location.pathname === "/museo") return null;`).
  - En `src/App.tsx`: actualizar `Home` para renderizar `Hero`, `HowItWorks`, `CampusShowcase`, `ProjectFrameworkTabs`, `MuseumTeaser`, `ScannerCTA` y `Footer`, y registrar la ruta diferida `<Route path="/museo" element={<Museo />} />`.

- [ ] **Step 3: Ejecutar compilación completa y linter para verificar la integración**
  Run: `npm run build && npm run lint`
  Expected: Compilación de TypeScript y Vite exitosa (`dist/` generado sin errores) y linter limpio.
