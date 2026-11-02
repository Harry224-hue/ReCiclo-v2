import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Barcode,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CloudUpload,
  Recycle,
  Sparkles,
  X,
} from "lucide-react";
import { triggerHaptic } from "../../utils/haptics";

export const SCANNER_ONBOARDING_KEY = "reciclo_scanner_onboarding_v1";

interface ScannerOnboardingModalProps {
  open: boolean;
  onClose: (selectedMode?: "photo" | "barcode") => void;
}

interface SlideSpec {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  bullets: string[];
  accentHex: string;
  modeAction?: {
    mode: "photo" | "barcode";
    label: string;
  };
}

const SLIDES: SlideSpec[] = [
  {
    id: "photo-ai",
    badge: "Modo 1 · Visión Artificial Gratuita",
    title: "Tómale foto a cualquier residuo",
    subtitle:
      "Ideal para restos de comida, vasos de cafetería, papel, unicel o envases sin etiqueta. Analizado con Groq Vision y respaldo local MobileNet sin costo.",
    bullets: [
      "Identifica el material técnico exacto en segundos",
      "Funciona con residuos sueltos, orgánicos o sin empaque",
      "Respaldo local sin conexión integrado en tu navegador",
    ],
    accentHex: "#10b981",
    modeAction: {
      mode: "photo",
      label: "Usar modo Foto con IA",
    },
  },
  {
    id: "barcode-off",
    badge: "Modo 2 · Open Food Facts",
    title: "O escanea el código de barras",
    subtitle:
      "¿Tienes una botella de refresco, bolsa de botana, lata o cartón de leche? Cambia a la pestaña «Código de barras» para una identificación 100% exacta.",
    bullets: [
      "Reconoce marcas comerciales mexicanas al instante",
      "Consulta la base comunitaria abierta Open Food Facts",
      "También puedes escribir el código o elegir productos del campus",
    ],
    accentHex: "#0284c7",
    modeAction: {
      mode: "barcode",
      label: "Probar lector de Código de barras",
    },
  },
  {
    id: "bins-history",
    badge: "Norma ITMORELIA-IT-AM-007 · Historial",
    title: "Separa en el ITM y guarda tu historial",
    subtitle:
      "Cada escaneo te indica el bote oficial del campus (Verde, Azul, Amarillo, Negro o Naranja) y los pasos para prepararlo.",
    bullets: [
      "Si inicias sesión, tu historial se guarda y sincroniza en tu cuenta",
      "Sin sesión iniciada, tus registros se guardan solo en este dispositivo",
      "Ubica en el mapa interactivo el punto limpio más cercano",
    ],
    accentHex: "#f59e0b",
  },
];

