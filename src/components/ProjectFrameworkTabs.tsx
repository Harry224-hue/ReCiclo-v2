import { useState, useRef, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Layers,
  Sparkles,
  Globe,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  BookOpen,
  Leaf,
  Users,
  TrendingUp,
  HelpCircle,
  Shuffle,
  MapPinOff,
  UserX,
  Wrench,
  Compass,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

type TabKey = "problem" | "dimensions" | "proposal" | "sdg";

interface TabMeta {
  key: TabKey;
  label: string;
  badge: string;
  icon: typeof AlertCircle;
  shortDesc: string;
}

const TABS: TabMeta[] = [
  {
    key: "problem",
    label: "Diagnóstico ITM",
    badge: "Problemática",
    icon: AlertCircle,
    shortDesc: "Cuatro obstáculos críticos en el campus",
  },
  {
    key: "dimensions",
    label: "Dimensiones Sustentables",
    badge: "Desarrollo Integral",
    icon: Layers,
    shortDesc: "Impacto ambiental, social y económico",
  },
  {
    key: "proposal",
    label: "Propuesta Técnica",
    badge: "Metodología",
    icon: Sparkles,
    shortDesc: "Tres respuestas clave y Regla de las 4V",
  },
  {
    key: "sdg",
    label: "Alineación ODS 12",
    badge: "Agenda 2030",
    icon: Globe,
    shortDesc: "Metas 12.5 y 12.8 de sostenibilidad de la ONU",
  },
];

export function ProjectFrameworkTabs() {
  const { accent } = useTheme();
  const [activeTab, setActiveTab] = useState<TabKey>("problem");
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [mobileExpandedTab, setMobileExpandedTab] = useState<TabKey | null>("problem");

  const collapseBtnRef = useRef<HTMLButtonElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({
    problem: null,
    dimensions: null,
    proposal: null,
    sdg: null,
  });

  const handleTabClick = (key: TabKey) => {
    setActiveTab(key);
    if (!isExpanded) {
      setIsExpanded(true);
    }
    if (rightPanelRef.current) {
      rightPanelRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleMobileTab = (key: TabKey) => {
    setMobileExpandedTab((prev) => (prev === key ? null : key));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex = currentIndex;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % TABS.length;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = TABS.length - 1;
    }

    if (nextIndex !== currentIndex) {
      const nextTab = TABS[nextIndex].key;
      setActiveTab(nextTab);
      tabRefs.current[nextTab]?.focus();
    }
  };

  const activeTabMeta = TABS.find((t) => t.key === activeTab) || TABS[0];
  const ActiveIcon = activeTabMeta.icon;

  return (
    <section
      id="marco-teorico"
      aria-label="Marco del Proyecto y Sustento Ambiental"
      className="py-16 md:py-24 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto transition-colors duration-300 scroll-mt-24"
    >
      {/* ─── TÍTULO PRINCIPAL Y CABECERA INSTITUCIONAL ─── */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 md:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold ${accent.badge} mb-4`}
        >
          <BookOpen className={`size-3.5 ${accent.text}`} />
          <span>Sustento Académico e Institucional · 19º Oxigena tus Ideas ITM</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          Marco Académico y Fundamentos del Proyecto
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mt-3 max-w-2xl"
        >
          Diagnóstico universitario en el IT Morelia, tres dimensiones de la sustentabilidad, propuesta metodológica con la Regla de las 4V y metas de la Agenda 2030.
        </motion.p>
      </div>

      {/* ─── CONTENEDOR COMPACTO PRINCIPAL ─── */}
      <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-4 sm:p-6 lg:p-8 shadow-sm">
        {/* Barra superior de control del contenedor */}
        <div className="flex items-center justify-between pb-5 border-b border-zinc-200/60 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Fundamentos Oficiales ITM
            </span>
          </div>

          <button
            ref={collapseBtnRef}
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            className="inline-flex min-h-[36px] items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold app-btn-secondary cursor-pointer"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="size-3.5 text-zinc-500" />
                <span>Plegar contenedor</span>
              </>
            ) : (
              <>
                <ChevronDown className="size-3.5 text-zinc-500" />
                <span>Desplegar ({TABS.length} secciones)</span>
              </>
            )}
          </button>
        </div>

        {isExpanded && (
          <div className="pt-6">
            {/* ─── VISTA ESCRITORIO (>= 1024px): DISEÑO DIVIDIDO 2 COLUMNAS ─── */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-start">
              {/* Columna Izquierda: Menú vertical de temas (35% de ancho) */}
              <div
                role="tablist"
                aria-label="Secciones académicas"
                aria-orientation="vertical"
                className="lg:col-span-4 flex flex-col gap-2.5 sticky top-4"
              >
                <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-2 mb-1">
                  Secciones del Proyecto
                </div>

                {TABS.map((tab, idx) => {
                  const Icon = tab.icon;
                  const isSelected = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      ref={(el) => {
                        tabRefs.current[tab.key] = el;
                      }}
                      role="tab"
                      id={`desktop-tab-${tab.key}`}
                      tabIndex={isSelected ? 0 : -1}
                      aria-selected={isSelected}
                      aria-controls={`desktop-panel-${tab.key}`}
                      onClick={() => handleTabClick(tab.key)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      className={`flex items-start justify-between gap-3 p-3.5 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-zinc-900/20 dark:border-white/25 bg-white dark:bg-zinc-900 shadow-sm ring-1 ring-zinc-900/10 dark:ring-white/15"
                          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/60 dark:bg-zinc-900/40 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/40"
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`p-2 rounded-xl shrink-0 transition-colors ${
                            isSelected
                              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm"
                              : "bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                          }`}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                            {tab.badge}
                          </span>
                          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                            {tab.label}
                          </div>
                          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-0.5">
                            {tab.shortDesc}
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        className={`size-4 shrink-0 transition-transform mt-2 ${
                          isSelected
                            ? "text-zinc-900 dark:text-white translate-x-0.5"
                            : "text-zinc-400 dark:text-zinc-600"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Columna Derecha: Panel de visualización con scroll interno (65% de ancho) */}
              <div
                id={`desktop-panel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`desktop-tab-${activeTab}`}
                className="lg:col-span-8 flex flex-col bg-zinc-50/60 dark:bg-zinc-950/50 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/80 overflow-hidden"
              >
                {/* Encabezado del panel activo */}
                <div className="flex items-center justify-between px-6 py-3.5 bg-zinc-100/70 dark:bg-zinc-900/70 border-b border-zinc-200/60 dark:border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <ActiveIcon className="size-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      {activeTabMeta.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                    Desplaza para leer
                  </span>
                </div>

                {/* Contenido con scroll acotado adaptado especialmente al contenedor */}
                <div
                  ref={rightPanelRef}
                  className="max-h-[580px] overflow-y-auto px-6 py-5 overscroll-contain"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      {activeTab === "problem" && <FrameworkProblemView />}
                      {activeTab === "dimensions" && <FrameworkDimensionsView />}
                      {activeTab === "proposal" && <FrameworkProposalView />}
                      {activeTab === "sdg" && <FrameworkSDGView />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* ─── VISTA MÓVIL (< 1024px): ACORDEÓN ACCESIBLE EN EL LUGAR ─── */}
            <div className="lg:hidden flex flex-col gap-3">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isItemOpen = mobileExpandedTab === tab.key;
                return (
                  <div
                    key={tab.key}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isItemOpen
                        ? "border-zinc-900/20 dark:border-white/25 bg-white dark:bg-zinc-900 shadow-sm"
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/50"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleMobileTab(tab.key)}
                      aria-expanded={isItemOpen}
                      className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-2 rounded-xl shrink-0 transition-colors ${
                            isItemOpen
                              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950"
                              : "bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                          }`}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                            {tab.badge}
                          </span>
                          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                            {tab.label}
                          </div>
                        </div>
                      </div>
                      <div className="size-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 shrink-0 ml-2">
                        {isItemOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isItemOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="border-t border-zinc-200/60 dark:border-zinc-800 px-4 py-4"
                        >
                          {tab.key === "problem" && <FrameworkProblemView />}
                          {tab.key === "dimensions" && <FrameworkDimensionsView />}
                          {tab.key === "proposal" && <FrameworkProposalView />}
                          {tab.key === "sdg" && <FrameworkSDGView />}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

{/* ─── VISTAS ESPECÍFICAS ADAPTADAS AL CONTENEDOR ─── */}

function FrameworkProblemView() {
  const problems = [
    {
      icon: HelpCircle,
      title: "Falta de información práctica",
      desc: "Desconocimiento sobre si un empaque requiere preparación previa (vaciar, enjuagar o compactar) antes de ser depositado.",
    },
    {
      icon: Shuffle,
      title: "Confusión entre materiales",
      desc: "Dificultad para distinguir entre plásticos reciclables (PET, PEAD) y polímeros no recuperables localmente (BOPP metalizado, unicel sucio).",
    },
    {
      icon: MapPinOff,
      title: "Puntos de disposición lejanos",
      desc: "Incertidumbre sobre qué estación recibe cada residuo específico dentro de los andadores y edificios del campus.",
    },
    {
      icon: UserX,
      title: "Hábitos inadecuados de mezcla",
      desc: "La práctica de mezclar residuos orgánicos con inorgánicos arruina toneladas de material potencialmente reciclable.",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
          Diagnóstico de Campo · IT Morelia
        </span>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
          Cuatro obstáculos críticos en el campus
        </h3>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
          Levantamiento realizado en andadores, cafeterías y comedores de Campus 1 y Campus 2.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {problems.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                  <Icon className="size-4" />
                </div>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {p.title}
                </span>
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {p.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div className="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-300">
        <span>Impacto institucional: Más de 8,000 estudiantes</span>
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          Metodología Oxigena tus Ideas
        </span>
      </div>
    </div>
  );
}

function FrameworkDimensionsView() {
  const dimensions = [
    {
      title: "Dimensión Ambiental",
      icon: Leaf,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      points: [
        "Desvío de residuos valorizables de los rellenos sanitarios municipales.",
        "Reducción directa de la huella de carbono y emisiones de metano.",
        "Conservación de agua mediante enjuague eficiente y separación en origen.",
      ],
    },
    {
      title: "Dimensión Social",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/40",
      points: [
        "Educación ambiental práctica para la comunidad tecnológica del ITM.",
        "Dignificación de la labor del personal de intendencia y mantenimiento.",
        "Fomento de hábitos sustentables replicables en hogares y colonias de Morelia.",
      ],
    },
    {
      title: "Dimensión Económica",
      icon: TrendingUp,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      points: [
        "Recuperación y valorización de PET y aluminio como materias primas secundarias.",
        "Ahorro de costos logísticos y de disposición de residuos institucionales.",
        "Impulso a la economía circular y alianzas con centros de acopio certificados.",
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          Desarrollo Sustentable Integral
        </span>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
          Tres dimensiones de la sustentabilidad
        </h3>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
          Alineación con los criterios de evaluación de ingeniería ambiental y bioquímica.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {dimensions.map((d, idx) => {
          const Icon = d.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col gap-2.5"
            >
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${d.bg} ${d.color}`}>
                  <Icon className="size-4" />
                </div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {d.title}
                </h4>
              </div>
              <ul className="flex flex-col gap-1.5 pl-6 list-disc text-[11px] text-zinc-600 dark:text-zinc-400">
                {d.points.map((pt, pIdx) => (
                  <li key={pIdx} className="leading-relaxed">
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FrameworkProposalView() {
  const steps = [
    {
      num: "01",
      question: "¿Qué residuo tengo?",
      feature: "Identificación Visual Ética",
      answer: "Reconocimiento en catálogo universitario o asistencia visual ligera en el navegador (MobileNet local) sin sustituir el criterio del estudiante.",
      icon: HelpCircle,
    },
    {
      num: "02",
      question: "¿Cómo debo prepararlo?",
      feature: "Regla de las 4V & Análisis de Ciclo de Vida",
      answer: "Instrucciones de preparación física: Vaciar líquidos, Enjuagar restos, Aplastar volumen y Tapar enroscado para proteger el lote de reciclaje.",
      icon: Wrench,
    },
    {
      num: "03",
      question: "¿Dónde depositarlo?",
      feature: "Cartografía Universitaria ITM",
      answer: "Ubicación en mapa georreferenciado con rutas peatonales directas hacia las estaciones oficiales de Campus 1 y Campus 2 según la norma ITMORELIA-IT-AM-007.",
      icon: Compass,
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          Metodología Técnica
        </span>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
          Claridad inmediata para tres preguntas clave
        </h3>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
          El estudiante resuelve el ciclo completo de separación en menos de un minuto.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex items-start gap-3.5"
            >
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                <Icon className="size-4" />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">
                    {s.num}
                  </span>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {s.question}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {s.feature}
                </span>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {s.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FrameworkSDGView() {
  const sdgs = [
    {
      num: "12.5",
      title: "ODS 12: Producción y Consumo Responsables",
      meta: "Reducción sustancial de desechos",
      desc: "De aquí a 2030, reducir considerablemente la generación de desechos mediante actividades de prevención, reducción, reciclado y reutilización en instalaciones universitarias.",
      badge: "Meta Principal",
      color: "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    },
    {
      num: "12.8",
      title: "ODS 12: Información y Sensibilización",
      meta: "Educación ambiental para la sostenibilidad",
      desc: "Asegurar que los estudiantes del ITM cuenten con información pertinente y educación para el desarrollo sostenible y estilos de vida en armonía con la naturaleza.",
      badge: "Formación",
      color: "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    },
    {
      num: "13.3",
      title: "ODS 13: Acción por el Clima",
      meta: "Mitigación del cambio climático",
      desc: "Mejorar la educación, la sensibilización y la capacidad institucional respecto de la mitigación del cambio climático mediante la reducción de emisiones de metano en rellenos sanitarios.",
      badge: "Impacto Global",
      color: "border-teal-500/50 bg-teal-500/10 text-teal-700 dark:text-teal-300",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          Agenda 2030 de la ONU
        </span>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
          Alineación de Sostenibilidad Global
        </h3>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
          Compromiso del Instituto Tecnológico de Morelia con los Objetivos de Desarrollo Sostenible.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {sdgs.map((sdg, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {sdg.title}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sdg.color}`}>
                {sdg.badge}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Meta {sdg.num}: {sdg.meta}
            </span>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {sdg.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
