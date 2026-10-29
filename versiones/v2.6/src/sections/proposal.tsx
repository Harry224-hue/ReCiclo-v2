import { motion } from "framer-motion";
import { HelpCircle, Wrench, MapPin, Compass, ShieldCheck } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export function Proposal() {
  const { accent } = useTheme();

  const threeQuestions = [
    {
      num: "01",
      question: "¿Qué residuo tengo?",
      feature: "Escáner con IA Multimodal Gemini",
      answer: "Apunta con la cámara o sube una imagen: la inteligencia artificial de Gemini detecta el envase, marca, polímero y categoría exacta en segundos.",
      icon: HelpCircle,
    },
    {
      num: "02",
      question: "¿Cómo debo manejarlo?",
      feature: "Regla de las 4V & Análisis de Ciclo de Vida",
      answer: "Instrucciones de preparación física: vaciar líquidos, enjuagar restos, compactar volumen y enroscar tapa para no contaminar el lote de reciclaje ni la composta.",
      icon: Wrench,
    },
    {
      num: "03",
      question: "¿Dónde puedo depositarlo?",
      feature: "Cartografía de Planos Oficiales ITM",
      answer: "Localización perimetral en Campus 1 y 2: identifica si el contenedor correcto (Verde, Amarillo, Negro, Azul o Pilas) está en Pony Plaza, cafeterías o aulas con ruta peatonal.",
      icon: MapPin,
    },
  ];

  return (
    <section id="propuesta" className="py-20 md:py-28 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto border-t border-zinc-200/60 dark:border-zinc-800 transition-colors duration-300">
      
      {/* Encabezado */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold ${accent.badge} mb-4`}
        >
          <Compass className={`size-3.5 ${accent.text}`} />
          <span>Propuesta Educativa y Ambiental</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight"
        >
          Claridad inmediata para tres preguntas clave
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed text-balance"
        >
          La aplicación traduce la complejidad normativa y los códigos de reciclaje en tres respuestas sencillas, directas y accionables.
        </motion.p>
      </div>

      {/* Las Tres Preguntas en Cards Didácticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {threeQuestions.map((q, idx) => {
          const Icon = q.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-7 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className={`text-3xl font-extrabold opacity-40 ${accent.text}`}>
                    {q.num}
                  </span>
                  <div className="size-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
                    <Icon className="size-5" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  {q.question}
                </h3>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
                  {q.feature}
                </p>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                  {q.answer}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <span className={`text-xs font-semibold ${accent.text}`}>
                  Respuesta inmediata en app
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Declaración de Propósito y Alcance */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex items-start gap-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400"
      >
        <ShieldCheck className={`size-5 ${accent.text} shrink-0 mt-0.5`} />
        <div>
          <p className="leading-relaxed">
            <strong>ReCiclo no resuelve por sí solo el problema de los residuos.</strong> Es una herramienta de apoyo digital concebida para fortalecer la educación ambiental y fomentar hábitos responsables de separación dentro de una estrategia colectiva más amplia en el Instituto Tecnológico de Morelia.
          </p>
        </div>
      </motion.div>

    </section>
  );
}
