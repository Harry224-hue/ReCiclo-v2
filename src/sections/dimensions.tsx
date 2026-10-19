import { motion } from "framer-motion";
import { Leaf, Users, TrendingUp, CheckCircle2 } from "lucide-react";
import { SUSTAINABLE_DIMENSIONS } from "../data/wasteData";
import { useTheme } from "../context/ThemeContext";

export function Dimensions() {
  const { accent } = useTheme();

  const iconMap = {
    ambiental: Leaf,
    social: Users,
    economica: TrendingUp,
  };

  return (
    <section id="dimensiones" className="py-20 md:py-28 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto border-t border-zinc-200/60 dark:border-zinc-800 transition-colors duration-300">
      
      {/* Encabezado */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold ${accent.badge} mb-4`}
        >
          <Leaf className={`size-3.5 ${accent.text}`} />
          <span>Desarrollo Sustentable Integral</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight"
        >
          Las Tres Dimensiones de la Sustentabilidad
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed text-balance"
        >
          ReCiclo integra el equilibrio entre la protección del ecosistema, el beneficio social comunitario y la viabilidad económica en el manejo de residuos.
        </motion.p>
      </div>

      {/* Grid de las 3 Dimensiones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SUSTAINABLE_DIMENSIONS.map((dim, idx) => {
          const Icon = iconMap[dim.id as keyof typeof iconMap] || Leaf;
          return (
            <motion.div
              key={dim.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-7 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className={`size-12 rounded-2xl ${accent.badge} flex items-center justify-center mb-5`}>
                  <Icon className={`size-6 ${accent.text}`} />
                </div>

                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {dim.title}
                </h3>
                <p className={`text-xs font-semibold ${accent.text} mt-1 mb-4`}>
                  {dim.subtitle}
                </p>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  {dim.description}
                </p>

                <div className="space-y-2 border-t border-zinc-100 dark:border-zinc-800 pt-4 mb-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    Aspectos clave
                  </p>
                  {dim.indicators.map((ind, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                      <CheckCircle2 className={`size-3.5 ${accent.text} shrink-0 mt-0.5`} />
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400">
                Sustento: {dim.verifiedSource}
              </div>
            </motion.div>
          );
        })}
      </div>

    </section>
  );
}
