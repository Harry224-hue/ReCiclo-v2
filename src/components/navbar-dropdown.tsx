import { useEffect, useRef, type ComponentType, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { logout } from "../firebase";
import { Settings, LogIn, UserPlus, LogOut, Sun, Moon, Palette, Layers, User } from "lucide-react";

interface NavbarDropdownProps {
    id: string;
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    closeMenu: () => void;
    openSettings: () => void; // Abre el modal de configuración detallada
    onSignUp?: () => void; // Acción de "Crear cuenta"
    user?: { name: string; email: string; photoURL?: string };
}

const GLASS_OPTIONS = [
    { value: "solid", label: "Sólido" },
    { value: "light", label: "Ligero" },
    { value: "heavy", label: "Profundo" },
] as const;

// Mismos tokens de acento que el resto de la página: el color elegido por la persona
// tiñe el saludo y los íconos, así el menú se siente parte del sitio y no un menú genérico.
const ACCENTS = {
    emerald: {
        text: "text-emerald-600 dark:text-emerald-400",
        gradient: "from-emerald-500 to-teal-700 dark:from-emerald-400 dark:to-teal-300",
    },
    blue: {
        text: "text-blue-600 dark:text-blue-400",
        gradient: "from-blue-500 to-cyan-700 dark:from-blue-400 dark:to-cyan-300",
    },
    amber: {
        text: "text-amber-600 dark:text-amber-400",
        gradient: "from-amber-500 to-orange-700 dark:from-amber-400 dark:to-orange-300",
    },
    purple: {
        text: "text-purple-600 dark:text-purple-400",
        gradient: "from-purple-500 to-fuchsia-700 dark:from-purple-400 dark:to-fuchsia-300",
    },
    rose: {
        text: "text-rose-600 dark:text-rose-400",
        gradient: "from-rose-500 to-pink-700 dark:from-rose-400 dark:to-pink-300",
    },
};

const FOCUS_RING =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40 dark:focus-visible:ring-white/50";

const SECTION_LABEL =
    "text-xs font-bold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-2";

interface MenuItemProps {
    icon: ComponentType<{ size?: number; className?: string }>;
    iconClass?: string;
    onClick: () => void;
    children: ReactNode;
    danger?: boolean;
}

function MenuItem({ icon: Icon, iconClass = "", onClick, children, danger = false }: MenuItemProps) {
    const tone = danger
        ? "text-red-600 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/20 font-bold"
        : "text-zinc-900 dark:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/10 font-semibold";

    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-xl transition-colors text-left cursor-pointer active:scale-[0.98] ${tone} ${FOCUS_RING}`}
        >
            <Icon size={16} className={danger ? "" : iconClass} /> {children}
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
    const { glassTheme, setGlassTheme, isDarkMode, toggleDarkMode, colorSchemeMode, accentColor, setAccentColor, perfTier } = useTheme();
    const navigate = useNavigate();
    const accent = ACCENTS[accentColor as keyof typeof ACCENTS] ?? ACCENTS.emerald;
    const reduceMotion = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);

    // closeMenu en una ref: si el padre no lo memoiza, el efecto de abajo se volvía a ejecutar en cada
    // render (p. ej. al cambiar de tema) y el foco saltaba de vuelta al primer botón.
    const closeRef = useRef(closeMenu);
    useEffect(() => {
        closeRef.current = closeMenu;
    }, [closeMenu]);

    // Al abrir, el foco entra al menú (al contenedor, para no resaltar ninguna fila si se abrió con el mouse).
    // Escape cierra. Al cerrar, el foco vuelve al botón que lo abrió, salvo que otra cosa
    // (por ejemplo el modal de Configuración) ya lo haya tomado.
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

    // Flechas arriba/abajo, Inicio y Fin recorren las opciones
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

    // Animación rápida y sin blur: entra con un resorte firme (~200 ms) y sale más rápido todavía.
    // Animar `filter: blur()` sobre un panel que ya tiene backdrop-blur era lo más lento del original.
    const hidden = reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: -6 };
    const enter: Transition = reduceMotion
        ? { duration: 0.1 }
        : {
            default: { type: "spring", stiffness: 520, damping: 36, mass: 0.7 },
            opacity: { duration: 0.14, ease: "easeOut" },
        };
    const leave: Transition = { duration: reduceMotion ? 0.08 : 0.12, ease: "easeIn" };

    return (
        <motion.div
            ref={ref}
            role="dialog"
            aria-label="Menú de usuario"
            tabIndex={-1}
            onKeyDown={onKeyDown}
            initial={hidden}
            animate={{ opacity: 1, scale: 1, y: 0, transition: enter }}
            exit={{ ...hidden, ...(reduceMotion ? {} : { scale: 0.97, y: -2 }), transition: leave }}
            style={{ transformOrigin: "top right", willChange: "transform, opacity" }}
            className={`absolute top-[calc(100%+16px)] right-0 w-[265px] max-w-[calc(100vw-2rem)] rounded-[1.5rem] p-2 overflow-hidden z-50 outline-none bg-white/98 dark:bg-zinc-900/95 backdrop-blur-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-2xl`}
        >
            <div className="flex flex-col">
                {/* 1. Usuario */}
                {isLoggedIn ? (
                    <div className="px-3 py-3 border-b border-black/5 dark:border-white/10 mb-2 flex items-center gap-3">
                        <div className="size-10 rounded-full overflow-hidden bg-black/5 dark:bg-white/10 shrink-0 border border-black/10 dark:border-white/10 shadow-sm flex items-center justify-center">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 select-none">
                                    {(user.name || "U").charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-zinc-950 dark:text-white truncate">
                                Hola,{" "}
                                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${accent.gradient}`}>{user.name}</span>
                            </p>
                            <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium truncate">{user.email}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1 mb-2 border-b border-black/5 dark:border-white/10 pb-2">
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
                                if (onSignUp) {
                                    onSignUp();
                                } else {
                                    navigate("/registro");
                                }
                                closeMenu();
                            }}
                        >
                            Crear cuenta
                        </MenuItem>
                    </div>
                )}

                {/* 2. Ajustes rápidos */}
                <div className="px-2 mb-2 flex flex-col gap-1.5">
                    {/* Toda la fila es el interruptor: objetivo táctil grande y un solo elemento enfocable */}
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
                        className={`flex items-center justify-between w-full px-2 py-2 rounded-xl cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${FOCUS_RING}`}
                    >
                        <span className={SECTION_LABEL}>
                            {isDarkMode ? <Moon size={15} className={accent.text} /> : <Sun size={15} className={accent.text} />} Tema
                            {(colorSchemeMode === "system" || colorSchemeMode === "schedule") && (
                                <span className="normal-case font-medium text-zinc-600 dark:text-zinc-400">
                                    · Automático
                                </span>
                            )}
                        </span>
                        <span
                            aria-hidden="true"
                            className={`w-11 h-6 rounded-full relative flex items-center px-1 shadow-inner border border-black/15 dark:border-white/10 transition-colors duration-200 ${
                                isDarkMode ? "bg-zinc-700" : "bg-zinc-300"
                            }`}
                        >
                            <motion.span
                                initial={false}
                                className="block w-4 h-4 bg-white rounded-full shadow-md"
                                animate={{ x: isDarkMode ? 20 : 0 }}
                                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 600, damping: 34 }}
                            />
                        </span>
                    </button>

                    {/* Selector rápido de color de acento para adaptar toda la página */}
                    <div className="flex flex-col gap-1.5 px-1 py-1.5">
                        <span className={SECTION_LABEL}>
                            <Palette size={15} className={accent.text} /> Color de Acento
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
                                        className={`size-6 rounded-full ${c.bg} flex items-center justify-center transition-transform active:scale-90 cursor-pointer ${
                                            isSelected ? "ring-2 ring-offset-2 ring-zinc-950 dark:ring-white dark:ring-offset-zinc-900 scale-110 shadow-sm" : "opacity-80 hover:opacity-100 hover:scale-105"
                                        }`}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* El selector de transparencia optimizado sin layoutId pesado */}
                    {perfTier === "lite" ? (
                        <div className="flex items-center gap-2 px-2 py-2">
                            <Palette size={15} className="shrink-0 text-zinc-700 dark:text-zinc-300" />
                            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                                Transparencia simplificada
                            </span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1.5 px-1 py-1.5">
                            <span id={`${id}-glass-label`} className={SECTION_LABEL}>
                                Transparencia
                            </span>
                            <div
                                role="radiogroup"
                                aria-labelledby={`${id}-glass-label`}
                                className="flex bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/5 p-1 rounded-xl"
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
                                            className={`relative flex-1 py-1 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer active:scale-95 ${FOCUS_RING} ${
                                                active
                                                    ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm border border-zinc-200/80 dark:border-white/10"
                                                    : "text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white"
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

                {/* 3. Configuración detallada y cierre de sesión */}
                <div className="border-t border-black/5 dark:border-white/10 pt-2 mt-1">
                    <MenuItem
                        icon={User}
                        iconClass={accent.text}
                        onClick={() => {
                            navigate(isLoggedIn ? "/perfil" : "/login");
                            closeMenu();
                        }}
                    >
                        {isLoggedIn ? "Mi Perfil" : "Iniciar sesión"}
                    </MenuItem>

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