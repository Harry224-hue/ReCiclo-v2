import { motion } from "framer-motion";
import { Globe, Leaf, ShieldCheck, TreePine, Droplets, Wind, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import CountUp from "../components/count-number";
import { useTheme } from "../context/ThemeContext";
import { Footer } from "../components/footer";

const ACCENT_STYLES = {
    emerald: {
        text: "text-emerald-600 dark:text-emerald-400",
        gradient: "from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-300",
        badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        btn: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20",
    },
    blue: {
        text: "text-blue-600 dark:text-blue-400",
        gradient: "from-blue-500 to-cyan-600 dark:from-blue-400 dark:to-cyan-300",
        badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        btn: "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20",
    },
    purple: {
        text: "text-purple-600 dark:text-purple-400",
        gradient: "from-purple-500 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-300",
        badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        btn: "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20",
    },
    rose: {
        text: "text-rose-600 dark:text-rose-400",
        gradient: "from-rose-500 to-pink-600 dark:from-rose-400 dark:to-pink-300",
        badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        btn: "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20",
    },
};

const PILLARS = [
    {
        icon: TreePine,
        title: "Preservación Forestal",
        desc: "Cada tonelada de papel y cartón reciclado a través de nuestra comunidad salva hasta 17 árboles maduros y evita la deforestación.",
        metric: "12,400+ árboles protegidos",
    },
    {
        icon: Droplets,
        title: "Ahorro de Agua",
        desc: "Guiamos a las personas a limpiar y separar envases sin desperdiciar agua potable mediante técnicas de enjuague eficiente.",
        metric: "1.8M de litros ahorrados",
    },
    {
        icon: Wind,
        title: "Reducción de CO₂",
        desc: "Al desviar residuos plásticos y metálicos de los vertederos reducimos las emisiones directas de metano y dióxido de carbono.",
        metric: "25 Toneladas mitigadas",
    },
    {
        icon: ShieldCheck,
        title: "Trazabilidad Circular",
        desc: "Conectamos con plantas de reciclaje aliadas para garantizar que los residuos clasificados se conviertan efectivamente en materia prima.",
        metric: "99% destino verificado",
    },
];

export default function Impacto() {
    const { accentColor, getThemeClasses } = useTheme();
    const currentTheme = ACCENT_STYLES[accentColor as keyof typeof ACCENT_STYLES] ?? ACCENT_STYLES.emerald;
    const cardTheme = getThemeClasses("dropdown");

    return (
        <div className="min-h-screen flex flex-col justify-between pt-24 md:pt-32">
            <main className="max-w-6xl mx-auto px-5 md:px-8 w-full flex-1">
                {/* Encabezado */}
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16 md:mb-20">
                    <motion.div
                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border mb-6 ${currentTheme.badge}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Globe size={15} />
                        <span>Métricas de Sostenibilidad Global</span>
                    </motion.div>

                    <motion.h1
                        className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 mb-6"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        El resultado de hacerlo{" "}
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentTheme.gradient}`}>
                            simple y colectivo.
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-2xl font-light"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Monitoreamos en tiempo real el efecto de cada envase escaneado, separado y recuperado por nuestra comunidad.
                    </motion.p>
                </div>

                {/* Métricas Principales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {[
                        { val: 150, suf: "k", label: "Objetos Escaneados", delay: 0.1 },
                        { val: 25, suf: "T", label: "Emisiones Reducidas", delay: 0.2 },
                        { val: 99, suf: "%", label: "Precisión Analítica", delay: 0.3 },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: stat.delay, type: "spring", stiffness: 300, damping: 25 }}
                            className={`flex flex-col items-center justify-center p-8 rounded-3xl border text-center ${cardTheme}`}
                        >
                            <span className="text-6xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
                                <CountUp from={0} to={stat.val} />{stat.suf}
                            </span>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-semibold">
                                {stat.label}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Pilares de Impacto */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-semibold text-zinc-800 dark:text-zinc-100">
                            Nuestros Pilares de Regeneración
                        </h2>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 max-w-md mx-auto">
                            Transformamos la clasificación de residuos cotidiana en métricas verificables para el medio ambiente.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {PILLARS.map((pillar, i) => {
                            const Icon = pillar.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`p-6 sm:p-8 rounded-3xl border flex flex-col justify-between ${cardTheme}`}
                                >
                                    <div>
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${currentTheme.badge}`}>
                                            <Icon size={24} />
                                        </div>
                                        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                                            {pillar.title}
                                        </h3>
                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                                            {pillar.desc}
                                        </p>
                                    </div>
                                    <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs font-semibold">
                                        <span className="text-zinc-500 dark:text-zinc-400">Logro verificado</span>
                                        <span className={currentTheme.text}>{pillar.metric}</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Banner CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`rounded-[2.5rem] p-8 md:p-12 mb-16 text-center border relative overflow-hidden ${cardTheme}`}
                >
                    <div className="max-w-2xl mx-auto relative z-10">
                        <Leaf size={32} className={`mx-auto mb-4 ${currentTheme.text}`} />
                        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                            Sé parte del cambio hoy
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base mb-8">
                            Cada botella, caja o lata cuenta. Usa el escáner ahora y descubre a qué contenedor va cada material.
                        </p>
                        <Link
                            to="/escanear"
                            className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-transform active:scale-95 shadow-lg ${currentTheme.btn}`}
                        >
                            <span>Escanear un residuo</span>
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
