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
    title: "Inteligencia Artificial y Visión",
    shortTitle: "IA & Visión",
    icon: Brain,
    description: "Modelos visuales para reconocer qué tipo de residuo tienes frente a ti y cómo debes separarlo.",
    items: [
      {
        name: "Google Gemini Vision API",
        category: "IA en la Nube",
        description: "Modelo multimodal en la nube que analiza la foto del residuo, reconoce el material, estima su degradación y te da consejos prácticos para reciclarlo.",
        badge: "Google AI",
      },
      {
        name: "TensorFlow.js",
        category: "Motor de IA en Navegador",
        description: "Permite ejecutar redes neuronales directamente en la página web usando el procesador o tarjeta gráfica de tu dispositivo.",
        badge: "TensorFlow.js",
      },
      {
        name: "MobileNet v2",
        category: "IA Local / Offline",
        description: "Red neuronal ligera que identifica residuos directamente en tu teléfono, rápido y sin necesidad de gastar datos móviles ni tener internet.",
        badge: "Offline Ready",
      },
    ],
  },
  {
    id: "mobile",
    title: "Experiencia Móvil y Web (Mobile)",
    shortTitle: "Mobile & PWA",
    icon: Smartphone,
    description: "Herramientas pensadas para que la app se sienta como una aplicación nativa en tu teléfono.",
    items: [
      {
        name: "PWA (Aplicación Web Progresiva)",
        category: "Instalación en Celular",
        description: "Puedes agregar ReCiclo a la pantalla de inicio de tu celular (Android o iPhone); abre a pantalla completa y sin barras de navegador.",
        badge: "PWA Web",
      },
      {
        name: "Web MediaDevices (Cámara)",
        category: "Cámara del Teléfono",
        description: "Se conecta a la cámara trasera de tu teléfono con enfoque automático para tomar la foto del residuo al instante.",
        badge: "Cámara Web",
      },
      {
        name: "Vibration API (Respuesta Háptica)",
        category: "Vibración Táctil",
        description: "El teléfono vibra suavemente cuando la cámara detecta y clasifica el residuo con éxito, confirmando la acción.",
        badge: "Vibración",
      },
      {
        name: "Geolocation API (GPS)",
        category: "Ubicación en Vivo",
        description: "Usa la ubicación de tu celular dentro del campus para mostrarte en el mapa cuál es el bote adecuado más cercano a ti.",
        badge: "GPS Campus",
      },
      {
        name: "Diseño Mobile-First",
        category: "Uso a una Mano",
        description: "Interfaz ergonómica con barra de navegación inferior tipo cápsula, pensada para usarse cómodamente con el pulgar.",
        badge: "Touch UI",
      },
      {
        name: "Almacenamiento Local (Offline)",
        category: "Memoria del Dispositivo",
        description: "Guarda tu historial de escaneos y preferencias en la memoria del celular para que puedas revisarlos aunque no tengas señal.",
        badge: "Sin Conexión",
      },
    ],
  },
  {
    id: "frontend",
    title: "Desarrollo Frontend y Navegación",
    shortTitle: "Frontend",
    icon: Code2,
    description: "La base sobre la que está construida toda la página web y la experiencia de usuario.",
    items: [
      {
        name: "React 19",
        category: "Librería Principal",
        description: "La versión más reciente de React para crear pantallas interactivas que cargan al instante y consumen poca batería.",
        badge: "React 19",
      },
      {
        name: "TypeScript 5.7",
        category: "Código Seguro",
        description: "Ayuda a que el código no tenga errores de programación en los datos de residuos, usuarios y coordenadas del campus.",
        badge: "TypeScript",
      },
      {
        name: "Tailwind CSS v4",
        category: "Diseño y Estilos",
        description: "Sistema de diseño rápido y moderno para que la aplicación se adapte a cualquier pantalla y soporte temas de color.",
        badge: "Tailwind v4",
      },
      {
        name: "Framer Motion 12",
        category: "Animaciones Fluidas",
        description: "Maneja las animaciones suaves, los botones elásticos y las transiciones entre pantallas.",
        badge: "Framer Motion",
      },
      {
        name: "Lenis Smooth Scroll",
        category: "Scroll Suave",
        description: "Hace que el desplazamiento al deslizar hacia arriba o hacia abajo se sienta súper suave a 60 y 120 cuadros por segundo.",
        badge: "Scroll 120Hz",
      },
      {
        name: "React Router v7",
        category: "Navegación entre Páginas",
        description: "Permite cambiar entre Inicio, Escáner, Mapa y Perfil sin recargar la página, descargando cada módulo solo cuando se visita.",
        badge: "React Router",
      },
    ],
  },
  {
    id: "graphics",
    title: "Física Interactiva y Gráficos",
    shortTitle: "Física & Gráficos",
    icon: Boxes,
    description: "Elementos visuales, animaciones interactivas e iconografía que acompañan cada pantalla.",
    items: [
      {
        name: "Matter.js",
        category: "Física en 2D",
        description: "Simula gravedad, rebotes y choques realistas en los residuos que caen en la pantalla de bienvenida.",
        badge: "Física 2D",
      },
      {
        name: "Lucide Icons",
        category: "Iconos Vectoriales",
        description: "Iconos limpios y claros para que cada botón y opción se entienda de un vistazo.",
        badge: "Iconos SVG",
      },
      {
        name: "React Icons (Remix Icons)",
        category: "Iconos Móviles",
        description: "Iconos especiales con versión de línea y relleno para resaltar en qué pestaña estás en tu teléfono.",
        badge: "Iconos Móvil",
      },
      {
        name: "Selector de Color Espectral",
        category: "Personalización",
        description: "Rueda de color interactiva que te permite cambiar el color de acento de toda la app a tu gusto.",
        badge: "Colores",
      },
    ],
  },
  {
    id: "backend",
    title: "Servicios en la Nube y DevOps",
    shortTitle: "Nube & DevOps",
    icon: Server,
    description: "Servicios en internet que guardan la información, ejecutan la IA con seguridad y compilan el proyecto.",
    items: [
      {
        name: "Firebase Authentication",
        category: "Cuentas y Seguridad",
        description: "Permite registrarte e iniciar sesión de forma segura sin poner en riesgo tus contraseñas.",
        badge: "Firebase",
      },
      {
        name: "Cloud Firestore",
        category: "Base de Datos",
        description: "Base de datos en la nube de Google que sincroniza tu perfil de estudiante, tus puntos y tu historial de escaneos.",
        badge: "Google Cloud",
      },
      {
        name: "Vercel Serverless Functions",
        category: "Servidor Seguro",
        description: "Microservidor en la nube (`/api/gemini`) que conecta con la IA de Google protegiendo la clave secreta de la API.",
        badge: "Vercel API",
      },
      {
        name: "GitHub Actions",
        category: "Revisión Automática",
        description: "Revisa automáticamente que el código no tenga fallas y compila la versión de prueba en cada cambio guardado.",
        badge: "GitHub CI",
      },
      {
        name: "Vite 6.2 Bundler",
        category: "Empaquetador",
        description: "Compila el código en paquetes pequeños y ligeros para que la página abra rápido incluso con datos móviles.",
        badge: "Vite ESM",
      },
      {
        name: "ESLint 9",
        category: "Calidad de Código",
        description: "Audita que el código esté escrito con buenas prácticas y sin funciones innecesarias que hagan lenta la aplicación.",
        badge: "ESLint",
      },
    ],
  },
  {
    id: "gis",
    title: "Mapas y Georreferenciación",
    shortTitle: "Mapas",
    icon: Compass,
    description: "Planos y mapas interactivos del Instituto Tecnológico de Morelia para ubicar los botes.",
    items: [
      {
        name: "Leaflet.js",
        category: "Visor de Mapas",
        description: "Librería ligera de mapas interactivos que muestra los puntos de reciclaje, andadores y edificios del campus.",
        badge: "Leaflet",
      },
      {
        name: "OpenStreetMap",
        category: "Mapas Libres",
        description: "Mapa abierto y colaborativo que sirve de fondo para ubicar las instalaciones de Campus 1 y Campus 2.",
        badge: "OpenStreetMap",
      },
    ],
  },
  {
    id: "normativity",
    title: "Normatividad Ambiental y del ITM",
    shortTitle: "Normativa & SGI",
    icon: Scale,
    description: "Normas oficiales y reglamentos institucionales en los que se basan los colores y categorías de los botes.",
    items: [
      {
        name: "Procedimiento ITMORELIA-IT-AM-007 (Rev. 2)",
        category: "Regla Oficial del ITM",
        description: "Instrucción oficial del Sistema de Gestión Integrado del ITM: Bote Verde (Orgánicos), Amarillo (Inorgánicos reciclables) y Naranja (Pilas).",
        badge: "SGI IT Morelia",
      },
      {
        name: "LGPGIR (Ley General de Residuos)",
        category: "Ley Federal Mexicana",
        description: "Ley nacional que define qué es un residuo sólido urbano, qué se puede valorizar y cómo reciclar en México (DOF 2026).",
        badge: "Ley Federal",
      },
      {
        name: "NOM-161-SEMARNAT-2011",
        category: "Norma Mexicana",
        description: "Criterios oficiales para clasificar los residuos que requieren un plan de manejo especial.",
        badge: "SEMARNAT",
      },
      {
        name: "NOM-052-SEMARNAT-2005",
        category: "Norma de Residuos Peligrosos",
        description: "Define las características de toxicidad y riesgo ambiental aplicadas al desecho de pilas y electrónicos.",
        badge: "Peligrosos",
      },
      {
        name: "INEGI Michoacán",
        category: "Datos Estadísticos",
        description: "Estadísticas oficiales sobre la generación y disposición final de basura en Morelia y Michoacán.",
        badge: "INEGI",
      },
      {
        name: "Agenda 2030 (ODS 12)",
        category: "Objetivos ONU",
        description: "Metas de la ONU para el consumo responsable, reducción del desperdicio y cuidado del medio ambiente.",
        badge: "ODS 12 / ONU",
      },
    ],
  },
  {
    id: "academic",
    title: "Entorno Académico e Institucional",
    shortTitle: "Academia ITM",
    icon: GraduationCap,
    description: "La sede y el contexto escolar en el que nació la propuesta de ReCiclo.",
    items: [
      {
        name: "Instituto Tecnológico de Morelia (ITM)",
        category: "Sede del Proyecto",
        description: "Nuestra casa de estudios. El proyecto toma en cuenta la distribución de botes tanto de Campus 1 como de Campus 2.",
        badge: "TecNM / ITM",
      },
      {
        name: "Materia de Desarrollo Sustentable (ACD-0908)",
        category: "Materia de Origen",
        description: "Asignatura escolar donde los integrantes del equipo desarrollaron este proyecto integrador para generar impacto ambiental positivo.",
        badge: "Materia DS",
      },
      {
        name: "Departamento de Química y Bioquímica",
        category: "Convocatoria Oficial",
        description: "Comité organizador de la 18° Semana de Oxigena tus Ideas, certamen donde se presenta y evalúa este proyecto.",
        badge: "Oxigena 2026",
      },
    ],
  },
];

