# Documento de Diseño: Modernización del Escáner ReCiclo (Groq Vision + Código de Barras + Sincronización de Cuenta)

**Fecha:** 2026-11-02  
**Estado:** Aprobación pendiente del usuario  
**Ubicación:** `docs/superpowers/specs/2026-11-02-escaner-alternativas-historial-design.md`

---

## 1. Intent y Propósito (Why)
Permitir a los estudiantes del Instituto Tecnológico de Morelia (ITM) clasificar residuos de manera precisa, rápida y sin costo de APIs de pago (eliminando la dependencia de Gemini de pago). Ofrecer una experiencia intuitiva que guíe al usuario en su primera visita mediante un carrusel onboarding, incorpore un lector de códigos de barras (Open Food Facts) junto a visión artificial gratuita (Groq Cloud Vision), y gestione el historial de escaneos de forma transparente (sincronizado a la cuenta o claramente identificado como local en modo invitado).

---

## 2. Metas, No-Metas y Anti-Metas

### Metas (Goals)
1. **Cero costo en visión IA:** Sustituir la función serverless de Gemini por Groq Cloud Vision (`llama-3.2-11b-vision-preview`), utilizando su capa gratuita de alta velocidad sin tarjeta de crédito.
2. **Escaneo de código de barras determinista:** Integrar lectura de códigos de barras comerciales mediante un selector de modo dedicado (`[📸 Foto con IA]` / `[🏷️ Código de barras]`) y consulta libre a Open Food Facts.
3. **Onboarding ilustrado en carrusel:** Desplegar una tarjeta/modal interactivo en la primera visita al escáner explicando ambas opciones (foto vs. código), con opción de reabrirlo mediante un botón de ayuda `?`.
4. **Sincronización de cuenta y aviso de invitado:**
   - **Con sesión (`user?.uid`):** Guardar en Firestore (`scans`), leer y sincronizar en `Historial.tsx`.
   - **Sin sesión (Invitado):** Guardar en `localStorage` y mostrar un banner destacado informando que el historial solo reside en este dispositivo, con botón para iniciar sesión o registrarse.
   - **Reconciliación al iniciar sesión:** Al iniciar sesión o registrarse, migrar automáticamente los escaneos locales a Firestore sin perder registros.
   - **Limpieza en cierre de sesión:** Al cerrar sesión, limpiar la memoria local para proteger la privacidad en equipos compartidos del campus.
   - **Vaciar historial:** Eliminar los registros correspondientes en Firestore preservando intacto el nivel y experiencia (`UserProgress`).

### No-Metas (Non-Goals)
- No se implementarán microtransacciones ni gamificación con recompensas monetarias.
- No se creará una base de datos propia de códigos comerciales; se utilizará la infraestructura libre de Open Food Facts.

### Anti-Metas (Anti-Goals)
- No romper la funcionalidad sin conexión: `MobileNet` se mantiene como fallback local automático si falla la red.
- No bloquear el escáner si el usuario no tiene cuenta; los invitados pueden escanear sin restricciones.
- No solicitar tarjetas de crédito ni servicios de cobro en ninguna capa de la aplicación.

---

## 3. Decisiones de Interacción y Arquitectura (Resumen de Acuerdos)

### A. Selector de Modo en el Escáner (`Escanear.tsx`)
- En lugar de un detector pasivo que interrumpa la toma de fotografías, la barra inferior del visor contará con un selector estilo pestañas segmentadas:
  - `[📸 Foto con IA]`: Activa el botón de obturador para capturar la imagen y enviarla a Groq Vision (ideal para orgánicos, unicel, servilletas, botellas sin etiqueta).
  - `[🏷️ Código de barras]`: Muestra una retícula de enfoque para código de barras, activa la lectura continua con `BarcodeDetector` / polyfill y consulta instantáneamente Open Food Facts al detectarlo.

### B. Onboarding con Carrusel (`ScannerOnboardingModal.tsx`)
- Se activa automáticamente la primera vez que se visita `/escanear` (controlado con la clave `reciclo_scanner_onboarding_v1` en `localStorage`).
- **Slide 1 - Foto con IA:** "Toma foto a cualquier residuo: vasos, cáscaras, papel o platos. Nuestra IA gratuita identifica el material y su bote correcto."
- **Slide 2 - Código de barras:** "Escanea el código de productos comerciales (refrescos, frituras, lácteos) para una clasificación instantánea y exacta con Open Food Facts."
- **Slide 3 - Los 5 Contenedores del ITM:** "Verde (Orgánicos), Azul (Plásticos rígidos), Amarillo (Aluminio/Cartón), Negro (No reciclables) y Naranja (Pilas/Especiales)."
- Botón principal: *"¡Entendido, empezar a escanear!"*.
- Botón circular `?` en el encabezado del visor para volver a consultar la guía en cualquier momento.

