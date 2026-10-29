import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Leaf, School, MapPin, History, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LOGO_DARK } from "../constants/assets";

function DustParticles({ count = 26 }: { count?: number }) {
    const particles = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            x: (Math.random() - 0.5) * 80 + (Math.random() > 0.5 ? 25 : -25),
            y: -Math.random() * 50 - 15,
            size: Math.random() * 2.5 + 1.2,
            duration: Math.random() * 0.5 + 0.6,
            delay: Math.random() * 0.15,
            opacity: Math.random() * 0.7 + 0.3,
        }));
    }, [count]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
            {particles.map(p => (
                <motion.span
                    key={p.id}
                    initial={{ opacity: p.opacity, x: 0, y: 0, scale: 1 }}
                    animate={{
                        opacity: 0,
                        x: p.x,
                        y: p.y,
                        scale: 0.1,
                        filter: "blur(1.5px)"
                    }}
                    transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
                    className="absolute rounded-full bg-emerald-200/90"
                    style={{
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                />
            ))}
        </div>
    );
}

function TeamCredits() {
    const [c1, setC1] = useState(0);
    const [c2, setC2] = useState(0);
    const [c3, setC3] = useState(0);
    const [step, setStep] = useState(1);
    const [failed, setFailed] = useState(false);
    const [isDisintegrating, setIsDisintegrating] = useState(false);
    const [unlocked, setUnlocked] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    const h1 = () => {
        if (unlocked || failed) return;
        if (step === 1 && c1 < 6) {
            const next = c1 + 1;
            setC1(next);
            if (next === 6) setStep(2);
        } else {
            setFailed(true);
        }
    };

    const h2 = () => {
        if (unlocked || failed) return;
        if (step === 2 && c2 < 6) {
            const next = c2 + 1;
            setC2(next);
            if (next === 6) setStep(3);
        } else {
            setFailed(true);
        }
    };

    const h3 = () => {
        if (unlocked) {
            setShowExplanation(prev => !prev);
            return;
        }
        if (failed) return;
        if (step === 3 && c3 < 7) {
            const next = c3 + 1;
            setC3(next);
            if (next === 7) {
                setIsDisintegrating(true);
                setTimeout(() => {
                    setUnlocked(true);
                    setIsDisintegrating(false);
                }, 850);
            }
        } else {
            setFailed(true);
        }
    };

    const r1 = failed ? 0 : Math.min(c1 / 6, 1);
    const r2 = failed ? 0 : Math.min(c2 / 6, 1);
    const r3 = failed ? 0 : Math.min(c3 / 7, 1);

    const getGlowStyle = (ratio: number) => {
        if (ratio === 0) return {};
        const glowPx = Math.round(ratio * 12);
        const intensePx = Math.round(ratio * 22);
        return {
            color: ratio >= 1 ? "#34d399" : `rgba(209, 250, 229, ${0.4 + ratio * 0.6})`,
            textShadow: `0 0 ${glowPx}px rgba(52, 211, 153, ${ratio * 0.9}), 0 0 ${intensePx}px rgba(16, 185, 129, ${ratio * 0.5})`,
            transition: "all 0.25s ease",
        };
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3 text-xs text-zinc-400 my-6 select-none border-t border-zinc-800/80 pt-5 w-full">
            <div className="flex flex-wrap items-center justify-center gap-3">
                <span className={`font-medium transition-colors duration-500 ${unlocked ? "text-emerald-400 font-semibold" : "text-zinc-500"}`}>
                    {unlocked ? "Creador del proyecto:" : "Desarrollo del proyecto:"}
                </span>

                {!unlocked && (
                    <div className="flex items-center gap-3 relative">
                        {/* Integrante 1 */}
                        <div className="relative">
                            {isDisintegrating && <DustParticles count={24} />}
                            <motion.button
                                onClick={h1}
                                animate={isDisintegrating ? {
                                    opacity: 0,
                                    x: 18,
                                    y: -8,
                                    scale: 0.9,
                                    filter: "blur(6px)",
                                } : { scale: c1 > 0 ? 1.02 : 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                style={getGlowStyle(r1)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900/60 hover:bg-zinc-800/70 border border-zinc-800 cursor-pointer transition-colors"
                            >
                                <span>García Montañez Ulises Jasen</span>
                            </motion.button>
                        </div>

                        <span className="text-zinc-600">•</span>

                        {/* Integrante 2 */}
                        <div className="relative">
                            {isDisintegrating && <DustParticles count={24} />}
                            <motion.button
                                onClick={h2}
                                animate={isDisintegrating ? {
                                    opacity: 0,
                                    x: 18,
                                    y: -8,
                                    scale: 0.9,
                                    filter: "blur(6px)",
                                } : { scale: c2 > 0 ? 1.02 : 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                style={getGlowStyle(r2)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900/60 hover:bg-zinc-800/70 border border-zinc-800 cursor-pointer transition-colors"
                            >
                                <span>Medina Cuamba Juan Pablo</span>
                            </motion.button>
                        </div>

                        <span className="text-zinc-600">•</span>
                    </div>
                )}

                {/* Integrante 3 */}
                <motion.button
                    onClick={h3}
                    animate={unlocked ? {
                        scale: [1, 1.12, 1.05],
                        boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)",
                    } : { scale: c3 > 0 ? 1.02 : 1 }}
                    transition={{ duration: 0.6 }}
                    style={getGlowStyle(unlocked ? 1 : r3)}
                    title={unlocked ? "Haz clic para ver los detalles del proyecto" : undefined}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md cursor-pointer transition-all ${
                        unlocked
                            ? "bg-emerald-500/15 border border-emerald-400/50 text-emerald-400 font-semibold shadow-lg hover:bg-emerald-500/25 active:scale-95"
                            : "bg-zinc-900/60 hover:bg-zinc-800/70 border border-zinc-800"
                    }`}
                >
                    <span>Solís Calvillo Juan Pablo</span>
                </motion.button>
            </div>

            {unlocked && (
                <AnimatePresence>
                    {showExplanation && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.97 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="w-full max-w-xl mt-3 p-5 rounded-2xl bg-zinc-900/95 border border-emerald-500/30 text-zinc-300 text-xs text-left shadow-2xl backdrop-blur-md space-y-3 leading-relaxed"
                        >
                            <p>
                                Aunque el equipo se registró inicialmente con varios integrantes para cumplir con los requisitos de la convocatoria escolar, el proyecto ReCiclo fue desarrollado íntegramente por mí. Me encargué de la investigación, la planificación, el diseño de la interfaz, la arquitectura del sistema y toda la programación necesaria para su funcionamiento. Los demás integrantes únicamente aparecieron en el registro inicial del equipo y no participaron en el desarrollo ni en la ejecución del proyecto.
                            </p>
                            <p>
                                Quiero aclarar que esto no se debió a ninguna mala intención ni a desacuerdos con ellos. Simplemente me siento más cómodo trabajando de manera independiente y es la forma en la que he desarrollado la mayoría de mis proyectos a lo largo del tiempo. Estoy acostumbrado a asumir todas las etapas del proceso por mi cuenta, desde la concepción de una idea hasta su implementación final.
                            </p>
                            <p className="text-emerald-400/90 font-medium italic pt-1">
                                When I was young, I prayed for lightning.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}

export function Footer() {
    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="bg-zinc-950 text-white pt-20 pb-10 px-5 md:px-12 lg:px-20 xl:px-28 w-full overflow-hidden border-t border-white/5 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16">

                    {/* Columna Izquierda: Identidad Institucional y Propósito */}
                    <div className="lg:col-span-5 flex flex-col items-start gap-5">
                        <Link
                            to="/"
                            onClick={handleScrollTop}
                            className="flex items-center gap-3 select-none text-white hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl"
                            aria-label="ReCiclo - Ir al inicio"
                        >
                            <img
                                src={LOGO_DARK}
                                alt="ReCiclo"
                                className="h-8 w-auto object-contain"
                            />
                        </Link>

                        <p className="text-zinc-400 text-sm/relaxed max-w-sm font-light">
                            Proyecto de <strong className="text-zinc-200 font-medium">Desarrollo Sustentable</strong> enfocado en mejorar la separación y disposición de residuos en el <strong className="text-zinc-200 font-medium">Instituto Tecnológico de Morelia, Michoacán</strong>. La tecnología como medio para una cultura ambiental responsable.
                        </p>

                        <div className="flex flex-wrap gap-2 pt-1">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <Leaf size={12} />
                                ODS 12: Consumo Responsable
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                                <School size={12} />
                                IT Morelia
                            </span>
                        </div>
                    </div>

                    {/* Columnas Derechas: Enlaces de la Herramienta y Categorías */}
                    <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {/* Secciones de la Herramienta */}
                        <div className="flex flex-col gap-3.5">
                            <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
                                Herramienta
                            </span>
                            <div className="flex flex-col gap-2.5 text-sm text-zinc-400">
                                <Link to="/escanear" className="hover:text-emerald-400 transition-colors duration-200 flex items-center gap-1.5">
                                    <Camera size={14} />
                                    <span>Escáner</span>
                                </Link>
                                <Link to="/mapa" className="hover:text-emerald-400 transition-colors duration-200 flex items-center gap-1.5">
                                    <MapPin size={14} />
                                    <span>Puntos en Campus</span>
                                </Link>
                                <Link to="/historial" className="hover:text-emerald-400 transition-colors duration-200 flex items-center gap-1.5">
                                    <History size={14} />
                                    <span>Historial</span>
                                </Link>
                                <Link to="/perfil" className="hover:text-emerald-400 transition-colors duration-200">
                                    Perfil e Historial
                                </Link>
                                <Link to="/tecnologias" className="hover:text-emerald-400 transition-colors duration-200 text-emerald-400/90 font-medium">
                                    Tecnologías y Recursos
                                </Link>
                            </div>
                        </div>

                        {/* Categorías Normativas Oficiales */}
                        <div className="flex flex-col gap-3.5">
                            <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
                                Clasificación (SEMARNAT)
                            </span>
                            <div className="flex flex-col gap-2.5 text-xs text-zinc-400">
                                <span className="flex items-center gap-2 text-zinc-300">
                                    <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                                    Residuos Orgánicos
                                </span>
                                <span className="flex items-center gap-2 text-zinc-300">
                                    <span className="size-2 rounded-full bg-blue-500 shrink-0" />
                                    Inorgánicos Reciclables
                                </span>
                                <span className="flex items-center gap-2 text-zinc-300">
                                    <span className="size-2 rounded-full bg-zinc-500 shrink-0" />
                                    Inorgánicos No Reciclables
                                </span>
                                <span className="flex items-center gap-2 text-zinc-300">
                                    <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                                    Manejo Especial (Pilas/RAEE)
                                </span>
                            </div>
                        </div>

                        {/* Marco Académico */}
                        <div className="flex flex-col gap-3.5 col-span-2 sm:col-span-1">
                            <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
                                Contexto
                            </span>
                            <div className="flex flex-col gap-2.5 text-xs text-zinc-400 leading-relaxed">
                                <p>
                                    Iniciativa académica desarrollada en el contexto del <strong className="text-zinc-200">Instituto Tecnológico de Morelia</strong>.
                                </p>
                                <p className="text-[11px] text-zinc-500 mt-1">
                                    Propuesta adaptable a otros espacios educativos y comunitarios de Michoacán.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="w-full h-px bg-white/10" />

                {/* Huevo de pascua: TeamCredits con secuencia 6-6-7 */}
                <TeamCredits />

                {/* Barra Inferior */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 text-xs text-zinc-500 font-light">
                    <div className="flex items-center gap-2">
                        <span>ReCiclo · Proyecto de Desarrollo Sustentable · IT Morelia</span>
                    </div>

                    <div className="flex items-center gap-6 text-zinc-400">
                        <button
                            onClick={handleScrollTop}
                            className="hover:text-white transition-colors duration-200 cursor-pointer"
                        >
                            Volver arriba ↑
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
