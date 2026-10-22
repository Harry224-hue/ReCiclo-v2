import { useState, useEffect, useMemo, useRef, type ChangeEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  LogOut,
  LogIn,
  School,
  Settings,
  Sparkles,
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
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { logout, updateUserProfile } from "../firebase";
import { getScanHistory, clearScanHistory, removeScanFromHistory, ScanHistoryEntry } from "../data/historyStorage";
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

/* ------------------------------------------------------------------ */
/* Datos extra del perfil (se guardan en este dispositivo)             */
/* ------------------------------------------------------------------ */

interface ExtraProfile {
  nombre: string;
  carrera: string;
  semestre: string;
  control: string;
  bio: string;
}

const EMPTY_EXTRA: ExtraProfile = { nombre: "", carrera: "", semestre: "", control: "", bio: "" };
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
const MAX_AVATAR_CHARS = 150_000; // ~110 KB; el límite de un documento de Firestore es 1 MiB

export default function Perfil() {
  const { user, profile, isLoggedIn, profileStatus, refreshProfile, patchProfile } = useAuth();
  const { accent, perfTier } = useTheme();
  const prefersReduced = useReducedMotion();
  // Respeta "reducir movimiento" del sistema y el Modo Ligero de la app
  const reduceMotion = prefersReduced || perfTier === "lite";

  const inputCls = `w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 focus-visible:ring-2 ${accent.ring} transition-colors`;

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);

  useEffect(() => {
    const syncHistory = () => setHistory(getScanHistory());
    syncHistory();
    window.addEventListener("reciclo-history-updated", syncHistory);
    return () => window.removeEventListener("reciclo-history-updated", syncHistory);
  }, []);

  /* ---------------- Cuenta en la nube (Firestore) ---------------- */
  // El perfil ya lo lee AuthContext al iniciar sesión: aquí no se hace otra lectura.
  const uid = user?.uid;
  const cloud = isLoggedIn && Boolean(uid);
  const cloudReady = !cloud || profileStatus === "ready";

  /* ---------------- Campus ---------------- */
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

  /* ---------------- Foto de perfil ---------------- */
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customAvatar, setCustomAvatar] = useState(() => localStorage.getItem(AVATAR_KEY) || "");
  const [avatarError, setAvatarError] = useState("");
  const [avatarBusy, setAvatarBusy] = useState(false);

  // Con sesión: la foto vive en Firestore (sin Storage, que requiere plan de pago).
  // Sin sesión: solo en este dispositivo.
  const userPhoto = cloud ? profile?.fotoPerfil || user?.photoURL || "" : customAvatar;
  const hasCustomPhoto = cloud ? Boolean(profile?.fotoPerfil?.startsWith("data:")) : Boolean(customAvatar);

  const saveAvatar = async (url: string) => {
    setAvatarBusy(true);
    setAvatarError("");
    try {
      if (cloud && uid) {
        await updateUserProfile(uid, { fotoPerfil: url });
        patchProfile({ fotoPerfil: url }); // Navbar y Ajustes se actualizan al instante
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

  /* ---------------- Datos editables ---------------- */
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
  const userEmail = isLoggedIn ? profile?.correo || user?.email : "Modo local · IT Morelia";

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
        /* si falla, al menos se actualiza en pantalla */
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

  /* ---------------- Historial: estadísticas y filtros ---------------- */
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

  /* ---------------- Logros ---------------- */
  const profileComplete = Boolean(extra.carrera && extra.semestre && extra.bio);
  const achievements = [
    { id: "first", icon: Leaf, title: "Primer residuo", desc: "Clasifica tu primer residuo", done: stats.total >= 1 },
    { id: "ten", icon: Trophy, title: "10 residuos", desc: "Llega a 10 clasificados", done: stats.total >= 10 },
    { id: "p25", icon: Sparkles, title: "Eco constante", desc: "Llega a 25 clasificados", done: stats.total >= 25 },
    { id: "variety", icon: Layers, title: "Clasificador versátil", desc: "Usa 3 categorías distintas", done: stats.categories >= 3 },
    { id: "week", icon: Flame, title: "Semana activa", desc: "5 residuos en 7 días", done: stats.thisWeek >= 5 },
    { id: "profile", icon: UserCheck, title: "Perfil completo", desc: "Agrega carrera, semestre y bio", done: profileComplete },
  ];
  const unlocked = achievements.filter((a) => a.done).length;

  const topCategory = stats.ranked[0]?.[0];
  const maxCount = stats.ranked[0]?.[1] || 1;

  const fade = reduceMotion ? false : { opacity: 0, y: 12 };

  return (
      <div className="min-h-screen pt-20 pb-28 md:pt-24 md:pb-16 px-4 md:px-8 max-w-4xl mx-auto transition-colors duration-300 space-y-6">
        {/* ================================================= */}
        {/* TARJETA DE PERFIL                                 */}
        {/* ================================================= */}
        <motion.section
            initial={fade}
            animate={{ opacity: 1, y: 0 }}
            aria-label="Mi perfil"
            className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 sm:gap-5 min-w-0">
              {/* Avatar */}
              <div className="shrink-0">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarBusy || !cloudReady}
                    aria-label="Cambiar foto de perfil"
                    className={`group relative size-20 sm:size-24 rounded-3xl overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 ${accent.ring} focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900`}
                >
                  {userPhoto ? (
                      <img
                          src={userPhoto}
                          alt=""
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
                      className={`absolute inset-0 flex items-center justify-center bg-black/45 text-white transition-opacity ${
                          avatarBusy ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                      }`}
                  >
                  {avatarBusy ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
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

              {/* Identidad */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight break-words">
                    {displayName}
                  </h1>
                  <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          isLoggedIn ? accent.badge : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                  >
                  {isLoggedIn ? "Conectado" : "Local"}
                </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-500 mt-0.5 break-all">{userEmail}</p>

                {(extra.carrera || extra.semestre || extra.control) && (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {extra.carrera && (
                          <li className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                            <GraduationCap size={12} className={accent.text} />
                            {extra.carrera}
                          </li>
                      )}
                      {extra.semestre && (
                          <li className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                            {extra.semestre}° semestre
                          </li>
                      )}
                      {extra.control && (
                          <li className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                            <Hash size={12} className={accent.text} />
                            {extra.control}
                          </li>
                      )}
                    </ul>
                )}

                {extra.bio && (
                    <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-prose">
                      {extra.bio}
                    </p>
                )}

                {!isEditing && (
                    <div className="mt-3.5 flex flex-wrap items-center gap-2">
                      <button
                          type="button"
                          onClick={openEdit}
                          disabled={!cloudReady}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-xs transition-transform active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${accent.btn}`}
                      >
                        <Pencil size={13} />
                        <span>Editar perfil</span>
                      </button>
                      <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={avatarBusy || !cloudReady}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                      >
                        <Camera size={13} />
                        <span>Cambiar foto</span>
                      </button>
                      {hasCustomPhoto && (
                          <button
                              type="button"
                              onClick={() => saveAvatar("")}
                              disabled={avatarBusy}
                              className="px-2 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                          >
                            Quitar foto
                          </button>
                      )}
                      {savedMsg && (
                          <span
                              role="status"
                              className={`inline-flex items-center gap-1 text-xs font-medium ${accent.text}`}
                          >
                      <Check size={13} />
                      Cambios guardados
                    </span>
                      )}
                    </div>
                )}

                {cloud && profileStatus === "loading" && (
                    <p className="mt-2 text-xs text-zinc-500 inline-flex items-center gap-1.5" role="status">
                      <Loader2 size={12} className="animate-spin" />
                      Cargando tu perfil…
                    </p>
                )}
                {cloud && profileStatus === "error" && (
                    <p role="alert" className="mt-2 text-xs text-rose-600 dark:text-rose-400">
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
                    <p role="alert" className="mt-2 text-xs text-rose-600 dark:text-rose-400">
                      {avatarError}
                    </p>
                )}
              </div>
            </div>

            <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                aria-label="Abrir configuración"
                title="Configuración de la app"
                className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer shrink-0 active:scale-90"
            >
              <Settings size={18} />
            </button>
          </div>

          {/* Formulario de edición */}
          {isEditing && (
              <motion.form
                  onSubmit={handleSave}
                  initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800 overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="p-nombre" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
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
                        className={inputCls}
                    />
                    {!cloud && (
                        <p className="mt-1 text-[11px] text-zinc-400">
                          Déjalo vacío para usar el nombre predeterminado.
                        </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="p-carrera" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Carrera
                    </label>
                    <input
                        id="p-carrera"
                        type="text"
                        list="p-carreras"
                        maxLength={60}
                        value={draft.carrera}
                        onChange={(e) => setDraft({ ...draft, carrera: e.target.value })}
                        placeholder="Elige o escribe tu carrera"
                        className={inputCls}
                    />
                    <datalist id="p-carreras">
                      {CARRERAS.map((c) => (
                          <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="p-semestre" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Semestre
                      </label>
                      <select
                          id="p-semestre"
                          value={draft.semestre}
                          onChange={(e) => setDraft({ ...draft, semestre: e.target.value })}
                          className={inputCls}
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
                      <label htmlFor="p-control" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        N.º de control
                      </label>
                      <input
                          id="p-control"
                          type="text"
                          inputMode="numeric"
                          maxLength={8}
                          value={draft.control}
                          onChange={(e) => setDraft({ ...draft, control: e.target.value.replace(/\D/g, "") })}
                          placeholder="00000000"
                          className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="p-bio" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Sobre ti
                    </label>
                    <textarea
                        id="p-bio"
                        rows={3}
                        maxLength={140}
                        value={draft.bio}
                        onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                        placeholder="Ej. Voluntario en el comité ambiental, me encanta el reciclaje de electrónicos."
                        className={`${inputCls} resize-none`}
                    />
                    <p className="mt-1 text-right text-[11px] text-zinc-400">{draft.bio.length}/140</p>
                  </div>
                </div>

                {formError && (
                    <p role="alert" className="mt-3 text-xs text-rose-600 dark:text-rose-400">
                      {formError}
                    </p>
                )}

                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                      type="button"
                      disabled={saving}
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    <X size={13} />
                    <span>Cancelar</span>
                  </button>
                  <button
                      type="submit"
                      disabled={saving}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition-transform active:scale-95 cursor-pointer disabled:opacity-60 ${accent.btn}`}
                  >
                    {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                    <span>{saving ? "Guardando…" : "Guardar cambios"}</span>
                  </button>
                </div>
              </motion.form>
          )}

          {/* Campus y sesión */}
          <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <School size={16} className={`shrink-0 ${accent.text}`} />
              <div
                  role="group"
                  aria-label="Campus preferido"
                  className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-xs"
              >
                {CAMPUSES.map((c) => (
                    <button
                        key={c.id}
                        type="button"
                        aria-pressed={preferredCampus.includes(c.label)}
                        onClick={() => handleCampusChange(c.id)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                            preferredCampus.includes(c.label)
                                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs font-semibold"
                                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                        }`}
                    >
                      {c.label}
                    </button>
                ))}
              </div>
            </div>

            {isLoggedIn ? (
                <button
                    type="button"
                    onClick={() => logout()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Cerrar sesión</span>
                </button>
            ) : (
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Link
                      to="/login"
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-xs ${accent.btn}`}
                  >
                    <LogIn size={13} />
                    <span>Acceder</span>
                  </Link>
                  <Link
                      to="/registro"
                      className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Registrarse
                  </Link>
                </div>
            )}
          </div>
        </motion.section>

        {/* ================================================= */}
        {/* TU IMPACTO                                        */}
        {/* ================================================= */}
        <section
            aria-label="Tu impacto"
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm"
        >
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                {stats.total}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">Residuos clasificados</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                {stats.thisWeek}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">Últimos 7 días</p>
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {topCategory ? categoryName(topCategory) : "Sin datos"}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">Categoría más frecuente</p>
            </div>
          </div>

          {stats.total > 0 && (
              <ul className="mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800 space-y-2.5">
                {stats.ranked.map(([cat, count]) => (
                    <li key={cat} className="flex items-center gap-3 text-xs">
                <span className="w-28 sm:w-36 shrink-0 truncate text-zinc-600 dark:text-zinc-400">
                  {categoryName(cat)}
                </span>
                      <div className="flex-1 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                        <div
                            className="h-full rounded-full"
                            style={{ width: `${Math.max(6, (count / maxCount) * 100)}%`, backgroundColor: accent.hex }}
                        />
                      </div>
                      <span className="w-6 text-right font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {count}
                </span>
                    </li>
                ))}
              </ul>
          )}

          {/* Logros */}
          <div className="mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Logros</h2>
              <span className="text-xs text-zinc-500 tabular-nums">
              {unlocked} de {achievements.length}
            </span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {achievements.map((a) => {
                const Icon = a.icon;
                return (
                    <li
                        key={a.id}
                        className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${
                            a.done
                                ? `border-zinc-200 dark:border-zinc-700 ${accent.glow}`
                                : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30"
                        }`}
                    >
                  <span
                      style={a.done ? { backgroundColor: accent.hex } : undefined}
                      className={`size-9 shrink-0 rounded-xl flex items-center justify-center ${
                          a.done
                              ? "text-white"
                              : "bg-zinc-200 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500"
                      }`}
                  >
                    <Icon size={16} />
                  </span>
                      <div className="min-w-0">
                        <p
                            className={`text-xs font-semibold truncate ${
                                a.done ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500"
                            }`}
                        >
                          {a.title}
                        </p>
                        <p className="text-[11px] text-zinc-500 truncate">{a.desc}</p>
                      </div>
                    </li>
                );
              })}
            </ul>
          </div>
        </section>

        <ProfileResourcesSection accent={accent} />

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

        <p className="flex items-center justify-center gap-2 text-center text-[11px] text-zinc-400 pt-2">
          <Sparkles size={13} className={`${accent.text} shrink-0`} />
          <span>
          {cloud
              ? "Tu perfil se guarda en tu cuenta. El historial se guarda en este dispositivo."
              : "Modo local: tus datos solo viven en este dispositivo. Inicia sesión para guardar tu perfil en tu cuenta."}
        </span>
        </p>

        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </div>
  );
}