### C. Backend de Visión (`api/scan.js` / Groq Cloud Vision)
- Endpoint serverless Vercel que recibe la imagen en Base64.
- Conexión a la API de Groq (`https://api.groq.com/openai/v1/chat/completions`) usando el modelo `llama-3.2-11b-vision-preview` o similar gratuito.
- Mantiene la especificación JSON estructurada con los 5 botes oficiales del IT Morelia (`bin-verde`, `bin-azul`, `bin-amarillo`, `bin-negro`, `bin-pilas`), pasos de preparación y tiempo de degradación.
- Variable de entorno en Vercel: `GROQ_API_KEY`.

### D. Servicio de Código de Barras y Empaques (`src/services/barcodeClassifier.ts`)
- Consulta `https://world.openfoodfacts.org/api/v2/product/${code}.json`.
- Mapeo inteligente a los contenedores del ITM:
  - Si el empaque especifica PET, PEAD o plástico rígido -> Bote Azul (`bin-azul`).
  - Si especifica lata, aluminio, cartón limpio -> Bote Amarillo (`bin-amarillo`).
  - Si especifica unicel, envoltura metalizada (BOPP) o bolsa de frituras -> Bote Negro (`bin-negro`).
  - Heurística de respaldo: Si Open Food Facts no detalla el material del empaque pero contiene palabras clave ("refresco", "galletas", "agua"), deduce el contenedor habitual y muestra un botón para *"Verificar con foto IA"* si el alumno desea confirmación visual.
  - Si el código no existe en Open Food Facts: Notificación clara *"Código no encontrado en el catálogo. Toma una foto para identificarlo con IA"*.

### E. Historial de Escaneos y Autenticación (`Historial.tsx` y `Escanear.tsx`)
1. **Guardado en escaneo:**
   - Si `user?.uid`: se registra en Firestore (`addScan`) y en caché local.
   - Si invitado: se registra solo en `localStorage` (`historyStorage`).
   - El panel de resultados (`ScanResultPanel.tsx`) muestra un badge discreto: *"Guardado en tu cuenta"* o *"Guardado localmente (Sin sesión)"*.
2. **Vista de Historial (`Historial.tsx`):**
   - Si hay sesión: descarga y muestra los escaneos de Firestore mediante `getUserScans(user.uid)`.
   - Si NO hay sesión: muestra los registros locales acompañados de un banner visible:
     > 💡 **Historial local en este dispositivo:** Inicia sesión o regístrate para respaldar tus consultas en la nube y sincronizarlas entre tus dispositivos. [Iniciar Sesión](/login).
3. **Reconciliación y privacidad:**
   - Al iniciar sesión/registrarse: función de sincronización que sube los escaneos locales pendientes a Firestore.
   - Al cerrar sesión: limpia el historial local en el navegador para evitar cruce de datos en computadoras compartidas del campus.
   - Al vaciar historial: elimina los documentos en Firestore si está autenticado, conservando el nivel y experiencia acumulados.

---

## 4. Archivos a Modificar / Crear
1. `api/groq.js` (o actualización de `api/gemini.js` a `api/scan.js`)
2. `src/services/groqClassifier.ts` (reemplazo del cliente de Gemini)
3. `src/services/barcodeClassifier.ts` (cliente de Open Food Facts y mapeo al ITM)
4. `src/components/scanner/ScannerOnboardingModal.tsx` (nuevo carrusel ilustrado)
5. `src/pages/Escanear.tsx` (selector de modo `Foto / Código`, integración de BarcodeDetector y Groq)
6. `src/components/scanner/ScanResultPanel.tsx` (badges de origen y estado de guardado)
7. `src/pages/Historial.tsx` (lectura desde Firestore para usuarios autenticados + banner para invitados)
8. `src/context/AuthContext.tsx` (reconciliación de escaneos al autenticarse y limpieza al salir)
