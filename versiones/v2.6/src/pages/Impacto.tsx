import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Globe2,
  Leaf,
  Users,
  TrendingUp,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Sparkles,
  Scale,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  SUSTAINABLE_DIMENSIONS,
  ODS_ALIGNMENT,
  ITM_RSU_PROCEDURE,
  WASTE_DATABASE,
  ITM_DISPOSAL_POINTS,
  CAMPUS_CONTAINERS_CATALOG,
} from "../data/wasteData";
import { getScanHistory } from "../data/historyStorage";

export default function Impacto() {
  const { accent } = useTheme();
  const [localScansCount, setLocalScansCount] = useState<number>(0);

  useEffect(() => {
    const sync = () => setLocalScansCount(getScanHistory().length);
    sync();
    window.addEventListener("reciclo-history-updated", sync);
    return () => window.removeEventListener("reciclo-history-updated", sync);
  }, []);

  const dimensionIcons = {
    ambiental: Leaf,
    social: Users,
    economica: TrendingUp,
  };

  return (
    <div className="min-h-screen pt-24 pb-28 md:pt-28 md:pb-16 px-4 md:px-8 max-w-5xl mx-auto transition-colors duration-300">
      {/* Encabezado alineado con Tecnologias y Perfil */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-8"
      >
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border mb-3 ${accent.badge}`}
        >
          <Globe2 className="size-3.5" aria-hidden="true" />
          <span>Sustentabilidad · Agenda 2030 · SGI ITM</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Fundamento Ambiental y Alineación ODS
        </h1>

        <p className="mt-2 text-sm md:text-base text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed max-w-3xl">
          Marco ambiental, social y normativo de <strong className="text-zinc-900 dark:text-zinc-200">ReCiclo</strong> para el Instituto Tecnológico de Morelia. Presentamos únicamente la estructura real del proyecto, los lineamientos oficiales del plantel y las metas de los Objetivos de Desarrollo Sostenible a las que contribuye.
        </p>
      </motion.div>

      <div className="flex flex-col gap-10">
        {/* Aviso de Transparencia: Proyecto en Fase de Prototipo (Sin cifras inventadas) */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          aria-label="Estado actual del proyecto"
          className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-5"
        >
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-2xl ${accent.badge} shrink-0`}>
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Estado Actual: Prototipo Funcional sin Cifras Simuladas
                </h2>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  Oxigena tus Ideas 2026
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                ReCiclo se encuentra en etapa de desarrollo y presentación académica, por lo que <strong>aún no se ha desplegado en pruebas de campo masivas</strong> y no exhibimos contadores ficticios de toneladas ni de usuarios. Los indicadores de abajo reflejan únicamente la base técnica real integrada en la plataforma y los registros guardados en tu propio navegador.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/80">
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                {localScansCount}
              </p>
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mt-0.5">
                Tus escaneos locales
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Guardados en este dispositivo
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/80">
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                {WASTE_DATABASE.length}
              </p>
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mt-0.5">
                Residuos catalogados
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Con ficha ACV y regla 3R
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/80">
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                {ITM_DISPOSAL_POINTS.length}
              </p>
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mt-0.5">
                Estaciones mapeadas
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                En Campus 1 y Campus 2 ITM
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/80">
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                {CAMPUS_CONTAINERS_CATALOG.length}
              </p>
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mt-0.5">
                Tipos de contenedor
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Norma {ITM_RSU_PROCEDURE.code}
              </p>
            </div>
          </div>
        </motion.section>

        {/* 1. Las Tres Dimensiones de la Sustentabilidad */}
        <section
          aria-label="Las tres dimensiones de la sustentabilidad"
          className="p-5 sm:p-7 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-6"
        >
          <div>
            <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Las Tres Dimensiones de la Sustentabilidad
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Equilibrio entre protección ecológica, educación comunitaria y aprovechamiento circular de materiales en el campus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SUSTAINABLE_DIMENSIONS.map((dim) => {
              const Icon = dimensionIcons[dim.id as keyof typeof dimensionIcons] || Leaf;
              return (
                <div
                  key={dim.id}
                  className="p-5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/80 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2.5 rounded-xl ${accent.badge} shrink-0`}>
                        <Icon className="size-4.5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {dim.title}
                        </h3>
                        <p className={`text-[11px] font-semibold ${accent.text}`}>
                          {dim.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                      {dim.description}
                    </p>

                    <div className="space-y-2 border-t border-zinc-200/60 dark:border-zinc-800 pt-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        Objetivos en el campus
                      </p>
                      {dim.indicators.map((ind) => (
                        <div
                          key={ind}
                          className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300 leading-snug"
                        >
                          <CheckCircle2 className={`size-3.5 ${accent.text} shrink-0 mt-0.5`} />
                          <span>{ind}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-200/60 dark:border-zinc-800 text-[10px] text-zinc-500">
                    Referencia: {dim.verifiedSource}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. Alineación con los Objetivos de Desarrollo Sostenible (Agenda 2030) */}
        <section
          aria-label="Alineación con los Objetivos de Desarrollo Sostenible"
          className="p-5 sm:p-7 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-6"
        >
          <div>
            <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Alineación con la Agenda 2030 (ODS)
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Nos enfocamos únicamente en los tres Objetivos de Desarrollo Sostenible donde el proyecto tiene incidencia directa y justificable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ODS_ALIGNMENT.map((ods) => (
              <div
                key={ods.code}
                className="p-5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/80 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-base font-bold font-mono ${accent.text}`}>
                      {ods.code}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${accent.badge}`}>
                      {ods.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                    {ods.name}
                  </h3>

                  <div className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <p>
                      <strong className="text-zinc-800 dark:text-zinc-200">Por qué aplica:</strong>{" "}
                      {ods.whyItMatters}
                    </p>
                    <p>
                      <strong className="text-zinc-800 dark:text-zinc-200">Aporte del proyecto:</strong>{" "}
                      {ods.howWeContribute}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Procedimiento SGI ITM y Normatividad Aplicable */}
        <section
          aria-label="Procedimiento oficial SGI del IT Morelia"
          className="p-5 sm:p-7 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-6"
        >
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-2xl ${accent.badge} shrink-0`}>
              <Scale className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Marco Normativo Institucional ({ITM_RSU_PROCEDURE.code})
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                  {ITM_RSU_PROCEDURE.revision}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                {ITM_RSU_PROCEDURE.objective}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Registros del SGI */}
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                <FileCheck2 className={`size-4 ${accent.text} shrink-0`} />
                <span>Formatos Oficiales de Seguimiento en el ITM</span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Instrumentos con los que el Departamento de Recursos Materiales y el SGI documentan el manejo real de residuos en el campus:
              </p>
              <div className="space-y-2 pt-1">
                {ITM_RSU_PROCEDURE.documentedRecords.map((rec) => (
                  <div
                    key={rec.code}
                    className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 flex items-start justify-between gap-3"
                  >
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {rec.name}
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Responsable: {rec.responsible}
                      </p>
                    </div>
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md shrink-0 ${accent.badge}`}>
                      {rec.code}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Normas Oficiales y Estándares */}
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/80 flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  <ShieldCheck className={`size-4 ${accent.text} shrink-0`} />
                  <span>Normas Mexicanas e Internacionales de Referencia</span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Estándares técnicos en los que se apoya la clasificación y cuantificación de subproductos:
                </p>
                <ul className="space-y-2 pt-1">
                  {ITM_RSU_PROCEDURE.normativeStandards.map((std) => (
                    <li
                      key={std}
                      className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2 leading-relaxed"
                    >
                      <CheckCircle2 className={`size-3.5 ${accent.text} shrink-0 mt-0.5`} />
                      <span>{std}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                <strong className="text-zinc-800 dark:text-zinc-200">Alcance institucional:</strong>{" "}
                {ITM_RSU_PROCEDURE.scope}
              </div>
            </div>
          </div>
        </section>

        {/* CTA final coherente con el resto de la app */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
              <Leaf className={`size-4 ${accent.text} shrink-0`} />
              <span>Explora las herramientas del proyecto</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Clasifica un residuo desde tu navegador para consultar su Análisis de Ciclo de Vida o revisa la ubicación de los contenedores en el mapa del campus.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              to="/escanear"
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition-transform active:scale-95 ${accent.btn}`}
            >
              <Sparkles size={14} />
              <span>Escanear Residuo</span>
              <ArrowRight size={13} />
            </Link>
            <Link
              to="/mapa"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <MapPin size={14} />
              <span>Ver Mapa ITM</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
