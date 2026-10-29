import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import CountUp from "../components/count-number";
import { useTheme } from "../context/ThemeContext";
import { LazyMount } from "../components/PerformanceOptimizer.tsx";

const themeStyles = {
    emerald: {
        hover: "group-hover:text-emerald-500 dark:group-hover:text-emerald-400",
        text: "text-emerald-600 dark:text-emerald-500",
        gradient: "from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-400"
    },
    blue: {
        hover: "group-hover:text-blue-500 dark:group-hover:text-blue-400",
        text: "text-blue-600 dark:text-blue-500",
        gradient: "from-blue-500 to-cyan-600 dark:from-blue-400 dark:to-cyan-400"
    },
    amber: {
        hover: "group-hover:text-amber-500 dark:group-hover:text-amber-400",
        text: "text-amber-600 dark:text-amber-500",
        gradient: "from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-400"
    },
    purple: {
        hover: "group-hover:text-purple-500 dark:group-hover:text-purple-400",
        text: "text-purple-600 dark:text-purple-500",
        gradient: "from-purple-500 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400"
    },
    rose: {
        hover: "group-hover:text-rose-500 dark:group-hover:text-rose-400",
        text: "text-rose-600 dark:text-rose-500",
        gradient: "from-rose-500 to-pink-600 dark:from-rose-400 dark:to-pink-400"
    }
};

export function Impact() {
    const { accentColor, accent } = useTheme();
    const currentTheme = (accentColor in themeStyles)
        ? themeStyles[accentColor as keyof typeof themeStyles]
        : { hover: "group-hover:opacity-80", text: accent.text, gradient: accent.gradient };

    return (
        // Sin imágenes que optimizar aquí (son solo números animados), pero igual se
        // difiere el montaje: los tres CountUp + sus motion.div no tienen por qué
        // correr antes de que el usuario esté por llegar a esta sección.
        <LazyMount minHeight={640}>
            <section id="impacto" className="py-20 md:py-24 px-4 md:px-16 lg:px-24 xl:px-32 w-full transition-colors duration-300 flex flex-col items-center scroll-mt-24">

                <div className="flex flex-col items-center text-center max-w-4xl mb-16 md:mb-20">

                    <motion.div className="flex items-center gap-2 mb-6"
                                initial={{ y: 15, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                    >
                        <Globe size={16} className={`transition-colors duration-500 ${currentTheme.text}`} />
                        <span className="text-sm text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em] font-medium">
                            Impacto Global
                        </span>
                    </motion.div>

                    <motion.h2 className="text-5xl md:text-[80px]/none font-medium tracking-tighter mb-6"
                               initial={{ y: 50, opacity: 0 }}
                               whileInView={{ y: 0, opacity: 1 }}
                               viewport={{ once: true }}
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-zinc-900 to-zinc-400 dark:from-white dark:to-zinc-600">
                            El resultado de hacerlo{" "}
                        </span>
                        {/* 💡 PALABRA RESALTADA CON EL COLOR DINÁMICO */}
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r transition-colors duration-500 ${currentTheme.gradient}`}>
                            simple.
                        </span>
                    </motion.h2>

                    <motion.p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl max-w-2xl font-light"
                              initial={{ y: 50, opacity: 0 }}
                              whileInView={{ y: 0, opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.1 }}
                    >
                        Cuando la herramienta desaparece y la acción es intuitiva, el impacto en el planeta se multiplica a una escala global.
                    </motion.p>
                </div>

                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 relative">

                    <div className="hidden md:block absolute top-1/2 left-1/3 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-zinc-300 dark:via-zinc-700 to-transparent"></div>
                    <div className="hidden md:block absolute top-1/2 right-1/3 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-zinc-300 dark:via-zinc-700 to-transparent"></div>

                    {[
                        { val: 150, suf: "k", label: "Objetos Escaneados", delay: 0 },
                        { val: 25, suf: "T", label: "Emisiones Reducidas", delay: 0.1 },
                        { val: 99, suf: "%", label: "Precisión Analítica", delay: 0.2 }
                    ].map((stat, i) => (
                        <motion.div key={i} className="flex flex-col items-center justify-center text-center group cursor-default"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: stat.delay, type: "spring", stiffness: 300, damping: 50 }}
                        >
                            <span className={`text-7xl md:text-8xl font-medium tracking-tighter text-zinc-900 dark:text-white mb-2 transition-colors duration-500 ${currentTheme.hover}`}>
                                <CountUp from={0} to={stat.val} />{stat.suf}
                            </span>
                            <span className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em] font-semibold">
                                {stat.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </section>
        </LazyMount>
    );
}