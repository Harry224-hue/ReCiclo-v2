import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Wheel from "@uiw/react-color-wheel";
import { hsvaToHex, hexToHsva } from "@uiw/color-convert";
import { useTheme, type AccentColor, type ColorSchemeMode } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import {
    Sparkles,
    Palette,
    RotateCcw,
    Check,
    X,
    User,
    Shield,
    Camera,
    MapPin,
    Moon,
    Sliders,
    Smartphone,
    Zap,
    Layers,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NotchIsland } from "./NotchIsland";
import { clearScanHistory, getScanHistory } from "../data/historyStorage";
import {
    SettingsResourcesTab,
    SettingsAccountTab,
    SettingsPrivacyTab,
} from "./settings/SettingsSecondaryTabs";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type SettingsTab = "aspecto" | "notch" | "recursos" | "cuenta" | "privacidad";

const presetAccents: {
    id: AccentColor;
    bgClass: string;
    name: string;
    hex: string;
}[] = [
    { id: "emerald", bgClass: "bg-emerald-500", name: "Esmeralda", hex: "#10b981" },
    { id: "blue", bgClass: "bg-sky-500", name: "Zafiro", hex: "#0284c7" },
    { id: "amber", bgClass: "bg-amber-500", name: "Ámbar", hex: "#d97706" },
    { id: "purple", bgClass: "bg-purple-500", name: "Amatista", hex: "#9333ea" },
    { id: "rose", bgClass: "bg-rose-500", name: "Coral", hex: "#e11d48" },
];

