import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { Home, Camera, User, Menu } from "lucide-react";
import { NavbarDropdown } from "./navbar-dropdown";
import { SettingsModal } from "./settings-modal";
import { LiteModeBadge } from "./LiteModeBadge";
import { PerformanceWarningDialog } from "./PerformanceWarningDialog";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const desktopRef = useRef<HTMLDivElement>(null);
    const mobileRef = useRef<HTMLDivElement>(null);

    const { getThemeClasses, perfTier, perfSource, requestImmersive, visualMode } = useTheme();
    const navTheme = getThemeClasses("navbar");
    const dockTheme = getThemeClasses("dock");
    const location = useLocation();

    // Spring único reutilizado por ambos indicadores (desktop + dock) para que
    // se sientan como el mismo componente. stiffness/damping altos = respuesta
    // rápida sin overshoot exagerado, apropiado para un "pill" que sigue al tab.
    const pillSpring = { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.7 };

    // Igual que antes: en "essential" el cambio de fondo/blur al cruzar el
    // umbral de scroll es instantáneo, evitando el costo del backdrop-blur
    // animado en el compositor.
    const scrollTransition = visualMode === "immersive" ? "transition-all duration-500 ease-out" : "transition-none";

    const navLinks = [
        { path: "/", label: "Inicio", icon: Home },
        { path: "/escanear", label: "Escanear", icon: Camera },
    ];

    const [prevPathname, setPrevPathname] = useState(location.pathname);
    if (location.pathname !== prevPathname) {
        setPrevPathname(location.pathname);
        setScrolled(false);
        setIsDropdownOpen(false);
    }

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [location.pathname]);

    useEffect(() => {
        // rAF evita recalcular en cada evento de scroll (varios por frame); solo se
        // aplica el más reciente justo antes de pintar. La histéresis (activa a 60px,
        // desactiva a 24px) evita que el navbar "parpadee" entre estados si el usuario
        // se queda justo en el borde de un único umbral.
        let ticking = false;
        const handleScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                setScrolled((prev) => {
                    if (window.scrollY > 60) return true;
                    if (window.scrollY < 24) return false;
                    return prev;
                });
                ticking = false;
            });
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const clickedOutsideDesktop = desktopRef.current && !desktopRef.current.contains(event.target as Node);
            const clickedOutsideMobile = mobileRef.current && !mobileRef.current.contains(event.target as Node);

            if (clickedOutsideDesktop && clickedOutsideMobile) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            {/* 1. MODO PC */}
            <motion.nav
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1, scale: scrolled ? 1 : 1.015 }}
                transition={{
                    default: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                    scale: { type: "spring", stiffness: 170, damping: 26, mass: 0.9 }
                }}
                className="hidden md:flex fixed z-[60] top-5 left-0 right-0 justify-center w-full pointer-events-none"
            >
                <div className="pointer-events-auto relative grid grid-cols-3 items-center w-[calc(100vw-2rem)] max-w-5xl px-6 py-2.5">
                    <div className={`absolute inset-0 rounded-full ${scrollTransition} -z-10 ${scrolled ? `shadow-sm ${navTheme}` : "bg-transparent border border-transparent"}`} />

                    <div className="flex justify-start items-center gap-2">
                        <Link to="/" className="flex items-center">
                            <motion.span
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`text-xl font-bold tracking-tight transition-colors duration-300 select-none ${scrolled ? "text-zinc-900 dark:text-white" : "text-white"}`}
                            >
                                ReCiclo
                            </motion.span>
                        </Link>
                        <LiteModeBadge tier={perfTier} source={perfSource} onRequestFull={requestImmersive} />
                    </div>

                    <div className="flex justify-center">
                        <div className={`relative flex items-center gap-2 p-1.5 rounded-full ${scrollTransition} ${scrolled ? "bg-black/5 dark:bg-white/10 border border-transparent shadow-none" : "bg-white/15 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-zinc-700/50 shadow-sm"}`}>
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path;
                                const labelClass = isActive
                                    ? "text-zinc-900 dark:text-zinc-100 font-semibold"
                                    : scrolled
                                        ? "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white font-medium"
                                        : "text-white/80 hover:text-white font-medium";

                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`relative px-5 py-2 rounded-full text-sm transition-colors duration-200 ${labelClass}`}
                                    >
                                        {/* layoutId: Framer Motion anima el pill de una posición a otra
                                            automáticamente (FLIP), sin medir offsets a mano ni escuchar
                                            "resize". Se recalcula solo en cada cambio de layout. */}
                                        {isActive && (
                                            <motion.span
                                                layoutId="desktop-pill"
                                                transition={pillSpring}
                                                className="absolute inset-0 rounded-full shadow-sm bg-white dark:bg-zinc-800"
                                            />
                                        )}
                                        <span className="relative z-10">{link.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center justify-end relative" ref={desktopRef}>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`flex items-center gap-2.5 pl-3 pr-1 py-1 rounded-full transition-colors duration-300 hover:scale-105 cursor-pointer ${scrolled ? "bg-black/5 dark:bg-white/10 border border-transparent shadow-none" : "border border-white/20 dark:border-zinc-700/50 bg-white/15 dark:bg-black/40 backdrop-blur-md shadow-sm"}`}
                        >
                            <Menu size={18} className={scrolled ? "text-zinc-600 dark:text-zinc-300 transition-colors duration-200" : "text-white/90 transition-colors duration-200"} />

                            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-black/5 dark:bg-white/10">
                                <User size={16} className={scrolled ? "text-zinc-600 dark:text-zinc-200 transition-colors duration-200" : "text-white transition-colors duration-200"} />
                            </div>
                        </motion.button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <NavbarDropdown
                                    id="desktop-dropdown"
                                    isLoggedIn={isLoggedIn}
                                    setIsLoggedIn={setIsLoggedIn}
                                    closeMenu={() => setIsDropdownOpen(false)}
                                    openSettings={() => setIsSettingsOpen(true)}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.nav>

            {/* 2. MODO MÓVIL: ENCABEZADO SUPERIOR */}
            <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1, scale: scrolled ? 1 : 1.015 }}
                transition={{
                    default: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                    scale: { type: "spring", stiffness: 170, damping: 26, mass: 0.9 }
                }}
                className="md:hidden fixed top-0 left-0 w-full grid grid-cols-2 items-center px-4 pt-4 z-[60] pointer-events-none"
            >
                <div className="flex justify-start items-center gap-2 relative pointer-events-auto">
                    <Link to="/" className="px-4 py-2 rounded-full transition-colors duration-300 shadow-sm relative z-10 flex items-center">
                        <div className={`absolute inset-0 -z-10 rounded-full transition-all duration-300 ${scrolled ? `${navTheme} border-transparent` : "bg-black/20 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-zinc-700/50"}`} />
                        <span className={`text-base font-bold tracking-tight transition-colors duration-300 select-none ${scrolled ? "text-zinc-900 dark:text-white" : "text-white"}`}>
                            ReCiclo
                        </span>
                    </Link>
                    <LiteModeBadge tier={perfTier} source={perfSource} onRequestFull={requestImmersive} />
                </div>

                <div className="flex justify-end relative pointer-events-auto" ref={mobileRef}>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full transition-colors duration-300 cursor-pointer shadow-sm relative z-10"
                    >
                        <div className={`absolute inset-0 -z-10 rounded-full transition-all duration-300 ${scrolled ? `${navTheme} border-transparent` : "bg-black/20 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-zinc-700/50"}`} />

                        <Menu size={18} className={scrolled ? "text-zinc-600 dark:text-zinc-300" : "text-white/90"} />

                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-black/5 dark:bg-white/10">
                            <User size={16} className={scrolled ? "text-zinc-600 dark:text-zinc-200" : "text-white"} />
                        </div>
                    </motion.button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <NavbarDropdown
                                id="mobile-dropdown"
                                isLoggedIn={isLoggedIn}
                                setIsLoggedIn={setIsLoggedIn}
                                closeMenu={() => setIsDropdownOpen(false)}
                                openSettings={() => setIsSettingsOpen(true)}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* 3. MODO MÓVIL: DOCK FLOTANTE
                Entrada escalonada: el contenedor aparece primero y cada ícono se
                anima con un pequeño delay incremental, en vez de que los cuatro
                aparezcan todos a la vez. Da sensación de "ensamblaje" en lugar
                de un solo bloque deslizando hacia arriba. */}
            <motion.nav
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: { transition: { delayChildren: 0.15, staggerChildren: 0.06 } }
                }}
                className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] w-full max-w-[320px] px-4 pointer-events-none"
            >
                <motion.div
                    variants={{
                        hidden: { y: 30, opacity: 0 },
                        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
                    }}
                    className={`pointer-events-auto relative flex items-center justify-between p-1.5 rounded-[2rem] transition-colors duration-300 ease-out shadow-lg border-transparent ${dockTheme}`}
                >
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <motion.div
                                key={link.path}
                                variants={{
                                    hidden: { scale: 0.6, opacity: 0 },
                                    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }
                                }}
                                className="relative flex-1"
                            >
                                <Link
                                    to={link.path}
                                    className="relative flex flex-col items-center justify-center py-2 rounded-[1.5rem]"
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="mobile-pill"
                                            transition={pillSpring}
                                            className="absolute inset-0 rounded-[1.5rem] shadow-sm bg-zinc-900 dark:bg-zinc-100"
                                        />
                                    )}
                                    <motion.div
                                        whileTap={{ scale: 0.85 }}
                                        className={`relative z-10 flex flex-col items-center gap-0.5 transition-colors duration-200 ${isActive ? "text-white dark:text-zinc-900" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"}`}
                                    >
                                        <link.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className="text-[9px] font-medium tracking-wide">{link.label}</span>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </motion.nav>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
            <PerformanceWarningDialog />
        </>
    );
}