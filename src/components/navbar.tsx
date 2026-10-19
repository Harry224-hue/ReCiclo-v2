import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import {
    Home,
    ScanLine,
    MapPin,
    User,
    Menu,
} from "lucide-react";
import {
    RiHome5Line,
    RiHome5Fill,
    RiMapPin2Line,
    RiMapPin2Fill,
    RiQrScan2Line,
    RiQrScan2Fill,
    RiUser3Line,
    RiUser3Fill,
} from "react-icons/ri";
import { NavbarDropdown } from "./navbar-dropdown";
import { SettingsModal } from "./settings-modal";
import { LiteModeBadge } from "./LiteModeBadge";
import { PerformanceWarningDialog } from "./PerformanceWarningDialog";
import { NotchIsland } from "./NotchIsland";
import { LOGO_LIGHT, LOGO_DARK } from "../constants/assets";

const ACCENT_STYLES = {
    emerald: { ring: "focus-visible:ring-emerald-500", text: "text-emerald-500", bg: "bg-emerald-500" },
    blue: { ring: "focus-visible:ring-blue-500", text: "text-blue-500", bg: "bg-blue-500" },
    amber: { ring: "focus-visible:ring-amber-500", text: "text-amber-500", bg: "bg-amber-500" },
    purple: { ring: "focus-visible:ring-purple-500", text: "text-purple-500", bg: "bg-purple-500" },
    rose: { ring: "focus-visible:ring-rose-500", text: "text-rose-500", bg: "bg-rose-500" },
    custom: { ring: "focus-visible:ring-[var(--accent-color)]", text: "text-[var(--accent-color)]", bg: "bg-[var(--accent-color)]" },
};

