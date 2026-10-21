import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Code2, 
  ShieldCheck, 
  Layers,
  Smartphone,
  Brain,
  Boxes,
  Server,
  Compass,
  Scale,
  GraduationCap,
  Search,
  CheckCircle2,
  Filter
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface TechItem {
  name: string;
  category: string;
  description: string;
  badge: string;
}

interface TechSection {
  id: string;
  title: string;
  shortTitle: string;
  icon: typeof Code2;
  description: string;
  items: TechItem[];
}

const TECH_CATEGORIES: TechSection[] = [
  {
    id: "ai",
    title: "Inteligencia Artificial y Visión Computacional",
    shortTitle: "IA & Visión",
    icon: Brain,
    description: "Modelos neuronales de vanguardia y motores de inferencia multimodal tanto en la nube como en el dispositivo.",
    items: [
      {
        name: "Google Gemini Vision API",
        category: "IA Multimodal en la Nube",
        description: "Modelo Gemini 1.5/2.0 Flash para reconocimiento visual de empaques, estimación del estado del residuo, cálculo de biodegradabilidad y sugerencias ecológicas contextuales.",
        badge: "Google AI Studio",
      },
      {
        name: "TensorFlow.js (TF.js v4.22)",
        category: "Motor de Aprendizaje en Navegador",
        description: "Plataforma de machine learning de código abierto acelerada por WebGL para ejecutar redes neuronales convolucionales directamente en el cliente.",
        badge: "WebGL Acceleration",
      },
      {
        name: "MobileNet v2 (Alpha 1.0)",
        category: "Red Neuronal en Dispositivo",
        description: "Red neuronal convolucional compacta optimizada para teléfonos móviles, permitiendo preclasificación de residuos instantánea y 100% offline sin consumir datos.",
        badge: "Edge / Offline AI",
      },
    ],
  },
  {
    id: "mobile",
    title: "Experiencia Móvil, PWA y Sensores de Hardware",
    shortTitle: "Mobile & PWA",
    icon: Smartphone,
    description: "APIs web nativas para acceso a hardware, interacción táctil de baja fricción y funcionamiento como aplicación instalable.",
    items: [
      {
        name: "PWA (Progressive Web App)",
        category: "Arquitectura Móvil Instalable",
        description: "Capacidad de instalación en pantalla de inicio (Android e iOS) operando en modo pantalla completa sin barra de navegación, con carga instantánea.",
        badge: "W3C PWA Standards",
      },
      {
        name: "Web MediaDevices API",
        category: "Hardware / Cámara Trasera",
        description: "Conexión directa y de baja latencia con el sensor óptico del smartphone mediante `getUserMedia` con enfoque continuo y control ambiental.",
        badge: "MediaStream API",
      },
      {
        name: "Vibration API (Respuesta Háptica)",
        category: "Sensor Táctil / Haptics",
        description: "Pulsos de microvibración háptica (`navigator.vibrate`) en dispositivos móviles al confirmar la detección y clasificación de un residuo sólido.",
        badge: "Web Haptics API",
      },
      {
        name: "Geolocation API (GPS en Tiempo Real)",
        category: "Sensores de Posicionamiento",
        description: "Ubicación satelital del alumno para calcular la distancia y orientación hacia los contenedores de acopio más cercanos dentro de Campus 1 y 2.",
        badge: "W3C Geolocation",
      },
      {
        name: "Touch Gestures & Bottom Dock",
        category: "Ergonomía Móvil Touch",
        description: "Navegación inferior tipo cápsula flotante diseñada ergonómicamente para operación natural con el pulgar a una sola mano en pantallas táctiles.",
        badge: "Mobile-First UI",
      },
      {
        name: "Web Storage & Caching Local",
        category: "Persistencia sin Conexión",
        description: "Almacenamiento persistente en cliente con `localStorage` e IndexedDB para conservar historiales, preferencias, fotos en base64 y estados offline.",
        badge: "Client Storage",
      },
    ],
  },
  {
    id: "frontend",
    title: "Arquitectura y Desarrollo Frontend",
    shortTitle: "Frontend Web",
    icon: Code2,
    description: "Infraestructura moderna para garantizar rendimiento instantáneo, accesibilidad y bajo consumo de batería.",
    items: [
      {
        name: "React 19",
        category: "Librería Principal de UI",
        description: "Última generación de React con concurrencia nativa, Suspense dinámico, transiciones fluidas y renderizado ultraoptimizado.",
        badge: "v19.0.0",
      },
      {
        name: "TypeScript 5.7",
        category: "Tipado Estático Riguroso",
        description: "Seguridad de tipos estricta (`strict: true`) para modelos de residuos, esquemas de Firebase, coordenadas cartográficas y autenticación.",
        badge: "Strict Mode",
      },
      {
        name: "Tailwind CSS v4",
        category: "Motor de Diseño y Estilos",
        description: "Motor de utilidades CSS de alto rendimiento con tokens y variables dinámicas para paletas cromáticas intercambiables en caliente.",
        badge: "Tailwind v4",
      },
      {
        name: "Framer Motion 12",
        category: "Física y Animación Reactiva",
        description: "Animaciones de resortes realistas, cápsulas deslizantes elásticas en menús, efectos parallax reactivos al scroll y transiciones de estado.",
        badge: "Motion Engine",
      },
      {
        name: "Lenis Smooth Scroll",
        category: "Cinemática de Desplazamiento",
        description: "Normalización de desplazamiento suave para una navegación táctil y de escritorio precisa a 60/120 FPS sin alterar el scroll nativo.",
        badge: "60/120 FPS",
      },
      {
        name: "React Router v7",
        category: "Enrutamiento SPA Declarativo",
        description: "Gestión de rutas del lado del cliente con carga diferida (`React.lazy`) para aislar los paquetes pesados como TensorFlow en sus propias vistas.",
        badge: "Client Routing",
      },
    ],
  },
  {
    id: "graphics",
    title: "Física 2D, Gráficos e Iconografía",
    shortTitle: "Física & UI",
    icon: Boxes,
    description: "Simuladores cinemáticos interactivos, iconografía accesible y herramientas espectrales de personalización.",
    items: [
      {
        name: "Matter.js (v0.20)",
        category: "Motor de Física 2D",
        description: "Simulador físico de cuerpos rígidos con gravedad interactiva, colisiones elásticas y masa para la animación de residuos cayendo en el Hero.",
        badge: "2D Physics",
      },
      {
        name: "Lucide React & Lucide Animated",
        category: "Iconografía Vectorial SVG",
        description: "Colección extensa de iconos limpios, accesibles y consistentes en diseño para enriquecer visualmente cada sección y botón de acción.",
        badge: "SVG Vectors",
      },
      {
        name: "React Icons (Remix Icons)",
        category: "Iconografía Móvil Outline / Solid",
        description: "Iconos con estados alternables lineales y sólidos para representar de manera inequívoca la pantalla activa en la barra de navegación móvil.",
        badge: "Remix Icons (ri)",
      },
      {
        name: "UIW Color Wheel & Color Convert",
        category: "Manipulación de Color HSV/RGB",
        description: "Selectores cromáticos interactivos y conversores matemáticos de color que potencian el configurador de acento temático del usuario.",
        badge: "Color Wheel",
      },
    ],
  },
  {
    id: "backend",
    title: "Backend Cloud, Infraestructura y DevOps",
    shortTitle: "Cloud & Backend",
    icon: Server,
    description: "Servicios en la nube, microservicios serverless, bases de datos reactivas y automatización de despliegues.",
    items: [
      {
        name: "Firebase Authentication",
        category: "Seguridad y Gestión de Sesiones",
        description: "Gestión de sesiones protegidas con Firebase Auth, cifrado en tránsito SSL, tokens JWT y persistencia segura de estado de usuarios ponys.",
        badge: "Firebase v12",
      },
      {
        name: "Cloud Firestore",
        category: "Base de Datos NoSQL Distribuida",
        description: "Almacenamiento reactivo de perfiles de usuario, campus predilecto, bitácora de escaneos y sincronización de preferencias en la nube de Google.",
        badge: "Google Cloud",
      },
      {
        name: "Vercel Serverless Functions",
        category: "Microservicios Serverless Backend",
        description: "Función serverless `/api/gemini` que resguarda la variable de entorno `GEMINI_API_KEY` en el servidor, evitando exponer claves secretas en el cliente.",
        badge: "Serverless Edge",
      },
      {
        name: "GitHub Actions (CI/CD)",
        category: "Integración Continua Automatizada",
        description: "Flujo de trabajo automatizado que ejecuta comprobación de tipos (`tsc`), validación de linter y compilación de producción en cada push.",
        badge: "CI / CD Pipeline",
      },
      {
        name: "Vite 6.2 Bundler",
        category: "Empaquetador y Servidor Local",
        description: "Empaquetador ultrarrápido con Hot Module Replacement (HMR) y compresión Rollup para generación eficiente de trozos estáticos.",
        badge: "ESM Bundler",
      },
      {
        name: "ESLint 9",
        category: "Control de Calidad Estática",
        description: "Configuración moderna de linter (Flat Config) para garantizar buenas prácticas de código limpio, hooks de React y estándares de accesibilidad.",
        badge: "Code Quality",
      },
    ],
  },
  {
    id: "gis",
    title: "Cartografía y Sistemas de Información Geográfica",
    shortTitle: "Cartografía SIG",
    icon: Compass,
    description: "Herramientas de georreferenciación y renderizado de mapas abiertos para la ubicación espacial de contenedores.",
    items: [
      {
        name: "Leaflet API (v1.9)",
        category: "Librería Cartográfica Interactiva",
        description: "Renderizado interactivo de mapas para móviles y computadoras, con marcadores personalizados por color de bote, áreas y ventanas emergentes.",
        badge: "Leaflet.js",
      },
      {
        name: "OpenStreetMap & CartoDB Tiles",
        category: "Capas de Teselas Cartográficas",
        description: "Servidor de teselas cartográficas abiertas de alta resolución para geolocalizar con fidelidad edificios, andadores y cafeterías del ITM.",
        badge: "OpenStreetMap",
      },
    ],
  },
  {
    id: "normativity",
    title: "Normatividad Ambiental y Procedimientos Oficiales del ITM",
    shortTitle: "Normativa & SGI",
    icon: Scale,
    description: "Bases de conocimiento oficiales que sustentan la veracidad de los datos de degradación, colores de botes y clasificación.",
    items: [
      {
        name: "Procedimiento ITMORELIA-IT-AM-007 Rev. 2",
        category: "Procedimiento Oficial SGI ITM",
        description: "Instrucción de trabajo del Sistema de Gestión Integrado del ITM para la separación de RSU: Bote Verde (Orgánicos), Amarillo (Inorgánicos reciclables) y Naranja (Pilas/Manejo especial).",
        badge: "SGI IT Morelia",
      },
      {
        name: "LGPGIR (Ley General para la Prevención y Gestión Integral)",
        category: "Marco Jurídico Federal Vigente",
        description: "Artículos 5, 19 y subsecuentes que definen residuos sólidos urbanos, valorización y economía circular (última reforma DOF 19-01-2026).",
        badge: "DOF Federal 2026",
      },
      {
        name: "NOM-161-SEMARNAT-2011",
        category: "Norma Oficial Mexicana",
        description: "Criterios para clasificar los residuos de manejo especial y determinación de planes de manejo ambiental responsable.",
        badge: "SEMARNAT",
      },
      {
        name: "NOM-052-SEMARNAT-2005",
        category: "Norma de Residuos Peligrosos",
        description: "Identificación de características de toxicidad y corrosividad ambiental aplicadas al acopio de baterías y componentes electrónicos.",
        badge: "Norma Oficial",
      },
      {
        name: "INEGI - Censo de Gestión de Residuos",
        category: "Estadística Oficial del Estado",
        description: "Datos sobre tasas de recolección y sitios de disposición final en el estado de Michoacán y el municipio de Morelia.",
        badge: "INEGI Michoacán",
      },
      {
        name: "PNUMA / Agenda 2030 (ODS)",
        category: "Directrices Internacionales ONU",
        description: "Metas prioritarias para ODS 12 (Producción y Consumo Responsables), ODS 13 (Acción por el Clima) y directrices para erradicar plásticos de un solo uso.",
        badge: "ODS 12 / ONU",
      },
    ],
  },
  {
    id: "academic",
    title: "Entorno Institucional y Académico",
    shortTitle: "Academia ITM",
    icon: GraduationCap,
    description: "Contexto académico donde se fundamenta la investigación y el prototipo de Desarrollo Sustentable.",
    items: [
      {
        name: "Instituto Tecnológico de Morelia (ITM)",
        category: "Sede Académica del Proyecto",
        description: "Campus 1 (Av. Tecnológico #1500) y Campus 2 (Salida Salamanca). Levantamiento preliminar georreferenciado de contenedores y andadores.",
        badge: "TecNM / ITM",
      },
      {
        name: "Materia de Desarrollo Sustentable (ACD-0908)",
        category: "Asignatura Curricular Rectora",
        description: "Proyecto integrador que vincula las dimensiones ambiental, social y económica de la sustentabilidad en la formación de ingenieros.",
        badge: "TecNM 2026",
      },
      {
        name: "Departamento de Química y Bioquímica",
        category: "Convocatoria Institucional",
        description: "Comité organizador de la 18° Semana de Oxigena tus Ideas, fomentando el desarrollo de iniciativas sustentables con rigor metodológico.",
        badge: "Oxigena 2026",
      },
    ],
  },
];

