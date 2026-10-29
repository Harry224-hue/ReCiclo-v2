import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, ArrowLeft, Check, Shield, Sparkles } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { registerWithEmail, loginWithGoogle, loginWithGithub } from "../firebase";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { AuthSuccessOverlay } from "../components/AuthSuccessOverlay";
import { CLOUDINARY_HERO_BASE } from "../constants/hero-videos";
import { FAVICON, HERO_POSTER } from "../constants/assets";

function hexToRgba(hex: string, alpha: number): string {
    const clean = hex.replace("#", "");
    if (clean.length === 3) {
        const r = parseInt(clean[0] + clean[0], 16);
        const g = parseInt(clean[1] + clean[1], 16);
        const b = parseInt(clean[2] + clean[2], 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    if (clean.length === 6) {
        const r = parseInt(clean.substring(0, 2), 16);
        const g = parseInt(clean.substring(2, 4), 16);
        const b = parseInt(clean.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return `rgba(16, 185, 129, ${alpha})`;
}

export default function Registro() {
    const navigate = useNavigate();
    const location = useLocation();
    const { accent, heroVideo } = useTheme();
    const { isLoggedIn } = useAuth();
    const accentHex = accent?.hex || "#10b981";

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [shakeKey, setShakeKey] = useState(0);
    const [isPasswordError, setIsPasswordError] = useState(false);

    // Overlay de éxito post registro
    const [authOverlay, setAuthOverlay] = useState<{
        show: boolean;
        state: "verifying" | "success" | "error";
        title: string;
        subtitle: string;
    }>({
        show: false,
        state: "success",
        title: "Cuenta creada con éxito",
        subtitle: "Registro seguro verificado • Entrando a ReCiclo...",
    });

    // Requisitos de contraseña de Firebase en tiempo real
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasNumber;

    // Si ya está autenticado y no está viendo el overlay de éxito, redirigir a Home
    useEffect(() => {
        if (isLoggedIn && !loading && !authOverlay.show) {
            navigate("/", { replace: true });
        }
    }, [isLoggedIn, loading, authOverlay.show, navigate]);

    const handleComplete = () => {
        const stateFrom = (location.state as { from?: { pathname?: string } })?.from?.pathname;
        const sessionFrom = sessionStorage.getItem("reciclo_auth_redirect");
        const target = stateFrom || sessionFrom;
        sessionStorage.removeItem("reciclo_auth_redirect");

        if (target && target !== "/login" && target !== "/registro") {
            navigate(target, { replace: true });
        } else {
            navigate("/", { replace: true });
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsPasswordError(false);

        if (!isPasswordValid) {
            setIsPasswordError(true);
            setShakeKey((prev) => prev + 1);
            if (!hasMinLength) {
                setError("La contraseña debe tener al menos 8 caracteres.");
            } else if (!hasUppercase) {
                setError("La contraseña debe incluir al menos una letra mayúscula (A-Z).");
            } else if (!hasLowercase) {
                setError("La contraseña debe incluir al menos una letra minúscula (a-z).");
            } else if (!hasNumber) {
                setError("La contraseña debe incluir al menos un número (0-9).");
            }
            return;
        }

        if (password !== confirmPassword) {
            setIsPasswordError(true);
            setShakeKey((prev) => prev + 1);
            setError("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);
        setAuthOverlay({
            show: true,
            state: "verifying",
            title: "Creando cuenta protegida",
            subtitle: "Cifrando credenciales y verificando protocolo de seguridad...",
        });

        try {
            await registerWithEmail(email, password, nombre.trim() || "Usuario ReCiclo");
            setAuthOverlay({
                show: true,
                state: "success",
                title: "Cuenta creada con éxito",
                subtitle: "Registro seguro verificado • Entrando a ReCiclo...",
            });
        } catch (err: unknown) {
            setAuthOverlay((prev) => ({ ...prev, show: false }));
            setIsPasswordError(true);
            setShakeKey((prev) => prev + 1);

            const code = (err as { code?: string }).code;
            if (code === "auth/email-already-in-use") {
                setError("Este correo ya está registrado en ReCiclo.");
            } else if (code === "auth/invalid-email") {
                setError("Correo electrónico inválido.");
            } else if (code === "auth/weak-password" || code === "auth/password-does-not-meet-requirements") {
                setError("La contraseña no cumple con los requisitos de seguridad de Firebase.");
            } else {
                setError("Error al crear la cuenta. Intenta de nuevo.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        setError("");
        setLoading(true);
        setAuthOverlay({
            show: true,
            state: "verifying",
            title: "Vinculando con Google",
            subtitle: "Verificando token OAuth seguro y credenciales...",
        });

        try {
            await loginWithGoogle();
            setAuthOverlay({
                show: true,
                state: "success",
                title: "Autenticado con Google",
                subtitle: "Registro seguro verificado • Entrando a ReCiclo...",
            });
        } catch (err: unknown) {
            setAuthOverlay((prev) => ({ ...prev, show: false }));
            console.error("Error en Google register:", err);
            const msg = err instanceof Error ? err.message : (err as { message?: string })?.message || "Error al registrarse con Google.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGithubRegister = async () => {
        setError("");
        setLoading(true);
        setAuthOverlay({
            show: true,
            state: "verifying",
            title: "Vinculando con GitHub",
            subtitle: "Verificando token OAuth seguro...",
        });

        try {
            await loginWithGithub();
            setAuthOverlay({
                show: true,
                state: "success",
                title: "Autenticado con GitHub",
                subtitle: "Registro seguro verificado • Entrando a ReCiclo...",
            });
        } catch (err: unknown) {
            setAuthOverlay((prev) => ({ ...prev, show: false }));
            console.error("Error en GitHub register:", err);
            const msg = err instanceof Error ? err.message : (err as { message?: string })?.message || "Error al registrarse con GitHub.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const activeVideoSrc = heroVideo || `${CLOUDINARY_HERO_BASE}/video-hero.mp4`;

    return (
        <div className="h-screen max-h-[100dvh] w-full flex overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-500 selection:bg-zinc-800 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900">
            {/* ── PANEL IZQUIERDO: FORMULARIO (100% CERO SCROLL, AJUSTE PERFECTO EN 100VH) ── */}
            <div className="w-full md:w-[50%] lg:w-[48%] xl:w-[45%] h-full flex flex-col justify-between p-3 sm:p-5 md:p-6 lg:p-8 overflow-hidden relative z-10 shrink-0">
                {/* Resplandor ambiental de fondo */}
                <div
                    aria-hidden="true"
                    className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-[110px] pointer-events-none opacity-25 dark:opacity-20 transition-colors duration-700"
                    style={{ backgroundColor: accentHex }}
                />

                {/* ── BARRA SUPERIOR: ANDROID APP BAR EN MÓVIL ── */}
                <header className="w-full flex items-center justify-between shrink-0 mb-1 sm:mb-1.5">
                    <button
                        type="button"
                        onClick={() => {
                            if (window.history.length > 1 && window.history.state && window.history.state.idx > 0) {
                                navigate(-1);
                            } else {
                                navigate("/");
                            }
                        }}
                        className="inline-flex items-center gap-1.5 p-1.5 -ml-1.5 rounded-full text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                        aria-label="Regresar"
                    >
                        <ArrowLeft size={19} className="stroke-[2.2]" />
                        <span className="text-xs font-semibold sm:inline hidden">Volver</span>
                    </button>

                    <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                        <img
                            src={FAVICON}
                            alt="ReCiclo"
                            className="h-6 w-6 object-contain"
                        />
                        <span className="font-extrabold text-sm sm:text-base tracking-tight text-zinc-900 dark:text-white">
                            ReCiclo
                        </span>
                    </Link>
                </header>

                {/* ── CONTENIDO CENTRAL: FORMULARIO COMPLETO EN 2 COLUMNAS (0 SCROLL) ── */}
                <main className="w-full max-w-[410px] mx-auto my-auto flex-1 flex flex-col justify-center min-h-0">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Encabezado */}
                        <div className="mb-2 sm:mb-2.5">
                            <div
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold mb-0.5"
                                style={{
                                    backgroundColor: hexToRgba(accentHex, 0.12),
                                    color: accentHex,
                                    border: `1px solid ${hexToRgba(accentHex, 0.25)}`,
                                }}
                            >
                                <Sparkles size={10} />
                                <span>Registro Sustentable</span>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
                                Crear cuenta
                            </h1>
                            <p className="text-[10.5px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                                Únete a la red inteligente para clasificar residuos con IA.
                            </p>
                        </div>

                        {/* Botones Sociales Android / Web */}
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <button
                                onClick={handleGoogleRegister}
                                disabled={loading}
                                type="button"
                                className="w-full py-1.5 sm:py-2 px-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 hover:bg-black/[0.03] dark:hover:bg-white/[0.05] text-[11.5px] font-semibold text-zinc-800 dark:text-zinc-200 transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-[0.98]"
                            >
                                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span>Google</span>
                            </button>

                            <button
                                onClick={handleGithubRegister}
                                disabled={loading}
                                type="button"
                                className="w-full py-1.5 sm:py-2 px-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 hover:bg-black/[0.03] dark:hover:bg-white/[0.05] text-[11.5px] font-semibold text-zinc-800 dark:text-zinc-200 transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-[0.98]"
                            >
                                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                </svg>
                                <span>GitHub</span>
                            </button>
                        </div>

                        {/* Divisor */}
                        <div className="flex items-center gap-2 my-1.5">
                            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
                            <span className="text-[9.5px] text-zinc-400 dark:text-zinc-500 font-medium">o con correo</span>
                            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
                        </div>

                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-1.5 p-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[10.5px] text-center font-medium leading-tight"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Formulario en 2 columnas (móvil y PC para máxima compacidad y 0 scroll) */}
                        <form onSubmit={handleRegister} className="space-y-1.5">
                            {/* Fila 1: Nombre y Correo */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-0.5">
                                    <label htmlFor="reg-nombre" className="block text-[10.5px] font-semibold text-zinc-700 dark:text-zinc-300">
                                        Nombre
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
                                        <input
                                            id="reg-nombre"
                                            type="text"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            placeholder="Tu nombre"
                                            required
                                            className="w-full pl-8 pr-2.5 py-1.5 sm:py-2 rounded-xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-xs focus:outline-none transition-all shadow-2xs"
                                            onFocus={(e) => {
                                                e.currentTarget.style.borderColor = accentHex;
                                                e.currentTarget.style.boxShadow = `0 0 0 2px ${hexToRgba(accentHex, 0.25)}`;
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.borderColor = "";
                                                e.currentTarget.style.boxShadow = "";
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-0.5">
                                    <label htmlFor="reg-email" className="block text-[10.5px] font-semibold text-zinc-700 dark:text-zinc-300">
                                        Correo
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
                                        <input
                                            id="reg-email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="nombre@correo.com"
                                            required
                                            className="w-full pl-8 pr-2.5 py-1.5 sm:py-2 rounded-xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-xs focus:outline-none transition-all shadow-2xs"
                                            onFocus={(e) => {
                                                e.currentTarget.style.borderColor = accentHex;
                                                e.currentTarget.style.boxShadow = `0 0 0 2px ${hexToRgba(accentHex, 0.25)}`;
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.borderColor = "";
                                                e.currentTarget.style.boxShadow = "";
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Fila 2: Contraseña y Confirmar (con animación shake en caso de error) */}
                            <motion.div
                                key={shakeKey}
                                animate={shakeKey > 0 ? { x: [0, -10, 10, -7, 7, -3, 3, 0] } : { x: 0 }}
                                transition={{ duration: 0.38, ease: "easeInOut" }}
                                className="grid grid-cols-2 gap-2"
                            >
                                <div className="space-y-0.5">
                                    <label htmlFor="reg-password" className="block text-[10.5px] font-semibold text-zinc-700 dark:text-zinc-300">
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <Lock
                                            className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none transition-colors duration-200 ${
                                                isPasswordError ? "text-red-500" : "text-zinc-400 dark:text-zinc-500"
                                            }`}
                                        />
                                        <input
                                            id="reg-password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                if (isPasswordError) setIsPasswordError(false);
                                            }}
                                            placeholder="••••••••"
                                            required
                                            minLength={8}
                                            className={`w-full pl-8 pr-7 py-1.5 sm:py-2 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-xs focus:outline-none transition-all shadow-2xs ${
                                                isPasswordError
                                                    ? "border border-red-500/80 bg-red-500/[0.04] dark:bg-red-500/[0.08]"
                                                    : "bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10"
                                            }`}
                                            onFocus={(e) => {
                                                if (!isPasswordError) {
                                                    e.currentTarget.style.borderColor = accentHex;
                                                    e.currentTarget.style.boxShadow = `0 0 0 2px ${hexToRgba(accentHex, 0.25)}`;
                                                }
                                            }}
                                            onBlur={(e) => {
                                                if (!isPasswordError) {
                                                    e.currentTarget.style.borderColor = "";
                                                    e.currentTarget.style.boxShadow = "";
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-0.5 cursor-pointer"
                                            aria-label={showPassword ? "Ocultar" : "Mostrar"}
                                        >
                                            {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-0.5">
                                    <label htmlFor="reg-confirm" className="block text-[10.5px] font-semibold text-zinc-700 dark:text-zinc-300">
                                        Confirmar
                                    </label>
                                    <div className="relative">
                                        <Lock
                                            className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none transition-colors duration-200 ${
                                                isPasswordError ? "text-red-500" : "text-zinc-400 dark:text-zinc-500"
                                            }`}
                                        />
                                        <input
                                            id="reg-confirm"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(e.target.value);
                                                if (isPasswordError) setIsPasswordError(false);
                                            }}
                                            placeholder="••••••••"
                                            required
                                            minLength={8}
                                            className={`w-full pl-8 pr-7 py-1.5 sm:py-2 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-xs focus:outline-none transition-all shadow-2xs ${
                                                isPasswordError
                                                    ? "border border-red-500/80 bg-red-500/[0.04] dark:bg-red-500/[0.08]"
                                                    : "bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10"
                                            }`}
                                            onFocus={(e) => {
                                                if (!isPasswordError) {
                                                    e.currentTarget.style.borderColor = accentHex;
                                                    e.currentTarget.style.boxShadow = `0 0 0 2px ${hexToRgba(accentHex, 0.25)}`;
                                                }
                                            }}
                                            onBlur={(e) => {
                                                if (!isPasswordError) {
                                                    e.currentTarget.style.borderColor = "";
                                                    e.currentTarget.style.boxShadow = "";
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-0.5 cursor-pointer"
                                            aria-label={showConfirmPassword ? "Ocultar" : "Mostrar"}
                                        >
                                            {showConfirmPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Checklist de requisitos de Firebase ultra-compacto */}
                            <div className="p-1.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 text-[9.5px]">
                                <div className="grid grid-cols-2 gap-1">
                                    <div
                                        className={`flex items-center gap-1.5 px-1 py-0.5 rounded transition-colors ${
                                            hasMinLength
                                                ? "text-emerald-700 dark:text-emerald-300 font-semibold"
                                                : "text-zinc-400 dark:text-zinc-500"
                                        }`}
                                    >
                                        <div
                                            className={`w-3 h-3 rounded-full flex items-center justify-center transition-all ${
                                                hasMinLength
                                                    ? "bg-emerald-500 text-white"
                                                    : "border border-zinc-300 dark:border-zinc-700"
                                            }`}
                                        >
                                            {hasMinLength && <Check className="w-2 h-2 stroke-[3]" />}
                                        </div>
                                        <span>8+ caracteres</span>
                                    </div>

                                    <div
                                        className={`flex items-center gap-1.5 px-1 py-0.5 rounded transition-colors ${
                                            hasUppercase
                                                ? "text-emerald-700 dark:text-emerald-300 font-semibold"
                                                : "text-zinc-400 dark:text-zinc-500"
                                        }`}
                                    >
                                        <div
                                            className={`w-3 h-3 rounded-full flex items-center justify-center transition-all ${
                                                hasUppercase
                                                    ? "bg-emerald-500 text-white"
                                                    : "border border-zinc-300 dark:border-zinc-700"
                                            }`}
                                        >
                                            {hasUppercase && <Check className="w-2 h-2 stroke-[3]" />}
                                        </div>
                                        <span>Mayúscula (A-Z)</span>
                                    </div>

                                    <div
                                        className={`flex items-center gap-1.5 px-1 py-0.5 rounded transition-colors ${
                                            hasLowercase
                                                ? "text-emerald-700 dark:text-emerald-300 font-semibold"
                                                : "text-zinc-400 dark:text-zinc-500"
                                        }`}
                                    >
                                        <div
                                            className={`w-3 h-3 rounded-full flex items-center justify-center transition-all ${
                                                hasLowercase
                                                    ? "bg-emerald-500 text-white"
                                                    : "border border-zinc-300 dark:border-zinc-700"
                                            }`}
                                        >
                                            {hasLowercase && <Check className="w-2 h-2 stroke-[3]" />}
                                        </div>
                                        <span>Minúscula (a-z)</span>
                                    </div>

                                    <div
                                        className={`flex items-center gap-1.5 px-1 py-0.5 rounded transition-colors ${
                                            hasNumber
                                                ? "text-emerald-700 dark:text-emerald-300 font-semibold"
                                                : "text-zinc-400 dark:text-zinc-500"
                                        }`}
                                    >
                                        <div
                                            className={`w-3 h-3 rounded-full flex items-center justify-center transition-all ${
                                                hasNumber
                                                    ? "bg-emerald-500 text-white"
                                                    : "border border-zinc-300 dark:border-zinc-700"
                                            }`}
                                        >
                                            {hasNumber && <Check className="w-2 h-2 stroke-[3]" />}
                                        </div>
                                        <span>Número (0-9)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Botón Principal Material You */}
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                disabled={loading}
                                type="submit"
                                className="w-full py-2.5 sm:py-3 mt-0.5 rounded-full font-bold text-xs sm:text-sm text-white transition-all duration-300 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98]"
                                style={{
                                    background: `linear-gradient(135deg, ${accentHex} 0%, ${hexToRgba(accentHex, 0.85)} 60%, #059669 100%)`,
                                    boxShadow: `0 6px 18px ${hexToRgba(accentHex, 0.32)}`,
                                }}
                            >
                                {loading ? (
                                    <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Crear cuenta</span>
                                        <ArrowRight size={14} />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Enlace de cambio */}
                        <p className="text-center text-[10.5px] text-zinc-500 dark:text-zinc-400 mt-2">
                            ¿Ya tienes una cuenta?{" "}
                            <Link
                                to="/login"
                                className="font-bold hover:underline transition-colors"
                                style={{ color: accentHex }}
                            >
                                Inicia sesión
                            </Link>
                        </p>

                        {/* Protocolo de Privacidad ReCiclo (ultracompacto, 0 scroll) */}
                        <div className="mt-2 p-1.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] text-[9.5px] text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                            <Shield className="size-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <div className="leading-snug truncate">
                                <span className="font-semibold text-zinc-800 dark:text-zinc-200">Protección Estudiantil:</span> Cifrado TLS 1.3 Firebase Auth confidencial.
                            </div>
                        </div>
                    </motion.div>
                </main>

                {/* ── PIE: ANDROID HOME PILL Y NOTA ── */}
                <footer className="w-full text-center shrink-0 pt-0.5">
                    <div className="w-24 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mb-1 md:hidden" />
                    <p className="text-[9.5px] text-zinc-400 dark:text-zinc-500">
                        ReCiclo • Plataforma de reciclaje sustentable
                    </p>
                </footer>
            </div>

            {/* ── PANEL DERECHO: VIDEO / HERO MEDIA DESKTOP (SPLIT SCREEN, CERO SCROLL) ── */}
            <div className="hidden md:flex md:w-[50%] lg:w-[52%] xl:w-[55%] h-full relative overflow-hidden bg-zinc-950 flex-col justify-between p-8 lg:p-12 select-none shrink-0">
                <video
                    key={activeVideoSrc}
                    src={activeVideoSrc}
                    poster={HERO_POSTER}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover scale-105 filter brightness-[0.85] contrast-[1.05]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/35 pointer-events-none" />

                <div
                    aria-hidden="true"
                    className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-[130px] pointer-events-none opacity-40 transition-colors duration-700"
                    style={{ backgroundColor: accentHex }}
                />

                <div className="relative z-10 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white text-xs font-semibold shadow-lg">
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentHex }} />
                        <span>Comunidad ReCiclo</span>
                    </div>

                    <span className="text-[11px] font-semibold text-white/70 tracking-wider uppercase">
                        Impacto Colectivo
                    </span>
                </div>

                <div className="relative z-10 max-w-lg space-y-3.5">
                    <div className="space-y-1.5">
                        <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                            Únete al cambio <br />
                            <span style={{ color: accentHex }}>ecológico de tu campus.</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                            Crea tu cuenta gratuita para desbloquear el escaneo con visión artificial, acumular logros verdes y liderar iniciativas de reciclaje.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white flex items-center gap-2.5 shadow-md">
                            <Sparkles size={16} style={{ color: accentHex }} className="shrink-0" />
                            <div className="text-xs font-bold leading-tight">
                                <div>Logros & Nivel</div>
                                <div className="text-[10px] text-zinc-400 font-normal mt-0.5">Gamificación ecológica</div>
                            </div>
                        </div>

                        <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white flex items-center gap-2.5 shadow-md">
                            <Shield size={16} style={{ color: accentHex }} className="shrink-0" />
                            <div className="text-xs font-bold leading-tight">
                                <div>Privacidad Total</div>
                                <div className="text-[10px] text-zinc-400 font-normal mt-0.5">Normas institucionales</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── OVERLAY DE REGISTRO SEGURO TRAS REGISTRO EXITOSO ── */}
            <AuthSuccessOverlay
                show={authOverlay.show}
                state={authOverlay.state}
                title={authOverlay.title}
                subtitle={authOverlay.subtitle}
                onComplete={handleComplete}
            />
        </div>
    );
}
