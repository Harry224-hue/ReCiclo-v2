import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Barcode,
  BookOpen,
  CheckCircle2,
  Clock,
  CloudCheck,
  ExternalLink,
  HardDrive,
  History,
  Leaf,
  MapPin,
  RefreshCw,
  Recycle,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { CATEGORY_INFO, CampusContainerSpec, WasteItem } from "../../data/wasteData";
import type { AIClassificationResult } from "../../services/aiClassifier";
import { useAuth } from "../../context/AuthContext";
import { WasteVisual } from "../WasteVisual";
import { ContainerGlyph, containerTextOn } from "../container-ui";
import { triggerHaptic } from "../../utils/haptics";
import { APPLE_SPRING_PILL } from "../../utils/springs";

type ResultTab = "preparar" | "impacto" | "ficha";

const TABS: { id: ResultTab; label: string }[] = [
  { id: "preparar", label: "Preparar" },
  { id: "impacto", label: "Impacto" },
  { id: "ficha", label: "Ficha" },
];

interface ScanResultPanelProps {
  waste: WasteItem;
  bin: CampusContainerSpec;
  aiResult: AIClassificationResult | null;
  preview?: string | null;
  onClose: () => void;
  onOpenGuide: (binId: string) => void;
  onRescan: () => void;
}

/**
 * Resultado del escaneo, terminado como una ficha de decisión:
 * la recomendación del bote siempre visible y el detalle secundario
 * en pestañas para no obligar a hacer scroll largo.
 */