export default function Tecnologias() {
  const { accent } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filtrado reactivo por categoría y búsqueda de texto
  const filteredSections = useMemo(() => {
    return TECH_CATEGORIES.map((section) => {
      // Si hay filtro por categoría y no coincide
      if (selectedFilter !== "all" && section.id !== selectedFilter) {
        return null;
      }

      // Si hay término de búsqueda, filtrar items
      const query = searchQuery.trim().toLowerCase();
      if (!query) {
        return section;
      }

      const matchingItems = section.items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.badge.toLowerCase().includes(query)
      );

      if (matchingItems.length === 0) {
        return null;
      }

      return {
        ...section,
        items: matchingItems,
      };
    }).filter(Boolean) as TechSection[];
  }, [selectedFilter, searchQuery]);

  const totalItemsCount = useMemo(() => {
    return TECH_CATEGORIES.reduce((acc, sec) => acc + sec.items.length, 0);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-28 md:pt-28 md:pb-16 px-4 md:px-8 max-w-5xl mx-auto transition-colors duration-300">
      
      {/* Encabezado */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-8"
      >
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border mb-3 ${accent.badge}`}>
          <Layers className="size-3.5" aria-hidden="true" />
          <span>Ficha Técnica y Recursos</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Tecnologías, APIs y Recursos Oficiales
        </h1>
        <p className="mt-2 text-sm md:text-base text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed max-w-3xl">
          Inventario exhaustivo de herramientas de desarrollo, librerías frontend, modelos de inteligencia artificial, capacidades móviles PWA, microservicios serverless y normativas institucionales utilizadas en <strong className="text-zinc-900 dark:text-zinc-200">ReCiclo</strong> para el Instituto Tecnológico de Morelia ({totalItemsCount} recursos documentados).
        </p>

        {/* Barra de Filtros y Búsqueda Interactiva (Optimizada para Móvil y Escritorio) */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          {/* Buscador */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar tecnología, API, norma o biblioteca..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Contador de recursos activos */}
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-zinc-500 dark:text-zinc-400 shrink-0 px-1">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              <span>
                {filteredSections.reduce((acc, s) => acc + s.items.length, 0)} de {totalItemsCount} recursos
              </span>
            </span>
          </div>
        </div>

        {/* Chips de Categorías (Scroll horizontal suave en móviles) */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
              selectedFilter === "all"
                ? `${accent.badge} font-bold shadow-xs`
                : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Todas ({totalItemsCount})
          </button>

          {TECH_CATEGORIES.map((cat) => {
            const isSelected = selectedFilter === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedFilter(cat.id)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? `${accent.badge} font-bold shadow-xs`
                    : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{cat.shortTitle}</span>
                <span className="text-[10px] opacity-75">({cat.items.length})</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Secciones de Recursos */}
      {filteredSections.length === 0 ? (
        <div className="text-center py-16 px-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <Filter className="size-8 mx-auto text-zinc-400 mb-2 opacity-50" />
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            No se encontraron tecnologías que coincidan con tu búsqueda
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            Intenta con otro término o selecciona "Todas" en los filtros superiores.
          </p>
          <button
            onClick={() => {
              setSelectedFilter("all");
              setSearchQuery("");
            }}
            className="mt-4 px-4 py-1.5 text-xs rounded-xl font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
          >
            Restablecer filtros
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {filteredSections.map((section, sIdx) => {
            const Icon = section.icon;
            return (
              <motion.section
                key={section.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: sIdx * 0.05 }}
                className="p-5 sm:p-7 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs"
              >
                {/* Encabezado de la categoría */}
                <div className="flex items-start gap-3.5 mb-2">
                  <div className={`p-2.5 rounded-2xl ${accent.badge} shrink-0`}>
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                        {section.title}
                      </h2>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                        {section.items.length} {section.items.length === 1 ? "recurso" : "recursos"}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                      {section.description}
                    </p>
                  </div>
                </div>

                {/* Grid de Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-6">
                  {section.items.map((item) => (
                    <div
                      key={item.name}
                      className="p-4 sm:p-4.5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/80 flex flex-col justify-between gap-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                    >
                      <div>
                        {/* Cabecera del item: Nombre + Categoría destacada + Badge de versión */}
                        <div className="flex flex-col gap-1.5 mb-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                              {item.name}
                            </h3>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${accent.badge} shrink-0`}>
                              {item.badge}
                            </span>
                          </div>

                          {/* CATEGORÍA DESTACADA (Visible y nítida en móvil y PC) */}
                          <div className="flex items-center">
                            <span className="inline-flex items-center text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md bg-zinc-200/60 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-300/40 dark:border-zinc-700/50">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        {/* Descripción técnica */}
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>
      )}

      {/* Resumen de Compromiso Ético y Académico */}
      <div className="mt-10 p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed">
        <div className="flex items-center gap-2 font-bold mb-1.5">
          <ShieldCheck className="size-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Compromiso de Transparencia y Rigor Científico</span>
        </div>
        <p>
          ReCiclo no emplea cifras inventadas ni pretende resolver el manejo integral de residuos de manera aislada. La tecnología se implementa como un vehículo educativo accesible para respaldar mejores decisiones cotidianas dentro de la comunidad ponys del IT Morelia, respetando las normas ambientales de México y el procedimiento institucional ITMORELIA-IT-AM-007.
        </p>
      </div>

    </div>
  );
}
