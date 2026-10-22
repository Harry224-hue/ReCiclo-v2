import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Camera,
  ListChecks,
  MapPin,
  ChevronDown,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  CAMPUS_CONTAINERS_CATALOG,
  ITM_RSU_PROCEDURE,
  WASTE_DATABASE,
  ITM_DISPOSAL_POINTS,
} from "../data/wasteData";

const WORKFLOW_STEPS = [
  {
    num: "01",
    badge: "IA + Catálogo Integrado",
    title: "Identifica tu residuo con cámara o buscador",
    desc: `Enfoca el envase desde tu teléfono, sube una foto o búscalo por nombre entre los ${WASTE_DATABASE.length} residuos documentados del campus. Con conexión a internet, el sistema analiza la imagen con Gemini 2.5 Flash y, si el servicio en la nube no está disponible o agota su cuota, recurre a TensorFlow.js (MobileNet v2) en el navegador.`,
    detail: "Reconoce botellas PET, latas de aluminio y hojalata, papel, cartón, unicel, envolturas metalizadas, restos orgánicos y pilas.",
    icon: Camera,
  },
  {
    num: "02",
    badge: "Regla de las 4V y ACV",
    title: "Prepara el material antes de desecharlo",
    desc: "Un envase reciclable con restos de líquido o grasa contamina a los demás materiales del contenedor. ReCiclo te indica cómo prepararlo paso a paso y te muestra su tiempo estimado de degradación y Análisis de Ciclo de Vida (ACV).",
    detail: "Aplica la regla de las 4V en envases plásticos: Vaciar, Enjuagar con poca agua, Aplastar y volver a Tapar.",
    icon: ListChecks,
  },
  {
    num: "03",
    badge: `${ITM_DISPOSAL_POINTS.length} Estaciones en Campus 1 y 2`,
    title: "Ubica el contenedor oficial más cercano",
    desc: `Consulta el color exacto del bote según el procedimiento ${ITM_RSU_PROCEDURE.code} (${ITM_RSU_PROCEDURE.revision}) y abre el mapa interactivo para localizar la estación de separación más próxima en Campus 1 (Av. Tecnológico) o Campus 2 (San José de la Huerta).`,
    detail: "Las rutas sugeridas respetan los andadores peatonales del Instituto para proteger las áreas verdes.",
    icon: MapPin,
  },
];

const REGLA_4V = [
  {
    step: "1. Vaciar",
    desc: "Escurre por completo cualquier resto de líquido, caldo o alimento antes de acercarte al bote.",
  },
  {
    step: "2. Enjuagar",
    desc: "Si contenía azúcar, leche o grasa, dale un enjuague rápido con muy poca agua para evitar malos olores e insectos.",
  },
  {
    step: "3. Aplastar",
    desc: "Compacta botellas de PET, latas de aluminio y cajas de cartón para aprovechar hasta un 70% más la capacidad del contenedor.",
  },
  {
    step: "4. Tapar",
    desc: "Enrosca de nuevo la tapa plástica en las botellas de PET para evitar derrames y asegurar que la tapita también se recicle.",
  },
];

const FAQS = [
  {
    q: "¿Se necesita conexión a internet para usar ReCiclo?",
    a: "Sí. Al ser una aplicación web servida en línea, requiere conexión a internet para cargar la interfaz (incluso si agregaste un acceso directo en tu pantalla de inicio), descargar las teselas del mapa y consultar los modelos de inteligencia artificial. Si durante tu sesión falla el servicio principal de Gemini 2.5 Flash o se alcanza el límite de peticiones, el escáner cambia automáticamente al modelo MobileNet v2 en el navegador o al buscador del catálogo.",
  },
  {
    q: "¿Es obligatorio crear una cuenta para usar el escáner o el mapa?",
    a: "No. Todas las herramientas de identificación, el mapa de contenedores de Campus 1 y 2 y el historial local funcionan sin iniciar sesión. La cuenta con correo o Google es opcional por si deseas respaldar tus preferencias académicas y foto de perfil.",
  },
  {
    q: "¿Por qué los vasos de café desechables o bolsas de frituras van al bote negro?",
    a: "Aunque un vaso de café parece de cartón, tiene una película plástica interna adherida que impide repulparlo en las recicladoras locales; del mismo modo, las envolturas de botanas combinan plástico y aluminio vaporizado (BOPP metalizado) sin cadena de reciclaje viable en Morelia.",
  },
  {
    q: "¿Por qué ReCiclo no incluye puntos canjeables ni rachas competitivas?",
    a: "Porque es una herramienta educativa y de consulta ambiental para el Instituto Tecnológico de Morelia. Preferimos ofrecer información verificable basada en la norma ITMORELIA-IT-AM-007 en lugar de mecánicas de juego artificiales.",
  },
];

