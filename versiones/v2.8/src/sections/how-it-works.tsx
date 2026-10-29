import { motion } from "framer-motion";
import { Leaf, Scan, Minimize2, MapPin, CheckCircle2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { LazyMount } from "../components/PerformanceOptimizer.tsx";

const STEPS = [
    {
        number: "01",
        badge: "Paso 1 · Identificación",
        badgeColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20",
        icon: <Scan size={22} className="text-emerald-600 dark:text-emerald-400" />,
        title: "Escanea el residuo",
        description: "Apunta con la cámara de tu celular o consulta el catálogo del ITM. La asistencia visual reconoce al instante si es PET, aluminio, cartón u orgánico.",
        footer: "Detección en segundos",
    },
    {
        number: "02",
        badge: "Paso 2 · Norma 4V",
        badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20",
        icon: <Minimize2 size={22} className="text-amber-600 dark:text-amber-400" />,
        title: "Prepara y compacta",
        description: "Aplica la regla de las 4V: vaciar líquidos, enjuagar levemente, aplastar para reducir el 70% del volumen físico y volver a colocar la tapa.",
        footer: "-70% de volumen",
    },
    {
        number: "03",
        badge: "Paso 3 · Campus ITM",
        badgeColor: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20",
        icon: <MapPin size={22} className="text-sky-600 dark:text-sky-400" />,
        title: "Deposita en el contenedor",
        description: "Sigue la cartografía oficial hacia la estación de separación más cercana en Pony Plaza o cafeterías y deposita en el bote del color correspondiente.",
        footer: "Campus 1 y Campus 2",
    },
];

export function HowItWorks() {
    const { accent } = useTheme();

    return (
        <LazyMount minHeight={500}>
            <section id="como-funciona" className="relative py-16 md:py-24 w-full overflow-hidden transition-colors duration-500 scroll-mt-24">
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[140px] rounded-full pointer-events-none -z-10 transition-colors duration-500 ${accent.glow}`} />

                <div className="max-w-6xl mx-auto px-5 md:px-8 relative z-10">
                    {/* Encabezado limpio y directo */}
                    <div className="flex flex-col items-center text-center mb-12 md:mb-16">
                        <motion.div
                            className="flex items-center gap-2 mb-4"
                            initial={{ y: 15, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <Leaf size={16} className={`transition-colors duration-500 ${accent.text}`} />
                            <span className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em] font-semibold">
                                Guía paso a paso · Campus ITM
                            </span>
                        </motion.div>

                        <motion.h2
                            className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tighter text-zinc-900 dark:text-white max-w-4xl leading-[1.08]"
                            initial={{ y: 15, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            Tres pasos. <br className="hidden md:block" />
                            <span className={`text-transparent bg-clip-text bg-gradient-to-r transition-colors duration-500 ${accent.gradient}`}>
                                Reciclaje exacto.
                            </span>
                        </motion.h2>

                        <motion.p
                            className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mt-4 max-w-2xl leading-relaxed"
                            initial={{ y: 15, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.15 }}
                        >
                            El ciclo completo para gestionar tus residuos en el Instituto Tecnológico de Morelia de forma simple, limpia y responsable.
                        </motion.p>
                    </div>

                    {/* Tres tarjetas limpias de pasos sin imágenes ni sobrecargas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {STEPS.map((step, index) => (
                            <motion.div
                                key={step.number}
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * (index + 1), duration: 0.4 }}
                                className="group relative flex flex-col justify-between rounded-3xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-[#11141b] p-7 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div>
                                    {/* Cabecera de la tarjeta: Icono y Número */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 shadow-2xs group-hover:scale-105 transition-transform duration-300">
                                            {step.icon}
                                        </div>
                                        <span className="font-mono text-4xl sm:text-5xl font-black tracking-tight text-zinc-200 dark:text-zinc-800 select-none group-hover:text-zinc-300 dark:group-hover:text-zinc-700 transition-colors">
                                            {step.number}
                                        </span>
                                    </div>

                                    {/* Etiqueta de paso */}
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold mb-3 ${step.badgeColor}`}>
                                        {step.badge}
                                    </span>

                                    {/* Titular */}
                                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white mb-2.5">
                                        {step.title}
                                    </h3>

                                    {/* Descripción */}
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Pie de la tarjeta */}
                                <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400">
                                    <span className="flex items-center gap-1.5 font-semibold">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                        <span>{step.footer}</span>
                                    </span>
                                    <span className="text-[11px] opacity-60">ITM</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </LazyMount>
    );
}
