import { useState } from "react";
import { ArrowRight, Sparkles, Compass, Recycle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { LazyMount, LazyImage } from "../components/PerformanceOptimizer";
import ctaLeft from "../assets/project/cta-materiales.jpg";
import ctaCenter from "../assets/project/cta-scan-mobile.jpg";
import ctaRight from "../assets/project/cta-smart-bin.jpg";

interface FeatureCard {
  id: string;
  shortTitle: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  link: string;
  ctaText: string;
  icon: typeof Sparkles;
}

const CARDS: FeatureCard[] = [
  {
    id: "scanner",
    shortTitle: "IA Gemini",
    badge: "Diagnóstico Multimodal",
    title: "Identificación con IA Gemini",
    description: "Diagnóstico multimodal instantáneo de materiales, cálculo de reciclabilidad y análisis de ciclo de vida (ACV) en tiempo real con visión artificial.",
    image: ctaCenter,
    alt: "Escáner móvil ReCiclo IT Morelia",
    link: "/escanear",
    ctaText: "Escanear con IA Gemini",
    icon: Sparkles,
  },
  {
    id: "map",
    shortTitle: "Mapa ITM",
    badge: "Campus 1 y Campus 2",
    title: "Cartografía y Botes del ITM",
    description: "Ubica los contenedores oficiales y centros de acopio en el IT Morelia con geolocalización precisa y rutas peatonales directas paso a paso.",
    image: ctaRight,
    alt: "Punto de acopio y bote inteligente en campus ITM",
    link: "/mapa",
    ctaText: "Explorar Mapa del Campus",
    icon: Compass,
  },
  {
    id: "materials",
    shortTitle: "Ciclo de Vida",
    badge: "Economía Circular",
    title: "Clasificación y Ciclo de Vida",
    description: "Trazabilidad ecológica para plásticos, latas de aluminio y botellas de vidrio, cuantificando la reducción de huella de carbono y ahorro hídrico.",
    image: ctaLeft,
    alt: "Materiales y botellas clasificadas para reciclaje",
    link: "/impacto",
    ctaText: "Ver Impacto y Métricas",
    icon: Recycle,
  },
];

export function ScannerCTA() {
  const { accent } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <LazyMount minHeight={640}>
      <section className="py-24 md:py-28 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 w-full flex flex-col items-center justify-center transition-colors duration-500">
        <div className="max-w-6xl w-full mx-auto flex flex-col items-center">
          
          {/* Encabezado de la Sección */}
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 border shadow-sm ${accent.badge}`}
            >
              <Sparkles size={13} />
              <span>Ecosistema ReCiclo • IT Morelia</span>
            </motion.div>

            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-semibold text-zinc-900 dark:text-white tracking-tight mb-4 transition-colors duration-500 leading-tight"
              initial={{ y: 25, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Identifica con IA Gemini y ubica el bote exacto en el ITM
            </motion.h2>

            <motion.p
              className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl font-normal leading-relaxed transition-colors duration-500"
              initial={{ y: 25, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Diagnóstico multimodal instantáneo de materiales, análisis de ciclo de vida (ACV) y cartografía oficial de Campus 1 y 2 con rutas peatonales directas.
            </motion.p>
          </div>

          {/* Carrusel de Tarjetas Expandibles (Estilo Acordeón Interactivo) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full h-[440px] sm:h-[480px] md:h-[520px] flex flex-row gap-2.5 sm:gap-4 md:gap-5 items-stretch select-none"
          >
            {CARDS.map((card, index) => {
              const isActive = activeIndex === index;
              const IconComponent = card.icon;

              return (
                <div
                  key={card.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={card.title}
                  tabIndex={0}
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveIndex(index);
                    }
                  }}
                  className={`relative rounded-2xl sm:rounded-3xl overflow-hidden border transition-[flex,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group cursor-pointer will-change-[flex] ${
                    isActive
                      ? "flex-[3.5] sm:flex-[4] lg:flex-[4.5] min-w-0 border-white/20 dark:border-white/15 shadow-2xl ring-1 ring-white/10"
                      : "flex-[0.6] sm:flex-1 min-w-[48px] sm:min-w-[70px] border-black/10 dark:border-white/10 hover:border-white/25 shadow-md hover:shadow-xl"
                  }`}
                >
                  {/* Imagen de fondo LazyImage */}
                  <LazyImage
                    src={card.image}
                    alt={card.alt}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      isActive ? "scale-100 group-hover:scale-105" : "scale-105 grayscale-[15%] group-hover:grayscale-0"
                    }`}
                  />

                  {/* Capa de oscurecimiento cuando está colapsada */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-400 ease-out ${
                      isActive
                        ? "opacity-0 pointer-events-none"
                        : "bg-black/45 group-hover:bg-black/25 opacity-100"
                    }`}
                  />

                  {/* Vista colapsada: Icono y texto vertical */}
                  <div
                    className={`absolute inset-0 z-10 flex flex-col justify-between items-center py-6 sm:py-8 px-1.5 pointer-events-none transition-all ease-out ${
                      isActive
                        ? "opacity-0 scale-90 duration-150 delay-0 pointer-events-none"
                        : "opacity-100 scale-100 duration-300 delay-150"
                    }`}
                  >
                    <div className="size-8 sm:size-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <IconComponent size={16} />
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-white/90 [writing-mode:vertical-rl] rotate-180 tracking-widest uppercase drop-shadow-md">
                      {card.shortTitle}
                    </span>
                  </div>

                  {/* Gradiente inferior para legibilidad en tarjeta activa */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/10 z-10 pointer-events-none transition-opacity duration-400 ease-out ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  {/* Gradiente superior sutil */}
                  <div
                    className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent z-10 pointer-events-none transition-opacity duration-400 ease-out ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  {/* Contenido protagonista en tarjeta activa: suave, coordinado y sin saltos */}
                  <div
                    className={`absolute inset-x-0 bottom-0 p-5 sm:p-7 md:p-9 z-20 flex flex-col items-start text-left w-full max-w-2xl transition-all ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      isActive
                        ? "opacity-100 translate-y-0 duration-400 delay-150 pointer-events-auto"
                        : "opacity-0 translate-y-3 duration-150 delay-0 pointer-events-none"
                    }`}
                  >
                    {/* Píldora / Badge de categoría */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-white border border-white/25 mb-2.5 sm:mb-3 shadow-sm">
                      <IconComponent size={13} className="text-emerald-400" />
                      <span>{card.badge}</span>
                    </div>

                    {/* Título de la tarjeta - Prominente y en blanco puro */}
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-2 sm:mb-3 leading-snug drop-shadow-md">
                      {card.title}
                    </h3>

                    {/* Descripción clara y legible */}
                    <p className="text-zinc-200 text-xs sm:text-sm md:text-base font-normal leading-relaxed mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3 md:line-clamp-none drop-shadow-sm">
                      {card.description}
                    </p>

                    {/* Botón de Acción Directo */}
                    <Link
                      to={card.link}
                      onClick={(e) => e.stopPropagation()}
                      className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full transition-all duration-300 shadow-xl active:scale-95 group/btn cursor-pointer ${accent.btn}`}
                    >
                      <span>{card.ctaText}</span>
                      <ArrowRight size={15} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Selector inferior de píldoras rápidas para facilitar el cambio en móviles y PC */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
            {CARDS.map((card, idx) => {
              const isPillActive = activeIndex === idx;
              const IconComp = card.icon;

              return (
                <button
                  key={`pill-${card.id}`}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    isPillActive
                      ? `${accent.btn} shadow-md scale-105`
                      : "bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-black/5 dark:border-white/10 backdrop-blur-sm"
                  }`}
                >
                  <IconComp size={14} />
                  <span>{card.shortTitle}</span>
                </button>
              );
            })}
          </div>

        </div>
      </section>
    </LazyMount>
  );
}