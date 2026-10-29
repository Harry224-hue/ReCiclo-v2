import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

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
        <div className="flex flex-col items-center justify-center gap-3 text-xs text-zinc-400 mt-6 select-none border-t border-zinc-800/80 pt-4 w-full">
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
    return (
        <footer className="bg-black text-white pt-16 pb-8 mt-32 px-4 md:px-16 lg:px-24 xl:px-32 w-full overflow-hidden relative">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16">
                    <div className="lg:col-span-6 flex flex-col items-start gap-6">
                        <Link to="/" className="select-none flex items-center">
                            <span className="text-2xl font-bold tracking-tight text-white">
                                ReCiclo
                            </span>
                        </Link>
                        <p className="text-zinc-300 text-sm/6 max-w-md">
                            Tecnología inteligente al servicio del reciclaje y la economía circular. Guiando a personas, empresas e instituciones hacia una separación precisa y un impacto ambiental medible.
                        </p>
                    </div>
                    <div className="lg:col-span-6 flex justify-between gap-8 flex-wrap">
                        <div className="flex flex-col gap-5">
                            <span className="text-white font-medium text-sm">Explorar</span>
                            <div className="flex flex-col gap-3 text-xs text-zinc-300">
                                <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
                                    <Link to="/" className="hover:text-white transition-colors duration-200">Inicio</Link>
                                </motion.div>
                                <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
                                    <Link to="/escanear" className="hover:text-white transition-colors duration-200">Escáner de residuos</Link>
                                </motion.div>
                                <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
                                    <Link to="/impacto" className="hover:text-white transition-colors duration-200">Impacto y métricas</Link>
                                </motion.div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-5">
                            <span className="text-white font-medium text-sm">Recursos</span>
                            <div className="flex flex-col gap-3 text-xs text-zinc-300">
                                <a href="#guia" className="hover:text-white transition-colors duration-200">Guía de materiales</a>
                                <a href="#contenedores" className="hover:text-white transition-colors duration-200">Colores y contenedores</a>
                                <a href="#institucional" className="hover:text-white transition-colors duration-200">Plataforma institucional</a>
                                <a href="#certificaciones" className="hover:text-white transition-colors duration-200">Certificaciones ecológicas</a>
                            </div>
                        </div>
                        <div className="flex flex-col gap-5">
                            <span className="text-white font-medium text-sm">ReCiclo</span>
                            <div className="flex flex-col gap-3 text-xs text-zinc-300">
                                <a href="#nosotros" className="hover:text-white transition-colors duration-200">Sobre nosotros</a>
                                <a href="#ayuda" className="hover:text-white transition-colors duration-200">Preguntas frecuentes</a>
                                <a href="#contacto" className="hover:text-white transition-colors duration-200">Contacto</a>
                                <a href="#privacidad" className="hover:text-white transition-colors duration-200">Privacidad</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full h-px bg-zinc-800"></div>
                <TeamCredits />

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-5 text-xs text-zinc-400">
                    <p>Copyright 2026 ReCiclo. Todos los derechos reservados.</p>
                    <div className="flex items-center gap-6">
                        <a href="#privacidad" className="hover:text-white transition-colors duration-200">Política de Privacidad</a>
                        <a href="#terminos" className="hover:text-white transition-colors duration-200">Términos del Servicio</a>
                        <a href="#cookies" className="hover:text-white transition-colors duration-200">Cookies</a>
                    </div>
                </div>
            </div>

            <div 
                aria-hidden="true" 
                className="absolute -bottom-8 right-0 pointer-events-none select-none text-zinc-900/60 font-black text-[120px] md:text-[200px] tracking-tighter leading-none z-0 overflow-hidden"
            >
                RECICLO
            </div>
        </footer>
    );
}
