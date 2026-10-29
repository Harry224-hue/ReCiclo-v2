/**
 * Rutas de assets públicos resueltas con `import.meta.env.BASE_URL`.
 *
 * Con `base: './'` esto devuelve rutas relativas ("./logo.svg") que funcionan en los
 * tres destinos del proyecto:
 *  - Navegador / Vercel (BrowserRouter)
 *  - Capacitor Android (https://localhost)
 *  - Electron (file://, donde una ruta absoluta "/logo.svg" apuntaría a la raíz del disco
 *    y rompería el logo/favicon/poster del .exe).
 *
 * No usar rutas absolutas "/..." en `src`/`public`: Vite NO las reescribe.
 */
const BASE = import.meta.env.BASE_URL;

export const LOGO_LIGHT = `${BASE}logo.svg`;
export const LOGO_DARK = `${BASE}logo-dark.svg`;
export const FAVICON = `${BASE}favicon.svg`;
export const HERO_POSTER = `${BASE}hero-image.png`;

/** Capturas del museo de versiones (WebP recomprimido a 1200 px de ancho). */
export const MUSEUM_BASE = `${BASE}museo/`;
