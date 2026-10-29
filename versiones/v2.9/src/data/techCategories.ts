import {
  Code2,
  Brain,
  Smartphone,
  Boxes,
  Compass,
  Server,
  Scale,
  GraduationCap,
} from "lucide-react";

export interface TechItem {
  name: string;
  category: string;
  badge: string;
  description: string;
  usedFor: string;
  url: string;
  urlLabel: string;
}

export interface TechSection {
  id: string;
  title: string;
  shortTitle: string;
  icon: typeof Code2;
  description: string;
  items: TechItem[];
}

export const TECH_CATEGORIES: TechSection[] = [
  {
    id: "core",
    title: "Arquitectura Frontend y Compilación (Core)",
    shortTitle: "Vite & Frontend",
    icon: Code2,
    description:
      "Herramientas base con las que se desarrolla, tipa, estiliza y empaqueta toda la aplicación web.",
    items: [
      {
        name: "Vite 8.3 + @vitejs/plugin-react",
        category: "Empaquetador y Servidor de Desarrollo",
        badge: "Vite v8.3.5",
        description:
          "Herramienta de compilación frontend de última generación basada en módulos ES nativos (ESM) para desarrollo instantáneo con Hot Module Replacement (HMR) y empaquetado ultra rápido de producción con Rolldown.",
        usedFor:
          "Motor central de desarrollo (`npm run dev`) y compilación (`vite build`). Configurado en `vite.config.ts` para integrar el compilador de React (`@vitejs/plugin-react` v6) y el plugin nativo de Tailwind CSS v4, compilando la aplicación en menos de 2 segundos con división de código (*code-splitting*) automática.",
        url: "https://vite.dev/",
        urlLabel: "vite.dev",
      },
      {
        name: "React 19 (react & react-dom)",
        category: "Biblioteca de Interfaz de Usuario",
        badge: "React v19.3.1",
        description:
          "Biblioteca declarativa basada en componentes y Hooks para construir interfaces reactivas de una sola página (SPA) con renderizado concurrente y carga diferida de módulos.",
        usedFor:
          "Construcción de todas las vistas y componentes interactivos del proyecto, gestión de los contextos globales (`ThemeContext.tsx` para temas, acentos y modo ligero; `AuthContext.tsx` para sesión de usuario) y carga bajo demanda mediante `React.lazy()` y `Suspense` en `src/App.tsx`.",
        url: "https://react.dev/",
        urlLabel: "react.dev",
      },
      {
        name: "TypeScript 5.7",
        category: "Tipado Estático y Contratos de Datos",
        badge: "TypeScript v5.7.3",
        description:
          "Superset tipado de JavaScript que valida en tiempo de compilación (`tsc -b`) las interfaces, propiedades de componentes y estructuras de datos para evitar errores en tiempo de ejecución.",
        usedFor:
          "Tipado estricto del catálogo de residuos (`WasteItem`, `CampusContainerSpec`, `CampusDisposalPoint` en `src/data/wasteData.ts`), del esquema de respuestas del clasificador (`GeminiVisionResponse`, `AIClassificationResult`), de los tokens de tema (`AccentTokens`) y del perfil en Firestore (`UserProfile`).",
        url: "https://www.typescriptlang.org/",
        urlLabel: "typescriptlang.org",
      },
      {
        name: "Tailwind CSS v4 + @tailwindcss/vite",
        category: "Sistema de Diseño y Estilos CSS",
        badge: "Tailwind v4.3.3",
        description:
          "Framework CSS de utilidades de cuarta generación integrado directamente en el pipeline de Vite, con soporte nativo para variables CSS dinámicas, modo oscuro y diseño adaptable.",
        usedFor:
          "Maquetación responsiva de toda la plataforma, implementación de los tres niveles de acabado visual (*Sólido*, *Cristal Ligero* y *Cristal Intenso* con `backdrop-blur`), soporte de modo claro/oscuro (`.dark`) e inyección reactiva de variables de color (`--accent-color`, `--accent-glow`).",
        url: "https://tailwindcss.com/",
        urlLabel: "tailwindcss.com",
      },
      {
        name: "React Router DOM v7",
        category: "Enrutamiento del Lado del Cliente",
        badge: "React Router v7.18.4",
        description:
          "Enrutador declarativo para aplicaciones React que sincroniza la interfaz con la URL del navegador sin recargar el documento completo.",
        usedFor:
          "Navegación entre las rutas del sistema (`/`, `/escanear`, `/mapa`, `/historial`, `/perfil`, `/impacto`, `/como-funciona`, `/tecnologias`, `/login`, `/registro`) en `src/App.tsx`, redirecciones programáticas con `useNavigate` y resaltado de ruta activa con `useLocation` en el `Navbar` y `NotchIsland`.",
        url: "https://reactrouter.com/",
        urlLabel: "reactrouter.com",
      },
      {
        name: "Google Fonts (Urbanist y Geist)",
        category: "Tipografía Web y Cifras Tabulares",
        badge: "Google Fonts CSS2",
        description:
          "Servicio de distribución tipográfica de Google que entrega fuentes variables optimizadas en formato WOFF2.",
        usedFor:
          "Importadas en `src/index.css` para definir la identidad visual de ReCiclo: `Urbanist` en encabezados principales y títulos de tarjetas, y `Geist` en párrafos técnicos, etiquetas de contenedores y contadores con alineación numérica (`tabular-nums`).",
        url: "https://fonts.google.com/",
        urlLabel: "fonts.google.com",
      },
    ],
  },
  {
    id: "ai",
    title: "Inteligencia Artificial y Visión por Computadora",
    shortTitle: "IA & Visión",
    icon: Brain,
    description:
      "Modelos de reconocimiento visual y procesamiento de imagen utilizados en el módulo de escaneo de residuos.",
    items: [
      {
        name: "Google Gemini 2.5 Flash API",
        category: "Visión Multimodal en la Nube",
        badge: "gemini-2.5-flash",
        description:
          "Modelo generativo multimodal de Google capaz de analizar fotografías reales y responder bajo un esquema JSON estructurado (`responseSchema`) con baja latencia.",
        usedFor:
          "Motor principal de clasificación en `api/gemini.js` y `src/services/geminiClassifier.ts`. Analiza la imagen capturada en `Escanear.tsx`, identifica el producto y marca (ej. botella de Coca-Cola, vaso Maruchan, bolsa Sabritas), determina el material técnico, asigna uno de los 5 contenedores oficiales del IT Morelia y genera los pasos de preparación.",
        url: "https://ai.google.dev/gemini-api/docs",
        urlLabel: "ai.google.dev",
      },
      {
        name: "TensorFlow.js",
        category: "Inferencia de Machine Learning en Navegador",
        badge: "@tensorflow/tfjs v4.22.0",
        description:
          "Biblioteca de aprendizaje automático de Google para ejecutar modelos de redes neuronales directamente en el navegador del usuario mediante aceleración WebGL o CPU.",
        usedFor:
          "Integrado en `src/services/aiClassifier.ts` como motor de respaldo en línea cuando la API de Gemini no tiene clave configurada en el entorno o alcanza su límite de peticiones, permitiendo seguir ejecutando inferencia visual desde el navegador.",
        url: "https://www.tensorflow.org/js",
        urlLabel: "tensorflow.org/js",
      },
      {
        name: "MobileNet v2 (ImageNet)",
        category: "Red Neuronal Convolucional de Respaldo",
        badge: "@tensorflow-models/mobilenet v2.1.1",
        description:
          "Arquitectura de visión artificial ligera preentrenada con el catálogo ImageNet (configurada en versión 2 con `alpha: 1.0`), cuyos pesos se descargan bajo demanda en el navegador.",
        usedFor:
          "En `src/services/aiClassifier.ts` (`loadVisionModel` y `classifyWasteImage`), evalúa el elemento `HTMLImageElement` del escáner y cruza las etiquetas detectadas mediante una tabla de mapeo semántico (`KEYWORD_MAPPINGS`) con los residuos documentados en `WASTE_DATABASE`.",
        url: "https://github.com/tensorflow/tfjs-models/tree/master/mobilenet",
        urlLabel: "github.com/tensorflow/tfjs-models",
      },
      {
        name: "HTML5 Canvas 2D API",
        category: "Preprocesamiento y Compresión de Imagen",
        badge: "Web Canvas 2D",
        description:
          "API nativa del estándar HTML5 para manipulación, redimensionado y recorte de imágenes en memoria antes de su transmisión o almacenamiento.",
        usedFor:
          "Utilizada en `downscaleToBase64()` (`src/services/geminiClassifier.ts`) para escalar las fotos de la cámara a un máximo de 800 px en JPEG (`0.85`) y reducir el consumo de datos al llamar a `/api/gemini`, así como en `fileToAvatar()` (`ProfileHistoryAndResources.tsx`) para recortar las fotos de perfil a un cuadrado de `256×256 px` compatible con el límite de Firestore.",
        url: "https://developer.mozilla.org/es/docs/Web/API/Canvas_API",
        urlLabel: "developer.mozilla.org",
      },
    ],
  },
  {
    id: "mobile",
    title: "APIs Web en Dispositivos Móviles y Rendimiento",
    shortTitle: "Mobile & APIs Web",
    icon: Smartphone,
    description:
      "Interfaces del navegador y optimizaciones de hardware empleadas para el uso en teléfonos dentro del campus (con conexión a internet activa).",
    items: [
      {
        name: "MediaDevices getUserMedia() API",
        category: "Captura de Cámara en Tiempo Real",
        badge: "W3C MediaDevices",
        description:
          "Interfaz estándar del navegador que permite solicitar acceso seguro al flujo de video de las cámaras integradas en teléfonos y computadoras.",
        usedFor:
          "Implementada en `src/pages/Escanear.tsx` con el parámetro `{ video: { facingMode: 'environment' } }` para activar directamente la cámara trasera del celular en el visor interactivo y capturar fotografías del residuo sin salir de la aplicación.",
        url: "https://developer.mozilla.org/es/docs/Web/API/MediaDevices/getUserMedia",
        urlLabel: "developer.mozilla.org",
      },
      {
        name: "Geolocation API (navigator.geolocation)",
        category: "Posicionamiento GPS en Campus",
        badge: "W3C Geolocation",
        description:
          "API web que obtiene las coordenadas geográficas (latitud, longitud y radio de precisión en metros) del dispositivo cuando el usuario lo autoriza.",
        usedFor:
          "Utilizada en `src/pages/Mapa.tsx` para ubicar al estudiante dentro de Campus 1 o Campus 2, comprobar si está dentro del polígono del Instituto y calcular mediante distancia geodésica cuál es la estación de contenedores más cercana a su posición.",
        url: "https://developer.mozilla.org/es/docs/Web/API/Geolocation_API",
        urlLabel: "developer.mozilla.org",
      },
      {
        name: "Web Storage API (window.localStorage)",
        category: "Persistencia de Preferencias e Historial",
        badge: "HTML5 Web Storage",
        description:
          "Almacenamiento clave-valor persistente en el navegador del dispositivo que conserva la información entre sesiones sin requerir cuenta en servidor.",
        usedFor:
          "En `src/data/historyStorage.ts` (`reciclo_scan_history_v1`) guarda hasta 50 clasificaciones recientes; en `ThemeContext.tsx` persiste el tema visual, color hexadecimal y accesos del `NotchIsland`; y en `Perfil.tsx` almacena los datos académicos y campus preferido (`reciclo_pref_campus`).",
        url: "https://developer.mozilla.org/es/docs/Web/API/Window/localStorage",
        urlLabel: "developer.mozilla.org",
      },
      {
        name: "Interfaz Móvil Adaptativa (NotchIsland y Dock)",
        category: "Ergonomía Táctil Mobile-First",
        badge: "Responsive Touch UI",
        description:
          "Arquitectura de navegación adaptativa configurada con `viewport-fit=cover` en `index.html` para ajustarse a pantallas móviles modernas.",
        usedFor:
          "En pantallas móviles (`< 768px`), `src/components/navbar.tsx` y `src/components/NotchIsland.tsx` reemplazan el menú de escritorio por una barra inferior de 5 secciones operable con el pulgar y una isla superior personalizable con atajos directos al escáner, mapa, tecnologías, tema y ajustes.",
        url: "https://developer.mozilla.org/es/docs/Web/CSS/@media",
        urlLabel: "developer.mozilla.org",
      },
      {
        name: "Detección de Capacidad del Dispositivo (PerformanceOptimizer)",
        category: "Adaptación Automática de Rendimiento",
        badge: "Navigator Hardware APIs",
        description:
          "Consulta de memoria RAM (`navigator.deviceMemory`), núcleos de CPU (`navigator.hardwareConcurrency`), ahorro de datos (`navigator.connection`) y preferencia de movimiento reducido (`prefers-reduced-motion`).",
        usedFor:
          "Implementada en `src/components/PerformanceOptimizer.tsx` y `ThemeContext.tsx` para activar automáticamente el *Modo Ligero* en teléfonos de gama de entrada, sustituyendo desenfoques pesados (`backdrop-blur`) por fondos sólidos y pausando videos de fondo para ahorrar batería.",
        url: "https://developer.mozilla.org/es/docs/Web/API/Navigator",
        urlLabel: "developer.mozilla.org",
      },
    ],
  },
  {
    id: "graphics",
    title: "Animación, Física 2D e Interacción Visual",
    shortTitle: "Física & Gráficos",
    icon: Boxes,
    description:
      "Bibliotecas encargadas del motor físico interactivo, transiciones de interfaz, iconografía vectorial y personalización cromática.",
    items: [
      {
        name: "Framer Motion 12 (framer-motion & motion)",
        category: "Motor de Animaciones Declarativas",
        badge: "Framer Motion v12.43.0",
        description:
          "Biblioteca de animación y gestos para React basada en física de resortes (*springs*), transiciones de layout y montaje condicional (`AnimatePresence`).",
        usedFor:
          "Animaciones de entrada en las secciones de inicio, transiciones entre pestañas en `settings-modal.tsx`, desplegado de preguntas frecuentes en `ComoFunciona.tsx`, superposición de bienvenida en `AuthSuccessOverlay.tsx` y desactivación automática de movimiento con `useReducedMotion()`.",
        url: "https://motion.dev/",
        urlLabel: "motion.dev",
      },
      {
        name: "Matter.js",
        category: "Motor de Física de Cuerpos Rígidos 2D",
        badge: "matter-js v0.20.0",
        description:
          "Motor de física bidimensional en JavaScript que calcula gravedad, colisiones de polígonos, fricción, rebote y restricciones de arrastre con el puntero.",
        usedFor:
          "Utilizado para simular la caída interactiva y colisión de residuos dentro de las tarjetas visuales de la página principal, permitiendo que el usuario interactúe con los elementos en pantalla.",
        url: "https://brm.io/matter-js/",
        urlLabel: "brm.io/matter-js",
      },
      {
        name: "Lenis Smooth Scroll",
        category: "Desplazamiento Inercial Sincronizado",
        badge: "lenis v1.3.27",
        description:
          "Biblioteca ligera que normaliza el desplazamiento vertical con interpolación suave sincronizada al ciclo de refresco (`requestAnimationFrame`).",
        usedFor:
          "Integrada en `src/components/lenis-scroll.tsx` para suavizar el recorrido de lectura en la página de inicio y acompañar el efecto de paralaje en `SectionParallax.tsx`, excluyendo modales y mapas mediante el atributo `data-lenis-prevent`.",
        url: "https://lenis.darkroom.engineering/",
        urlLabel: "lenis.darkroom.engineering",
      },
      {
        name: "Lucide React + React Icons (Remix Icons)",
        category: "Sistemas de Iconografía Vectorial SVG",
        badge: "lucide-react v1.61.0",
        description:
          "Bibliotecas de iconos vectoriales modulares con soporte de *tree-shaking* para incluir en el paquete final únicamente los iconos utilizados.",
        usedFor:
          "`lucide-react` provee los iconos técnicos y de interfaz en todas las páginas (cámara, contenedores, filtros, alertas normativas), mientras que `react-icons/ri` suministra los pares de iconos de contorno y relleno para el dock móvil en `src/components/navbar.tsx`.",
        url: "https://lucide.dev/",
        urlLabel: "lucide.dev",
      },
      {
        name: "React Color Wheel (@uiw/react-color-wheel & color-convert)",
        category: "Selector Cromático HSVA / HEX",
        badge: "@uiw v2.10.3",
        description:
          "Componente de rueda de color interactiva y biblioteca de conversión matemática entre modelos de color HSVA, RGB y Hexadecimal.",
        usedFor:
          "Implementado en la pestaña *Aspecto* de `src/components/settings-modal.tsx` junto con `createCustomTokens()` en `ThemeContext.tsx` para permitir al usuario elegir cualquier color hexadecimal personalizado y recalcular los tonos de acento de toda la aplicación.",
        url: "https://uiwjs.github.io/react-color/",
        urlLabel: "uiwjs.github.io/react-color",
      },
    ],
  },
  {
    id: "gis",
    title: "Cartografía Digital y Georreferenciación",
    shortTitle: "Mapas & GIS",
    icon: Compass,
    description:
      "Motores y capas cartográficas empleados para representar los planos de Campus 1 y Campus 2 del IT Morelia.",
    items: [
      {
        name: "Leaflet 1.9",
        category: "Visor Cartográfico Interactivo",
        badge: "leaflet v1.9.4",
        description:
          "Biblioteca open-source en JavaScript para mapas interactivos adaptados a dispositivos móviles y de escritorio, con soporte de capas de teselas, polígonos y marcadores HTML.",
        usedFor:
          "Núcleo de `src/pages/Mapa.tsx`. Dibuja los polígonos perimetrales de Campus 1 (Av. Tecnológico #1500) y Campus 2 (San José de la Huerta), posiciona las 16 estaciones de contenedores (`ITM_DISPOSAL_POINTS`), filtra por tipo de bote y traza líneas indicadoras hacia la estación más cercana.",
        url: "https://leafletjs.com/",
        urlLabel: "leafletjs.com",
      },
      {
        name: "OpenStreetMap Standard Tile Layer",
        category: "Cartografía Base Colaborativa",
        badge: "OSM Tiles",
        description:
          "Servicio abierto de teselas cartográficas (`tile.openstreetmap.org`) mantenido por la comunidad global de OpenStreetMap.",
        usedFor:
          "Capa de mapa callejero y peatonal predeterminada en `src/pages/Mapa.tsx` para identificar la distribución de edificios (A, B, C, F, G, H, K, R, S2, U, X, LL, AF), accesos y andadores internos del Instituto Tecnológico de Morelia.",
        url: "https://www.openstreetmap.org/",
        urlLabel: "openstreetmap.org",
      },
      {
        name: "Esri ArcGIS World Imagery",
        category: "Ortofotografía y Vista Satelital",
        badge: "ArcGIS REST TileService",
        description:
          "Servicio de imágenes satelitales y aéreas de alta resolución proporcionado por Esri (`server.arcgisonline.com`).",
        usedFor:
          "Capa satelital conmutable dentro de `src/pages/Mapa.tsx` para que los estudiantes ubiquen visualmente las explanadas, canchas techadas, jardines y techumbres reales de ambos campus del ITM.",
        url: "https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9",
        urlLabel: "arcgis.com",
      },
    ],
  },
  {
    id: "backend",
    title: "Servicios en la Nube, Multimedia y Calidad de Código",
    shortTitle: "Nube & Backend",
    icon: Server,
    description:
      "Infraestructura serverless, autenticación, base de datos en la nube, entrega de video y auditoría estática del código.",
    items: [
      {
        name: "Vercel Serverless Functions (/api/gemini)",
        category: "Backend Serverless y Protección de Credenciales",
        badge: "Node.js Serverless",
        description:
          "Funciones HTTP bajo demanda ejecutadas en el entorno de servidor de Vercel que permiten procesar peticiones seguras sin exponer claves privadas al cliente.",
        usedFor:
          "Aloja el endpoint `api/gemini.js`, encargado de recibir la imagen en Base64 desde el escáner, adjuntar la clave privada `GEMINI_API_KEY` almacenada en las variables de entorno del servidor y aplicar el prompt del Sistema de Gestión Ambiental del ITM.",
        url: "https://vercel.com/docs/functions",
        urlLabel: "vercel.com/docs/functions",
      },
      {
        name: "Firebase Authentication",
        category: "Autenticación OAuth 2.0 y Correo",
        badge: "firebase v12.19.0",
        description:
          "Servicio de identidad de Google Firebase que gestiona el registro de usuarios, inicio de sesión con proveedores federados y recuperación de contraseñas.",
        usedFor:
          "Implementado en `src/firebase/auth.ts`, `src/pages/Login.tsx` y `src/pages/Registro.tsx` para ofrecer inicio de sesión con cuenta de Google (`signInWithPopup`) o correo y contraseña, manteniendo el estado reactivo en `AuthContext.tsx`.",
        url: "https://firebase.google.com/docs/auth",
        urlLabel: "firebase.google.com/docs/auth",
      },
      {
        name: "Cloud Firestore",
        category: "Base de Datos Documental NoSQL",
        badge: "firebase/firestore v12.19.0",
        description:
          "Base de datos NoSQL alojada en Google Cloud que organiza la información en documentos y colecciones con reglas de seguridad por usuario.",
        usedFor:
          "Configurada en `src/firebase/firestore.ts` y `src/pages/Perfil.tsx` para almacenar y sincronizar en la colección `users/{uid}` los datos académicos opcionales del estudiante (nombre, carrera del ITM, semestre, número de control, campus preferido y foto de perfil recortada).",
        url: "https://firebase.google.com/docs/firestore",
        urlLabel: "firebase.google.com/docs/firestore",
      },
      {
        name: "Cloudinary Video CDN",
        category: "Distribución y Optimización de Video",
        badge: "Cloudinary q_auto,f_auto",
        description:
          "Red de entrega de contenido (CDN) multimedia que comprime y adapta automáticamente el códec de video según el navegador del usuario.",
        usedFor:
          "Utilizada en `src/constants/hero-videos.ts` y `src/sections/hero.tsx` para transmitir los 5 videos ambientales intercambiables del encabezado principal sin incrementar el peso del repositorio ni del paquete de descarga inicial.",
        url: "https://cloudinary.com/documentation/video_manipulation_and_delivery",
        urlLabel: "cloudinary.com",
      },
      {
        name: "ESLint 9 + TypeScript-ESLint",
        category: "Análisis Estático y Reglas de Código",
        badge: "ESLint v9.39.5",
        description:
          "Herramienta de inspección estática con formato *Flat Config* (`eslint.config.js`) y reglas de validación para Hooks de React y TypeScript.",
        usedFor:
          "Ejecutada mediante `npm run lint` para verificar que los componentes cumplan las reglas de `react-hooks` y `react-refresh`, evitando fugas de memoria o variables sin uso.",
        url: "https://eslint.org/",
        urlLabel: "eslint.org",
      },
    ],
  },
  {
    id: "normativity",
    title: "Normatividad Ambiental y Sistema de Gestión (SGI ITM)",
    shortTitle: "Normativa & SGI",
    icon: Scale,
    description:
      "Leyes federales, Normas Oficiales Mexicanas y procedimientos internos del IT Morelia que rigen la clasificación de residuos en la app.",
    items: [
      {
        name: "Procedimiento SGI ITMORELIA-IT-AM-007 (Rev. 3)",
        category: "Instructivo Oficial del IT Morelia",
        badge: "SGI ITM Rev. 3",
        description:
          "Instructivo operativo del Sistema de Gestión Ambiental del Instituto Tecnológico de Morelia titulado 'Gestión integral de residuos sólidos urbanos'.",
        usedFor:
          "Define en `src/data/wasteData.ts` (`ITM_RSU_PROCEDURE` y `CAMPUS_CONTAINERS_CATALOG`) la separación oficial en 4 colores de la sección 4.1 (Verde orgánicos, Amarillo papel/cartón/vidrio/metales, Azul plásticos/PET, Negro no reciclables), la política 100% libre de plásticos de un solo uso y los formatos `ITMORELIA-IT-AM-007-01` al `04`.",
        url: "https://www.morelia.tecnm.mx/",
        urlLabel: "morelia.tecnm.mx",
      },
      {
        name: "LGPGIR (Ley General para la Prevención y Gestión Integral de los Residuos)",
        category: "Legislación Ambiental Federal",
        badge: "Ley Federal DOF",
        description:
          "Ordenamiento jurídico nacional que establece la clasificación de Residuos Sólidos Urbanos (RSU), Residuos de Manejo Especial (RME) y Residuos Peligrosos en México.",
        usedFor:
          "Sustenta las categorías legales en `CATEGORY_INFO` (`src/data/wasteData.ts`) y las recomendaciones de prevención, reducción, reutilización y reciclaje (3R) mostradas al escanear cada envase.",
        url: "https://www.diputados.gob.mx/LeyesBiblio/pdf/LGPGIR.pdf",
        urlLabel: "diputados.gob.mx (PDF)",
      },
      {
        name: "NOM-161-SEMARNAT-2011 y NOM-052-SEMARNAT-2005",
        category: "Normas Oficiales Mexicanas de Residuos",
        badge: "NOM SEMARNAT",
        description:
          "Normas que regulan los Planes de Manejo de Residuos de Manejo Especial (`NOM-161`) y el listado y características de toxicidad de los Residuos Peligrosos (`NOM-052`).",
        usedFor:
          "Aplicadas en el catálogo de residuos y en el Contenedor Naranja Especial (`bin-pilas`) para orientar sobre el acopio seguro de pilas alcalinas, baterías de litio y residuos electrónicos (RAEE), incluyendo el aislamiento de polos con cinta adhesiva.",
        url: "https://www.gob.mx/semarnat/acciones-y-programas/normas-oficiales-mexicanas-de-residuos",
        urlLabel: "gob.mx/semarnat",
      },
      {
        name: "Normas NMX-AA (015, 019, 22 y 61-1985) e ISO 14001:2015",
        category: "Estándares de Cuantificación y Gestión Ambiental",
        badge: "NMX-AA / ISO 14001",
        description:
          "Normas Mexicanas para muestreo por método de cuarteo, peso volumétrico *in situ* y selección de subproductos de RSU, junto con la norma internacional de Sistemas de Gestión Ambiental.",
        usedFor:
          "Incorporadas en `ITM_RSU_PROCEDURE.normativeStandards` (`src/data/wasteData.ts`) y en `/impacto` como los protocolos técnicos con los que el Comité de Gestión Ambiental del ITM realiza los diagnósticos e informes semestrales.",
        url: "https://www.iso.org/standard/60857.html",
        urlLabel: "iso.org (ISO 14001)",
      },
      {
        name: "Agenda 2030 de la ONU (ODS 12, ODS 4 y ODS 11)",
        category: "Objetivos de Desarrollo Sostenible",
        badge: "ONU Agenda 2030",
        description:
          "Marco internacional de las Naciones Unidas con metas específicas para reducir la generación de desechos (Meta 12.5), educación ambiental (Meta 4.7) y gestión de residuos urbanos (Meta 11.6).",
        usedFor:
          "Documentada en `ODS_ALIGNMENT` (`src/data/wasteData.ts`), en la sección `src/sections/sdg.tsx` y en la vista `/impacto` para vincular la separación en origen dentro del campus con metas globales verificables.",
        url: "https://www.un.org/sustainabledevelopment/es/sustainable-consumption-production/",
        urlLabel: "un.org/sustainabledevelopment",
      },
    ],
  },
  {
    id: "academic",
    title: "Entorno Académico e Institucional (TecNM / IT Morelia)",
    shortTitle: "Academia ITM",
    icon: GraduationCap,
    description:
      "Institución educativa, asignatura curricular y convocatoria académica donde se desarrolla el proyecto.",
    items: [
      {
        name: "Tecnológico Nacional de México / Instituto Tecnológico de Morelia",
        category: "Institución Sede del Proyecto",
        badge: "TecNM / ITM",
        description:
          "Institución pública de educación superior tecnológica en Morelia, Michoacán, conformada por el Campus 1 (Av. Tecnológico #1500, Lomas de Santiaguito) y el Campus 2 (San José de la Huerta).",
        usedFor:
          "Define toda la geografía, edificios, comedores, explanadas y oferta educativa de 17 carreras integradas en `src/pages/Mapa.tsx`, `src/pages/Perfil.tsx` y `src/data/wasteData.ts`.",
        url: "https://www.morelia.tecnm.mx/",
        urlLabel: "morelia.tecnm.mx",
      },
      {
        name: "Desarrollo Sustentable (ACD-0908) · 18° Semana de Oxigena tus Ideas",
        category: "Asignatura y Certamen Académico",
        badge: "Oxigena 2026",
        description:
          "Asignatura común del plan de estudios del TecNM enfocada en las tres dimensiones de la sustentabilidad, vinculada con la 18° Semana de Oxigena tus Ideas organizada por el Departamento de Ingeniería Química y Bioquímica.",
        usedFor:
          "Proporciona la metodología académica del proyecto: análisis de las dimensiones ambiental, social y económica (`src/sections/dimensions.tsx`), Análisis de Ciclo de Vida (ACV) por material y presentación transparente como prototipo estudiantil.",
        url: "https://www.tecnm.mx/",
        urlLabel: "tecnm.mx",
      },
    ],
  },
];

export const TOTAL_TECH_RESOURCES = TECH_CATEGORIES.reduce(
  (acc, sec) => acc + sec.items.length,
  0
);
