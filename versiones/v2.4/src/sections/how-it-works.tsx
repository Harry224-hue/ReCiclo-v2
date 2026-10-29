import { motion } from "framer-motion";
import { Sparkles, ListChecks, MapPin, Leaf } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { LazyMount, LazyImage } from "../components/PerformanceOptimizer.tsx";
import visual1 from "../assets/project/step1-scanner.jpg";
import visual2 from "../assets/project/step2-guia.jpg";
import visual3 from "../assets/project/step3-contenedores.jpg";

const getGlassClasses = (theme: string) => {
    if (theme === "solid") return "bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-none";
    if (theme === "light") return "bg-white/90 dark:bg-zinc-900/90 border border-black/5 dark:border-white/10 shadow-md backdrop-blur-md saturate-[150%]";
    return "bg-white/60 dark:bg-zinc-900/60 border border-black/10 dark:border-white/10 shadow-2xl backdrop-blur-[40px] saturate-[200%]";
};

const steps = [
    { 
        id: 1, 
        badge: "IA Gemini Multimodal",
        title: "Escaneo con IA Gemini Vision", 
        description: "Enfoca con tu cámara o selecciona una muestra. El modelo multimodal Gemini identifica el material exacto (PET, aluminio, unicel, cartón u orgánico) y evalúa su reciclabilidad real.", 
        icon: <Sparkles size={26} strokeWidth={1.5} />, 
        image: visual1 
    },
    { 
        id: 2, 
        badge: "Norma ITM & Regla 4V",
        title: "Diagnóstico, Regla 4V & ACV", 
        description: "Aprende el tratamiento adecuado con la regla de las 4V (vaciar, enjuagar, aplastar y tapar) y conoce el Análisis de Ciclo de Vida (ACV), huella de carbono y tiempo de degradación.", 
        icon: <ListChecks size={26} strokeWidth={1.5} />, 
        image: visual2 
    },
    { 
        id: 3, 
        badge: "Planos Campus 1 y 2",
        title: "Cartografía oficial del ITM", 
        description: "Localiza la estación de separación más cercana en Pony Plaza, cafeterías, comedores o laboratorios según la norma ITMORELIA-IT-AM-007 con rutas peatonales directas.", 
        icon: <MapPin size={26} strokeWidth={1.5} />, 
        image: visual3 
    }
];

export function HowItWorks() {
    const { accent, glassTheme, visualMode } = useTheme();
    const glassStyle = getGlassClasses(glassTheme);
    // Igual que baseTransition en ThemeContext.getThemeClasses: animar backdrop-blur es lo
    // más pesado para el compositor, así que en "essential" (equipo "lite" o elegido a mano)
    // el cambio de cristal es instantáneo en vez de una transición de 300ms que se traba.
    const glassTransition = visualMode === "immersive" ? "transition-all duration-300" : "transition-none";

    return (
        // No está en la primera pantalla (viene después del Hero): se difiere hasta
        // que el usuario esté por llegar. minHeight aproxima el alto real de la
        // sección para que la página no salte cuando se monta de verdad.
        <LazyMount minHeight={900}>
            <section id="como-funciona" className="relative py-20 md:py-24 w-full overflow-hidden transition-colors duration-500 scroll-mt-24">
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[120px] rounded-full pointer-events-none -z-10 transition-colors duration-500 ${accent.glow}`} />

                <div className="max-w-6xl mx-auto px-5 md:px-8 relative z-10">
                    <div className="flex flex-col items-center text-center mb-16 md:mb-20">
                        <motion.div className="flex items-center gap-2 mb-6" initial={{ y: 15, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
                            <Leaf size={16} className={`transition-colors duration-500 ${accent.text}`} />
                            <span className="text-sm text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em] font-semibold">Guía paso a paso</span>
                        </motion.div>

                        <motion.h2 className="text-5xl md:text-6xl lg:text-[80px] font-semibold tracking-tighter text-zinc-900 dark:text-white max-w-4xl leading-[1.05]" initial={{ y: 15, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                            Tres pasos. <br className="hidden md:block" />
                            <span className={`text-transparent bg-clip-text bg-gradient-to-r transition-colors duration-500 ${accent.gradient}`}>Reciclaje exacto.</span>
                        </motion.h2>
                    </div>

                    <div className="flex flex-col gap-20 md:gap-28">
                        {steps.map((step, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <div key={step.id} className="relative flex flex-col md:flex-row items-center w-full">
                                    <motion.div className={`w-full md:w-[65%] relative z-0 ${isEven ? 'md:mr-auto' : 'md:ml-auto'}`} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }}>
                                        <div className="aspect-[4/3] md:aspect-[16/10] rounded-[2rem] overflow-hidden bg-zinc-200 dark:bg-zinc-950 border border-black/5 dark:border-white/5">
                                            {/* Ninguna de las tres es la imagen principal de la página (el hero ya
                                                se encargó de eso) — todas en lazy, ninguna con priority. */}
                                            <LazyImage src={step.image} alt={step.title} className="w-full h-full object-cover" />
                                        </div>
                                    </motion.div>

                                    {/* 💡 APLICACIÓN DEL CRISTAL DINÁMICO
                                        Solo se anima "y" aquí: si el propio panel translúcido animara su
                                        opacity, esta se multiplicaría con la transparencia del cristal y
                                        se vería "más transparente" mientras sube, en vez de liquid glass
                                        desde el primer frame. El fade de opacidad va en el contenido de
                                        adentro (icono/título/texto), no en el fondo de cristal. */}
                                    <motion.div className={`w-[92%] md:w-[45%] relative md:absolute z-10 -mt-16 md:mt-0 ${isEven ? 'md:right-0' : 'md:left-0'} md:top-1/2 md:-translate-y-1/2`} initial={{ y: 30 }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}>
                                        <div className={`p-8 md:p-12 rounded-[2rem] flex flex-col ${glassTransition} ${glassStyle}`}>
                                            <motion.div className="flex flex-col" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}>
                                                <div className="flex justify-between items-start mb-10">
                                                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shadow-lg">
                                                        {step.icon}
                                                    </div>
                                                    <span className="text-7xl md:text-8xl font-bold text-zinc-900/20 dark:text-white/20 tracking-tighter leading-none select-none">0{step.id}</span>
                                                </div>
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit mb-3">
                                                    {step.badge}
                                                </div>
                                                <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-4">{step.title}</h3>
                                                <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-300 font-light leading-relaxed">{step.description}</p>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </LazyMount>
    );
}