import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { LazyMount, LazyImage } from "../components/PerformanceOptimizer.tsx";

const themeStyles = {
    emerald: { text: "text-emerald-600 dark:text-emerald-400", fill: "fill-emerald-500 text-emerald-500" },
    blue: { text: "text-blue-600 dark:text-blue-400", fill: "fill-blue-500 text-blue-500" },
    amber: { text: "text-amber-600 dark:text-amber-400", fill: "fill-amber-500 text-amber-500" },
    purple: { text: "text-purple-600 dark:text-purple-400", fill: "fill-purple-500 text-purple-500" },
    rose: { text: "text-rose-600 dark:text-rose-400", fill: "fill-rose-500 text-rose-500" }
};

const reviewsCol1 = [
    { name: "Laura Martínez", location: "Diseñadora", text: "La experiencia de uso es impecable. Simplemente abro la cámara y todo funciona.", avatar: "https://i.pravatar.cc/150?img=5" },
    { name: "Carlos Gómez", location: "Logística", text: "Integrar esto en nuestras operaciones diarias fue automático.", avatar: "https://i.pravatar.cc/150?img=11" },
    { name: "Ana Ruiz", location: "Arquitecta", text: "Rara vez ves una herramienta tan bien ejecutada. Es rápida y elegante.", avatar: "https://i.pravatar.cc/150?img=9" }
];

const reviewsCol2 = [
    { name: "Miguel Soto", location: "Educador", text: "Tener la información exacta en pantalla es la mejor manera de aprender.", avatar: "https://i.pravatar.cc/150?img=12" },
    { name: "Sofía Hernández", location: "Ingeniera", text: "El procesamiento en tiempo real es fascinante. No hay retardo visible.", avatar: "https://i.pravatar.cc/150?img=1" },
    { name: "Jorge Díaz", location: "Creativo", text: "Una interfaz limpia que respeta el espacio del usuario. Todo está donde debe estar.", avatar: "https://i.pravatar.cc/150?img=14" }
];

export function Reviews() {
    const { accentColor, accent } = useTheme();
    const currentTheme = (accentColor in themeStyles)
        ? themeStyles[accentColor as keyof typeof themeStyles]
        : { text: accent.text, fill: "fill-[var(--accent-color)] text-[var(--accent-color)]" };

    const renderCard = (item: typeof reviewsCol1[0], index: number) => (
        <div key={index} className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-2xl saturate-[180%] p-7 rounded-[1.5rem] flex flex-col gap-5 w-70 sm:w-[320px] select-none transition-colors duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-black/5 dark:border-white/10">
            <div className="flex items-center gap-1.5 mb-1">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 transition-colors duration-500 ${currentTheme.fill}`} />
                ))}
            </div>
            <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300 font-light">"{item.text}"</p>
            <div className="flex items-center gap-3 mt-2">
                {/* Avatares pequeños, ninguno es la imagen principal: lazy también. */}
                <LazyImage src={item.avatar} alt={item.name} className="size-10 rounded-full object-cover shrink-0 ring-1 ring-black/5 dark:ring-white/10" />
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">{item.name}</span>
                    <span className="text-xs text-zinc-500">{item.location}</span>
                </div>
            </div>
        </div>
    );

    return (
        <LazyMount minHeight={780}>
            <section className="py-20 md:py-28 px-4 md:px-16 lg:px-24 xl:px-32 w-full overflow-hidden transition-colors duration-500">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-2 justify-start items-start">
                    <div className="lg:col-span-5 flex flex-col items-start mt-20">
                        <motion.div className="flex items-center gap-2" initial={{ y: -20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
                            <span className={`text-xs uppercase tracking-[0.2em] font-semibold transition-colors duration-500 ${currentTheme.text}`}>Perspectivas</span>
                        </motion.div>
                        <motion.h2 className="text-4xl md:text-[44px]/12 text-zinc-900 dark:text-white mt-4 tracking-tight font-medium" initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
                            Hablan por sí solos.
                        </motion.h2>
                        <motion.p className="text-zinc-500 dark:text-zinc-400 text-base mt-4 max-w-85 font-light" initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
                            Quienes integraron ReCiclo en su día a día descubrieron que lo complejo ahora es invisible.
                        </motion.p>
                    </div>

                    <div className="lg:col-span-7 relative h-130 md:h-145 overflow-hidden flex justify-center md:justify-start gap-6 mt-10 lg:mt-0">
                        <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-zinc-50 dark:from-zinc-950 to-transparent pointer-events-none z-10 transition-colors duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-zinc-50 dark:from-zinc-950 to-transparent pointer-events-none z-10 transition-colors duration-500" />

                        <div className="overflow-hidden h-full flex flex-col">
                            <div className="flex flex-col gap-6 animate-marquee-up py-2">
                                {reviewsCol1.map((item, index) => renderCard(item, index))}
                                {reviewsCol1.map((item, index) => renderCard(item, index + reviewsCol1.length))}
                            </div>
                        </div>
                        <div className="overflow-hidden h-full hidden sm:flex flex-col">
                            <div className="flex flex-col gap-6 animate-marquee-down py-2">
                                {reviewsCol2.map((item, index) => renderCard(item, index))}
                                {reviewsCol2.map((item, index) => renderCard(item, index + reviewsCol2.length))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </LazyMount>
    );
}