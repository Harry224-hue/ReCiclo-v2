/**
 * Rutas de assets públicos resueltas con `import.meta.env.BASE_URL`.
 *
 * Con `base: './'` esto devuelve rutas relativas ("./logo.svg") que funcionan correctamente
 * tanto en local como en producción (Vercel, GitHub Pages o cualquier hosting estático).
 *
 * No usar rutas absolutas "/..." en `src`/`public`: Vite NO las reescribe.
 */
const BASE = import.meta.env.BASE_URL;

export const LOGO_LIGHT = `${BASE}logo.svg`;
export const LOGO_DARK = `${BASE}logo-dark.svg`;
export const FAVICON = `${BASE}favicon.svg`;
export const HERO_POSTER = `${BASE}hero-image.png`;
