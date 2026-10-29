import { useEffect, useRef } from "react";
import { ScanLine } from "lucide-react";
import { motion, MotionConfig, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

interface HeroProps {
    videoSrc?: string;
    poster?: string;
}

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const item: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.7, bounce: 0 } },
};

const LINK_FOCUS =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

export function Hero({ videoSrc = "/video-hero.mp4", poster }: HeroProps = {}) {
    const sectionRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const { visualMode } = useTheme();
    const reduceMotion = useReducedMotion();

    const immersive = visualMode === "immersive";
    const animated = immersive && !reduceMotion;

    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
    const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const textY = useTransform(scrollYProgress, [0, 0.5], [0, -140]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
    const textVisibility = useTransform(scrollYProgress, (v) => (v > 0.4 ? "hidden" : "visible"));

    useEffect(() => {
        const video = videoRef.current;
        const section = sectionRef.current;
        if (!video || !section) return;

        video.muted = true;

        if (!animated) {
            video.pause();
            return;
        }

        let inViewport = true;
        const sync = () => {
            if (inViewport && !document.hidden) video.play().catch(() => {});
            else video.pause();
        };

        const observer = new IntersectionObserver(([entry]) => {
            inViewport = entry.isIntersecting;
            sync();
        });
        observer.observe(section);
        document.addEventListener("visibilitychange", sync);
        sync();

        return () => {
            observer.disconnect();
            document.removeEventListener("visibilitychange", sync);
            video.pause();
        };
    }, [animated]);

    return (
        <MotionConfig reducedMotion="user">
            <section
                ref={sectionRef}
                className="relative flex flex-col items-center justify-center min-h-screen min-h-[100svh] w-full px-6 py-24 overflow-hidden bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500 [-webkit-text-size-adjust:100%] [text-size-adjust:100%]"
            >
                <motion.div
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-[25%] h-[125%] z-0 will-change-transform"
                    style={{ y: animated ? videoY : 0 }}
                >
                    <video
                        ref={videoRef}
                        loop
                        muted
                        playsInline
                        preload={immersive ? "auto" : "none"}
                        poster={poster}
                        tabIndex={-1}
                        disablePictureInPicture
                        disableRemotePlayback
                        className="w-full h-full object-cover opacity-80"
                    >
                        <source src={videoSrc} type="video/mp4" />
                    </video>
                </motion.div>

                <div aria-hidden="true" className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-black/50 to-zinc-50 dark:to-zinc-950 transition-colors duration-500" />

                <motion.div
                    className="relative z-20 flex flex-col items-center w-full"
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
                        className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full text-xs sm:text-sm text-white bg-black/35 sm:bg-white/10 sm:backdrop-blur-md border border-white/20 shadow-xl"
                    >
                        <span className="bg-white/20 rounded-full p-1">
                            <ScanLine size={14} aria-hidden="true" />
                        </span>
                        <p className="font-medium tracking-wide">ReCiclo 1.0 Oficial · IT Morelia</p>
                    </motion.div>

                    <motion.h1
                        variants={item}
                        className="mt-5 max-w-3xl text-center text-balance text-5xl sm:text-6xl md:text-[80px] font-medium leading-[1.05] tracking-tight text-white"
                    >
                        Apunta. Descubre. Recicla.
                    </motion.h1>

                    <motion.p variants={item} className="mt-4 max-w-lg text-center text-base sm:text-lg font-light text-white/85">
                        Abre tu cámara y deja que ReCiclo reconozca cualquier material al instante. Separar tus residuos nunca fue tan intuitivo.
                    </motion.p>

                    <motion.div variants={item} className="mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <Link
                            to="/escanear"
                            className={`w-full sm:w-auto flex justify-center px-6 py-3 rounded-full text-sm font-medium text-zinc-900 bg-white hover:bg-zinc-200 shadow-xl transition-[transform,background-color] active:scale-95 ${LINK_FOCUS}`}
                        >
                            Abrir Escáner
                        </Link>

                        <button
                            type="button"
                            onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: "smooth" })}
                            className={`w-full sm:w-auto flex justify-center px-6 py-3 rounded-full text-sm font-medium text-white bg-black/40 hover:bg-black/55 sm:bg-black/20 sm:hover:bg-black/40 sm:backdrop-blur-md border border-white/20 transition-[transform,background-color] active:scale-95 cursor-pointer ${LINK_FOCUS}`}
                        >
                            Descubrir más
                        </button>
                    </motion.div>
                </motion.div>
            </section>
        </MotionConfig>
    );
}
