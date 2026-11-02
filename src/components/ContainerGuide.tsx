import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Check,
  Ban,
  Sparkles,
  MapPin,
  FileText,
} from "lucide-react";
import { CAMPUS_CONTAINERS_CATALOG, CampusContainerSpec } from "../data/wasteData";
import { ContainerGlyph, containerTextOn } from "./container-ui";
import { triggerHaptic } from "../utils/haptics";
import { APPLE_SPRING_DEFAULT } from "../utils/springs";

interface ContainerGuideProps {
  open: boolean;
  onClose: () => void;
  initialBinId?: string | null;
}

/**
 * Guía interactiva del código oficial de botes del ITM.
 * Sustituye la parrilla larga al final de las páginas: se abre como capa contextual
 * desde el mapa o el escáner, sin alargar el scroll.
 */
export function ContainerGuide({ open, onClose, initialBinId }: ContainerGuideProps) {
  const [activeId, setActiveId] = useState<string>(initialBinId || "bin-azul");

  useEffect(() => {
    if (open) setActiveId(initialBinId || "bin-azul");
  }, [open, initialBinId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const active: CampusContainerSpec = useMemo(
    () =>
      CAMPUS_CONTAINERS_CATALOG.find((bin) => bin.id === activeId) ??
      CAMPUS_CONTAINERS_CATALOG[0],
    [activeId]
  );
  const activeInk = containerTextOn(active.colorHex);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="container-guide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-zinc-950/70 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Guía de contenedores del ITM"
        >
          <motion.div
            initial={{ y: 36, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 36, opacity: 0, scale: 0.985 }}
            transition={APPLE_SPRING_DEFAULT}
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-[93dvh] w-full flex-col overflow-hidden rounded-t-[2rem] border border-zinc-200 bg-white text-zinc-900 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 sm:max-w-3xl sm:max-h-[86dvh] sm:rounded-[2rem]"
          >
            {/* Cabecera */}
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-200/80 px-5 pb-3 pt-3 dark:border-zinc-800 sm:pt-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <FileText size={19} />
                </div>
                <div>
                  <h2 className="text-base font-extrabold leading-tight sm:text-lg">
                    Guía de contenedores ITM
                  </h2>
                  <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                    ITMORELIA-IT-AM-007 Rev. 3 · Separación en origen
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar guía de contenedores"
                className="flex size-10 shrink-0 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Selector de color */}
            <div className="shrink-0 border-b border-zinc-200/70 px-3 py-2.5 dark:border-zinc-800">
              <div className="relative">
                <div className="no-scrollbar flex gap-1.5 overflow-x-auto overscroll-x-contain pr-5">
                {CAMPUS_CONTAINERS_CATALOG.map((bin) => {
                  const isActive = bin.id === active.id;
                  return (
                    <button
                      key={bin.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic("selection");
                        setActiveId(bin.id);
                      }}
                      aria-pressed={isActive}
                      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-bold transition-all active:scale-[0.96] cursor-pointer ${
                        isActive
                          ? "border-transparent shadow-md"
                          : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      }`}
                      style={
                        isActive
                          ? { backgroundColor: bin.colorHex, color: containerTextOn(bin.colorHex) }
                          : undefined
                      }
                    >
                      <ContainerGlyph id={bin.id} size={14} />
                      <span>{bin.colorName}</span>
                    </button>
                  );
                  })}
                </div>
                <span className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent dark:from-zinc-900" />
              </div>
            </div>

            {/* Contenido */}
            <div
              data-lenis-prevent
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5"
            >
              <div
                className="flex items-start gap-3 rounded-2xl border p-3.5"
                style={{
                  borderColor: `${active.colorHex}55`,
                  backgroundColor: `${active.colorHex}12`,
                }}
              >
                <div
                  className="flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-sm"
                  style={{ backgroundColor: active.colorHex, color: activeInk }}
                >
                  <ContainerGlyph id={active.id} size={24} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                    Contenedor oficial
                  </p>
                  <h3 className="text-lg font-extrabold leading-tight">{active.name}</h3>
                  <p className="mt-0.5 text-xs leading-snug text-zinc-600 dark:text-zinc-300">
                    {active.shortDescription}
                  </p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <section className="rounded-2xl border border-emerald-200/70 bg-emerald-50/60 p-3 dark:border-emerald-900/60 dark:bg-emerald-950/30">
                  <h4 className="mb-2 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    <Check size={13} /> Sí va aquí
                  </h4>
                  <ul className="space-y-1.5">
                    {active.acceptedMaterials.map((material) => (
                      <li
                        key={material}
                        className="flex items-start gap-1.5 text-[11.5px] leading-snug text-zinc-700 dark:text-zinc-300"
                      >
                        <Check
                          size={12}
                          className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                        />
                        <span>{material}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-2xl border border-rose-200/70 bg-rose-50/60 p-3 dark:border-rose-900/60 dark:bg-rose-950/30">
                  <h4 className="mb-2 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-300">
                    <Ban size={13} /> Nunca aquí
                  </h4>
                  <ul className="space-y-1.5">
                    {active.rejectedMaterials.map((material) => (
                      <li
                        key={material}
                        className="flex items-start gap-1.5 text-[11.5px] leading-snug text-zinc-700 dark:text-zinc-300"
                      >
                        <Ban size={12} className="mt-0.5 shrink-0 text-rose-500 dark:text-rose-400" />
                        <span>{material}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3 dark:border-zinc-700/70 dark:bg-zinc-800/40">
                  <h4 className="mb-2 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
                    <Sparkles size={13} className="text-amber-500" /> Antes de depositarlo
                  </h4>
                  <ol className="space-y-1.5">
                    {active.preparationRules.slice(0, 5).map((rule, index) => (
                      <li
                        key={rule}
                        className="flex items-start gap-2 text-[11.5px] leading-snug text-zinc-700 dark:text-zinc-300"
                      >
                        <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[9px] font-black text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200">
                          {index + 1}
                        </span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ol>
                </section>

                <section className="flex flex-col gap-2.5 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3 dark:border-zinc-700/70 dark:bg-zinc-800/40">
                  <div>
                    <h4 className="mb-1 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
                      <MapPin size={13} className="text-sky-500" /> Destino en el campus
                    </h4>
                    <p className="text-[11.5px] leading-snug text-zinc-600 dark:text-zinc-300">
                      {active.campusDestination}
                    </p>
                  </div>
                  <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-2.5">
                    <p className="text-[11px] font-semibold leading-snug text-amber-900 dark:text-amber-200">
                      {active.handlingTip}
                    </p>
                  </div>
                </section>
              </div>

              <p className="mt-3 text-[10px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                {active.normativeReference}
              </p>
            </div>

            {/* Pie */}
            <div className="shrink-0 border-t border-zinc-200/80 bg-zinc-50/80 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] dark:border-zinc-800 dark:bg-zinc-900/80 sm:px-5">
              <button
                type="button"
                onClick={onClose}
                className="w-full min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-sm font-semibold text-white border border-emerald-700/20 shadow-xs active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
