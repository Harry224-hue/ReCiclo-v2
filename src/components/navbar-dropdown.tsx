import { useEffect, useRef, type ComponentType, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { logout } from "../firebase";
import { Settings, LogIn, UserPlus, LogOut, Sun, Moon, Layers, User } from "lucide-react";

interface NavbarDropdownProps {
    id?: string;
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    closeMenu: () => void;
    openSettings: () => void; // Abre el modal de configuración detallada
    onSignUp?: () => void; // Acción de "Crear cuenta"
    user?: { name: string; email: string; photoURL?: string };
}

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

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 8, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 480,
            damping: 28,
            mass: 0.5,
        },
    },
};

interface MenuItemProps {
    icon: ComponentType<{ size?: number; className?: string }>;
    iconClass?: string;
    onClick: () => void;
    children: ReactNode;
    danger?: boolean;
}

function MenuItem({ icon: Icon, iconClass = "", onClick, children, danger = false }: MenuItemProps) {
    const tone = danger
        ? "text-red-600 dark:text-red-400 hover:bg-red-500/15 dark:hover:bg-red-500/25 font-bold"
        : "text-zinc-900 dark:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/10 font-semibold";

    return (
        <motion.button
            type="button"
            variants={itemVariants}
            whileHover={{ x: 4, scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            onClick={onClick}
            className={`group flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-xl text-left cursor-pointer transition-colors duration-150 ${tone} ${FOCUS_RING}`}
        >
            <motion.span
                whileHover={{ scale: 1.18, rotate: danger ? 12 : -8 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                className="shrink-0 flex items-center justify-center transition-transform"
            >
                <Icon size={16} className={danger ? "" : iconClass} />
            </motion.span>
            <span className="flex-1 truncate">{children}</span>
        </motion.button>
    );
}

export function NavbarDropdown({
                                   isLoggedIn,
                                   setIsLoggedIn,
                                   closeMenu,
                                   openSettings,
                                   onSignUp,
                                   user = { name: "Usuario", email: "usuario@correo.com" },
                               }: NavbarDropdownProps) {
    const { isDarkMode, toggleDarkMode, colorSchemeMode, accentColor, getThemeClasses } = useTheme();
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

    // Cerrar al hacer clic fuera del menú
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            const target = e.target as HTMLElement | null;
            if (ref.current && !ref.current.contains(target as Node)) {
                if (target?.closest('[aria-haspopup="dialog"]')) return;
                closeRef.current();
            }
        };
        const timer = setTimeout(() => {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }, 10);

        return () => {
            clearTimeout(timer);
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
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

    const containerVariants: Variants = {
        hidden: reduceMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.93, y: -10 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: reduceMotion
                ? { duration: 0.1 }
                : {
                    type: "spring",
                    stiffness: 460,
                    damping: 30,
                    mass: 0.6,
                    staggerChildren: 0.035,
                    delayChildren: 0.015,
                },
        },
        exit: reduceMotion
            ? { opacity: 0, transition: { duration: 0.08 } }
            : {
                opacity: 0,
                scale: 0.95,
                y: -6,
                transition: { duration: 0.15, ease: [0.32, 0, 0.67, 0] as const },
            },
    };

    return (
        <motion.div
            ref={ref}
            role="dialog"
            aria-label="Menú de usuario"
            tabIndex={-1}
            onKeyDown={onKeyDown}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            style={{ transformOrigin: "top right", willChange: "transform, opacity" }}
            className={`absolute top-[calc(100%+16px)] right-0 w-[265px] max-w-[calc(100vw-2rem)] rounded-[1.5rem] p-2 overflow-hidden z-50 outline-none ${getThemeClasses("dropdown")}`}
        >
            <div className="flex flex-col">
                {/* 1. Usuario */}
                {isLoggedIn ? (
                    <motion.div
                        variants={itemVariants}
                        className="px-3 py-3 border-b border-black/5 dark:border-white/10 mb-2 flex items-center gap-3"
                    >
                        <motion.div
                            whileHover={{ scale: 1.08, rotate: 3 }}
                            transition={{ type: "spring", stiffness: 450, damping: 20 }}
                            className="size-10 rounded-full overflow-hidden bg-black/5 dark:bg-white/10 shrink-0 border border-black/10 dark:border-white/10 shadow-sm flex items-center justify-center cursor-pointer"
                        >
                            {user.photoURL ? (
                                <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 select-none">
                                    {(user.name || "U").charAt(0).toUpperCase()}
                                </span>
                            )}
                        </motion.div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-zinc-950 dark:text-white truncate">
                                Hola,{" "}
                                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${accent.gradient}`}>{user.name}</span>
                            </p>
                            <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium truncate">{user.email}</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div variants={itemVariants} className="flex flex-col gap-1 mb-2 border-b border-black/5 dark:border-white/10 pb-2">
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
                    </motion.div>
                )}

                {/* 2. Ajustes rápidos */}
                <motion.div variants={itemVariants} className="px-2 mb-2 flex flex-col gap-1.5">
                    {/* Toda la fila es el interruptor: objetivo táctil grande y un solo elemento enfocable */}
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 500, damping: 28 }}
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
                            <motion.span
                                key={isDarkMode ? "moon" : "sun"}
                                initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                className="inline-flex"
                            >
                                {isDarkMode ? <Moon size={15} className={accent.text} /> : <Sun size={15} className={accent.text} />}
                            </motion.span>
                            <span>Tema</span>
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
                                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 650, damping: 32 }}
                            />
                        </span>
                    </motion.button>
                </motion.div>

                {/* 3. Configuración detallada y cierre de sesión */}
                <motion.div variants={itemVariants} className="border-t border-black/5 dark:border-white/10 pt-2 mt-1 flex flex-col gap-0.5">
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
                </motion.div>
            </div>
        </motion.div>
    );
}