// 1. En PC: Inicio, Escáner, Mapa, Perfil
const DESKTOP_NAV_LINKS = [
    { path: "/", label: "Inicio", icon: Home },
    { path: "/escanear", label: "Escáner", icon: ScanLine },
    { path: "/mapa", label: "Mapa", icon: MapPin },
    { path: "/perfil", label: "Perfil", icon: User },
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [notchVisible, setNotchVisible] = useState(true);
    const lastScrollY = useRef(0);

    const { user, profile, isLoggedIn } = useAuth();
    const currentUser = {
        name: profile?.nombre || user?.displayName || "Usuario",
        email: profile?.correo || user?.email || "",
    };
    const [localAvatar, setLocalAvatar] = useState(() => localStorage.getItem("reciclo_avatar_custom") || "");
    useEffect(() => {
        const handleStorage = () => {
            setLocalAvatar(localStorage.getItem("reciclo_avatar_custom") || "");
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    const userPhoto = profile?.fotoPerfil || user?.photoURL || localAvatar || undefined;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // En móvil: 4 botones con orden solicitado: Inicio, Escáner, Mapa, Perfil
    const mobileNavLinks = [
        {
            path: "/",
            label: "Inicio",
            outlineIcon: RiHome5Line,
            solidIcon: RiHome5Fill,
            isCenter: false,
            activeColor: "text-emerald-500 dark:text-emerald-400",
        },
        {
            path: "/escanear",
            label: "Escáner",
            outlineIcon: RiQrScan2Line,
            solidIcon: RiQrScan2Fill,
            isCenter: true,
            activeColor: "text-emerald-500 dark:text-emerald-400",
        },
        {
            path: "/mapa",
            label: "Mapa",
            outlineIcon: RiMapPin2Line,
            solidIcon: RiMapPin2Fill,
            isCenter: false,
            activeColor: "text-sky-500 dark:text-sky-400",
        },
        {
            path: "/perfil",
            label: "Perfil",
            outlineIcon: RiUser3Line,
            solidIcon: RiUser3Fill,
            isCenter: false,
            activeColor: "text-purple-500 dark:text-purple-400",
        },
    ];

    const desktopRef = useRef<HTMLDivElement>(null);
    const mobileRef = useRef<HTMLDivElement>(null);

    const desktopTabsRef = useRef<(HTMLAnchorElement | null)[]>([]);
    const mobileTabsRef = useRef<(HTMLDivElement | null)[]>([]);

    const [desktopPill, setDesktopPill] = useState({ left: 0, width: 0, height: 0, top: 0, ready: false });
    const [mobilePill, setMobilePill] = useState({ left: 0, width: 0, height: 0, top: 0, ready: false });

    const {
        getThemeClasses,
        perfTier,
        perfSource,
        requestImmersive,
        visualMode,
        isDarkMode,
        toggleDarkMode,
        accentColor,
        notchShortcuts,
    } = useTheme();

    const navTheme = getThemeClasses("navbar");
    const dockTheme = getThemeClasses("dock");
    const location = useLocation();

    const pillSpring = { type: "spring" as const, stiffness: 600, damping: 38, mass: 0.4 };
    const accentStyle = ACCENT_STYLES[accentColor as keyof typeof ACCENT_STYLES] ?? ACCENT_STYLES.emerald;
    const scrollTransition = visualMode === "immersive" ? "transition-all duration-500 ease-out" : "transition-none";

    const [scrollY, setScrollY] = useState(0);
    const isOverHero = location.pathname === "/" && scrollY < 80;
    const shouldShowGlassNavbar = scrolled;

    // Lógica para auto-hide al bajar y REAPARICIÓN INMEDIATA al hacer scroll hacia arriba
    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            setScrollY(currentY);
            setScrolled(currentY > 20);

            // Si está hasta arriba, siempre visible
            if (currentY <= 20) {
                setNotchVisible(true);
            } else if (currentY > lastScrollY.current + 8) {
                // Scroll hacia abajo -> oculta el notch
                setNotchVisible(false);
            } else if (currentY < lastScrollY.current - 6) {
                // Scroll hacia arriba -> REAPARECE DE INMEDIATO!
                setNotchVisible(true);
            }

            lastScrollY.current = currentY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const pathnameRef = useRef(location.pathname);
    pathnameRef.current = location.pathname;

    const updatePills = () => {
        // Desktop
        const dIdx = DESKTOP_NAV_LINKS.findIndex((l) => l.path === pathnameRef.current);
        if (dIdx !== -1) {
            const dEl = desktopTabsRef.current[dIdx];
            if (dEl) {
                setDesktopPill({
                    left: dEl.offsetLeft,
                    top: dEl.offsetTop,
                    width: dEl.offsetWidth,
                    height: dEl.offsetHeight,
                    ready: true,
                });
            }
        } else {
            setDesktopPill((prev) => ({ ...prev, ready: false }));
        }

        // Mobile
        const mIdx = mobileNavLinks.findIndex(
            (l) => l.path === pathnameRef.current || (l.path === "/perfil" && pathnameRef.current === "/login")
        );
        if (mIdx !== -1) {
            const mEl = mobileTabsRef.current[mIdx];
            if (mEl) {
                setMobilePill({
                    left: mEl.offsetLeft,
                    top: mEl.offsetTop,
                    width: mEl.offsetWidth,
                    height: mEl.offsetHeight,
                    ready: true,
                });
            }
        } else {
            setMobilePill((prev) => ({ ...prev, ready: false }));
        }
    };

    useLayoutEffect(() => {
        updatePills();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, isLoggedIn]);

    useEffect(() => {
        const rafId = requestAnimationFrame(updatePills);
        window.addEventListener("resize", updatePills);
        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", updatePills);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setIsDropdownOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                desktopRef.current &&
                !desktopRef.current.contains(e.target as Node) &&
                mobileRef.current &&
                !mobileRef.current.contains(e.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogoClick = (e: React.MouseEvent) => {
        if (location.pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleNavClick = (e: React.MouseEvent, path: string) => {
        if (path === "/" && location.pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    if (location.pathname === "/login" || location.pathname === "/registro") {
        return null;
    }

    return (
        <>
            {/* 1. MODO PC (Inicio, Escáner, Mapa, Perfil + Botón Ajustes + Menú) */}
            <motion.header
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1, scale: scrolled ? 1 : 1.015 }}
                transition={{
                    default: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                    scale: { type: "spring", stiffness: 170, damping: 26, mass: 0.9 },
                }}
                aria-label="Navegación principal"
                className="hidden md:flex fixed z-[60] top-[max(1.25rem,calc(env(safe-area-inset-top,0px)+0.75rem))] left-0 right-0 justify-center w-full pointer-events-none"
            >
                <div className="pointer-events-auto relative grid grid-cols-3 items-center w-[calc(100vw-2rem)] max-w-5xl px-6 py-2.5">
                    {/* Capa de cristal */}
                    <div
                        className={`absolute inset-0 rounded-full ${scrollTransition} -z-10 pointer-events-none shadow-md ${navTheme} ${
                            shouldShowGlassNavbar ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-[0.99] -translate-y-0.5"
                        }`}
                    />

                    {/* Logo */}
                    <div className="flex justify-start items-center gap-2">
                        <Link
                            to="/"
                            onClick={handleLogoClick}
                            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl p-1"
                            aria-label="ReCiclo - Ir al inicio"
                        >
                            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="flex items-center gap-2">
                                <img
                                    src={isOverHero || isDarkMode ? LOGO_DARK : LOGO_LIGHT}
                                    alt="ReCiclo"
                                    className="h-7 w-auto object-contain select-none transition-all duration-300"
                                />
                                <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                    v2.0
                                </span>
                            </motion.div>
                        </Link>
                        <LiteModeBadge tier={perfTier} source={perfSource} onRequestFull={requestImmersive} />
                    </div>

                    {/* Tabs centrales en PC */}
                    <div className="flex justify-center">
                        <div
                            className={`relative flex items-center gap-1.5 p-1.5 rounded-full ${scrollTransition} ${
                                isOverHero
                                    ? "bg-white/15 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-zinc-700/50 shadow-sm"
                                    : "bg-black/[0.04] dark:bg-white/10 backdrop-blur-md border border-black/[0.06] dark:border-white/5 shadow-sm"
                            }`}
                        >
                            {/* Cápsula animada */}
                            <motion.div
                                className={`absolute inset-y-1.5 rounded-full pointer-events-none ${
                                    isDarkMode
                                        ? "bg-white shadow-[0_2px_12px_rgba(255,255,255,0.12),0_1px_3px_rgba(0,0,0,0.4)]"
                                        : "bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-black/5"
                                }`}
                                initial={false}
                                animate={{
                                    x: desktopPill.left,
                                    width: desktopPill.width,
                                    opacity: desktopPill.ready && desktopPill.width > 0 ? 1 : 0,
                                }}
                                transition={pillSpring}
                                style={{ left: 0 }}
                            />

                            {DESKTOP_NAV_LINKS.map((link, index) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        ref={(el) => {
                                            desktopTabsRef.current[index] = el;
                                        }}
                                        onClick={(e) => handleNavClick(e, link.path)}
                                        aria-current={isActive ? "page" : undefined}
                                        className={`relative px-5 py-2 rounded-full text-sm transition-colors duration-200 select-none focus-visible:outline-none focus-visible:ring-2 ${accentStyle.ring} active:scale-[0.96] ${
                                            isActive
                                                ? "text-zinc-950 font-semibold"
                                                : isOverHero
                                                ? "text-white/80 hover:text-white font-medium"
                                                : isDarkMode
                                                ? "text-zinc-400 hover:text-white font-medium"
                                                : "text-zinc-600 hover:text-zinc-950 font-medium"
                                        }`}
                                    >
                                        <span className="relative z-10">{link.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Controles de la derecha en PC: Menú de usuario con Configuración integrada */}
                    <div className="flex items-center justify-end gap-2 relative" ref={desktopRef}>
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            aria-label="Abrir menú de usuario"
                            aria-expanded={isDropdownOpen}
                            aria-haspopup="dialog"
                            className={`flex items-center gap-2 pl-2.5 pr-1 py-1 rounded-full ${scrollTransition} cursor-pointer focus-visible:outline-none focus-visible:ring-2 ${accentStyle.ring} ${
                                isOverHero
                                    ? "bg-white/15 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-zinc-700/50 shadow-sm text-white"
                                    : "bg-black/[0.04] dark:bg-white/10 backdrop-blur-md border border-black/[0.06] dark:border-transparent shadow-sm hover:bg-black/[0.07] dark:hover:bg-white/15"
                            }`}
                        >
                            <Menu size={18} className={`transition-colors duration-200 ${isOverHero ? "text-white/90" : isDarkMode ? "text-zinc-300" : "text-zinc-700"}`} />
                            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-black/5 dark:bg-white/10">
                                {isLoggedIn ? (
                                    userPhoto ? (
                                        <img src={userPhoto} alt="Foto de perfil" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 select-none">
                                            {(currentUser.name || "U").charAt(0).toUpperCase()}
                                        </span>
                                    )
                                ) : (
                                    <User size={16} className={`transition-colors duration-200 ${isOverHero ? "text-white" : isDarkMode ? "text-zinc-200" : "text-zinc-700"}`} />
                                )}
                            </div>
                        </motion.button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <NavbarDropdown
                                    id="desktop-dropdown"
                                    isLoggedIn={isLoggedIn}
                                    setIsLoggedIn={() => {}}
                                    user={{ ...currentUser, photoURL: userPhoto }}
                                    closeMenu={() => setIsDropdownOpen(false)}
                                    openSettings={() => setIsSettingsOpen(true)}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.header>

            {/* 2. MÓVIL: TOP NOTCH DINÁMICO ADAPTATIVO */}
            <motion.header
                initial={{ y: 0, opacity: 1 }}
                animate={{
                    y: notchVisible ? 0 : -80,
                    opacity: notchVisible ? 1 : 0,
                }}
                transition={{
                    duration: 0.28,
                    ease: [0.16, 1, 0.3, 1],
                }}
                aria-label="Notch móvil institucional"
                className="md:hidden fixed top-[max(0.625rem,calc(env(safe-area-inset-top,0px)+0.35rem))] left-1/2 -translate-x-1/2 z-[60] pointer-events-auto flex items-center gap-2"
            >
                <NotchIsland
                    shortcuts={notchShortcuts}
                    isDarkMode={isDarkMode}
                    isTransparent={location.pathname === "/" && scrollY < 50}
                    onToggleTheme={toggleDarkMode}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                />
                {perfTier === "lite" && (
                    <LiteModeBadge tier={perfTier} onRequestFull={requestImmersive} />
                )}
            </motion.header>

            {/* 3. MÓVIL: DEGRADADO INFERIOR SUAVE */}
            <div
                aria-hidden="true"
                className={`md:hidden fixed bottom-0 left-0 right-0 h-24 pointer-events-none z-[55] transition-colors duration-500 bg-gradient-to-t ${
                    isOverHero || isDarkMode
                        ? "from-zinc-950 via-zinc-950/60 to-transparent"
                        : "from-white via-white/60 to-transparent"
                }`}
            />

            {/* 4. MÓVIL: TAB BAR CON ÍCONOS PROFESIONALES OUTLINE/FILLED MEDIANTE REACT-ICONS */}
            <motion.nav
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: { transition: { delayChildren: 0.15, staggerChildren: 0.05 } },
                }}
                aria-label="Navegación principal móvil"
                className="md:hidden fixed bottom-[max(0.75rem,calc(env(safe-area-inset-bottom,0px)+0.5rem))] left-1/2 -translate-x-1/2 z-[60] w-full max-w-[360px] px-3 pointer-events-none"
            >
                <motion.div
                    variants={{
                        hidden: { y: 25, opacity: 0 },
                        visible: { y: 0, opacity: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
                    }}
                    className={`pointer-events-auto relative flex items-center justify-between p-1 h-[52px] rounded-full transition-colors duration-300 ease-out shadow-xl border border-black/10 dark:border-white/10 ${dockTheme}`}
                >
                    {/* Cápsula deslizante activa */}
                    <motion.div
                        className={`absolute inset-y-1 rounded-full pointer-events-none ${
                            isDarkMode ? "bg-white shadow-sm" : "bg-zinc-900 shadow-sm"
                        }`}
                        initial={false}
                        animate={{
                            x: mobilePill.left,
                            width: mobilePill.width,
                            opacity: mobilePill.ready && mobilePill.width > 0 ? 1 : 0,
                        }}
                        transition={pillSpring}
                        style={{ left: 0 }}
                    />

                    {mobileNavLinks.map((link, index) => {
                        const isActive =
                            location.pathname === link.path ||
                            (link.path === "/perfil" && location.pathname === "/login");
                        const OutlineIcon = link.outlineIcon;
                        const SolidIcon = link.solidIcon;
                        const isCenterButton = link.isCenter;

                        // Micro-animación suave según el icono activo
                        const iconAnimation =
                            link.path === "/escanear"
                                ? { scale: isActive ? [1, 1.15, 1] : 1 }
                                : link.path === "/mapa"
                                ? { y: isActive ? [0, -2, 0] : 0, scale: isActive ? [1, 1.1, 1] : 1 }
                                : { scale: isActive ? [1, 1.1, 1] : 1 };

                        const content = (
                            <motion.div
                                whileHover={{ scale: 1.06 }}
                                whileTap={{ scale: 0.88 }}
                                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                                className={`relative z-10 flex flex-col items-center justify-center gap-0.5 transition-colors duration-200 ${
                                    isActive
                                        ? isDarkMode
                                            ? "text-zinc-950 font-bold"
                                            : "text-white font-bold"
                                        : "text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white font-medium"
                                }`}
                            >
                                <motion.div
                                    animate={iconAnimation}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                    className={`transition-colors duration-200 ${
                                        isActive ? link.activeColor : "text-zinc-700 dark:text-zinc-300"
                                    }`}
                                >
                                    {isActive ? (
                                        <SolidIcon size={isCenterButton ? 21 : 19} />
                                    ) : (
                                        <OutlineIcon size={isCenterButton ? 21 : 19} />
                                    )}
                                </motion.div>
                                <span className={`text-[9px] tracking-tight leading-none ${isActive ? "font-bold" : "font-medium"}`}>
                                    {link.label}
                                </span>
                            </motion.div>
                        );

                        return (
                            <motion.div
                                key={link.label}
                                ref={(el) => {
                                    mobileTabsRef.current[index] = el;
                                }}
                                variants={{
                                    hidden: { scale: 0.7, opacity: 0 },
                                    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
                                }}
                                className="relative flex-1 h-full"
                            >
                                <Link
                                    to={link.path}
                                    onClick={(e) => handleNavClick(e, link.path)}
                                    aria-current={isActive ? "page" : undefined}
                                    className="relative flex flex-col items-center justify-center w-full h-full py-1 rounded-full focus-visible:outline-none"
                                >
                                    {content}
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </motion.nav>

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            <PerformanceWarningDialog />
        </>
    );
}