const colorSchemeOptions: {
    id: ColorSchemeMode;
    name: string;
    description: string;
}[] = [
    { id: "light", name: "Claro", description: "Fondo claro en todo momento." },
    { id: "dark", name: "Oscuro", description: "Fondo oscuro en todo momento." },
    {
        id: "system",
        name: "Automático (sistema)",
        description: "Sigue el modo claro u oscuro configurado en tu dispositivo.",
    },
    {
        id: "schedule",
        name: "Automático (horario)",
        description: "Oscuro de 7:00 p. m. a 7:00 a. m., claro el resto del día.",
    },
];

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<SettingsTab>("aspecto");

    const {
        colorSchemeMode,
        setColorSchemeMode,
        isDarkMode,
        accentColor,
        setAccentColor,
        customHex,
        setCustomHex,
        notchShortcuts,
        setNotchShortcuts,
        accent,
        visualMode,
        setVisualMode,
        requestImmersive,
        glassTheme,
        setGlassTheme,
        perfTier,
        resetTheme,
    } = useTheme();

    const { user, profile, isLoggedIn } = useAuth();
    const userPhoto = profile?.fotoPerfil || user?.photoURL || localStorage.getItem("reciclo_avatar_custom") || undefined;

    // Estado local para la rueda HSV
    const [hsva, setHsva] = useState(() => hexToHsva(customHex || "#10b981"));
    const [hexInputText, setHexInputText] = useState(customHex || "#10b981");

    // Sincronizar cuando cambia customHex desde el exterior
    useEffect(() => {
        if (customHex) {
            setHexInputText(customHex);
            setHsva(hexToHsva(customHex));
        }
    }, [customHex]);

    // Estado para configuración de campus y rol del usuario (unificado con Perfil)
    const [selectedCampus, setSelectedCampus] = useState(() => {
        return localStorage.getItem("reciclo_pref_campus") || localStorage.getItem("reciclo_campus") || "Campus 1 (Principal)";
    });
    const [userRole, setUserRole] = useState(() => {
        return localStorage.getItem("reciclo_role") || "Estudiante";
    });

    const [cacheCleared, setCacheCleared] = useState(false);

    // Prevenir scroll en el fondo al abrir modal
    useEffect(() => {
        if (!isOpen) return;

        const html = document.documentElement;
        const body = document.body;
        const previousHtmlOverflow = html.style.overflow;
        const previousBodyOverflow = body.style.overflow;

        html.style.overflow = "hidden";
        body.style.overflow = "hidden";

        return () => {
            html.style.overflow = previousHtmlOverflow;
            body.style.overflow = previousBodyOverflow;
        };
    }, [isOpen]);

    const handleColorWheelChange = (newColor: { hsva: { h: number; s: number; v: number; a: number } }) => {
        setHsva(newColor.hsva);
        const hex = hsvaToHex(newColor.hsva);
        setHexInputText(hex);
        setCustomHex(hex);
        setAccentColor("custom");
    };

    const handleHexInputChange = (val: string) => {
        setHexInputText(val);
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
            setCustomHex(val);
            setHsva(hexToHsva(val));
            setAccentColor("custom");
        }
    };

    const toggleNotchShortcut = (id: string) => {
        if (notchShortcuts.includes(id)) {
            if (notchShortcuts.length <= 1) return; // Mantener al menos 1
            setNotchShortcuts(notchShortcuts.filter((s) => s !== id));
        } else {
            setNotchShortcuts([...notchShortcuts, id]);
        }
    };

    const handleClearHistory = () => {
        clearScanHistory();
        localStorage.removeItem("reciclo_scan_history");
        setCacheCleared(true);
        setTimeout(() => setCacheCleared(false), 3000);
    };

    const handleExportData = () => {
        const historyData = JSON.stringify(getScanHistory(), null, 2);
        const blob = new Blob([historyData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `reciclo-datos-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 lg:p-6 overscroll-none"
                    data-lenis-prevent
                >
                    {/* BACKDROP */}
                    <motion.div
                        className="absolute inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* MODAL */}
                    <motion.div
                        className="relative z-10 w-full h-[100dvh] sm:h-[calc(100dvh-2rem)] lg:h-[650px] lg:max-h-[calc(100dvh-3rem)] lg:max-w-5xl flex flex-col lg:flex-row overflow-hidden rounded-none sm:rounded-[1.75rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                        initial={{ opacity: 0, scale: 0.97, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: 10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        onWheel={(e) => e.stopPropagation()}
                    >
                        {/* ================================================= */}
                        {/* HEADER MOBILE */}
                        {/* ================================================= */}
                        <div className="flex lg:hidden shrink-0 flex-col border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
                            <div className="flex items-center justify-between px-5 pt-4 pb-2">
                                <div className="flex items-center gap-2">
                                    <Sliders size={18} className={accent.text} />
                                    <h2 className="text-lg font-black text-zinc-950 dark:text-white">
                                        Configuración
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full bg-zinc-200/70 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                                    title="Cerrar"
                                >
                                    <X size={18} strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* TABS MOBILE (Notch disponible en móviles) */}
                            <div className="flex gap-1.5 px-3 pb-3 overflow-x-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {[
                                    { id: "aspecto", label: "Aspecto", icon: Palette },
                                    { id: "notch", label: "Notch", icon: Smartphone },
                                    { id: "recursos", label: "Tecnologías", icon: Layers },
                                    { id: "cuenta", label: "Cuenta", icon: User },
                                    { id: "privacidad", label: "Privacidad", icon: Shield },
                                ].map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as SettingsTab)}
                                            className={`shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                                isActive
                                                    ? `${accent.badge} shadow-xs border border-zinc-300/80 dark:border-zinc-700`
                                                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800"
                                            }`}
                                        >
                                            <Icon size={15} />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ================================================= */}
                        {/* SIDEBAR DESKTOP (En PC no hay Notch, solo en móvil) */}
                        {/* ================================================= */}
                        <div className="hidden lg:flex w-64 shrink-0 bg-zinc-50 dark:bg-zinc-950/60 border-r border-zinc-200 dark:border-zinc-800 flex-col pt-7 pb-6 px-4">
                            <div className="flex items-center gap-2.5 px-3 mb-6">
                                <div className={`size-8 rounded-xl ${accent.btn} flex items-center justify-center shadow-sm`}>
                                    <Sliders size={16} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-base font-black text-zinc-950 dark:text-white leading-tight">
                                        Configuración
                                    </h2>
                                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
                                        Personalización ReCiclo
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5 flex-1">
                                {[
                                    { id: "aspecto", label: "Aspecto & Color", desc: "Temas, acento y rueda HEX", icon: Palette },
                                    { id: "recursos", label: "Tecnologías & APIs", desc: "Stack, IA y normas oficiales", icon: Layers },
                                    { id: "cuenta", label: "Cuenta & Campus", desc: "Comunidad IT Morelia", icon: User },
                                    { id: "privacidad", label: "Privacidad & Datos", desc: "Cámara local y caché", icon: Shield },
                                ].map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as SettingsTab)}
                                            className={`flex items-start gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                                                isActive
                                                    ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white border border-zinc-200 dark:border-zinc-700 shadow-sm font-bold"
                                                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 hover:text-zinc-950 dark:hover:text-white font-semibold"
                                            }`}
                                        >
                                            <Icon size={18} className={`shrink-0 mt-0.5 ${isActive ? accent.text : "opacity-80"}`} />
                                            <div>
                                                <div className="text-sm font-bold leading-tight">{tab.label}</div>
                                                <div className="text-[11px] opacity-75 mt-0.5 font-normal">{tab.desc}</div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={onClose}
                                className="mt-auto flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer shadow-xs"
                            >
                                <X size={15} />
                                Cerrar panel
                            </button>
                        </div>

                        {/* ================================================= */}
                        {/* CONTENIDO CENTRAL (Scrollbar oculta como en código original) */}
                        {/* ================================================= */}
                        <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-7 lg:p-8 overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            <AnimatePresence mode="wait">
                                {/* ================================================= */}
                                {/* TAB 1: ASPECTO Y COLORES */}
                                {/* ================================================= */}
                                {activeTab === "aspecto" && (
                                    <motion.div
                                        key="aspecto"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-8 max-w-3xl"
                                    >
                                        <div>
                                            <h3 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white flex items-center gap-2.5">
                                                <Palette className={accent.text} size={24} />
                                                Aspecto y Paleta de Color
                                            </h3>
                                            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium mt-1">
                                                Elige un color predeterminado o utiliza la rueda cromática interactiva para personalizar toda la interfaz.
                                            </p>
                                        </div>

                                        {/* SECCIÓN RUEDA HEX & PRESETS */}
                                        <div className="p-5 sm:p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 space-y-6">
                                            <div>
                                                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
                                                    Colores Predeterminados
                                                </span>
                                                <div className="flex flex-wrap items-center gap-3 mt-3">
                                                    {presetAccents.map((color) => (
                                                        <button
                                                            key={color.id}
                                                            onClick={() => setAccentColor(color.id)}
                                                            className={`relative flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition-all cursor-pointer ${
                                                                accentColor === color.id
                                                                    ? "border-zinc-400 dark:border-zinc-600 bg-white dark:bg-zinc-800 shadow-sm font-bold text-zinc-950 dark:text-white"
                                                                    : "border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 font-medium"
                                                            }`}
                                                        >
                                                            <span className={`size-4 rounded-full ${color.bgClass} shadow-xs shrink-0`} />
                                                            <span>{color.name}</span>
                                                            {accentColor === color.id && (
                                                                <Check size={13} className="text-zinc-900 dark:text-zinc-100" strokeWidth={3} />
                                                            )}
                                                        </button>
                                                    ))}

                                                    <button
                                                        onClick={() => setAccentColor("custom")}
                                                        className={`relative flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition-all cursor-pointer ${
                                                            accentColor === "custom"
                                                                ? "border-zinc-400 dark:border-zinc-600 bg-white dark:bg-zinc-800 shadow-sm font-bold text-zinc-950 dark:text-white"
                                                                : "border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 font-medium"
                                                        }`}
                                                    >
                                                        <span
                                                            className="size-4 rounded-full shadow-xs shrink-0"
                                                            style={{ backgroundColor: customHex }}
                                                        />
                                                        <span>Personalizado</span>
                                                        {accentColor === "custom" && (
                                                            <Check size={13} className="text-zinc-900 dark:text-zinc-100" strokeWidth={3} />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* RUEDA CROMÁTICA HEX */}
                                            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center gap-6">
                                                <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                                                    <Wheel
                                                        color={hsva}
                                                        onChange={handleColorWheelChange}
                                                        width={170}
                                                        height={170}
                                                    />
                                                </div>

                                                <div className="flex-1 w-full space-y-3">
                                                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-200 block">
                                                        Código de Color Hexadecimal
                                                    </span>
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative flex-1">
                                                            <input
                                                                type="text"
                                                                value={hexInputText}
                                                                onChange={(e) => handleHexInputChange(e.target.value)}
                                                                placeholder="#10b981"
                                                                className="w-full px-3 py-2.5 text-xs font-mono font-bold rounded-xl border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                                                            />
                                                        </div>
                                                        <input
                                                            type="color"
                                                            value={customHex}
                                                            onChange={(e) => {
                                                                setHexInputText(e.target.value);
                                                                setCustomHex(e.target.value);
                                                                setHsva(hexToHsva(e.target.value));
                                                                setAccentColor("custom");
                                                            }}
                                                            className="size-10 rounded-xl border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 cursor-pointer p-0.5 shadow-xs"
                                                            title="Selector de color del sistema"
                                                        />
                                                    </div>

                                                    {/* VISTA PREVIA DEL COLOR ACTIVO */}
                                                    <div className="pt-2 flex items-center gap-2 text-xs">
                                                        <span className="text-zinc-600 dark:text-zinc-400 font-medium">Muestra en vivo:</span>
                                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${accent.badge}`}>
                                                            Insignia activa
                                                        </span>
                                                        <button
                                                            className={`px-3 py-1 rounded-lg text-[11px] font-bold text-white ${accent.btn}`}
                                                        >
                                                            Botón demo
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* MODO CLARO / OSCURO */}
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                                            <div className="max-w-sm">
                                                <span className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                                                    <Moon size={16} />
                                                    Modo Visual
                                                </span>
                                                <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium mt-0.5">
                                                    Controla la iluminación de la interfaz.
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 w-full md:w-auto">
                                                {colorSchemeOptions.map((opt) => (
                                                    <button
                                                        key={opt.id}
                                                        onClick={() => setColorSchemeMode(opt.id)}
                                                        className={`px-3.5 py-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                                                            colorSchemeMode === opt.id
                                                                ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-sm border-transparent"
                                                                : "bg-zinc-100 dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/80 font-semibold"
                                                        }`}
                                                    >
                                                        <div className="font-bold">{opt.name}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* TRANSPARENCIA / LIQUID GLASS */}
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                                            <div className="max-w-sm">
                                                <span className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                                                    <Sparkles size={16} />
                                                    Transparencia Liquid Glass
                                                </span>
                                                <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium mt-0.5">
                                                    {perfTier === "lite"
                                                        ? "Ajustado a Sólido automáticamente para fluidez máxima."
                                                        : "Ajusta la intensidad del desenfoque traslúcido."}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                {(["solid", "light", "heavy"] as const).map((theme) => (
                                                    <button
                                                        key={theme}
                                                        onClick={() => setGlassTheme(theme)}
                                                        className={`px-3.5 py-2 rounded-xl border text-xs transition-all cursor-pointer ${
                                                            glassTheme === theme
                                                                ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-sm border-transparent"
                                                                : "bg-zinc-100 dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/80 font-semibold"
                                                        }`}
                                                    >
                                                        {theme === "solid" ? "Sólido" : theme === "light" ? "Ligero" : "Profundo"}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* MOVIMIENTO Y RENDIMIENTO CON INDICADOR CLARO */}
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                                            <div className="max-w-sm space-y-2">
                                                <div>
                                                    <span className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                                                        <Sparkles size={16} />
                                                        Efectos de Movimiento
                                                    </span>
                                                    <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium mt-0.5">
                                                        Controla la fluidez y cantidad de animaciones dinámicas.
                                                    </p>
                                                </div>

                                                {/* INDICADOR EN VIVO DEL MODO LIGERO / RENDIMIENTO */}
                                                <div className="pt-1">
                                                    {perfTier === "lite" ? (
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-900 dark:text-amber-200 text-xs font-bold shadow-xs">
                                                            <Zap size={13} className="text-amber-600 dark:text-amber-400 fill-amber-500" />
                                                            <span>Modo Ligero Activado (Optimizado)</span>
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-900 dark:text-emerald-200 text-xs font-bold shadow-xs">
                                                            <Sparkles size={13} className="text-emerald-600 dark:text-emerald-400" />
                                                            <span>Modo Inmersivo (Efectos Completos)</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex bg-zinc-100 dark:bg-white/10 p-1 rounded-xl border border-zinc-200 dark:border-white/10 self-start">
                                                <button
                                                    onClick={() => setVisualMode("essential")}
                                                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                                        visualMode === "essential"
                                                            ? "bg-zinc-950 text-white dark:bg-zinc-800 dark:text-white shadow-xs"
                                                            : "text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white"
                                                    }`}
                                                >
                                                    Optimizado
                                                </button>
                                                <button
                                                    onClick={requestImmersive}
                                                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                                        visualMode === "immersive"
                                                            ? "bg-zinc-950 text-white dark:bg-zinc-800 dark:text-white shadow-xs"
                                                            : "text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white"
                                                    }`}
                                                >
                                                    Inmersivo
                                                </button>
                                            </div>
                                        </div>

                                        {/* BOTÓN RESTABLECER */}
                                        <div>
                                            <button
                                                onClick={resetTheme}
                                                className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                                            >
                                                <RotateCcw size={14} />
                                                Restaurar configuración visual por defecto
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* ================================================= */}
                                {/* TAB 2: NOTCH MÓVIL (Activo en móviles) */}
                                {/* ================================================= */}
                                {activeTab === "notch" && (
                                    <motion.div
                                        key="notch"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-7 max-w-3xl"
                                    >
                                        <div>
                                            <h3 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white flex items-center gap-2.5">
                                                <Smartphone className={accent.text} size={24} />
                                                Personalización del Notch Móvil
                                            </h3>
                                            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium mt-1">
                                                El Notch es la cápsula interactiva superior que aparece en dispositivos móviles. Se oculta suavemente al deslizar hacia abajo y reaparece al instante al subir.
                                            </p>
                                        </div>

                                        {/* VISTA PREVIA DEL NOTCH CON EL MISMO DISEÑO ELEVADO */}
                                        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center">
                                            <span className="text-xs uppercase tracking-wider font-bold text-zinc-700 dark:text-zinc-400 mb-4">
                                                Diseño del Notch Activo en tu Dispositivo
                                            </span>

                                            <NotchIsland
                                                shortcuts={notchShortcuts}
                                                isDarkMode={isDarkMode}
                                                isStaticPreview={true}
                                            />
                                        </div>

                                        {/* SELECCIÓN DE ACCESOS DIRECTOS */}
                                        <div className="space-y-3">
                                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
                                                Accesos Rápidos a Mostrar
                                            </span>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {[
                                                    {
                                                        id: "scan",
                                                        title: "Escáner Inmediato",
                                                        desc: "Acceso con un toque a la cámara para clasificar residuos.",
                                                        icon: Camera,
                                                        color: "text-emerald-500",
                                                    },
                                                    {
                                                        id: "map",
                                                        title: "Mapa del Campus",
                                                        desc: "Localización rápida de contenedores en el IT Morelia.",
                                                        icon: MapPin,
                                                        color: "text-sky-500",
                                                    },
                                                    {
                                                        id: "tech",
                                                        title: "Tecnologías y Recursos",
                                                        desc: "Ficha técnica completa, IA y normativas oficiales.",
                                                        icon: Layers,
                                                        color: "text-emerald-500",
                                                    },
                                                    {
                                                        id: "theme",
                                                        title: "Modo Oscuro / Claro",
                                                        desc: "Alternar iluminación del dispositivo al instante.",
                                                        icon: Moon,
                                                        color: "text-amber-500",
                                                    },
                                                    {
                                                        id: "settings",
                                                        title: "Panel de Ajustes",
                                                        desc: "Abrir este diálogo de configuración en cualquier momento.",
                                                        icon: Sliders,
                                                        color: "text-purple-500",
                                                    },
                                                ].map((item) => {
                                                    const isChecked = notchShortcuts.includes(item.id);
                                                    const Icon = item.icon;
                                                    return (
                                                        <button
                                                            type="button"
                                                            role="switch"
                                                            aria-checked={isChecked}
                                                            key={item.id}
                                                            onClick={() => toggleNotchShortcut(item.id)}
                                                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 text-left ${
                                                                isChecked
                                                                    ? "border-zinc-400 dark:border-zinc-600 bg-white dark:bg-zinc-800 shadow-xs"
                                                                    : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 opacity-75 hover:opacity-100"
                                                            }`}
                                                        >
                                                            <div className={`p-2 rounded-xl bg-zinc-100 dark:bg-white/10 shrink-0 ${item.color}`}>
                                                                <Icon size={18} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-sm font-bold text-zinc-950 dark:text-white">
                                                                        {item.title}
                                                                    </span>
                                                                    <div className={`size-5 rounded-md border flex items-center justify-center transition-all ${
                                                                        isChecked
                                                                            ? `${accent.btn} border-transparent text-white`
                                                                            : "border-zinc-400 dark:border-zinc-600 bg-transparent"
                                                                    }`}>
                                                                        {isChecked && <Check size={12} strokeWidth={3} />}
                                                                    </div>
                                                                </div>
                                                                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-1">
                                                                    {item.desc}
                                                                </p>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === "recursos" && (
                                    <SettingsResourcesTab
                                        accent={accent}
                                        onClose={onClose}
                                        navigate={navigate}
                                    />
                                )}

                                {activeTab === "cuenta" && (
                                    <SettingsAccountTab
                                        accent={accent}
                                        isLoggedIn={isLoggedIn}
                                        user={user}
                                        profile={profile}
                                        userPhoto={userPhoto}
                                        selectedCampus={selectedCampus}
                                        setSelectedCampus={setSelectedCampus}
                                        userRole={userRole}
                                        setUserRole={setUserRole}
                                        onClose={onClose}
                                    />
                                )}

                                {activeTab === "privacidad" && (
                                    <SettingsPrivacyTab
                                        accent={accent}
                                        cacheCleared={cacheCleared}
                                        onClearHistory={handleClearHistory}
                                        onExportData={handleExportData}
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}