import { motion } from "framer-motion";
import { 
  Code2, 
  Cpu, 
  ShieldCheck, 
  Globe2, 
  Layers,
  BookOpen
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Tecnologias() {
  const { accent } = useTheme();

  const TECH_CATEGORIES = [
    {
      title: "Arquitectura y Desarrollo Frontend",
      icon: Code2,
      description: "Infraestructura moderna para garantizar rendimiento instantáneo, accesibilidad y bajo consumo de batería.",
      items: [
        {
          name: "React 19",
          category: "Librería Principal",
          description: "Última generación con Server Components, Suspense dinámico y renderizado ultraoptimizado.",
          badge: "v19.0.0",
        },
        {
          name: "TypeScript 5.7",
          category: "Tipado Estricto",
          description: "Seguridad de tipos estricta para modelos de residuos, coordenadas geográficas y autenticación.",
          badge: "Strict Mode",
        },
        {
          name: "Tailwind CSS v4",
          category: "Estilos y Diseño",
          description: "Motor de utilidades CSS de alto rendimiento con tokens dinámicos para paletas de color personalizadas.",
          badge: "Tailwind v4",
        },
        {
          name: "Vite 6.2",
          category: "Herramienta de Compilación",
          description: "Empaquetador ultrarrápido con Hot Module Replacement (HMR) y compresión gzip/brotli.",
          badge: "ESM Bundler",
        },
        {
          name: "Framer Motion 12",
          category: "Física y Animación",
          description: "Animaciones de resortes realistas, efectos parallax reactivos al scroll y transiciones de estado fluidas.",
          badge: "Framer Motion",
        },
        {
          name: "Lenis Smooth Scroll",
          category: "Cinemática de Scroll",
          description: "Normalización de desplazamiento suave para una navegación táctil y de escritorio precisa a 60/120 fps.",
          badge: "60/120 FPS",
        },
      ],
    },
    {
      title: "APIs y Servicios Integrados",
      icon: Cpu,
      description: "Servicios e interfaces de programación que potencian la identificación, cartografía y seguridad.",
      items: [
        {
          name: "Firebase Authentication",
          category: "Seguridad y Cuentas",
          description: "Gestión de sesiones protegidas con Firebase Auth, cifrado en tránsito SSL y persistencia segura de estado.",
          badge: "Firebase v12",
        },
        {
          name: "Cloud Firestore",
          category: "Base de Datos NoSQL",
          description: "Almacenamiento reactivo de perfiles de usuario, campus predilecto y sincronización de preferencias en la nube.",
          badge: "Google Cloud",
        },
        {
          name: "OpenStreetMap & Leaflet API",
          category: "Georreferenciación",
          description: "API de cartografía libre para ubicar puntos de acopio oficiales del IT Morelia con teselas y marcadores interactivos.",
          badge: "OpenStreetMap API",
        },
        {
          name: "Web MediaDevices API",
          category: "Hardware / Cámara",
          description: "Acceso al sensor fotográfico del dispositivo con `getUserMedia` para captura y preclasificación de residuos.",
          badge: "W3C Camera API",
        },
        {
          name: "PWA / Web Mobile Responsive",
          category: "Experiencia Web Multiplataforma",
          description: "Interfaz reactiva adaptada para móviles, tablets y computadoras, con acceso a cámara mediante APIs web estándar.",
          badge: "Web Standards",
        },
      ],
    },
    {
      title: "Normatividad y Fuentes Ambientales Oficiales",
      icon: BookOpen,
      description: "Bases de conocimiento oficiales que sustentan la veracidad de los datos de degradación, categorías y manejo.",
      items: [
        {
          name: "LGPGIR (Ley General para la Prevención y Gestión Integral)",
          category: "Marco Jurídico Federal",
          description: "Artículos 5, 19 y subsecuentes que definen residuos sólidos urbanos, orgánicos, inorgánicos y de manejo especial.",
          badge: "Diario Oficial de la Federación",
        },
        {
          name: "NOM-161-SEMARNAT-2011",
          category: "Norma Oficial Mexicana",
          description: "Criterios para clasificar los residuos de manejo especial y determinación de planes de manejo ambiental.",
          badge: "SEMARNAT",
        },
        {
          name: "NOM-052-SEMARNAT-2005",
          category: "Norma de Residuos Peligrosos",
          description: "Identificación de características de toxicidad y corrosividad aplicadas a baterías y componentes electrónicos.",
          badge: "Norma Oficial",
        },
        {
          name: "INEGI - Censo de Gestión de Residuos",
          category: "Estadística Oficial",
          description: "Datos sobre tasas de recolección y sitios de disposición final en el estado de Michoacán y Morelia.",
          badge: "INEGI Michoacán",
        },
        {
          name: "PNUMA / ONU Medio Ambiente",
          category: "Organismo Internacional",
          description: "Parámetros sobre el ciclo de vida de polímeros y directrices para la erradicación de plásticos de un solo uso.",
          badge: "ODS 12 / PNUMA",
        },
      ],
    },
    {
      title: "Entorno Institucional y Académico",
      icon: Globe2,
      description: "Contexto académico donde se fundamenta la investigación y el prototipo de Desarrollo Sustentable.",
      items: [
        {
          name: "Instituto Tecnológico de Morelia (ITM)",
          category: "Sede del Proyecto",
          description: "Campus 1 (Av. Tecnológico #1500) y Campus 2 (Salida Salamanca). Levantamiento georreferenciado de contenedores y andadores.",
          badge: "TecNM / ITM",
        },
        {
          name: "Materia de Desarrollo Sustentable",
          category: "Academia Institucional",
          description: "Proyecto integrador que vincula las dimensiones ambiental, social y económica con los ODS 12, 4 y 11.",
          badge: "TecNM 2026",
        },
      ],
    },
  ];

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
          Inventario completo de las herramientas digitales, servicios en la nube, bibliotecas de código abierto y fuentes normativas ambientales utilizadas en la concepción y desarrollo de <strong className="text-zinc-900 dark:text-zinc-200">ReCiclo</strong> para el Instituto Tecnológico de Morelia.
        </p>
      </motion.div>

      {/* Secciones de Recursos */}
      <div className="flex flex-col gap-10">
        {TECH_CATEGORIES.map((section, sIdx) => {
          const Icon = section.icon;
          return (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sIdx * 0.08 }}
              className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm"
            >
              <div className="flex items-start gap-3.5 mb-2">
                <div className={`p-2.5 rounded-2xl ${accent.badge} shrink-0`}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    {section.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {section.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-6">
                {section.items.map((item) => (
                  <div
                    key={item.name}
                    className="p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/50 border border-zinc-200/60 dark:border-zinc-800/80 flex flex-col justify-between gap-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div>
                          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            {item.name}
                          </h3>
                          <span className="text-[11px] text-zinc-400 font-medium">
                            {item.category}
                          </span>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${accent.badge} shrink-0`}>
                          {item.badge}
                        </span>
                      </div>
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

      {/* Resumen de Compromiso Ético y Académico */}
      <div className="mt-10 p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed">
        <div className="flex items-center gap-2 font-bold mb-1.5">
          <ShieldCheck className="size-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Compromiso de Transparencia y Rigor Científico</span>
        </div>
        <p>
          ReCiclo no emplea cifras inventadas ni pretende resolver el manejo integral de residuos de manera aislada. La tecnología se implementa como un vehículo educativo accesible para respaldar mejores decisiones cotidianas dentro de la comunidad ponys del IT Morelia, respetando las normas ambientales de México.
        </p>
      </div>

    </div>
  );
}
