import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { LazyMount, LazyImage } from "../components/PerformanceOptimizer.tsx";
import campusImage from "../assets/project/campus-ecosistema.jpg";

const themeStyles = {
    emerald: { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500 hover:bg-emerald-600 text-white", ring: "focus:ring-emerald-500" },
    blue: { text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500 hover:bg-blue-600 text-white", ring: "focus:ring-blue-500" },
    amber: { text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500 hover:bg-amber-600 text-white", ring: "focus:ring-amber-500" },
    purple: { text: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500 hover:bg-purple-600 text-white", ring: "focus:ring-purple-500" },
    rose: { text: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500 hover:bg-rose-600 text-white", ring: "focus:ring-rose-500" }
};

export function Partnerships() {
    const { accentColor, accent } = useTheme();
    const currentTheme = (accentColor in themeStyles)
        ? themeStyles[accentColor as keyof typeof themeStyles]
        : { text: accent.text, bg: accent.btn, ring: accent.ring };

    return (
        <LazyMount minHeight={640}>
            <section className="py-20 md:py-16 w-full flex items-center justify-center transition-colors duration-500">
                <div className="max-w-5xl w-full mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="flex flex-col">
                        <motion.div className="flex items-center gap-2" initial={{ y: -20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
                            <span className={`text-xs uppercase tracking-[0.2em] font-semibold transition-colors duration-500 ${currentTheme.text}`}>Integración</span>
                        </motion.div>

                        <motion.h2 className="text-4xl md:text-[44px]/11 text-zinc-900 dark:text-white mt-4 tracking-tight font-medium max-w-100" initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
                            Llévalo a tu ecosistema.
                        </motion.h2>

                        <form className="mt-12 flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <motion.input type="text" placeholder="Nombre completo" className={`w-full bg-black/5 dark:bg-white/5 border border-transparent rounded-xl px-4 py-3.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all duration-300 ${currentTheme.ring}`} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} />
                                <motion.input type="email" placeholder="Correo electrónico" className={`w-full bg-black/5 dark:bg-white/5 border border-transparent rounded-xl px-4 py-3.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all duration-300 ${currentTheme.ring}`} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} />
                            </div>
                            <motion.input type="text" placeholder="Organización o Institución" className={`w-full bg-black/5 dark:bg-white/5 border border-transparent rounded-xl px-4 py-3.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all duration-300 ${currentTheme.ring}`} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} />
                            <motion.textarea rows={3} placeholder="¿Cómo planeas integrar ReCiclo?" className={`w-full bg-black/5 dark:bg-white/5 border border-transparent rounded-xl px-4 py-3.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${currentTheme.ring}`} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} />

                            <motion.div className="mt-2" initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
                                <button type="submit" className={`w-auto text-sm font-medium px-8 py-3.5 rounded-full transition-colors duration-500 cursor-pointer shadow-lg active:scale-95 ${currentTheme.bg}`}>
                                    Contactar equipo
                                </button>
                            </motion.div>
                        </form>
                    </div>

                    <motion.div className="relative overflow-hidden group flex justify-center" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                        <div className="relative w-95.5 h-113.75 overflow-hidden rounded-[2rem]">
                            {/* No es la imagen principal de la página: lazy. */}
                            <LazyImage src={campusImage} alt="Campus sustentable con ReCiclo" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none" />
                            <div className="absolute bottom-6 left-6 right-6 backdrop-blur-2xl bg-white/40 dark:bg-black/40 border border-white/30 dark:border-white/10 saturate-[180%] p-6 rounded-3xl shadow-2xl z-10">
                                <span className="text-xs font-semibold tracking-[0.1em] text-zinc-800 dark:text-zinc-200 uppercase">Adopción global</span>
                                <div className="flex flex-col gap-1 text-zinc-900 dark:text-white mt-2 font-medium">
                                    <p>Listo para campus universitarios.</p>
                                    <p>Escalable para infraestructuras corporativas.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </LazyMount>
    );
}