export default function ComoFunciona() {
  const { accent } = useTheme();
  const [selectedBinId, setSelectedBinId] = useState<string>(CAMPUS_CONTAINERS_CATALOG[0].id);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const activeBin =
    CAMPUS_CONTAINERS_CATALOG.find((b) => b.id === selectedBinId) || CAMPUS_CONTAINERS_CATALOG[0];

  return (
    <div className="min-h-screen pt-24 pb-28 md:pt-28 md:pb-16 px-4 md:px-8 max-w-5xl mx-auto transition-colors duration-300">
      {/* Encabezado alineado con el diseño general */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-8"
      >
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border mb-3 ${accent.badge}`}
        >
          <BookOpen className="size-3.5" aria-hidden="true" />
          <span>Guía Práctica · {ITM_RSU_PROCEDURE.code}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Cómo Funciona ReCiclo en el Campus
        </h1>

        <p className="mt-2 text-sm md:text-base text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed max-w-3xl">
          Guía directa para identificar tus residuos cotidianos, prepararlos con la regla de las 4V y depositarlos en el contenedor correcto dentro del{" "}
          <strong className="text-zinc-900 dark:text-zinc-200">
            Instituto Tecnológico de Morelia
          </strong>{" "}
          conforme al procedimiento oficial del Sistema de Gestión Ambiental.
        </p>
      </motion.div>

      <div className="flex flex-col gap-10">
        {/* 1. Flujo en 3 pasos */}
        <section aria-label="Flujo de uso en tres pasos" className="space-y-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Flujo de Clasificación en 3 Pasos
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Desde que tienes un envase en la mano hasta que lo depositas en la estación correspondiente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {WORKFLOW_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className={`p-2.5 rounded-2xl ${accent.badge}`}>
                        <Icon className="size-5" />
                      </div>
                      <span className="text-xs font-bold font-mono text-zinc-400 dark:text-zinc-500">
                        PASO {step.num}
                      </span>
                    </div>

                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md mb-2 ${accent.badge}`}
                    >
                      {step.badge}
                    </span>

                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                      {step.title}
                    </h3>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mt-2">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                    {step.detail}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 2. Código Oficial de Contenedores ITM */}
        <section
          aria-label="Código oficial de contenedores del IT Morelia"
          className="p-5 sm:p-7 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Código Oficial de Contenedores en el ITM
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                Selecciona cada contenedor para consultar qué materiales acepta y cuáles deben evitarse según la sección 4.1 de {ITM_RSU_PROCEDURE.code}.
              </p>
            </div>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 self-start ${accent.badge}`}>
              {ITM_RSU_PROCEDURE.revision}
            </span>
          </div>

          {/* Selector de contenedor */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
            {CAMPUS_CONTAINERS_CATALOG.map((bin) => {
              const isSelected = bin.id === activeBin.id;
              return (
                <button
                  key={bin.id}
                  type="button"
                  onClick={() => setSelectedBinId(bin.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all shrink-0 cursor-pointer border ${
                    isSelected
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-xs"
                      : "bg-zinc-50 dark:bg-zinc-950/60 text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  <span
                    className="size-3 rounded-full shrink-0 border border-black/10 dark:border-white/20"
                    style={{ backgroundColor: bin.colorHex }}
                  />
                  <span>{bin.name.replace(" — ", " · ")}</span>
                </button>
              );
            })}
          </div>

          {/* Detalle del contenedor activo */}
          <div className="p-5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/80 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200/70 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <span
                  className="size-5 rounded-lg shrink-0 border border-black/10 dark:border-white/20"
                  style={{ backgroundColor: activeBin.colorHex }}
                />
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {activeBin.name.replace(" — ", ": ")}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {activeBin.shortDescription}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                {activeBin.normativeReference}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sí va aquí */}
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-3">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>Materiales que SÍ van en este contenedor</span>
                </div>
                <ul className="space-y-2">
                  {activeBin.acceptedMaterials.map((mat) => (
                    <li
                      key={mat}
                      className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2 leading-relaxed"
                    >
                      <span className="size-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      <span>{mat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* No va aquí */}
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-400 mb-3">
                  <XCircle className="size-4 shrink-0" />
                  <span>Materiales que NO deben depositarse aquí</span>
                </div>
                <ul className="space-y-2">
                  {activeBin.rejectedMaterials.map((mat) => (
                    <li
                      key={mat}
                      className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2 leading-relaxed"
                    >
                      <span className="size-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                      <span>{mat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Reglas de preparación antes de depositar
                </p>
                <ul className="space-y-1.5">
                  {activeBin.preparationRules.map((rule) => (
                    <li key={rule} className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      • {rule}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 flex flex-col justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                    Destino en el campus
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {activeBin.campusDestination}
                  </p>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <strong className="text-zinc-700 dark:text-zinc-300">Nota práctica:</strong>{" "}
                  {activeBin.handlingTip}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Regla de las 4V */}
        <section
          aria-label="Regla de las 4V"
          className="p-5 sm:p-7 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-5"
        >
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-2xl ${accent.badge} shrink-0`}>
              <Trash2 className="size-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                La Regla de las 4V para Envases Reciclables
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                Hábito básico promovido por el Sistema de Gestión Ambiental para que el PET, aluminio y cartón del campus realmente puedan reciclarse.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {REGLA_4V.map((item) => (
              <div
                key={item.step}
                className="p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/80"
              >
                <p className={`text-xs font-bold ${accent.text} mb-1.5`}>{item.step}</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Preguntas Frecuentes */}
        <section
          aria-label="Preguntas frecuentes"
          className="p-5 sm:p-7 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-5"
        >
          <div>
            <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Preguntas Frecuentes
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Dudas comunes sobre el funcionamiento técnico y normativo de ReCiclo.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/80 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 shrink-0 text-zinc-400 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-200/50 dark:border-zinc-800/70">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* Nota institucional y accesos rápidos */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
              <ShieldCheck className={`size-4 ${accent.text} shrink-0`} />
              <span>Ponlo en práctica en el campus</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Abre el escáner para identificar un residuo en este momento o consulta el mapa de contenedores de Campus 1 y Campus 2.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              to="/escanear"
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition-transform active:scale-95 ${accent.btn}`}
            >
              <Sparkles size={14} />
              <span>Ir al Escáner</span>
              <ArrowRight size={13} />
            </Link>
            <Link
              to="/mapa"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <MapPin size={14} />
              <span>Mapa del Campus</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
