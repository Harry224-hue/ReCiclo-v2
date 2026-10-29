import { useEffect, useRef, type ComponentType, type KeyboardEvent as ReactKeyboardEvent } from "react";
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
    Landmark,
    BookOpen,
    MapPin,
    ScanLine,
    Clock,
    Layers,
    User,
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

const ACCENT_COLORS = [
    { id: "emerald" as const, bg: "bg-emerald-500", name: "Esmeralda", text: "text-emerald-600 dark:text-emerald-400", gradient: "from-emerald-500 to-teal-700 dark:from-emerald-400 dark:to-teal-300" },
    { id: "blue" as const, bg: "bg-blue-500", name: "Zafiro", text: "text-blue-600 dark:text-blue-400", gradient: "from-blue-500 to-cyan-700 dark:from-blue-400 dark:to-cyan-300" },
    { id: "amber" as const, bg: "bg-amber-500", name: "Ámbar", text: "text-amber-600 dark:text-amber-400", gradient: "from-amber-500 to-orange-700 dark:from-amber-400 dark:to-orange-300" },
    { id: "purple" as const, bg: "bg-purple-500", name: "Amatista", text: "text-purple-600 dark:text-purple-400", gradient: "from-purple-500 to-fuchsia-700 dark:from-purple-400 dark:to-fuchsia-300" },
    { id: "rose" as const, bg: "bg-rose-500", name: "Coral", text: "text-rose-600 dark:text-rose-400", gradient: "from-rose-500 to-pink-700 dark:from-rose-400 dark:to-pink-300" },
] as const;

interface DropdownItemProps {
    icon: ComponentType<{ size?: number; className?: string }>;
    label: string;
    desc?: string;
    badge?: string;
    onClick: () => void;
    accentClass: string;
}