export function ScannerOnboardingModal({ open, onClose }: ScannerOnboardingModalProps) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  const handleDismiss = (mode?: "photo" | "barcode") => {
    try {
      localStorage.setItem(SCANNER_ONBOARDING_KEY, "true");
    } catch {
      // Ignorar si el navegador restringe localStorage
    }
    triggerHaptic("light");
    onClose(mode);
  };

  const nextSlide = () => {
    triggerHaptic("selection");
    if (index < SLIDES.length - 1) {
      setIndex((i) => i + 1);
    } else {
      handleDismiss();
    }
  };

  const prevSlide = () => {
    triggerHaptic("selection");
    if (index > 0) setIndex((i) => i - 1);
  };

  const slide = SLIDES[index];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="scanner-onboarding-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="scanner-onboarding-title"
        >
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/15 bg-zinc-900 text-white shadow-2xl"
          >
            {/* Resplandor superior */}
            <div
              className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full opacity-30 blur-3xl transition-colors duration-500"
              style={{ backgroundColor: slide.accentHex }}
            />

            {/* Cabecera del modal */}
            <div className="relative flex items-center justify-between px-5 pt-5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-emerald-300">
                <Sparkles size={12} />
                Guía rápida del escáner
              </span>
              <button
                type="button"
                onClick={() => handleDismiss()}
                aria-label="Cerrar guía de bienvenida"
                title="Cerrar guía de bienvenida"
                className="app-btn-icon-glass"
              >
                <X size={16} />
              </button>
            </div>

            {/* Contenido del carrusel */}
            <div className="relative px-6 pt-4 pb-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.22 }}
                  className="space-y-4"
                >
                  {/* Ilustración visual de la diapositiva */}
                  <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-4">
                    {index === 0 && (
                      <div className="flex items-center gap-4">
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-white/15 border border-white/25 text-white shadow-lg">
                          <Camera size={32} />
                        </div>
                        <div className="text-left">
                          <span className="inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold text-white border border-white/20">
                            Groq Vision IA
                          </span>
                          <p className="mt-1 text-xs font-bold text-white">
                            Fotografía directa al residuo
                          </p>
                          <p className="text-[11px] text-zinc-400">
                            Orgánicos, unicel, papel, envases
                          </p>
                        </div>
                      </div>
                    )}

                    {index === 1 && (
                      <div className="flex items-center gap-4">
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-sky-500/20 border border-sky-400/40 text-sky-300 shadow-lg">
                          <Barcode size={32} />
                        </div>
                        <div className="text-left">
                          <span className="inline-block rounded-full bg-sky-500/20 px-2.5 py-0.5 text-[10px] font-bold text-sky-300 border border-sky-400/30">
                            EAN-13 / UPC
                          </span>
                          <p className="mt-1 text-xs font-bold text-white">
                            Lectura de código de barras
                          </p>
                          <p className="text-[11px] text-zinc-400">
                            Refrescos, botanas, lácteos, latas
                          </p>
                        </div>
                      </div>
                    )}

                    {index === 2 && (
                      <div className="flex flex-col items-center gap-2.5 text-center">
                        <div className="flex items-center gap-2">
                          {[
                            { name: "Verde", hex: "#16a34a" },
                            { name: "Azul", hex: "#2563eb" },
                            { name: "Amarillo", hex: "#eab308" },
                            { name: "Negro", hex: "#27272a" },
                            { name: "Pilas", hex: "#ea580c" },
                          ].map((b) => (
                            <span
                              key={b.name}
                              className="flex size-9 items-center justify-center rounded-xl border border-white/20 text-[9px] font-black text-white shadow"
                              style={{ backgroundColor: b.hex }}
                            >
                              {b.name[0]}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                          <CloudUpload size={14} />
                          <span>Sincronización en tu cuenta o guardado local</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      {slide.badge}
                    </p>
                    <h2
                      id="scanner-onboarding-title"
                      className="mt-1 text-xl font-extrabold tracking-tight text-white"
                    >
                      {slide.title}
                    </h2>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">
                      {slide.subtitle}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-1">
                    {slide.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-zinc-200"
                      >
                        <CheckCircle2
                          size={15}
                          className="mt-0.5 shrink-0 text-white"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {slide.modeAction && (
                    <button
                      type="button"
                      onClick={() => handleDismiss(slide.modeAction?.mode)}
                      className="min-h-[40px] w-full px-4 py-2 text-xs app-btn-glass"
                    >
                      <Recycle size={14} className="text-white" />
                      <span>{slide.modeAction.label} ahora</span>
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Controles de paginación del carrusel */}
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                <div className="flex items-center gap-1.5">
                  {SLIDES.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic("selection");
                        setIndex(idx);
                      }}
                      aria-label={`Ir a diapositiva ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === index
                          ? "w-6 bg-white"
                          : "w-2 bg-white/25 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={prevSlide}
                      className="min-h-[40px] px-3 text-xs app-btn-text !text-zinc-300 hover:!bg-white/10 hover:!text-white"
                    >
                      <ChevronLeft size={15} />
                      Anterior
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={nextSlide}
                    className="min-h-[40px] px-4 text-xs app-btn-primary"
                  >
                    <span>
                      {index < SLIDES.length - 1 ? "Siguiente" : "¡Entendido, escanear!"}
                    </span>
                    {index < SLIDES.length - 1 && <ChevronRight size={15} />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
