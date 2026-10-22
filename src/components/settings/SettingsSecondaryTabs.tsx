import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Layers,
    BookOpen,
    Sparkles,
    User,
    ExternalLink,
    School,
    Check,
    GraduationCap,
    Shield,
    Camera,
    Lock,
    MapPin,
    CheckCircle2,
    Trash2,
    Download,
} from "lucide-react";
import { type AccentTokens } from "../../context/ThemeContext";
import { updateUserProfile } from "../../firebase";
import { TOTAL_TECH_RESOURCES } from "../../pages/Tecnologias";

interface ResourcesTabProps {
    accent: AccentTokens;
    onClose: () => void;
    navigate: (path: string) => void;
}

export function SettingsResourcesTab({ accent, onClose, navigate }: ResourcesTabProps) {
    return (
        <motion.div
            key="recursos"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
        >
            <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
                    Ficha Técnica y Recursos
                </span>
                <p className="text-xs text-zinc-500 mt-0.5">
                    Herramientas digitales, inteligencia artificial y marco normativo oficial del proyecto.
                </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl ${accent.badge} shrink-0`}>
                        <Layers size={20} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                                Tecnologías, APIs y Recursos Oficiales
                            </h3>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${accent.badge}`}>
                                {TOTAL_TECH_RESOURCES} recursos
                            </span>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                            Explora el inventario completo de {TOTAL_TECH_RESOURCES} recursos con sus enlaces oficiales y uso específico en el proyecto: Vite 6, React 19, IA (Gemini y MobileNet), mapas y normativas ambientales.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        onClose();
                        navigate("/tecnologias");
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-xs transition-transform active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${accent.btn}`}
                >
                    <Layers size={14} />
                    <span>Ver apartado completo de Tecnologías</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => {
                        onClose();
                        navigate("/como-funciona");
                    }}
                    className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all text-left flex items-start gap-3 cursor-pointer"
                >
                    <div className={`p-2 rounded-xl ${accent.badge} shrink-0`}>
                        <BookOpen size={16} />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                            Cómo Funciona ReCiclo
                        </span>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 leading-snug">
                            Flujo de clasificación, regla de las 4V y código oficial de contenedores ITM.
                        </p>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        onClose();
                        navigate("/impacto");
                    }}
                    className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all text-left flex items-start gap-3 cursor-pointer"
                >
                    <div className={`p-2 rounded-xl ${accent.badge} shrink-0`}>
                        <Sparkles size={16} />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                            Fundamento e Impacto Ambiental
                        </span>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 leading-snug">
                            Dimensiones de sustentabilidad, ODS 12 y procedimiento SGI del IT Morelia.
                        </p>
                    </div>
                </button>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Tecnológico Nacional de México / Instituto Tecnológico de Morelia
                </p>
                <p>
                    Proyecto presentado para la 18° Semana de Oxigena tus Ideas (Semestre Enero - Junio 2026), basado en el procedimiento SGI ITMORELIA-IT-AM-007 y normatividad ambiental aplicable.
                </p>
            </div>
        </motion.div>
    );
}

interface AccountTabProps {
    accent: AccentTokens;
    isLoggedIn: boolean;
    user: { uid?: string; displayName?: string | null; email?: string | null } | null;
    profile: { nombre?: string } | null;
    userPhoto?: string;
    selectedCampus: string;
    setSelectedCampus: (campus: string) => void;
    userRole: string;
    setUserRole: (role: string) => void;
    onClose: () => void;
}

export function SettingsAccountTab({
    accent,
    isLoggedIn,
    user,
    profile,
    userPhoto,
    selectedCampus,
    setSelectedCampus,
    userRole,
    setUserRole,
    onClose,
}: AccountTabProps) {
    return (
        <motion.div
            key="cuenta"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-7 max-w-3xl"
        >
            <div>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white flex items-center gap-2.5">
                    <User className={accent.text} size={24} />
                    Cuenta y Campus Universitario
                </h3>
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium mt-1">
                    Configura tu pertenencia a la comunidad del Instituto Tecnológico de Morelia y vincula tu actividad ambiental.
                </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="size-14 rounded-2xl overflow-hidden bg-white dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center justify-center">
                        {userPhoto ? (
                            <img src={userPhoto} alt="Perfil" className="w-full h-full object-cover" />
                        ) : (
                            <div className={`w-full h-full ${accent.btn} flex items-center justify-center text-white text-xl font-bold`}>
                                {isLoggedIn && (profile?.nombre || user?.displayName)
                                    ? (profile?.nombre || user?.displayName || "U")[0].toUpperCase()
                                    : "ITM"}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="text-base font-black text-zinc-950 dark:text-white">
                                {isLoggedIn ? (profile?.nombre || user?.displayName || "Usuario ReCiclo") : "Invitado Tecnológico"}
                            </h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                isLoggedIn ? accent.badge : "bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                            }`}>
                                {isLoggedIn ? "Sesión Activa" : "Modo Local"}
                            </span>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-0.5">
                            {isLoggedIn ? user?.email : "Tus registros se guardan localmente en este dispositivo"}
                        </p>
                    </div>
                </div>

                <Link
                    to="/perfil"
                    onClick={onClose}
                    className={`px-4 py-2 rounded-xl text-xs font-bold ${accent.btnOutline} border flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs`}
                >
                    Ver Perfil Completo
                    <ExternalLink size={13} />
                </Link>
            </div>

            <div className="space-y-3 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
                    <School size={15} />
                    Sede del Tec de Morelia
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        {
                            id: "Campus 1 (Principal)",
                            name: "Campus 1 (Principal)",
                            address: "Av. Tecnológico #1500, Lomas de Santiaguito",
                        },
                        {
                            id: "Campus 2 (San José de la Huerta)",
                            name: "Campus 2 (San José de la Huerta)",
                            address: "Camino de la Arboleda, San José de la Huerta",
                        },
                    ].map((c) => {
                        const isSelected = selectedCampus.includes(c.name.split(" ")[0] + " " + c.name.split(" ")[1]);
                        return (
                            <button
                                type="button"
                                key={c.id}
                                onClick={() => {
                                    setSelectedCampus(c.id);
                                    localStorage.setItem("reciclo_pref_campus", c.id);
                                    localStorage.setItem("reciclo_campus", c.id);
                                    window.dispatchEvent(new Event("reciclo-campus-updated"));
                                    if (isLoggedIn && user?.uid) {
                                        updateUserProfile(user.uid, { campus: c.id }).catch(() => {});
                                    }
                                }}
                                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                                    isSelected
                                        ? "border-zinc-400 dark:border-zinc-600 bg-white dark:bg-zinc-800 font-bold shadow-xs"
                                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 opacity-80 hover:opacity-100"
                                }`}
                            >
                                <div className="text-xs font-bold text-zinc-950 dark:text-white flex items-center justify-between">
                                    {c.name}
                                    {isSelected && <Check size={14} className={accent.text} />}
                                </div>
                                <div className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium mt-1">{c.address}</div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
                    <GraduationCap size={15} />
                    Rol en la Comunidad
                </span>
                <div className="flex flex-wrap gap-2">
                    {["Estudiante", "Docente / Investigador", "Personal de Apoyo", "Visitante"].map((r) => (
                        <button
                            type="button"
                            key={r}
                            onClick={() => {
                                setUserRole(r);
                                localStorage.setItem("reciclo_role", r);
                            }}
                            className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                userRole === r
                                    ? `${accent.badge} shadow-xs border border-zinc-300 dark:border-zinc-700`
                                    : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                            }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

interface PrivacyTabProps {
    accent: AccentTokens;
    cacheCleared: boolean;
    onClearHistory: () => void;
    onExportData: () => void;
}

export function SettingsPrivacyTab({
    accent,
    cacheCleared,
    onClearHistory,
    onExportData,
}: PrivacyTabProps) {
    return (
        <motion.div
            key="privacidad"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-7 max-w-3xl"
        >
            <div>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white flex items-center gap-2.5">
                    <Shield className={accent.text} size={24} />
                    Privacidad y Soberanía de Datos
                </h3>
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium mt-1">
                    ReCiclo fue diseñado bajo principios de ética ambiental y respeto a la privacidad: la tecnología es únicamente un facilitador pedagógico.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 space-y-2">
                    <div className="size-8 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                        <Camera size={16} />
                    </div>
                    <h4 className="text-xs font-bold text-zinc-950 dark:text-white">
                        Cámara en Dispositivo
                    </h4>
                    <p className="text-[11px] text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
                        Las tomas del escáner se procesan directamente en tu navegador y no se almacenan en álbumes públicos externos.
                    </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 space-y-2">
                    <div className="size-8 rounded-lg bg-sky-500/15 text-sky-700 dark:text-sky-400 flex items-center justify-center font-bold">
                        <Lock size={16} />
                    </div>
                    <h4 className="text-xs font-bold text-zinc-950 dark:text-white">
                        Almacenamiento Local
                    </h4>
                    <p className="text-[11px] text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
                        El historial de residuos y tus preferencias residen en el almacenamiento de tu equipo (localStorage).
                    </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 space-y-2">
                    <div className="size-8 rounded-lg bg-purple-500/15 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold">
                        <MapPin size={16} />
                    </div>
                    <h4 className="text-xs font-bold text-zinc-950 dark:text-white">
                        Ubicación Puntual
                    </h4>
                    <p className="text-[11px] text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
                        El mapa sólo consulta coordenadas al abrirlo para calcular la distancia a los contenedores, sin rastreo constante.
                    </p>
                </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 block">
                    Gestión de tus Datos
                </span>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div>
                        <h5 className="text-xs font-bold text-zinc-950 dark:text-white">
                            Limpiar Historial de Escaneos
                        </h5>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
                            Borra todos los residuos registrados localmente en este navegador.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClearHistory}
                        className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2 self-start sm:self-auto cursor-pointer transition-colors shadow-xs"
                    >
                        {cacheCleared ? (
                            <>
                                <CheckCircle2 size={14} />
                                ¡Historial Borrado!
                            </>
                        ) : (
                            <>
                                <Trash2 size={14} />
                                Borrar Historial
                            </>
                        )}
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                    <div>
                        <h5 className="text-xs font-bold text-zinc-950 dark:text-white">
                            Exportar Datos en Formato JSON
                        </h5>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
                            Descarga tus clasificaciones para análisis o proyectos académicos.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onExportData}
                        className={`px-3.5 py-2 rounded-xl ${accent.btnOutline} border text-xs font-bold flex items-center gap-2 self-start sm:self-auto cursor-pointer transition-colors shadow-xs`}
                    >
                        <Download size={14} />
                        Exportar JSON
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
