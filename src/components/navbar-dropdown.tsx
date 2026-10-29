import { useEffect, useRef, type ComponentType, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { logout } from "../firebase";
import {
    Settings,
    LogIn,
    UserPlus,
    LogOut,
    Sun,
    Moon,
    Palette,
    Layers,
    User,
    Landmark,
    BookOpen,
} from "lucide-react";

interface NavbarDropdownProps {
    id: string;
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    closeMenu: () => void;
    openSettings: () => void;
    onSignUp?: () => void;
    user?: { name: string; email: string; photoURL?: string };
}

const GLASS_OPTIONS = [
    { value: "solid", label: "Sólido" },
    { value: "light", label: "Ligero" },
    { value: "heavy", label: "Profundo" },
] as const;

const ACCENTS = {
    emerald: {
        text: "text-emerald-600 dark:text-emerald-400",
        gradient: "from-emerald-500 to-teal-700 dark:from-emerald-400 dark:to-teal-300",
        badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    blue: {
        text: "text-blue-600 dark:text-blue-400",
        gradient: "from-blue-500 to-cyan-700 dark:from-blue-400 dark:to-cyan-300",
        badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    amber: {
        text: "text-amber-600 dark:text-amber-400",
        gradient: "from-amber-500 to-orange-700 dark:from-amber-400 dark:to-orange-300",
        badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    purple: {
        text: "text-purple-600 dark:text-purple-400",
        gradient: "from-purple-500 to-fuchsia-700 dark:from-purple-400 dark:to-fuchsia-300",
        badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    },
    rose: {
        text: "text-rose-600 dark:text-rose-400",
        gradient: "from-rose-500 to-pink-700 dark:from-rose-400 dark:to-pink-300",
        badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    },
};

const FOCUS_RING =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40 dark:focus-visible:ring-white/50";

const SECTION_LABEL =
    "text-[11px] font-bold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5";

interface MenuItemProps {
    icon: ComponentType<{ size?: number; className?: string }>;
    iconClass?: string;
    onClick: () => void;
    children: ReactNode;
    badge?: string;
    danger?: boolean;
}

function MenuItem({ icon: Icon, iconClass = "", onClick, children, badge, danger = false }: MenuItemProps) {
    const tone = danger
        ? "text-red-600 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/20 font-bold"
        : "text-zinc-800 dark:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/10 hover:text-zinc-950 dark:hover:text-white font-medium";

    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center justify-between w-full px-2.5 py-2 text-xs rounded-xl transition-colors text-left cursor-pointer active:scale-[0.98] ${tone} ${FOCUS_RING}`}
        >
            <div className="flex items-center gap-2.5 truncate">
                <Icon size={15} className={`shrink-0 ${danger ? "" : iconClass}`} />
                <span className="truncate">{children}</span>
            </div>
            {badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                    {badge}
                </span>
            )}
        </button>
    );
}

export function NavbarDropdown({
    id,
    isLoggedIn,
    setIsLoggedIn,
    closeMenu,
    openSettings,
    onSignUp,
    user = { name: "Usuario", email: "usuario@correo.com" },
}: NavbarDropdownProps) {
    const {
        glassTheme,
        setGlassTheme,
        isDarkMode,
        toggleDarkMode,
        colorSchemeMode,
        accentColor,
        setAccentColor,
        perfTier,
    } = useTheme();

    const navigate = useNavigate();
    const accent = ACCENTS[accentColor as keyof typeof ACCENTS] ?? ACCENTS.emerald;
    const reduceMotion = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);

    const closeRef = useRef(closeMenu);
    useEffect(() => {
        closeRef.current = closeMenu;
    }, [closeMenu]);

    // Gestión del foco y tecla Escape
    useEffect(() => {
        const node = ref.current;
        const previous = document.activeElement as HTMLElement | null;
        node?.focus({ preventScroll: true });

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeRef.current();
        };
        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            const active = document.activeElement;
            if ((!active || active === document.body || node?.contains(active)) && previous?.isConnected) {
                previous.focus({ preventScroll: true });
            }
        };
    }, []);

    // Navegación con flechas del teclado
    const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
        if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
        const items: HTMLElement[] = Array.from(ref.current?.querySelectorAll<HTMLElement>("button") ?? []);
        if (!items.length) return;
        e.preventDefault();
        const i = items.indexOf(document.activeElement as HTMLElement);
        const last = items.length - 1;
        let next: number;
        if (e.key === "Home") next = 0;
        else if (e.key === "End") next = last;
        else if (e.key === "ArrowDown") next = i < 0 || i === last ? 0 : i + 1;
        else next = i <= 0 ? last : i - 1;
        items[next].focus();
    };

    const hidden = reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -6 };
    const enter: Transition = reduceMotion
        ? { duration: 0.1 }
        : {
            default: { type: "spring", stiffness: 540, damping: 36, mass: 0.65 },
            opacity: { duration: 0.12, ease: "easeOut" },
        };
    const leave: Transition = { duration: reduceMotion ? 0.08 : 0.1, ease: "easeIn" };

    return (
        <motion.div
            ref={ref}
            id={id}
            role="dialog"
            aria-label="Menú de usuario"
            tabIndex={-1}
            onKeyDown={onKeyDown}
            initial={hidden}
            animate={{ opacity: 1, scale: 1, y: 0, transition: enter }}
            exit={{ ...hidden, ...(reduceMotion ? {} : { scale: 0.97, y: -2 }), transition: leave }}
            style={{ transformOrigin: "top right", willChange: "transform, opacity" }}
            className="absolute top-[calc(100%+12px)] right-0 w-[270px] max-w-[calc(100vw-1.5rem)] rounded-2xl p-2 z-50 outline-none bg-white/98 dark:bg-zinc-900/95 backdrop-blur-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-2xl"
        >
            <div className="flex flex-col">
                {/* 1. Usuario o Acceso */}
                {isLoggedIn ? (
                    <div className="px-2.5 py-2 border-b border-black/5 dark:border-white/10 mb-1.5 flex items-center gap-2.5">
                        <div className="size-9 rounded-full overflow-hidden bg-black/5 dark:bg-white/10 shrink-0 border border-black/10 dark:border-white/10 shadow-xs flex items-center justify-center">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className={`text-xs font-bold ${accent.text} select-none`}>
                                    {(user.name || "U").charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-zinc-950 dark:text-white truncate">
                                Hola,{" "}
                                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${accent.gradient}`}>
                                    {user.name}
                                </span>
                            </p>
                            <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-medium truncate">
                                {user.email || "Estudiante ITM"}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-0.5 mb-1.5 border-b border-black/5 dark:border-white/10 pb-1.5">
                        <MenuItem
                            icon={LogIn}
                            iconClass={accent.text}
                            onClick={() => {
                                navigate("/login");
                                closeMenu();
                            }}
                        >
                            Iniciar sesión
                        </MenuItem>
                        <MenuItem
                            icon={UserPlus}
                            iconClass={accent.text}
                            onClick={() => {
                                if (onSignUp) onSignUp();
                                else navigate("/registro");
                                closeMenu();
                            }}
                        >
                            Crear cuenta
                        </MenuItem>
                    </div>
                )}

                {/* 2. Ajustes rápidos: Tema, Color de Acento y Transparencia */}
                <div className="px-1 mb-1.5 flex flex-col gap-1.5">
                    {/* Interruptor de Tema (Claro / Oscuro) */}
                    <button
                        type="button"
                        role="switch"
                        aria-checked={isDarkMode}
                        onClick={toggleDarkMode}
                        title={
                            colorSchemeMode === "system" || colorSchemeMode === "schedule"
                                ? "Cambiar manualmente desactiva el modo automático"
                                : undefined
                        }
                        className={`flex items-center justify-between w-full px-2 py-1.5 rounded-xl cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${FOCUS_RING}`}
                    >
                        <span className={SECTION_LABEL}>
                            {isDarkMode ? <Moon size={14} className={accent.text} /> : <Sun size={14} className={accent.text} />} Tema
                            {(colorSchemeMode === "system" || colorSchemeMode === "schedule") && (
                                <span className="normal-case font-normal text-zinc-500 dark:text-zinc-400">
                                    · Auto
                                </span>
                            )}
                        </span>
                        <span
                            aria-hidden="true"
                            className={`w-9 h-5 rounded-full relative flex items-center px-0.5 shadow-inner border border-black/15 dark:border-white/10 transition-colors duration-200 ${
                                isDarkMode ? "bg-zinc-700" : "bg-zinc-300"
                            }`}
                        >
                            <motion.span
                                initial={false}
                                className="block size-3.5 bg-white rounded-full shadow-xs"
                                animate={{ x: isDarkMode ? 16 : 0 }}
                                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 600, damping: 34 }}
                            />
                        </span>
                    </button>

                    {/* Selector de Color de Acento */}
                    <div className="flex flex-col gap-1 px-1">
                        <span className={SECTION_LABEL}>
                            <Palette size={14} className={accent.text} /> Color de Acento
                        </span>
                        <div className="flex items-center justify-between gap-1 px-2 py-1.5 bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/5 rounded-xl">
                            {[
                                { id: "emerald" as const, bg: "bg-emerald-500", name: "Esmeralda" },
                                { id: "blue" as const, bg: "bg-blue-500", name: "Zafiro" },
                                { id: "amber" as const, bg: "bg-amber-500", name: "Ámbar" },
                                { id: "purple" as const, bg: "bg-purple-500", name: "Amatista" },
                                { id: "rose" as const, bg: "bg-rose-500", name: "Coral" },
                            ].map((c) => {
                                const isSelected = accentColor === c.id;
                                return (
                                    <button
                                        key={c.id}
                                        type="button"
                                        onClick={() => setAccentColor(c.id)}
                                        title={c.name}
                                        aria-label={`Color ${c.name}`}
                                        className={`size-5 rounded-full ${c.bg} flex items-center justify-center transition-transform active:scale-90 cursor-pointer ${
                                            isSelected
                                                ? "ring-2 ring-offset-2 ring-zinc-950 dark:ring-white dark:ring-offset-zinc-900 scale-110 shadow-xs"
                                                : "opacity-60 hover:opacity-100 hover:scale-105"
                                        }`}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* Selector de Transparencia de Vidrio */}
                    {perfTier !== "lite" && (
                        <div className="flex flex-col gap-1 px-1">
                            <span id={`${id}-glass-label`} className={SECTION_LABEL}>
                                Transparencia
                            </span>
                            <div
                                role="radiogroup"
                                aria-labelledby={`${id}-glass-label`}
                                className="flex bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/5 p-0.5 rounded-xl"
                            >
                                {GLASS_OPTIONS.map(({ value, label }) => {
                                    const active = glassTheme === value;
                                    return (
                                        <button
                                            key={value}
                                            type="button"
                                            role="radio"
                                            aria-checked={active}
                                            onClick={() => setGlassTheme(value)}
                                            className={`relative flex-1 py-1 text-[11px] font-semibold rounded-lg transition-all duration-150 cursor-pointer active:scale-95 ${FOCUS_RING} ${
                                                active
                                                    ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs border border-zinc-200/80 dark:border-white/10"
                                                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                                            }`}
                                        >
                                            <span className="relative z-10">{label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Navegación a las secciones de la página */}
                <div className="border-t border-black/5 dark:border-white/10 pt-1.5 mt-0.5 flex flex-col gap-0.5">
                    {/* Mi Perfil (si está logueado) */}
                    {isLoggedIn && (
                        <MenuItem
                            icon={User}
                            iconClass={accent.text}
                            onClick={() => {
                                navigate("/perfil");
                                closeMenu();
                            }}
                        >
                            Mi Perfil
                        </MenuItem>
                    )}

                    {/* Museo Histórico (gran novedad de ReCiclo) */}
                    <MenuItem
                        icon={Landmark}
                        iconClass={accent.text}
                        badge="30 v"
                        onClick={() => {
                            navigate("/museo");
                            closeMenu();
                        }}
                    >
                        Museo Histórico
                    </MenuItem>

                    {/* Guía Cómo Funciona */}
                    <MenuItem
                        icon={BookOpen}
                        iconClass={accent.text}
                        onClick={() => {
                            navigate("/como-funciona");
                            closeMenu();
                        }}
                    >
                        Cómo Funciona (4V)
                    </MenuItem>

                    {/* Tecnologías y Normativa */}
                    <MenuItem
                        icon={Layers}
                        iconClass={accent.text}
                        onClick={() => {
                            navigate("/tecnologias");
                            closeMenu();
                        }}
                    >
                        Tecnologías y Recursos
                    </MenuItem>

                    {/* Configuración Detallada */}
                    <MenuItem
                        icon={Settings}
                        iconClass={accent.text}
                        onClick={() => {
                            openSettings();
                            closeMenu();
                        }}
                    >
                        Configuración
                    </MenuItem>

                    {/* Cerrar sesión */}
                    {isLoggedIn && (
                        <MenuItem
                            icon={LogOut}
                            danger
                            onClick={async () => {
                                try {
                                    await logout();
                                } catch (err) {
                                    console.error("Error al cerrar sesión", err);
                                }
                                setIsLoggedIn(false);
                                closeMenu();
                            }}
                        >
                            Cerrar sesión
                        </MenuItem>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