function DropdownItem({ icon: Icon, label, desc, badge, onClick, accentClass }: DropdownItemProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl transition-colors text-left cursor-pointer active:scale-[0.98] text-zinc-800 dark:text-zinc-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-zinc-950 dark:hover:text-white group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
            <div className="flex items-center gap-2.5 min-w-0">
                <span className={`size-7 rounded-lg flex items-center justify-center shrink-0 bg-zinc-100 dark:bg-white/[0.06] group-hover:bg-zinc-200/80 dark:group-hover:bg-white/10 transition-colors ${accentClass}`}>
                    <Icon size={14} />
                </span>
                <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-tight truncate leading-tight">
                        {label}
                    </p>
                    {desc && (
                        <p className="text-[10px] text-zinc-600 dark:text-zinc-400 truncate leading-tight">
                            {desc}
                        </p>
                    )}
                </div>
            </div>
            {badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
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
    const { isDarkMode, toggleDarkMode, accentColor, setAccentColor } = useTheme();
    const navigate = useNavigate();
    const reduceMotion = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);

    const activeAccent = ACCENT_COLORS.find((c) => c.id === accentColor) ?? ACCENT_COLORS[0];

    const closeRef = useRef(closeMenu);
    useEffect(() => {
        closeRef.current = closeMenu;
    }, [closeMenu]);

    // Gestión accesible del foco
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

    // Navegación por teclado (Flechas, Inicio, Fin)
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
            aria-label="Menú rápido de navegación y ajustes"
            tabIndex={-1}
            onKeyDown={onKeyDown}
            initial={hidden}
            animate={{ opacity: 1, scale: 1, y: 0, transition: enter }}
            exit={{ ...hidden, ...(reduceMotion ? {} : { scale: 0.97, y: -2 }), transition: leave }}
            style={{ transformOrigin: "top right", willChange: "transform, opacity" }}
            className="absolute top-[calc(100%+12px)] right-0 w-[275px] max-w-[calc(100vw-1.5rem)] rounded-2xl p-2 z-50 outline-none bg-white/98 dark:bg-zinc-900/95 backdrop-blur-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-2xl text-zinc-900 dark:text-zinc-100"
        >
            <div className="flex flex-col gap-1">
                {/* 1. Cabecera: Usuario o botones de acceso */}
                {isLoggedIn ? (
                    <button
                        type="button"
                        onClick={() => {
                            navigate("/perfil");
                            closeMenu();
                        }}
                        className="flex items-center gap-2.5 p-2 rounded-xl transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-left cursor-pointer group"
                    >
                        <div className="relative size-9 rounded-full overflow-hidden bg-black/5 dark:bg-white/10 shrink-0 border border-black/10 dark:border-white/10 flex items-center justify-center">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className={`text-xs font-bold ${activeAccent.text} select-none`}>
                                    {(user.name || "U").charAt(0).toUpperCase()}
                                </span>
                            )}
                            <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                                <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                                    {user.name}
                                </p>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                                    ITM
                                </span>
                            </div>
                            <p className="text-[10px] text-zinc-600 dark:text-zinc-400 truncate">{user.email || "Mi Perfil"}</p>
                        </div>
                    </button>
                ) : (
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-50 dark:bg-white/[0.03] rounded-xl border border-zinc-200/60 dark:border-white/[0.06]">
                        <button
                            type="button"
                            onClick={() => {
                                navigate("/login");
                                closeMenu();
                            }}
                            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 shadow-xs border border-zinc-200/80 dark:border-white/10 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors cursor-pointer"
                        >
                            <LogIn size={13} className={activeAccent.text} />
                            <span>Ingresar</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (onSignUp) onSignUp();
                                else navigate("/registro");
                                closeMenu();
                            }}
                            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90 shadow-xs cursor-pointer ${activeAccent.bg}`}
                        >
                            <UserPlus size={13} />
                            <span>Registro</span>
                        </button>
                    </div>
                )}

                {/* 2. Barra de herramientas compacta (Tema + Colores + Ajustes) */}
                <div className="flex items-center justify-between gap-1 px-2 py-1.5 rounded-xl bg-zinc-100/80 dark:bg-white/[0.04] border border-zinc-200/60 dark:border-white/[0.06]">
                    {/* Alternar modo Claro / Oscuro */}
                    <button
                        type="button"
                        onClick={toggleDarkMode}
                        title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                        aria-label="Cambiar tema de color"
                        className="size-7 rounded-lg flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95"
                    >
                        {isDarkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-zinc-700" />}
                    </button>

                    <div className="h-4 w-px bg-zinc-200 dark:bg-white/10 shrink-0" aria-hidden="true" />

                    {/* Paleta compacta de 5 colores de acento */}
                    <div className="flex items-center gap-1" role="radiogroup" aria-label="Color de acento">
                        {ACCENT_COLORS.map((c) => {
                            const isSelected = accentColor === c.id;
                            return (
                                <button
                                    key={c.id}
                                    type="button"
                                    role="radio"
                                    aria-checked={isSelected}
                                    onClick={() => setAccentColor(c.id)}
                                    title={`Color ${c.name}`}
                                    aria-label={`Acento ${c.name}`}
                                    className={`size-5 rounded-full ${c.bg} transition-all cursor-pointer active:scale-90 ${
                                        isSelected
                                            ? "ring-2 ring-offset-2 ring-zinc-950 dark:ring-white dark:ring-offset-zinc-900 scale-110 shadow-xs"
                                            : "opacity-55 hover:opacity-100 hover:scale-105"
                                    }`}
                                />
                            );
                        })}
                    </div>

                    <div className="h-4 w-px bg-zinc-200 dark:bg-white/10 shrink-0" aria-hidden="true" />

                    {/* Acceso directo a Configuración */}
                    <button
                        type="button"
                        onClick={() => {
                            openSettings();
                            closeMenu();
                        }}
                        title="Abrir ajustes detallados"
                        aria-label="Configuración"
                        className="size-7 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95"
                    >
                        <Settings size={15} />
                    </button>
                </div>

                {/* 3. Accesos rápidos a las secciones funcionales de ReCiclo */}
                <div className="flex flex-col gap-0.5 pt-0.5" role="menu">
                    {/* Mi Perfil (si está logueado) */}
                    {isLoggedIn && (
                        <DropdownItem
                            icon={User}
                            label="Mi Perfil"
                            desc="Racha, medallas y puntos"
                            onClick={() => {
                                navigate("/perfil");
                                closeMenu();
                            }}
                            accentClass={activeAccent.text}
                        />
                    )}

                    {/* Museo Histórico */}
                    <DropdownItem
                        icon={Landmark}
                        label="Museo Histórico"
                        desc="30 versiones interactivas"
                        badge="30 v"
                        onClick={() => {
                            navigate("/museo");
                            closeMenu();
                        }}
                        accentClass={activeAccent.text}
                    />

                    {/* Cómo Funciona */}
                    <DropdownItem
                        icon={BookOpen}
                        label="Cómo Funciona"
                        desc="Guía 4V y los 5 contenedores"
                        onClick={() => {
                            navigate("/como-funciona");
                            closeMenu();
                        }}
                        accentClass={activeAccent.text}
                    />

                    {/* Mapa del Campus */}
                    <DropdownItem
                        icon={MapPin}
                        label="Mapa del Campus"
                        desc="Estaciones en Campus 1 y 2"
                        onClick={() => {
                            navigate("/mapa");
                            closeMenu();
                        }}
                        accentClass={activeAccent.text}
                    />

                    {/* Escáner de Residuos */}
                    <DropdownItem
                        icon={ScanLine}
                        label="Escáner de Residuos"
                        desc="Identificación por cámara e IA"
                        onClick={() => {
                            navigate("/escanear");
                            closeMenu();
                        }}
                        accentClass={activeAccent.text}
                    />

                    {/* Historial */}
                    <DropdownItem
                        icon={Clock}
                        label="Historial de Residuos"
                        desc="Tus clasificaciones guardadas"
                        onClick={() => {
                            navigate("/historial");
                            closeMenu();
                        }}
                        accentClass={activeAccent.text}
                    />

                    {/* Tecnologías y Normas */}
                    <DropdownItem
                        icon={Layers}
                        label="Tecnologías y Normas"
                        desc="Bibliotecas y leyes ambientales"
                        onClick={() => {
                            navigate("/tecnologias");
                            closeMenu();
                        }}
                        accentClass={activeAccent.text}
                    />
                </div>

                {/* 4. Pie: Cerrar sesión si está autenticado */}
                {isLoggedIn && (
                    <div className="border-t border-zinc-100 dark:border-white/10 pt-1 mt-0.5">
                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    await logout();
                                } catch (err) {
                                    console.error("Error al cerrar sesión", err);
                                }
                                setIsLoggedIn(false);
                                closeMenu();
                            }}
                            className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer active:scale-[0.98]"
                        >
                            <span className="size-7 rounded-lg flex items-center justify-center shrink-0 bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                <LogOut size={14} />
                            </span>
                            <span>Cerrar sesión</span>
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
