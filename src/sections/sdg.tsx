import { motion } from "framer-motion";
import { Globe2 } from "lucide-react";
import { ODS_ALIGNMENT } from "../data/wasteData";
import { useTheme } from "../context/ThemeContext";

export function SDG() {
  const { accent } = useTheme();

  return (
    <section id="ods" className="py-20 md:py-28 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto border-t border-zinc-200/60 dark:border-zinc-800 transition-colors duration-300">
      
      {/* Encabezado */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold ${accent.badge} mb-4`}
        >
          <Globe2 className={`size-3.5 ${accent.text}`} />
          <span>Alineación de Sostenibilidad Global</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight"
        >
          Alineación con los Objetivos de Desarrollo Sostenible
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed text-balance"
        >
          No incluimos los 17 ODS como simple adorno gráfico. Nos enfocamos exclusivamente en aquellos donde ReCiclo tiene una contribución verificable y justificada.
        </motion.p>
      </div>

      {/* Grid de ODS Justificados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {ODS_ALIGNMENT.map((ods, idx) => (
          <motion.div
            key={ods.code}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="p-7 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className={`text-xl font-bold font-mono ${accent.text}`}>
                  {ods.code}
                </span>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${accent.badge}`}>
                  {ods.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                {ods.name}
              </h3>

              <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                <p className="mb-2">
                  <strong className="text-zinc-800 dark:text-zinc-200">Por qué aplica:</strong> {ods.whyItMatters}
                </p>
                <p>
                  <strong className="text-zinc-800 dark:text-zinc-200">Contribución concreta:</strong> {ods.howWeContribute}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-[11px] text-zinc-400 font-medium">
                Metas evaluables mediante mediciones en campus
              </span>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
}