export function ScanResultPanel({
  waste,
  bin,
  aiResult,
  preview,
  onClose,
  onOpenGuide,
  onRescan,
}: ScanResultPanelProps) {
  const [tab, setTab] = useState<ResultTab>("preparar");
  const { isLoggedIn } = useAuth();
  const reduceMotion = useReducedMotion();
  const binInk = containerTextOn(bin.colorHex);
  const confidence = aiResult ? Math.round(aiResult.confidence * 100) : null;
  const displayPreview = preview || aiResult?.productImageUrl || null;
  const engineLabel =
    aiResult?.engine === "groq"
      ? "Groq Visión IA"
      : aiResult?.engine === "barcode"
        ? "Open Food Facts · Código"
        : aiResult?.engine === "gemini"
          ? "Gemini Visión"
          : aiResult?.engine === "mobilenet"
            ? "MobileNet local"
            : "Resultado de muestra";

  return (
    <div className="flex h-full min-h-0 flex-col bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">
      {/* Cabecera: identificación + recomendación */}
      <div
        className="relative shrink-0 overflow-hidden border-b border-zinc-200/70 px-4 pb-2.5 pt-2.5 dark:border-zinc-800"
        style={{
          background: `linear-gradient(140deg, ${bin.colorHex}1f 0%, transparent 62%)`,
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar resultado"
          className="absolute right-2.5 top-2.5 z-10 flex size-11 items-center justify-center rounded-full bg-black/5 text-zinc-500 transition-colors hover:bg-black/10 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:bg-white/10 dark:text-zinc-300 dark:hover:bg-white/15 dark:hover:text-white"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-2.5 pr-10">
          <div
            className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-md ring-2 ring-white/60 dark:bg-zinc-800 dark:ring-white/10"
            style={{ boxShadow: `0 8px 24px ${bin.colorHex}33` }}
          >
            {displayPreview ? (
              <img src={displayPreview} alt={waste.name} className="h-full w-full object-cover" />
            ) : (
              <WasteVisual id={waste.id} size="lg" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`rounded-full px-2 py-0.5 text-[10.5px] font-black uppercase tracking-wider ${CATEGORY_INFO[waste.category].colorBadge}`}
              >
                {waste.categoryLabel}
              </span>
              {waste.brand && (
                <span className="max-w-[13rem] truncate rounded-full border border-zinc-200 bg-white/80 px-2 py-0.5 text-[10.5px] font-semibold text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300">
                  {waste.brand}
                </span>
              )}
              {confidence === null && (
                <span className="rounded-full border border-zinc-200 bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300">
                  Resultado de muestra
                </span>
              )}
            </div>
            <h2 className="mt-0.5 line-clamp-2 text-[16.5px] font-extrabold leading-tight tracking-tight">
              {waste.name}
            </h2>
            <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-zinc-600 dark:text-zinc-300">
              {waste.material}
            </p>
          </div>
        </div>

        {/* Confianza del modelo (solo cuando hay un resultado real) */}
        {confidence !== null && (
          <div className="mt-2 flex items-center gap-2">
            <span className="flex shrink-0 items-center gap-1 rounded-full border border-zinc-200 bg-white/85 px-2 py-1 text-[11px] font-bold text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300">
              {aiResult?.engine === "barcode" ? (
                <Barcode size={10} className="text-sky-500" />
              ) : aiResult?.engine === "groq" || aiResult?.engine === "gemini" ? (
                <Sparkles size={10} className="text-indigo-500" />
              ) : (
                <Leaf size={10} className="text-emerald-600 dark:text-emerald-400" />
              )}
              {engineLabel}
            </span>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-700/80">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidence ?? 100}%` }}
                transition={{ duration: reduceMotion ? 0.01 : 0.6, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: bin.colorHex }}
              />
            </div>
            <span className="shrink-0 text-[11px] font-black tabular-nums text-zinc-600 dark:text-zinc-300">
              {confidence !== null ? `${confidence}%` : "muestra"}
            </span>
          </div>
        )}

        {/* Recomendación principal */}
        <div
          className="mt-2 flex items-center gap-2 rounded-xl border p-2"
          style={{ borderColor: `${bin.colorHex}55`, backgroundColor: `${bin.colorHex}12` }}
        >
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-lg shadow-sm"
            style={{ backgroundColor: bin.colorHex, color: binInk }}
          >
            <ContainerGlyph id={bin.id} size={21} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10.5px] font-black uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
              Deposita en
            </p>
            <p className="truncate text-[13.5px] font-extrabold leading-tight">
              {bin.name.split("—")[0].trim()} · {bin.name.split("—")[1]?.trim() ?? bin.colorName}
            </p>
          </div>
          <CheckCircle2 size={19} className="shrink-0" style={{ color: bin.colorHex }} />
        </div>

        {/* Estado de guardado en historial (Cuenta vs Dispositivo local) */}
        <div className="mt-2">
          {isLoggedIn ? (
            <div className="flex items-center justify-between gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1.5 text-[10.5px] font-semibold text-emerald-800 dark:text-emerald-300">
              <span className="flex items-center gap-1.5">
                <CloudCheck size={13} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Guardado en el historial de tu cuenta</span>
              </span>
              <Link to="/historial" className="underline hover:opacity-80 shrink-0">
                Ver historial
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-[10.5px] font-medium text-amber-900 dark:text-amber-200">
              <span className="flex items-center gap-1.5">
                <HardDrive size={13} className="shrink-0 text-amber-600 dark:text-amber-400" />
                <span>El historial solo se guarda en este dispositivo sin sesión</span>
              </span>
              <Link
                to="/login"
                className="font-bold text-amber-800 underline hover:opacity-80 dark:text-amber-300 shrink-0"
              >
                Iniciar sesión
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Pestañas */}
      <div className="shrink-0 px-4 pt-2.5">
        <div className="relative grid grid-cols-3 gap-1 rounded-full bg-zinc-100 p-1 dark:bg-zinc-800/90 border border-black/5 dark:border-white/10">
          {TABS.map((item) => {
            const isActive = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  triggerHaptic("selection");
                  setTab(item.id);
                }}
                aria-pressed={isActive}
                className={`relative min-h-[38px] rounded-full py-1.5 text-[12px] font-semibold transition-all active:scale-[0.97] cursor-pointer ${
                  isActive
                    ? "text-zinc-950 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="scanResultTabPill"
                    transition={reduceMotion ? { duration: 0.01 } : APPLE_SPRING_PILL}
                    className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-zinc-950 border border-black/5 dark:border-white/10"
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido */}
      <div
        data-lenis-prevent
        className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-3"
      >
        {tab === "preparar" && (
          <div className="space-y-3">
            <section>
              <h3 className="mb-2 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                <Sparkles size={12} className="text-zinc-700 dark:text-zinc-300" />
                Antes de depositarlo
              </h3>
              <ol className="space-y-2">
                {waste.handlingInstructions.slice(0, 5).map((instruction, index) => (
                  <li
                    key={instruction}
                    className="flex items-start gap-2.5 rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-800/40"
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-black text-white dark:bg-white dark:text-zinc-950">
                      {index + 1}
                    </span>
                    <span className="text-[12.5px] leading-relaxed text-zinc-700 dark:text-zinc-300">
                      {instruction}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-2.5">
              <p className="text-[10.5px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Consejo del campus
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-amber-900/90 dark:text-amber-200/90">
                {bin.handlingTip}
              </p>
            </div>

            {aiResult?.geminiTip && (
              <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/10 p-2.5">
                <p className="flex items-center gap-1 text-[10.5px] font-black uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
                  {aiResult.engine === "barcode" ? <Barcode size={11} /> : <Sparkles size={11} />}
                  {aiResult.engine === "barcode"
                    ? "Dato de Open Food Facts"
                    : aiResult.engine === "groq"
                      ? "Lo que detectó Groq Visión"
                      : "Nota de identificación"}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-indigo-900/90 dark:text-indigo-200/90">
                  {aiResult.geminiTip}
                </p>
              </div>
            )}
          </div>
        )}

        {tab === "impacto" && (
          <div className="space-y-2.5">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 dark:border-zinc-700/80 dark:bg-zinc-800/40">
              <div className="flex items-center gap-1.5 text-[10.5px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <Clock size={12} className="text-amber-500" />
                Tiempo de degradación
              </div>
              <p className="mt-1 text-[16px] font-extrabold leading-tight">
                {waste.degradationTime.estimate}
              </p>
              <p className="mt-0.5 text-[10.5px] leading-snug text-zinc-500 dark:text-zinc-400">
                {waste.degradationTime.conditionsNote}
              </p>
            </div>

            <div className="space-y-1.5">
              {(
                [
                  { key: "reducir", label: "Reducir", icon: Leaf, tone: "text-emerald-600 dark:text-emerald-400" },
                  { key: "reutilizar", label: "Reutilizar", icon: Recycle, tone: "text-sky-600 dark:text-sky-400" },
                  { key: "reciclar", label: "Reciclar", icon: RefreshCw, tone: "text-amber-600 dark:text-amber-400" },
                ] as const
              ).map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.key}
                    className="flex items-start gap-2.5 rounded-xl border border-zinc-200 bg-white p-2.5 dark:border-zinc-800 dark:bg-zinc-900/50"
                  >
                    <Icon size={15} className={`mt-0.5 shrink-0 ${item.tone}`} />
                    <div className="min-w-0">
                      <p className="text-[10.5px] font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-snug text-zinc-600 dark:text-zinc-400">
                        {waste.recommendations3R[item.key]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/60 p-3 dark:border-emerald-900/60 dark:bg-emerald-950/30">
              <p className="text-[10.5px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Impacto ambiental
              </p>
              <p className="mt-1 text-[11px] leading-snug text-emerald-950/90 dark:text-emerald-100/90">
                {waste.environmentalImpact.description}
              </p>
              <p className="mt-1 text-[10.5px] italic text-emerald-800/80 dark:text-emerald-200/60">
                Fuente: {waste.environmentalImpact.source}
              </p>
            </div>
          </div>
        )}

        {tab === "ficha" && (
          <div className="space-y-2.5">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 dark:border-zinc-700/80 dark:bg-zinc-800/40">
              <p className="text-[10.5px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                ¿Por qué en este contenedor?
              </p>
              <p className="mt-1 text-[11px] leading-snug text-zinc-700 dark:text-zinc-300">
                {waste.categoryReason}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-zinc-200 bg-white p-2.5 dark:border-zinc-800 dark:bg-zinc-900/50">
                <p className="text-[10.5px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Categoría
                </p>
                <p className="mt-0.5 text-[11px] font-bold">{CATEGORY_INFO[waste.category].name}</p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-2.5 dark:border-zinc-800 dark:bg-zinc-900/50">
                <p className="text-[10.5px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Material
                </p>
                <p className="mt-0.5 line-clamp-2 text-[11px] font-bold">{waste.material}</p>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/50 p-3 dark:border-emerald-900/60 dark:bg-emerald-950/25">
              <p className="flex items-center gap-1.5 text-[10.5px] font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                <ShieldCheck size={12} /> Marco institucional
              </p>
              <p className="mt-1 text-[10.5px] leading-snug text-emerald-950/80 dark:text-emerald-100/80">
                ITMORELIA-IT-AM-007 Rev. 3 · Gestión integral de residuos sólidos urbanos del ITM.
              </p>
              <p className="mt-1 text-[10.5px] text-emerald-800/80 dark:text-emerald-200/60">
                {CATEGORY_INFO[waste.category].normativeBasis}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {["NMX-AA-015", "NMX-AA-019", "NMX-AA-22", "NMX-AA-61", "ISO 14001"].map((norm) => (
                  <span
                    key={norm}
                    className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300"
                  >
                    {norm}
                  </span>
                ))}
              </div>
            </div>

            <Link
              to="/historial"
              className="flex min-h-[40px] items-center justify-between px-4 py-2 text-[11px] app-btn-secondary"
            >
              <span className="flex items-center gap-1.5">
                <History size={13} className="text-zinc-600 dark:text-zinc-300" />
                Ver este escaneo en el historial
              </span>
              <ExternalLink size={12} className="text-zinc-400" />
            </Link>

            <p className="text-center text-[9.5px] text-zinc-400 dark:text-zinc-500">
              Registro local + sincronización con tu perfil si iniciaste sesión.
            </p>
          </div>
        )}
      </div>

      {/* Acciones fijas */}
      <div className="shrink-0 border-t border-zinc-200/80 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] dark:border-zinc-800 dark:bg-zinc-900/95">
        <div className="flex gap-2">
          <Link
            to={`/mapa?bin=${bin.id}`}
            onClick={() => triggerHaptic("light")}
            className="min-h-[44px] flex-1 px-4 text-xs sm:text-sm app-btn-primary"
          >
            <MapPin size={14} />
            Ver botes en el mapa
          </Link>
          <button
            type="button"
            onClick={() => {
              triggerHaptic("selection");
              onOpenGuide(bin.id);
            }}
            aria-label="Abrir guía de contenedores"
            title="Guía de contenedores"
            className="min-h-[44px] w-11 app-btn-secondary"
          >
            <BookOpen size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              onRescan();
            }}
            aria-label="Escanear otro residuo"
            title="Escanear otro"
            className="min-h-[44px] w-11 app-btn-secondary"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
