import { useState, useEffect, useMemo, useRef, type ChangeEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  LogOut,
  LogIn,
  School,
  Settings,
  Recycle,
  Camera,
  Pencil,
  X,
  Check,
  Trophy,
  Leaf,
  Layers,
  Flame,
  UserCheck,
  GraduationCap,
  Hash,
  Loader2,
  BarChart3,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { logout, updateUserProfile } from "../firebase";
import {
  getScanHistory,
  clearScanHistory,
  removeScanFromHistory,
  type ScanHistoryEntry,
} from "../data/historyStorage";
import { CATEGORY_INFO } from "../data/wasteData";
import { SettingsModal } from "../components/settings-modal";
import {
  PAGE_SIZE,
  CARRERAS,
  CAMPUSES,
  fileToAvatar,
  saveErrorMessage,
  ProfileResourcesSection,
  ProfileScanHistorySection,
} from "../components/profile/ProfileHistoryAndResources";

interface ExtraProfile {
  nombre: string;
  carrera: string;
  semestre: string;
  control: string;
  bio: string;
}

const EMPTY_EXTRA: ExtraProfile = {
  nombre: "",
  carrera: "",
  semestre: "",
  control: "",
  bio: "",
};
const EXTRA_KEY = "reciclo_profile_extra";
const AVATAR_KEY = "reciclo_avatar_custom";
const CAMPUS_KEY = "reciclo_pref_campus";

function loadExtra(): ExtraProfile {
  try {
    const raw = localStorage.getItem(EXTRA_KEY);
    return raw ? { ...EMPTY_EXTRA, ...JSON.parse(raw) } : EMPTY_EXTRA;
  } catch {
    return EMPTY_EXTRA;
  }
}

const DAY_MS = 24 * 60 * 60 * 1000;
// Límite seguro (~110 KB) para respetar el tope de 1 MiB por documento en Firestore.
const MAX_AVATAR_CHARS = 150_000;

export default function Perfil() {
  const { user, profile, isLoggedIn, profileStatus, refreshProfile, patchProfile } = useAuth();
  const { accent, perfTier } = useTheme();
  const prefersReduced = useReducedMotion();
  const reduceMotion = prefersReduced || perfTier === "lite";

  const inputCls = `w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 focus-visible:ring-2 ${accent.ring} transition-colors`;

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);

  useEffect(() => {
    const syncHistory = () => setHistory(getScanHistory());
    syncHistory();
    window.addEventListener("reciclo-history-updated", syncHistory);
    return () => window.removeEventListener("reciclo-history-updated", syncHistory);
  }, []);

  const uid = user?.uid;
  const cloud = isLoggedIn && Boolean(uid);
  const cloudReady = !cloud || profileStatus === "ready";

  const [preferredCampus, setPreferredCampus] = useState(() => {
    return localStorage.getItem(CAMPUS_KEY) || CAMPUSES[0].id;
  });

  useEffect(() => {
    if (cloud && profile?.campus) setPreferredCampus(profile.campus);
  }, [cloud, profile?.campus]);

  useEffect(() => {
    const syncCampus = () => {
      const stored = localStorage.getItem(CAMPUS_KEY);
      if (stored) setPreferredCampus(stored);
    };
    window.addEventListener("reciclo-campus-updated", syncCampus);
    return () => window.removeEventListener("reciclo-campus-updated", syncCampus);
  }, []);

  const handleCampusChange = (campus: string) => {
    setPreferredCampus(campus);
    localStorage.setItem(CAMPUS_KEY, campus);
    if (cloud && uid && profileStatus === "ready") {
      updateUserProfile(uid, { campus })
        .then(() => patchProfile({ campus }))
        .catch((err) => console.warn("[Perfil] campus no sincronizado:", err));
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customAvatar, setCustomAvatar] = useState(() => localStorage.getItem(AVATAR_KEY) || "");
  const [avatarError, setAvatarError] = useState("");
  const [avatarBusy, setAvatarBusy] = useState(false);

  const userPhoto = cloud ? profile?.fotoPerfil || user?.photoURL || "" : customAvatar;
  const hasCustomPhoto = cloud
    ? Boolean(profile?.fotoPerfil?.startsWith("data:"))
    : Boolean(customAvatar);

  const saveAvatar = async (url: string) => {
    setAvatarBusy(true);
    setAvatarError("");
    try {
      if (cloud && uid) {
        await updateUserProfile(uid, { fotoPerfil: url });
        patchProfile({ fotoPerfil: url });
      } else {
        localStorage.setItem(AVATAR_KEY, url);
        setCustomAvatar(url);
        window.dispatchEvent(new Event("storage"));
      }
    } catch (err) {
      console.error("[Perfil] No se pudo guardar la foto:", err);
      setAvatarError(saveErrorMessage(err));
    } finally {
      setAvatarBusy(false);
    }
  };

  const handleAvatarFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setAvatarError("Elige una imagen (JPG, PNG o WebP).");
      return;
    }
    let dataUrl: string;
    try {
      dataUrl = await fileToAvatar(file);
    } catch {
      setAvatarError("No se pudo leer esa imagen. Prueba con otra.");
      return;
    }
    if (dataUrl.length > MAX_AVATAR_CHARS) {
      setAvatarError("La imagen es demasiado pesada. Prueba con otra.");
      return;
    }
    await saveAvatar(dataUrl);
  };

  const [localExtra, setLocalExtra] = useState<ExtraProfile>(loadExtra);
  const extra: ExtraProfile = cloud
    ? {
        nombre: profile?.nombre ?? "",
        carrera: profile?.carrera ?? "",
        semestre: profile?.semestre ?? "",
        control: profile?.numeroControl ?? "",
        bio: profile?.bio ?? "",
      }
    : localExtra;

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<ExtraProfile>(extra);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [savedMsg, setSavedMsg] = useState(false);

  const accountName = cloud
    ? profile?.nombre || user?.displayName || "Estudiante IT Morelia"
    : "Invitado Tecnológico";
  const displayName = extra.nombre.trim() || accountName;
  const userEmail = isLoggedIn ? profile?.correo || user?.email : "Sesión local en este navegador";

  const openEdit = () => {
    setDraft({ ...extra, nombre: cloud ? extra.nombre || accountName : extra.nombre });
    setFormError("");
    setIsEditing(true);
  };

  const handleSave = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const clean: ExtraProfile = {
      nombre: draft.nombre.trim(),
      carrera: draft.carrera.trim(),
      semestre: draft.semestre,
      control: draft.control.trim(),
      bio: draft.bio.trim(),
    };

    if (cloud && uid) {
      if (!clean.nombre) {
        setFormError("Escribe tu nombre.");
        return;
      }
      setSaving(true);
      setFormError("");
      const patch = {
        nombre: clean.nombre,
        carrera: clean.carrera,
        semestre: clean.semestre,
        numeroControl: clean.control,
        bio: clean.bio,
      };
      try {
        await updateUserProfile(uid, patch);
        patchProfile(patch);
      } catch (err) {
        console.error("[Perfil] No se pudo guardar el perfil:", err);
        setFormError(saveErrorMessage(err));
        setSaving(false);
        return;
      }
      setSaving(false);
    } else {
      try {
        localStorage.setItem(EXTRA_KEY, JSON.stringify(clean));
      } catch {
        // Si localStorage está lleno, mantiene el estado en memoria de la sesión actual.
      }
      setLocalExtra(clean);
    }

    setIsEditing(false);
    setSavedMsg(true);
  };

  useEffect(() => {
    if (!savedMsg) return;
    const t = setTimeout(() => setSavedMsg(false), 2500);
    return () => clearTimeout(t);
  }, [savedMsg]);

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const stats = useMemo(() => {
    const now = Date.now();
    const byCategory: Record<string, number> = {};
    let thisWeek = 0;
    for (const entry of history) {
      byCategory[entry.category] = (byCategory[entry.category] || 0) + 1;
      const ts = new Date(entry.timestamp).getTime();
      if (!Number.isNaN(ts) && now - ts <= 7 * DAY_MS) thisWeek += 1;
    }
    const ranked = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
    return { total: history.length, thisWeek, ranked, categories: ranked.length };
  }, [history]);

  const categoryName = (key: string) =>
    (CATEGORY_INFO as Record<string, { name: string } | undefined>)[key]?.name ?? key;

  const filteredHistory = useMemo(() => {
    const q = query.trim().toLowerCase();
    return history.filter((entry) => {
      if (categoryFilter !== "all" && entry.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        entry.wasteName.toLowerCase().includes(q) ||
        (entry.material || "").toLowerCase().includes(q) ||
        (entry.recommendedBin || "").toLowerCase().includes(q)
      );
    });
  }, [history, query, categoryFilter]);

  const hasFilters = query.trim() !== "" || categoryFilter !== "all";
  const clearFilters = () => {
    setQuery("");
    setCategoryFilter("all");
    setVisible(PAGE_SIZE);
  };

  const handleRemoveEntry = (id: string) => {
    setHistory(removeScanFromHistory(id));
  };

  const handleClearHistory = () => {
    if (window.confirm("¿Deseas vaciar el historial de residuos clasificados?")) {
      clearScanHistory();
      setHistory([]);
      clearFilters();
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const profileComplete = Boolean(extra.carrera && extra.semestre && extra.bio);
  const achievements = [
    {
      id: "first",
      icon: Leaf,
      title: "Primer residuo",
      desc: "Clasifica tu primer residuo en la plataforma",
      done: stats.total >= 1,
    },
    {
      id: "ten",
      icon: Trophy,
      title: "10 residuos",
      desc: "Alcanza 10 materiales clasificados",
      done: stats.total >= 10,
    },
    {
      id: "p25",
      icon: Recycle,
      title: "Hábito constante",
      desc: "Alcanza 25 materiales clasificados",
      done: stats.total >= 25,
    },
    {
      id: "variety",
      icon: Layers,
      title: "Separación versátil",
      desc: "Identifica residuos de 3 categorías distintas",
      done: stats.categories >= 3,
    },
    {
      id: "week",
      icon: Flame,
      title: "Semana activa",
      desc: "Clasifica 5 residuos en los últimos 7 días",
      done: stats.thisWeek >= 5,
    },
    {
      id: "profile",
      icon: UserCheck,
      title: "Ficha académica completa",
      desc: "Registra tu carrera, semestre y presentación",
      done: profileComplete,
    },
  ];
  const unlocked = achievements.filter((a) => a.done).length;

  const topCategory = stats.ranked[0]?.[0];
  const maxCount = stats.ranked[0]?.[1] || 1;
  const activeCampusObj =
    CAMPUSES.find((c) => preferredCampus.includes(c.label)) || CAMPUSES[0];

  const fade = reduceMotion ? false : { opacity: 0, y: 12 };

  return (
    <div className="min-h-screen pt-20 pb-28 md:pt-24 md:pb-16 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto transition-colors duration-300 space-y-6">
      {/* Cabecera contextual del espacio personal */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <p className={`text-xs font-semibold ${accent.text} mb-1`}>
            Instituto Tecnológico de Morelia · Espacio del Estudiante
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Perfil y Registro Personal
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Administra tus datos académicos, selecciona tu campus predeterminado para el mapa y consulta el historial de residuos que has clasificado en este dispositivo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <Link
            to="/mapa"
            className={`inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 ${accent.ring}`}
          >
            <MapPin size={14} className={accent.text} aria-hidden="true" />
            <span>{activeCampusObj.label}</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Abrir configuración de la aplicación"
            className={`inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 ${accent.ring}`}
          >
            <Settings size={14} aria-hidden="true" />
            <span>Ajustes de interfaz</span>
          </button>
        </div>
      </div>

      {/* Estructura principal de dos columnas asimétricas en escritorio y fluido intermedio en tableta */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
        {/* Columna izquierda: Credencial académica y resumen de actividad */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 items-start">
          {/* Credencial de identidad */}
          <motion.section
            initial={fade}
            animate={{ opacity: 1, y: 0 }}
            aria-label="Mi perfil"
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarBusy || !cloudReady}
                    aria-label="Cambiar foto de perfil"
                    className={`group relative size-20 sm:size-22 rounded-3xl overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 shadow-sm cursor-pointer focus:outline-none focus-visible:ring-2 ${accent.ring} focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900`}
                  >
                    {userPhoto ? (
                      <img
                        src={userPhoto}
                        alt={`Foto de perfil de ${displayName}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span
                        className={`w-full h-full flex items-center justify-center font-bold text-2xl sm:text-3xl ${accent.badge}`}
                      >
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span
                      className={`absolute inset-0 flex items-center justify-center bg-black/50 text-white transition-opacity ${
                        avatarBusy
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                      }`}
                    >
                      {avatarBusy ? (
                        <Loader2 size={20} className="animate-spin" aria-hidden="true" />
                      ) : (
                        <Camera size={20} aria-hidden="true" />
                      )}
                    </span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFile}
                    className="hidden"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight break-words">
                      {displayName}
                    </h2>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                        isLoggedIn
                          ? accent.badge
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      {isLoggedIn ? "Cuenta activa" : "Modo local"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 break-all">
                    {userEmail}
                  </p>
                </div>
              </div>

              {extra.carrera || extra.semestre || extra.control ? (
                <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Datos académicos">
                  {extra.carrera && (
                    <li className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200">
                      <GraduationCap size={13} className={accent.text} aria-hidden="true" />
                      <span>{extra.carrera}</span>
                    </li>
                  )}
                  {extra.semestre && (
                    <li className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200">
                      {extra.semestre}° semestre
                    </li>
                  )}
                  {extra.control && (
                    <li className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200 tabular-nums">
                      <Hash size={12} className={accent.text} aria-hidden="true" />
                      <span>{extra.control}</span>
                    </li>
                  )}
                </ul>
              ) : (
                !isEditing && (
                  <p className="mt-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-dashed border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
                    Sin datos académicos registrados. Pulsa{" "}
                    <strong className="text-zinc-800 dark:text-zinc-200">Editar perfil</strong> para agregar tu carrera, semestre y número de control.
                  </p>
                )
              )}

              {extra.bio && (
                <p className="mt-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {extra.bio}
                </p>
              )}

              {!isEditing && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={openEdit}
                    disabled={!cloudReady}
                    className={`inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition-transform active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${accent.btn} focus:outline-none focus-visible:ring-2 ${accent.ring}`}
                  >
                    <Pencil size={13} aria-hidden="true" />
                    <span>Editar perfil</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarBusy || !cloudReady}
                    className={`inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 ${accent.ring}`}
                  >
                    <Camera size={13} aria-hidden="true" />
                    <span>Cambiar foto</span>
                  </button>
                  {hasCustomPhoto && (
                    <button
                      type="button"
                      onClick={() => saveAvatar("")}
                      disabled={avatarBusy}
                      className="min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    >
                      Quitar foto
                    </button>
                  )}
                  {savedMsg && (
                    <span
                      role="status"
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${accent.text}`}
                    >
                      <Check size={14} aria-hidden="true" />
                      Cambios guardados
                    </span>
                  )}
                </div>
              )}

              {cloud && profileStatus === "loading" && (
                <p
                  className="mt-3 text-xs text-zinc-600 dark:text-zinc-400 inline-flex items-center gap-1.5"
                  role="status"
                >
                  <Loader2 size={13} className="animate-spin" aria-hidden="true" />
                  Sincronizando perfil con tu cuenta...
                </p>
              )}
              {cloud && profileStatus === "error" && (
                <p role="alert" className="mt-3 text-xs text-rose-700 dark:text-rose-400">
                  No se pudo cargar tu perfil.{" "}
                  <button
                    type="button"
                    onClick={() => refreshProfile()}
                    className="font-semibold underline cursor-pointer"
                  >
                    Reintentar
                  </button>
                </p>
              )}

              {avatarError && (
                <p role="alert" className="mt-3 text-xs text-rose-700 dark:text-rose-400">
                  {avatarError}
                </p>
              )}

              {isEditing && (
                <motion.form
                  onSubmit={handleSave}
                  initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-5 pt-5 border-t border-zinc-200 dark:border-zinc-800 overflow-hidden space-y-4"
                >
                  <div>
                    <label
                      htmlFor="p-nombre"
                      className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5"
                    >
                      Nombre
                    </label>
                    <input
                      id="p-nombre"
                      type="text"
                      maxLength={40}
                      value={draft.nombre}
                      onChange={(e) => setDraft({ ...draft, nombre: e.target.value })}
                      placeholder={accountName}
                      required={cloud}
                      className={`${inputCls} min-h-[44px]`}
                    />
                    {!cloud && (
                      <p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-400">
                        Déjalo vacío para mostrar "{accountName}".
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="p-carrera"
                      className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5"
                    >
                      Carrera o programa
                    </label>
                    <input
                      id="p-carrera"
                      type="text"
                      list="p-carreras"
                      maxLength={60}
                      value={draft.carrera}
                      onChange={(e) => setDraft({ ...draft, carrera: e.target.value })}
                      placeholder="Elige o escribe tu carrera"
                      className={`${inputCls} min-h-[44px]`}
                    />
                    <datalist id="p-carreras">
                      {CARRERAS.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="p-semestre"
                        className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5"
                      >
                        Semestre
                      </label>
                      <select
                        id="p-semestre"
                        value={draft.semestre}
                        onChange={(e) => setDraft({ ...draft, semestre: e.target.value })}
                        className={`${inputCls} min-h-[44px]`}
                      >
                        <option value="">Sin indicar</option>
                        {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((n) => (
                          <option key={n} value={n}>
                            {n}°
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="p-control"
                        className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5"
                      >
                        N.º de control
                      </label>
                      <input
                        id="p-control"
                        type="text"
                        inputMode="numeric"
                        maxLength={8}
                        value={draft.control}
                        onChange={(e) =>
                          setDraft({ ...draft, control: e.target.value.replace(/\D/g, "") })
                        }
                        placeholder="Ej. 21120000"
                        className={`${inputCls} min-h-[44px]`}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="p-bio"
                      className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5"
                    >
                      Sobre ti
                    </label>
                    <textarea
                      id="p-bio"
                      rows={3}
                      maxLength={140}
                      value={draft.bio}
                      onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                      placeholder="Ej. Participante en brigadas ambientales del campus."
                      className={`${inputCls} resize-none`}
                    />
                    <p className="mt-1 text-right text-[11px] text-zinc-600 dark:text-zinc-400 tabular-nums">
                      {draft.bio.length}/140
                    </p>
                  </div>

                  {formError && (
                    <p role="alert" className="text-xs text-rose-700 dark:text-rose-400">
                      {formError}
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => setIsEditing(false)}
                      className={`inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 ${accent.ring}`}
                    >
                      <X size={14} aria-hidden="true" />
                      <span>Cancelar</span>
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className={`inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition-transform active:scale-95 cursor-pointer disabled:opacity-60 ${accent.btn} focus:outline-none focus-visible:ring-2 ${accent.ring}`}
                    >
                      {saving ? (
                        <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                      ) : (
                        <Check size={14} aria-hidden="true" />
                      )}
                      <span>{saving ? "Guardando..." : "Guardar cambios"}</span>
                    </button>
                  </div>
                </motion.form>
              )}
            </div>

            {/* Selector de campus y control de sesión */}
            <div className="mt-6 pt-5 border-t border-zinc-200/80 dark:border-zinc-800 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    <School size={14} className={accent.text} aria-hidden="true" />
                    <span>Campus predeterminado</span>
                  </span>
                  <span className="text-[11px] text-zinc-600 dark:text-zinc-400">
                    {activeCampusObj.subtitle}
                  </span>
                </div>

                <div
                  role="group"
                  aria-label="Campus preferido"
                  className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 text-xs"
                >
                  {CAMPUSES.map((c) => {
                    const active = preferredCampus.includes(c.label);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => handleCampusChange(c.id)}
                        className={`min-h-[40px] px-3 py-2 rounded-xl font-medium transition-all cursor-pointer focus:outline-none focus-visible:ring-2 ${accent.ring} ${
                          active
                            ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs font-semibold"
                            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                        }`}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <p className="inline-flex items-center gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-400">
                  <ShieldCheck size={13} className={`${accent.text} shrink-0`} aria-hidden="true" />
                  <span>
                    {cloud
                      ? "Perfil respaldado en tu cuenta."
                      : "Datos guardados en este dispositivo."}
                  </span>
                </p>

                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                  >
                    <LogOut size={14} aria-hidden="true" />
                    <span>Cerrar sesión</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/login"
                      className={`inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-xs ${accent.btn} focus:outline-none focus-visible:ring-2 ${accent.ring}`}
                    >
                      <LogIn size={13} aria-hidden="true" />
                      <span>Acceder</span>
                    </Link>
                    <Link
                      to="/registro"
                      className={`inline-flex items-center min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors focus:outline-none focus-visible:ring-2 ${accent.ring}`}
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.section>

          {/* Resumen estadístico de actividad */}
          <section
            aria-label="Actividad de clasificación"
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-5"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className={accent.text} aria-hidden="true" />
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Actividad en este Dispositivo
                </h2>
              </div>
              <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                Conteo real
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800">
                <p className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {stats.total}
                </p>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 leading-snug">
                  Clasificados
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800">
                <p className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {stats.thisWeek}
                </p>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 leading-snug">
                  Últimos 7 días
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800">
                <p className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {stats.categories}
                </p>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 leading-snug">
                  Categorías
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between gap-3">
              <span className="text-xs text-zinc-600 dark:text-zinc-400">
                Categoría más frecuente
              </span>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {topCategory ? categoryName(topCategory) : "Sin registros"}
              </span>
            </div>

            {stats.total > 0 ? (
              <div className="space-y-2.5 pt-1">
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Distribución por tipo de residuo
                </p>
                <ul className="space-y-2.5">
                  {stats.ranked.map(([cat, count]) => (
                    <li key={cat} className="flex items-center gap-3 text-xs">
                      <span className="w-32 shrink-0 truncate text-zinc-700 dark:text-zinc-300">
                        {categoryName(cat)}
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.max(6, (count / maxCount) * 100)}%`,
                            backgroundColor: accent.hex,
                          }}
                        />
                      </div>
                      <span className="w-6 text-right font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                        {count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Cuando clasifiques tu primer residuo en el escáner, aquí aparecerá el desglose proporcional por categoría de contenedor.
              </p>
            )}
          </section>
        </div>

        {/* Columna derecha: Historial interactivo, hitos de participación y recursos oficiales */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <ProfileScanHistorySection
            accent={accent}
            inputCls={inputCls}
            history={history}
            filteredHistory={filteredHistory}
            query={query}
            setQuery={setQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            visible={visible}
            setVisible={setVisible}
            hasFilters={hasFilters}
            clearFilters={clearFilters}
            handleClearHistory={handleClearHistory}
            handleRemoveEntry={handleRemoveEntry}
            formatDate={formatDate}
            categoryName={categoryName}
            categoriesCount={stats.categories}
            rankedCategories={stats.ranked}
          />

          {/* Hitos de participación */}
          <section
            aria-label="Logros de clasificación"
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Trophy size={18} className={accent.text} aria-hidden="true" />
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Hitos de Participación
                  </h2>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Metas verificables basadas en los residuos que has clasificado y el llenado de tu perfil.
                  </p>
                </div>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full tabular-nums ${accent.badge}`}>
                {unlocked} de {achievements.length} completados
              </span>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {achievements.map((a) => {
                const Icon = a.icon;
                return (
                  <li
                    key={a.id}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-colors ${
                      a.done
                        ? "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/70"
                        : "border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40"
                    }`}
                  >
                    <span
                      style={a.done ? { backgroundColor: accent.hex } : undefined}
                      className={`size-9 shrink-0 rounded-xl flex items-center justify-center ${
                        a.done
                          ? "text-white"
                          : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      <Icon size={16} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p
                          className={`text-xs font-bold truncate ${
                            a.done
                              ? "text-zinc-900 dark:text-zinc-100"
                              : "text-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          {a.title}
                        </p>
                        {a.done && (
                          <Check size={13} className={`${accent.text} shrink-0`} aria-hidden="true" />
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 leading-snug">
                        {a.desc}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <ProfileResourcesSection accent={accent} />
        </div>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
