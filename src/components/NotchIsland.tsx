import { Link, useLocation } from "react-router-dom";
import { ScanLine, MapPin, Sun, Moon, Settings, Layers } from "lucide-react";

interface NotchIslandProps {
    shortcuts?: string[];
    isDarkMode?: boolean;
    isTransparent?: boolean;
    onToggleTheme?: () => void;
    onOpenSettings?: () => void;
    isStaticPreview?: boolean;
}

export function NotchIsland({
    shortcuts = ["scan", "map", "tech", "theme", "settings"],
    isDarkMode = true,
    isTransparent = false,
    onToggleTheme,
    onOpenSettings,
    isStaticPreview = false,
}: NotchIslandProps) {
    const location = useLocation();
    const handleLogoClick = (e: React.MouseEvent) => {
        if (isStaticPreview) return;
        if (window.location.pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Estilos adaptativos según transparencia y modo oscuro/claro
    const containerClasses = isTransparent
        ? "bg-transparent backdrop-blur-none border-transparent shadow-none"
        : isDarkMode
        ? "bg-zinc-900/90 text-white border-zinc-700/60 shadow-[0_8px_25px_rgba(0,0,0,0.4)] backdrop-blur-xl"
        : "bg-white/90 text-zinc-900 border-zinc-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.08)] backdrop-blur-xl";

    const textClasses = isTransparent
        ? "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
        : isDarkMode
        ? "text-white"
        : "text-zinc-950";

    const buttonClasses = isTransparent
        ? "bg-white/20 hover:bg-white/30 text-white"
        : isDarkMode
        ? "bg-white/10 hover:bg-white/20 text-zinc-200"
        : "bg-black/5 hover:bg-black/10 text-zinc-700";

    const dividerClasses = isTransparent
        ? "border-white/30"
        : isDarkMode
        ? "border-white/15"
        : "border-zinc-200";

    return (
        <div
            className={`flex items-center justify-between gap-3 px-4 h-11 rounded-full transition-all duration-300 border select-none ${containerClasses} ${
                isStaticPreview ? "w-full max-w-sm" : ""
            }`}
        >
            {/* Branding Limpio y Humano (sin punto parpadeante ni insignia IA) */}
            <div className="flex items-center shrink-0">
                {isStaticPreview ? (
                    <span className={`text-sm font-black tracking-tight font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif] ${textClasses}`}>
                        ReCiclo
                    </span>
                ) : (
                    <Link
                        to="/"
                        onClick={handleLogoClick}
                        aria-label="ReCiclo - Ir al inicio"
                        className="flex items-center focus-visible:outline-none"
                    >
                        <span className={`text-sm font-black tracking-tight font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif] ${textClasses}`}>
                            ReCiclo
                        </span>
                    </Link>
                )}
            </div>

            {/* Accesos directos adaptativos */}
            {shortcuts && shortcuts.length > 0 && (
                <div className={`flex items-center gap-1.5 pl-2.5 border-l ${dividerClasses}`}>
                    {shortcuts.includes("scan") &&
                        (isStaticPreview ? (
                            <span
                                className={`size-7 rounded-full flex items-center justify-center text-emerald-500 dark:text-emerald-400 ${buttonClasses}`}
                                title="Escáner"
                            >
                                <ScanLine size={14} />
                            </span>
                        ) : (
                            <Link
                                to="/escanear"
                                className={`size-7 rounded-full active:scale-90 flex items-center justify-center text-emerald-500 dark:text-emerald-400 transition-all cursor-pointer ${buttonClasses}`}
                                title="Abrir Escáner"
                                aria-label="Abrir Escáner"
                            >
                                <ScanLine size={14} />
                            </Link>
                        ))}

                    {shortcuts.includes("map") &&
                        (isStaticPreview ? (
                            <span
                                className={`size-7 rounded-full flex items-center justify-center text-sky-500 dark:text-sky-400 ${buttonClasses}`}
                                title="Mapa"
                            >
                                <MapPin size={14} />
                            </span>
                        ) : (
                            <Link
                                to="/mapa"
                                className={`size-7 rounded-full active:scale-90 flex items-center justify-center text-sky-500 dark:text-sky-400 transition-all cursor-pointer ${buttonClasses} ${
                                    location.pathname === "/mapa" ? "ring-1 ring-sky-500/40 bg-sky-500/10" : ""
                                }`}
                                title="Ver Mapa"
                                aria-label="Ver Mapa"
                            >
                                <MapPin size={14} />
                            </Link>
                        ))}

                    {(shortcuts.includes("tech") || shortcuts.includes("tecnologias")) &&
                        (isStaticPreview ? (
                            <span
                                className={`size-7 rounded-full flex items-center justify-center text-emerald-500 dark:text-emerald-400 ${buttonClasses}`}
                                title="Tecnologías"
                            >
                                <Layers size={14} />
                            </span>
                        ) : (
                            <Link
                                to="/tecnologias"
                                className={`size-7 rounded-full active:scale-90 flex items-center justify-center text-emerald-500 dark:text-emerald-400 transition-all cursor-pointer ${buttonClasses} ${
                                    location.pathname === "/tecnologias"
                                        ? "ring-1 ring-emerald-500/40 bg-emerald-500/15 font-bold"
                                        : ""
                                }`}
                                title="Tecnologías y Recursos Oficiales"
                                aria-label="Tecnologías y Recursos Oficiales"
                            >
                                <Layers size={14} />
                            </Link>
                        ))}

                    {shortcuts.includes("theme") &&
                        (isStaticPreview ? (
                            <span
                                className={`size-7 rounded-full flex items-center justify-center text-amber-500 ${buttonClasses}`}
                                title="Alternar Tema"
                            >
                                {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={onToggleTheme}
                                className={`size-7 rounded-full active:scale-90 flex items-center justify-center text-amber-500 transition-all cursor-pointer ${buttonClasses}`}
                                title="Alternar Tema"
                                aria-label="Alternar Tema"
                            >
                                {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                            </button>
                        ))}

                    {shortcuts.includes("settings") &&
                        (isStaticPreview ? (
                            <span
                                className={`size-7 rounded-full flex items-center justify-center ${buttonClasses}`}
                                title="Configuración"
                            >
                                <Settings size={14} />
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={onOpenSettings}
                                className={`size-7 rounded-full active:scale-90 flex items-center justify-center transition-all cursor-pointer ${buttonClasses}`}
                                title="Configuración"
                                aria-label="Configuración"
                            >
                                <Settings size={14} />
                            </button>
                        ))}
                </div>
            )}
        </div>
    );
}