export const TOTAL_TECH_RESOURCES = TECH_CATEGORIES.reduce((acc, sec) => acc + sec.items.length, 0);

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
          Inventario transparente de las herramientas digitales, modelos de inteligencia artificial, servicios en la nube y normativas oficiales que utilizamos para hacer realidad <strong className="text-zinc-900 dark:text-zinc-200">ReCiclo</strong> en el Instituto Tecnológico de Morelia ({totalItemsCount} recursos documentados).
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
              className="w-full pl-10 pr-16 py-2 text-xs sm:text-sm rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
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

        {/* Chips de Categorías (Scroll horizontal táctil en móviles) */}
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
            No encontramos ninguna coincidencia con tu búsqueda
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            Intenta con otra palabra o selecciona "Todas" en los botones superiores.
          </p>
          <button
            onClick={() => {
              setSelectedFilter("all");
              setSearchQuery("");
            }}
            className="mt-4 px-4 py-1.5 text-xs rounded-xl font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
          >
            Ver todas las tecnologías
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

                        {/* Descripción técnica en lenguaje natural */}
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
          <span>Compromiso de Honestidad y Rigor Académico</span>
        </div>
        <p>
          ReCiclo es una propuesta estudiantil desarrollada para el Instituto Tecnológico de Morelia. No inventamos cifras de precisión ni prometemos soluciones mágicas; combinamos herramientas web modernas, inteligencia artificial y las normas ambientales oficiales de México para apoyar a nuestra comunidad de ponys a separar mejor sus residuos día con día.
        </p>
      </div>

    </div>
  );
}
