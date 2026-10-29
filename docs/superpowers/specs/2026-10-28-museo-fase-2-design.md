# Diseño del Proyecto: ReCiclo Fase 2 del Museo (v2.0 a v2.9)

## 1. Intención y Por Qué
El Museo de ReCiclo se concibió como un archivo visual e interactivo para evidenciar el proceso real y progresivo de desarrollo del proyecto en el Instituto Tecnológico de Morelia. Hasta ahora, el museo abarca la **Fase 0 (v0.0–v0.9)** y la **Fase 1 (v1.0–v1.9)**, sumando 20 versiones.

El objetivo de este proyecto es incorporar la **Fase 2 (v2.0 a v2.9)** para documentar de forma fidedigna la evolución de la **Versión 2** realizada durante octubre de 2026: la transición hacia una arquitectura Web pura (sin dependencias de Electron ni Android/Capacitor), integración continua con GitHub Actions, despliegue serverless en Vercel con protección de API para Gemini, modularización del Perfil y Ajustes, fundamentación académica de Tecnologías e Impacto, y resiliencia ante bloqueadores de red, completando una suite histórica de **30 versiones**.

---

## 2. Metas, No-Metas y Anti-Metas

### Metas
1. **Catálogo Museográfico de la Fase 2 (10 versiones):** Incorporar las cédulas de `v2.0` a `v2.9` en [`src/data/museum.ts`](file:///home/juanpa/Documentos/ReCiclo-versión-de-pruebas-v2/src/data/museum.ts) con tipado ampliado `phase: "v0" | "v1" | "v2"`, fechas reales de octubre de 2026, títulos, justificaciones metodológicas ("por qué"), adiciones, retiros e insignias.
2. **Interfaz del Museo Actualizada (`/museo`):** Adaptar [`src/pages/Museo.tsx`](file:///home/juanpa/Documentos/ReCiclo-versión-de-pruebas-v2/src/pages/Museo.tsx) con el filtro `SeriesFilter` soportando `"v2"`, pestaña de filtro para "Fase 2 (v2.0 - v2.9)", actualizar contador a 30 versiones y mantener navegación fluida entre emuladores.
3. **Directorio Unificado `versiones/` con las 30 Versiones (`v0.0` a `v2.9`):** Estructurar en la raíz la carpeta `versiones/` con todas las entregas históricas (`v0.0` a `v0.9`, `v1.0` a `v1.9` y `v2.0` a `v2.9`), cada una con su `EVIDENCIA_VERSION.md`, archivos fuente representativos de su hito y `README.md` global integrador, excluyendo carpetas pesadas `node_modules` para optimizar el almacenamiento.
4. **Bundles Servidos en Emulador (`public/emulador/v2.0` a `v2.9`):** Compilar y publicar cada versión en `public/emulador/v2.x/index.html` con HashRouter y base relativa `./`, permitiendo probar de manera interactiva cada entrega dentro de `Emulator.tsx` y su sandbox (`museum-sandbox.js`), excluyendo la duplicación recursiva de la carpeta `public/emulador/`.
5. **Capturas de Pantalla Reales (`public/museo/` y `public/capturas/`):** Generar y disponer de capturas de escritorio (`v2.x.webp` / `v2.x.png`) y móviles (`v2.x-mobile.png`) para cada una de las 10 versiones.
6. **Documentación Institucional y Académica:** Actualizar [`HISTORIAL_VERSIONES.md`](file:///home/juanpa/Documentos/ReCiclo-versión-de-pruebas-v2/HISTORIAL_VERSIONES.md) y [`BITACORA_RECICLO.md`](file:///home/juanpa/Documentos/ReCiclo-versión-de-pruebas-v2/BITACORA_RECICLO.md) para registrar los sprints de la Fase 2 con congruencia temporal (18 al 28 de octubre de 2026).

### No-Metas
- No alterar ni degradar las funcionalidades avanzadas de la versión de producción actual (como escáner asistido por IA, mapa interactivo Leaflet ni autenticación Firebase).
- No añadir paquetes o dependencias nativas al `package.json` raíz.
- No duplicar carpetas pesadas `node_modules` dentro de `versiones/v2.x/` (usan la instalación del proyecto raíz o symlink temporal durante compilación).
- No migrar las subcarpetas de código fuente de las Fases 0 y 1 a la raíz de este repositorio (permanecen en sus repositorios dedicados `ReCiclo-versión-0` y `ReCiclo-version-1`).

### Anti-Metas
- No mostrar enlaces rotos o emuladores con pantalla en blanco al abrir versiones v2 en el museo.
- No usar datos ni fechas inventadas que contradigan el historial verídico de Git ni las normas del IT Morelia.
- No incurrir en dependencias recursivas (anidar 1.2 GB de `public/emulador/` dentro de los bundles de `v2.8` o `v2.9`).

---

## 3. Restricciones Técnicas y de Entorno
- **Navegador y Sandbox:** Los emuladores se ejecutan en un `iframe` dentro de `Emulator.tsx`. Las versiones deben usar `HashRouter` y rutas relativas para no colisionar con el enrutamiento de la aplicación principal ni con `localStorage`.
- **Compatibilidad con TypeScript:** La propiedad `phase` de `MuseumVersion` debe ampliarse a `"v0" | "v1" | "v2"` sin generar errores de tipo en componentes consumidores (`Museo.tsx`, `VersionFrame.tsx`, etc.).
- **Diseño Editorial Anti-slop:** Mantener el lenguaje humano y directo de las cédulas del museo (tres preguntas clave: qué se agregó, qué se quitó y por qué), sin tecnicismos innecesarios ni texto de relleno.

---

## 4. Enfoques Considerados y Selección

### Enfoque A — Paridad total con código fuente y emuladores (Seleccionado por el usuario)
- Se crea la carpeta `versiones/v2.0` a `versiones/v2.9` con `EVIDENCIA_VERSION.md` y código fuente representativo.
- Se compilan los 10 bundles interactivos para `public/emulador/v2.x/`.
- Se generan las capturas para `public/museo/` y `public/capturas/`.
- Se actualizan [`src/data/museum.ts`](file:///home/juanpa/Documentos/ReCiclo-versión-de-pruebas-v2/src/data/museum.ts), [`src/pages/Museo.tsx`](file:///home/juanpa/Documentos/ReCiclo-versión-de-pruebas-v2/src/pages/Museo.tsx), [`HISTORIAL_VERSIONES.md`](file:///home/juanpa/Documentos/ReCiclo-versión-de-pruebas-v2/HISTORIAL_VERSIONES.md) y [`BITACORA_RECICLO.md`](file:///home/juanpa/Documentos/ReCiclo-versión-de-pruebas-v2/BITACORA_RECICLO.md).
- *Motivo de selección:* Proporciona evidencia total y tangible del progreso técnico; cualquier usuario puede interactuar con el emulador y revisar el código fuente de cada versión, manteniendo la misma calidad metodológica de las Fases 0 y 1.

### Enfoque B — Evidencia centrada en el Museo sin subcarpetas de código fuente (Descartado)
- Solo creaba los bundles en `public/emulador/v2.x/` y las cédulas sin la estructura `versiones/v2.x/`.
- *Motivo de descarte:* Menor rigurosidad para auditorías de código y falta de paridad con los repositorios v0 y v1.

---

## 5. Cronograma y Mapeo Cronológico Estricto de Git (Hitos Fase 2)

Para garantizar total fidelidad histórica y evitar regresiones o parches sintéticos entre emuladores, la secuencia se alinea con el orden cronológico real de los commits de Git:

| Versión | Commit Ref | Fecha | Hito Principal | Alcance Técnico / Metodológico |
| :---: | :---: | :---: | :--- | :--- |
| **v2.0** | `2bcb5af` | 18 de octubre | **Arquitectura Web Pura e Integración Continua** | Eliminación de dependencias de Electron y Android/Capacitor; pipeline CI con GitHub Actions; insignia oficial v2.0 en navbar. |
| **v2.1** | `8fb7f11` | 18 de octubre | **Arquitectura Cloud y Serverless** | Despliegue en Vercel, configuración de SPA rewrites y endpoint serverless `api/gemini.js` para resguardo de llaves. |
| **v2.2** | `95f56e8` | 21 de octubre (12:06) | **Seguridad y Validación Estudiantil** | Validación estricta de matrícula institucional del IT Morelia y control de estados de autenticación con Firebase. |
| **v2.3** | `9eda85d` | 21 de octubre (21:50) | **Interfaz Adaptativa e Isla Dinámica** | Implementación de `NotchIsland.tsx`, controles de visualización, gestión de estado de temas y accesibilidad. |
| **v2.4** | `51c86e0` | 21 de octubre (23:08) | **Modularización de Ajustes y Perfil** | Separación modular en `ProfileHistoryAndResources.tsx` y `SettingsSecondaryTabs.tsx` para optimizar mantenibilidad. |
| **v2.5** | `4d81f97` | 21 de octubre (23:23) | **Fundamentación Ambiental y Guía Operativa** | Rediseño profundo de `/como-funciona` e `/impacto` con métricas verificadas y pautas de acondicionamiento físico. |
| **v2.6** | `c3de19d` | 22 de octubre (01:34) | **Catálogo de Tecnologías Institucionales** | Creación de `techCategories.ts` con clasificación en 6 capas: IA, Frontend, Backend, Datos, Mapas y Normativa. |
| **v2.7** | `17fcdec` | 22 de octubre (02:44) | **Historial Estudiantil y Métricas de Logro** | Panel de estadísticas de reciclaje, rachas, medallas de logro y persistencia en Cloud Firestore. |
| **v2.8** | `aa4a4cb` | 28 de octubre (12:15) | **El Museo de la Evolución y Marco Institucional** | Incorporación de la exhibición interactiva con emuladores sandbox de 20 versiones y pestañas `ProjectFrameworkTabs`. |
| **v2.9** | `4e213dd` | 28 de octubre (12:22) | **Consolidación de Producción y Resiliencia** | Protección contra bloqueadores de red (GTM/Firebase), suite histórica de 30 versiones y optimización de rendimiento. |

---

## 6. Decisiones Técnicas del Constructor (Builder's Calls)
1. **Alineación Cronológica Directa de Git:** Se utiliza la secuencia cronológica exacta de los commits (Sección 5), asegurando que cada versión extraída sea 100% auténtica y acumulativa, sin discrepancias temporales ni regresiones entre saltos de versión.
2. **Estructura de `versiones/v2.x/`:** Cada carpeta contendrá su `package.json` ligero (apuntando a dependencias del raíz), `index.html`, `vite.config.ts`, `src/` y `EVIDENCIA_VERSION.md`. Se mantendrán scripts en el `package.json` raíz (`npm run v2.0` ... `npm run v2.9`) para ejecución directa opcional.
3. **Exclusión de Recursividad en Bundles:** El script de compilación (`scripts/build-museum-v2.mjs`) excluirá explícitamente `public/emulador/` al empaquetar `v2.8` y `v2.9`, evitando que los 1.2 GB de emuladores previos se dupliquen dentro de sí mismos. `v2.9` se compila al final una vez catalogada la suite de 30 versiones.
4. **Ámbito de `versiones/`:** La carpeta `versiones/` alojará las 30 entregas completas del proyecto: `v0.0`–`v0.9` (importadas desde ReCiclo-versión-0), `v1.0`–`v1.9` (importadas desde ReCiclo-version-1) y `v2.0`–`v2.9` (generadas en esta fase), manteniendo el repositorio 100% autocontenido en código fuente y alineado con la propiedad `runPath: "versiones/${id}/"` del catálogo.
