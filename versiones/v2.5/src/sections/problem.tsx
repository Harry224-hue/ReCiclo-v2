import { motion } from "framer-motion";
import { AlertCircle, FileText, HelpCircle, MapPinOff, Shuffle, UserX } from "lucide-react";

export function Problem() {
  const problemPoints = [
    {
      icon: HelpCircle,
      title: "Falta de información práctica",
      desc: "Desconocimiento sobre si un empaque requiere preparación previa (como enjuagar o compactar) antes de ser depositado.",
    },
    {
      icon: Shuffle,
      title: "Confusión entre materiales",
      desc: "Dificultad para distinguir entre plásticos reciclables (PET, PEAD) y polímeros no recuperables localmente (BOPP metalizado, unicel sucio).",
    },
    {
      icon: MapPinOff,
      title: "Puntos de disposición difíciles de ubicar",
      desc: "Incertidumbre sobre qué contenedor recibe cada residuo específico dentro de los andadores y edificios del campus.",
    },
    {
      icon: UserX,
      title: "Hábitos inadecuados de disposición",
      desc: "La práctica común de mezclar orgánicos con reciclables arruina toneladas de material que de otro modo tendrían una segunda vida.",
    },
  ];

  return (
    <section id="problema" className="py-20 md:py-28 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto transition-colors duration-300">
      
      {/* Encabezado del Problema */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 mb-4"
        >
          <AlertCircle className="size-3.5 text-rose-600 dark:text-rose-400" />
          <span>Diagnóstico de la Problemática Real</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight"
        >
          El reto no es solo "querer reciclar", sino saber cómo hacerlo
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed text-balance"
        >
          La separación inadecuada de residuos no se origina únicamente en la falta de interés, sino en barreras cotidianas de información, confusión técnica y falta de infraestructura visible en los espacios educativos.
        </motion.p>
      </div>

      {/* Grid de Aspectos Clave de la Dificultad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-14">
        {problemPoints.map((p, idx) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col"
            >
              <div className="size-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center mb-4 shrink-0">
                <Icon className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                {p.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                {p.desc}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Sustento en Información Real y Verificable */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 sm:p-8 rounded-3xl bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row gap-6 items-start"
      >
        <div className="size-12 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shrink-0">
          <FileText className="size-6" />
        </div>
        <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed flex-1">
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            Datos Verificables de Referencia Oficial (SEMARNAT & INEGI)
          </h4>
          <p className="mb-2">
            De acuerdo con el <em>Diagnóstico Básico para la Gestión Integral de los Residuos</em> (SEMARNAT), en México se generan más de 120,000 toneladas diarias de residuos sólidos urbanos. De estos, más del 30% son materiales potencialmente reciclables, pero solo una fracción mínima se recupera debido a que se mezclan y contaminan con desechos húmedos desde el origen.
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 italic">
            * <strong>Nota metodológica para el IT Morelia:</strong> Los volúmenes y porcentajes específicos de generación de residuos en los andadores y cafeterías del Instituto Tecnológico de Morelia se encuentran identificados como <em>información pendiente de medición directa</em> mediante muestreos, encuestas y pesaje físico de las brigadas estudiantiles.
          </p>
        </div>
      </motion.div>

    </section>
  );
}
