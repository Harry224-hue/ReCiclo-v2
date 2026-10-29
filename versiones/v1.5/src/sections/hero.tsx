import { useRef } from "react";
import { ScanLine, Leaf } from "lucide-react";
import { motion, MotionConfig, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.65, bounce: 0 } },
};

const LINK_FOCUS =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const { visualMode, accent } = useTheme();
    const reduceMotion = useReducedMotion();

    const immersive = visualMode === "immersive";
    const animated = immersive && !reduceMotion;

    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
    const textY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
    const textVisibility = useTransform(scrollYProgress, (v) => (v > 0.45 ? "hidden" : "visible"));

    return (
        <MotionConfig reducedMotion="user">
            <section
                ref={sectionRef}
                className="relative flex flex-col items-center justify-center min-h-screen min-h-[100svh] w-full px-5 sm:px-8 py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 [-webkit-text-size-adjust:100%] [text-size-adjust:100%]"
            >
                <div
                    aria-hidden="true"
                    className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] sm:w-[900px] h-[400px] ${accent.glow} rounded-full blur-[140px] pointer-events-none transition-colors duration-700`}
                />
                <div
                    aria-hidden="true"
                    className="absolute -bottom-24 left-1/4 w-[400px] h-[350px] bg-emerald-900/15 rounded-full blur-[130px] pointer-events-none"
                />

                <div
                    aria-hidden="true"
                    className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-zinc-950/90"
                />

                <motion.div
                    className="relative z-20 flex flex-col items-center w-full max-w-4xl mx-auto pointer-events-auto"
                    variants={container}
                    initial="hidden"
                    animate="show"
                    style={{
                        opacity: animated ? textOpacity : 1,
                        y: animated ? textY : 0,
                        visibility: animated ? textVisibility : "visible",
                    }}
                >
                    <motion.div
                        variants={item}
                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium border backdrop-blur-md shadow-sm ${accent.badge}`}
                    >
                        <Leaf className="size-3.5 shrink-0" aria-hidden="true" />
                        <span>Desarrollo Sustentable · IT Morelia · Norma ITMORELIA-IT-AM-007</span>
                    </motion.div>

                    <motion.h1
                        variants={item}
                        className="mt-6 max-w-3xl text-center text-balance text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-[1.12]"
                    >
                        Separación y manejo responsable de residuos
                    </motion.h1>

                    <motion.p
                        variants={item}
                        className="mt-4 max-w-2xl text-center text-base sm:text-lg text-zinc-300 font-normal leading-relaxed text-balance"
                    >
                        Guía interactiva de separación para envases y residuos del campus, con <strong className="text-emerald-400 font-semibold">asistencia visual ética</strong> y localización de contenedores oficiales en la <strong className="text-white font-semibold">Pony Plaza, cafeterías y andadores</strong> del IT Morelia (Campus 1 y 2).
                    </motion.p>

                    <motion.div
                        variants={item}
                        className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
                    >
                        <Link
                            to="/escanear"
                            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-medium text-white shadow-lg transition-all active:scale-95 ${accent.btn} ${LINK_FOCUS}`}
                        >
                            <ScanLine className="size-4" aria-hidden="true" />
                            <span>Abrir Escáner</span>
                        </Link>
                    </motion.div>
                </motion.div>
            </section>
        </MotionConfig>
    );
}
