import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Camera, ListChecks, Recycle, Sparkles, ChevronDown, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
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

const STEPS = [
    {
        num: "01",
        title: "Apunta al envase o residuo",
        desc: "Abre la cámara desde tu teléfono o sube una fotografía desde tu computadora. La inteligencia artificial identificará el objeto al instante.",
        icon: Camera,
    },
    {
        num: "02",
        title: "Sigue las instrucciones de preparación",
        desc: "Te indicamos si debes retirar etiquetas, enjuagar residuos orgánicos o separar tapas para facilitar su procesamiento en plantas de reciclaje.",
        icon: ListChecks,
    },
    {
        num: "03",
        title: "Deposita en el contenedor correcto",
        desc: "Visualiza el color exacto del contenedor oficial (azul, amarillo, verde o gris) y registra tus puntos de reciclaje.",
        icon: Recycle,
    },
];

const FAQS = [
    {
        q: "¿Qué tipos de residuos puede identificar el escáner?",
        a: "El modelo de visión por computadora reconoce plásticos (PET, HDPE, LDPE), envases Tetra Pak, vidrio, aluminio, hojalata, cartón, papel y residuos orgánicos comunes.",
    },
    {
        q: "¿Es necesario lavar los envases antes de reciclarlos?",
        a: "No es necesario lavarlos con jabón en profundidad, pero sí se recomienda vaciar líquidos y dar un enjuague rápido con poca agua para no contaminar otros residuos de papel o cartón.",
    },
    {
        q: "¿Funciona sin conexión a internet?",
        a: "La identificación visual instantánea requiere conexión para consultar la base de datos de materiales y normativas locales de reciclaje.",
    },
    {
        q: "¿Puedo usar ReCiclo en mi computadora?",
        a: "¡Sí! En la página de Escanear en modo de escritorio tienes la opción de arrastrar o seleccionar imágenes directamente desde tus archivos.",
    },
];

export default function ComoFunciona() {
    const { accentColor, getThemeClasses } = useTheme();
    const currentTheme = ACCENT_STYLES[accentColor as keyof typeof ACCENT_STYLES] ?? ACCENT_STYLES.emerald;
    const cardTheme = getThemeClasses("dropdown");

    const [openFaq, setOpenFaq] = useState<number | null>(0);

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
                        <HelpCircle size={15} />
                        <span>Centro de Ayuda y Guía</span>
                    </motion.div>

                    <motion.h1
                        className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 mb-6"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        ¿Cómo funciona{" "}
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentTheme.gradient}`}>
                            ReCiclo?
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-2xl font-light"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Aprende en tres sencillos pasos cómo clasificar correctamente tus residuos y resolver tus dudas frecuentes.
                    </motion.p>
                </div>

                {/* Pasos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {STEPS.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`p-8 rounded-3xl border flex flex-col justify-between ${cardTheme}`}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-3xl font-extrabold text-zinc-300 dark:text-zinc-700">
                                            {step.num}
                                        </span>
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${currentTheme.badge}`}>
                                            <Icon size={24} />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/10 flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                    <CheckCircle2 size={16} className={currentTheme.text} />
                                    <span>Paso verificado</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Preguntas Frecuentes */}
                <div className="max-w-3xl mx-auto mb-20">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-semibold text-zinc-800 dark:text-zinc-100">
                            Preguntas Frecuentes
                        </h2>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2">
                            Todo lo que necesitas saber para aprovechar al máximo la plataforma.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        {FAQS.map((faq, i) => {
                            const isOpen = openFaq === i;
                            return (
                                <div
                                    key={i}
                                    className={`rounded-2xl border overflow-hidden transition-all duration-200 ${cardTheme}`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaq(isOpen ? null : i)}
                                        className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-zinc-900 dark:text-zinc-100 cursor-pointer"
                                    >
                                        <span className="text-sm sm:text-base">{faq.q}</span>
                                        <ChevronDown
                                            size={18}
                                            className={`transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 pb-5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-black/5 dark:border-white/10 pt-3">
                                                    {faq.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA Escanear */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`rounded-[2.5rem] p-8 md:p-12 mb-16 text-center border relative overflow-hidden ${cardTheme}`}
                >
                    <div className="max-w-2xl mx-auto relative z-10">
                        <Sparkles size={32} className={`mx-auto mb-4 ${currentTheme.text}`} />
                        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                            ¿Listo para probarlo?
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base mb-8">
                            Empieza ahora mismo escaneando tu primer envase y comprueba lo fácil que es clasificar tus residuos.
                        </p>
                        <Link
                            to="/escanear"
                            className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-transform active:scale-95 shadow-lg ${currentTheme.btn}`}
                        >
                            <span>Ir al Escáner</span>
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
