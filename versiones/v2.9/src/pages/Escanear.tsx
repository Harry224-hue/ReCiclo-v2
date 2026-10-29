import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Camera as CameraIcon,
  ChevronDown,
  Cpu,
  FlaskConical,
  History,
  ImagePlus,
  Loader2,
  RefreshCw,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import {
  WASTE_DATABASE,
  WasteItem,
  CAMPUS_CONTAINERS_CATALOG,
} from "../data/wasteData";
import { addScanToHistory } from "../data/historyStorage";
import { WasteVisual } from "../components/WasteVisual";
import { useAuth } from "../context/AuthContext";
import type { AIClassificationResult } from "../services/aiClassifier";
import { classifyWithGemini } from "../services/geminiClassifier";
import { addScan, getUserProgress, updateUserProgress } from "../firebase";
import { ContainerGuide } from "../components/ContainerGuide";
import { ScanResultPanel } from "../components/scanner/ScanResultPanel";

function getMatchingBin(w: WasteItem) {
  const direct = CAMPUS_CONTAINERS_CATALOG.find(
    (b) =>
      b.name === w.recommendedBin?.label ||
      w.recommendedBin?.label?.toLowerCase().includes(b.colorName.toLowerCase()) ||
      w.recommendedBin?.color?.toLowerCase().includes(b.colorName.toLowerCase())
  );
  if (direct) return direct;

  return (
    CAMPUS_CONTAINERS_CATALOG.find((b) => {
      if (w.category === "manejo_especial") return b.id === "bin-pilas";
      if (
        w.category === "organicos" ||
        w.material.toLowerCase().includes("orgánico") ||
        w.material.toLowerCase().includes("alimento") ||
        w.material.toLowerCase().includes("madera")
      ) {
        return b.id === "bin-verde";
      }
      if (
        w.id.includes("lata") ||
        w.id.includes("aluminio") ||
        w.id.includes("papel") ||
        w.id.includes("carton") ||
        w.id.includes("cuaderno") ||
        w.id.includes("libreta") ||
        w.id.includes("vidrio") ||
        w.id.includes("tetra") ||
        w.material.toLowerCase().includes("aluminio") ||
        w.material.toLowerCase().includes("metal") ||
        w.material.toLowerCase().includes("papel") ||
        w.material.toLowerCase().includes("cartón") ||
        w.material.toLowerCase().includes("vidrio") ||
        w.category === "reciclables"
      ) {
        return b.id === "bin-amarillo";
      }
      if (
        w.id.includes("pet") ||
        w.id.includes("plastico") ||
        w.id.includes("botella") ||
        w.material.toLowerCase().includes("pet") ||
        w.material.toLowerCase().includes("plástico") ||
        w.material.toLowerCase().includes("polietileno") ||
        w.material.toLowerCase().includes("hule")
      ) {
        return b.id === "bin-azul";
      }
      return b.id === "bin-negro";
    }) || CAMPUS_CONTAINERS_CATALOG[2]
  );
}

const SCAN_STEPS = [
  "Analizando la imagen…",
  "Comparando con el catálogo ITM…",
  "Eligiendo el contenedor oficial…",
];

const SAMPLE_ITEMS = WASTE_DATABASE.slice(0, 12);

export default function Escanear() {
  const [selectedWaste, setSelectedWaste] = useState<WasteItem | null>(null);
  const [aiResult, setAiResult] = useState<AIClassificationResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [showSamples, setShowSamples] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideBinId, setGuideBinId] = useState<string | null>(null);
  const { user } = useAuth();
  const reduceMotion = useReducedMotion();

  const mountedRef = useRef(true);
  const cameraRequestRef = useRef(0);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);
  const resultDragControls = useDragControls();

  useEffect(() => {
    if (!isScanning) {
      setScanStep(0);
      return;
    }
    const interval = window.setInterval(
      () => setScanStep((step) => (step + 1) % SCAN_STEPS.length),
      1150
    );
    return () => window.clearInterval(interval);
  }, [isScanning]);

  const stopCamera = () => {
    // Invalida cualquier getUserMedia pendiente para que no "reviva" la cámara.
    cameraRequestRef.current += 1;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const startLiveCamera = async (targetFacing: "environment" | "user" = facingMode) => {
    setCameraError(null);
    setIsCameraStarting(true);
    stopCamera();
    const requestId = cameraRequestRef.current;

    const watchdog = window.setTimeout(() => {
      if (!mountedRef.current || requestId !== cameraRequestRef.current) return;
      setIsCameraStarting(false);
      setCameraError(
        "La cámara está tardando en responder. Puedes tomar una foto o subir una imagen."
      );
    }, 7000);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      window.clearTimeout(watchdog);
      setIsCameraStarting(false);
      setCameraError(
        "Tu navegador no permite cámara en vivo (se requiere HTTPS). Usa «Tomar foto» para abrir la cámara del teléfono."
      );
      return;
    }

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: targetFacing },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: targetFacing },
            audio: false,
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }
      }

      if (!mountedRef.current || requestId !== cameraRequestRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        video.muted = true;
        video.playsInline = true;
        video.setAttribute("playsinline", "true");
        video.setAttribute("webkit-playsinline", "true");
        await new Promise<void>((resolve) => {
          video.onloadedmetadata = () => {
            video.play().then(resolve).catch(resolve);
          };
          video.play().then(resolve).catch(resolve);
          window.setTimeout(resolve, 800);
        });
      }
      if (!mountedRef.current || requestId !== cameraRequestRef.current) return;
      setCameraActive(true);
    } catch (err: unknown) {
      console.warn("[ReCiclo Cámara]", err);
      const errName = (err as { name?: string } | null | undefined)?.name;
      let message = "No se pudo acceder a la cámara en vivo.";
      if (errName === "NotAllowedError" || errName === "PermissionDeniedError") {
        message = "Permiso de cámara denegado. Actívalo en el candado del navegador o usa «Tomar foto».";
      } else if (errName === "NotReadableError" || errName === "TrackStartError") {
        message = "La cámara está ocupada por otra app. Ciérrala e inténtalo de nuevo.";
      }
      setCameraError(message);
      setCameraActive(false);
    } finally {
      window.clearTimeout(watchdog);
      if (requestId === cameraRequestRef.current) setIsCameraStarting(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    startLiveCamera("environment");
    return () => {
      mountedRef.current = false;
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedWaste) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") resetScan();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWaste]);

  const toggleCameraFacing = async () => {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    await startLiveCamera(next);
  };

  const saveScanRecord = async (waste: WasteItem, confidence = 0.9) => {
    addScanToHistory({
      wasteId: waste.id,
      wasteName: waste.name,
      material: waste.material,
      category: waste.category,
      categoryLabel: waste.categoryLabel,
      recommendedBin: waste.recommendedBin.label,
    });

    if (user?.uid) {
      try {
        await addScan({
          userId: user.uid,
          fecha: new Date(),
          nombreDetectado: waste.name,
          categoria: waste.category,
          material: waste.material,
          contenedor: waste.recommendedBin.label,
          confianza: Math.round(confidence * 100),
          imagenUrl: "",
        });

        const currentProg = await getUserProgress(user.uid);
        if (currentProg) {
          const isRecyclable = waste.category === "reciclables";
          await updateUserProgress(user.uid, {
            totalEscaneos: (currentProg.totalEscaneos || 0) + 1,
            residuosReciclables: (currentProg.residuosReciclables || 0) + (isRecyclable ? 1 : 0),
            residuosNoReciclables:
              (currentProg.residuosNoReciclables || 0) + (!isRecyclable ? 1 : 0),
            experiencia: (currentProg.experiencia || 0) + 10,
            nivel: Math.floor(((currentProg.experiencia || 0) + 10) / 100) + 1,
          });
        }
      } catch (err) {
        console.warn("[Firebase] Registro local preservado:", err);
      }
    }
  };

  const showResult = (waste: WasteItem) => {
    setSelectedWaste(waste);
    setShowSamples(false);
  };

  const processImageSrc = (dataUrl: string) => {
    stopCamera();
    setUploadedPreview(dataUrl);
    setIsScanning(true);
    setSelectedWaste(null);
    setAiResult(null);

    const img = new Image();
    img.onload = async () => {
      try {
        let result: AIClassificationResult;
        try {
          result = await classifyWithGemini(img);
        } catch (geminiErr) {
          console.warn("[Gemini] No disponible, usando MobileNet local:", geminiErr);
          const { classifyWasteImage } = await import("../services/aiClassifier");
          result = { ...(await classifyWasteImage(img)), engine: "mobilenet" };
        }
        setAiResult(result);
        showResult(result.wasteItem);
        saveScanRecord(result.wasteItem, result.confidence);
      } catch (error) {
        console.error("[ReCiclo AI] Error en clasificación:", error);
        const fallback = WASTE_DATABASE[0];
        showResult(fallback);
        saveScanRecord(fallback);
      } finally {
        setIsScanning(false);
      }
    };
    img.src = dataUrl;
  };

  const handleNativeCamera = () => {
    setCameraError(null);
    nativeCameraInputRef.current?.click();
  };

  const handleCaptureFromLiveView = () => {
    const video = videoRef.current;
    if (!video) return;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (facingMode === "user") {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, width, height);
    processImageSrc(canvas.toDataURL("image/jpeg", 0.92));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      if (dataUrl) processImageSrc(dataUrl);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const analyzeItemDirect = (waste: WasteItem) => {
    stopCamera();
    setUploadedPreview(null);
    setIsScanning(true);
    setSelectedWaste(null);
    setAiResult(null);
    setShowSamples(false);
    window.setTimeout(() => {
      setIsScanning(false);
      showResult(waste);
      saveScanRecord(waste);
    }, 420);
  };

  const resetScan = () => {
    setSelectedWaste(null);
    setAiResult(null);
    setUploadedPreview(null);
    setShowSamples(false);
    startLiveCamera(facingMode);
  };

  const openGuide = (binId?: string | null) => {
    setGuideBinId(binId ?? null);
    setGuideOpen(true);
  };

  const activeBin = selectedWaste ? getMatchingBin(selectedWaste) : null;
  const hasResult = Boolean(selectedWaste && activeBin);

  return (
    <div className="scanner-page relative h-[100dvh] w-full overflow-hidden bg-zinc-950 text-white lg:flex lg:flex-col lg:bg-zinc-50 lg:px-6 lg:pb-6 lg:pt-[7rem] lg:text-zinc-900 lg:dark:bg-zinc-950 lg:dark:text-zinc-50">
      <h1 className="sr-only lg:hidden">Escáner de residuos</h1>

      {/* ── Encabezado de escritorio ── */}
      <header className="hidden shrink-0 items-end justify-between gap-4 pb-4 lg:flex">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/60 bg-emerald-50 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Cpu size={12} />
            Visión artificial · MobileNet v2 + Gemini
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 xl:text-4xl">
            Escáner de residuos
          </h1>
          <p className="mt-0.5 max-w-xl text-[12.5px] leading-snug text-zinc-500 dark:text-zinc-400">
            Apunta al residuo, captura y obtén el contenedor oficial del ITM con los pasos para
            prepararlo antes de depositarlo.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => openGuide()}
            className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 text-[12px] font-bold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <BookOpen size={15} className="text-emerald-600 dark:text-emerald-400" />
            Guía de contenedores
          </button>
          <Link
            to="/historial"
            className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 text-[12px] font-bold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <History size={15} className="text-sky-600 dark:text-sky-400" />
            Historial
          </Link>
        </div>
      </header>

      <div className="scanner-main absolute inset-0 lg:static lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        {/* ── Escenario de cámara ── */}
        <div className="relative h-full min-h-0 overflow-hidden bg-zinc-950 lg:rounded-[2rem] lg:border lg:border-black/10 lg:shadow-2xl lg:dark:border-white/10">
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              cameraActive ? "opacity-100" : "opacity-0"
            }`}
          />

          {uploadedPreview && !cameraActive && (
            <img
              src={uploadedPreview}
              alt="Residuo capturado"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* Textura de rejilla + degradados */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.10]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "54px 54px",
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/65 via-black/20 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Visual de la muestra analizada (cuando no hay foto real) */}
          {selectedWaste && activeBin && !uploadedPreview && !cameraActive && !isScanning && (
            <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center px-8">
              <div
                className="absolute size-[22rem] rounded-full opacity-40 blur-3xl"
                style={{ backgroundColor: activeBin.colorHex }}
              />
              <div className="relative flex max-w-[19rem] flex-col items-center gap-3 rounded-[2.25rem] border border-white/10 bg-white/[0.05] p-7 text-center backdrop-blur-md">
                <WasteVisual
                  id={selectedWaste.id}
                  size="xl"
                  className="!size-36 shadow-2xl"
                />
                <div>
                  <p className="text-[9.5px] font-black uppercase tracking-[0.18em] text-white/50">
                    Muestra analizada
                  </p>
                  <p className="mt-1 text-lg font-extrabold leading-tight text-white">
                    {selectedWaste.name}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* HUD superior */}
          <div className="absolute inset-x-3 top-[calc(env(safe-area-inset-top,0px)+5rem)] z-40 flex items-start justify-between gap-2 md:inset-x-5 md:top-[6.25rem] lg:inset-x-4 lg:top-4">
            <span className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/55 px-3 py-2 text-[10.5px] font-bold text-white shadow-lg backdrop-blur-md">
              <Cpu size={12} className="text-emerald-400" />
              {cameraActive ? (
                <>
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  Cámara en vivo
                </>
              ) : (
                "Escáner IA"
              )}
              <span className="hidden text-white/50 sm:inline">· MobileNet v2</span>
            </span>

            <div className="pointer-events-auto flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => openGuide()}
                aria-label="Abrir guía de contenedores"
                title="Guía de contenedores"
                className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white backdrop-blur-md transition-transform active:scale-90"
              >
                <BookOpen size={17} />
              </button>
              {cameraActive && (
                <button
                  type="button"
                  onClick={toggleCameraFacing}
                  aria-label="Cambiar cámara"
                  title="Cambiar cámara"
                  className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white backdrop-blur-md transition-transform active:scale-90"
                >
                  <RefreshCw size={17} />
                </button>
              )}
            </div>
          </div>

          {/* Retícula de captura */}
          {cameraActive && !hasResult && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <div className="relative aspect-square w-[60vw] max-w-[260px] sm:max-w-[300px]">
                <span className="absolute left-0 top-0 size-8 rounded-tl-2xl border-l-[3px] border-t-[3px] border-emerald-400" />
                <span className="absolute right-0 top-0 size-8 rounded-tr-2xl border-r-[3px] border-t-[3px] border-emerald-400" />
                <span className="absolute bottom-0 left-0 size-8 rounded-bl-2xl border-b-[3px] border-l-[3px] border-emerald-400" />
                <span className="absolute bottom-0 right-0 size-8 rounded-br-2xl border-b-[3px] border-r-[3px] border-emerald-400" />
                <span className="scan-sweep absolute inset-x-4 h-px bg-emerald-400/80 shadow-[0_0_14px_2px_rgba(52,211,153,0.6)]" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[10px] font-semibold text-white/85 backdrop-blur-sm">
                    Centra el residuo
                  </span>
                </span>
              </div>
            </div>
          )}

          {/* Estado sin cámara */}
          {!cameraActive && !uploadedPreview && !hasResult && !isScanning && !showSamples && (
            <div
              data-lenis-prevent
              className="absolute inset-0 z-20 overflow-y-auto overscroll-contain px-5 pb-[calc(env(safe-area-inset-bottom,0px)+9rem)] pt-[calc(env(safe-area-inset-top,0px)+7rem)] md:pt-32 lg:px-8 lg:pb-36 lg:pt-24"
            >
              <div className="mx-auto flex min-h-full w-full max-w-sm flex-col items-center justify-center">
              {isCameraStarting ? (
                <div className="flex flex-col items-center text-center">
                  <Loader2 className="size-9 animate-spin text-emerald-400" />
                  <p className="mt-3 text-sm font-bold">Iniciando cámara…</p>
                  <p className="mt-1 text-[11px] text-white/60">Puede tardar un momento</p>
                </div>
              ) : (
                <div className="w-full max-w-sm rounded-[1.75rem] border border-white/15 bg-black/45 p-5 text-center shadow-2xl backdrop-blur-xl">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-white/15 bg-white/10">
                    <CameraIcon className="size-8 stroke-[1.5]" />
                  </div>
                  <h2 className="mt-3 text-lg font-extrabold">Apunta al residuo</h2>
                  <p className="mx-auto mt-1 max-w-[16rem] text-[11.5px] leading-snug text-white/70">
                    Activa la cámara o sube una foto y la IA te dirá en qué bote del ITM va.
                  </p>

                  {cameraError && (
                    <p className="mt-3 rounded-xl border border-amber-400/30 bg-amber-500/20 px-3 py-2 text-left text-[10.5px] leading-snug text-amber-100">
                      {cameraError}
                    </p>
                  )}

                  <div className="mt-4 space-y-2">
                    <button
                      type="button"
                      onClick={() => startLiveCamera(facingMode)}
                      className="flex min-h-[46px] w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-4 text-[12.5px] font-bold text-white transition-colors hover:bg-emerald-600 active:scale-[0.98]"
                    >
                      <CameraIcon size={15} />
                      Activar cámara
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={handleNativeCamera}
                        className="flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-2 text-[11px] font-semibold text-white transition-colors hover:bg-white/20"
                      >
                        <UploadCloud size={14} />
                        Tomar foto
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-2 text-[11px] font-semibold text-white transition-colors hover:bg-white/20"
                      >
                        <ImagePlus size={14} />
                        Subir imagen
                      </button>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>
          )}

          {/* Animación de análisis */}
          {isScanning && (
            <div className="absolute inset-0 z-[59] flex flex-col items-center justify-center bg-zinc-950/75 backdrop-blur-sm">
              <div className="relative flex size-24 items-center justify-center">
                <span className="absolute inset-0 rounded-full border border-emerald-400/25" />
                <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-emerald-400" />
                <Sparkles className="size-8 text-emerald-400" />
              </div>
              <p className="mt-4 text-sm font-bold">Identificando el residuo…</p>
              <p className="mt-1 text-[11px] text-zinc-400">{SCAN_STEPS[scanStep]}</p>
              <div className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full w-1/2 rounded-full bg-emerald-400"
                  initial={{ x: reduceMotion ? "0%" : "-100%" }}
                  animate={{ x: reduceMotion ? "0%" : "200%" }}
                  transition={reduceMotion ? { duration: 0.01 } : { repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                />
              </div>
            </div>
          )}

          {/* Muestras */}
          <AnimatePresence>
            {showSamples && !hasResult && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: reduceMotion ? 0.01 : 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="absolute inset-x-3 bottom-[calc(env(safe-area-inset-bottom,0px)+12.5rem)] z-[58] md:inset-x-6 md:bottom-28 lg:inset-x-4 lg:bottom-32"
              >
                <div className="rounded-2xl border border-white/15 bg-black/70 p-2.5 shadow-2xl backdrop-blur-xl">
                  <div className="mb-2 flex items-center justify-between px-0.5">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/70">
                      Muestras de prueba
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowSamples(false)}
                      aria-label="Cerrar muestras"
                      className="flex size-7 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
                    >
                      <X size={13} />
                    </button>
                  </div>
                  <div className="no-scrollbar flex gap-2 overflow-x-auto overscroll-x-contain pb-1">
                    {SAMPLE_ITEMS.map((waste) => (
                      <button
                        key={waste.id}
                        type="button"
                        onClick={() => analyzeItemDirect(waste)}
                        className="flex w-[82px] shrink-0 flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/10 p-1.5 text-center transition-all hover:bg-white/20 active:scale-95"
                      >
                        <WasteVisual id={waste.id} size="sm" />
                        <span className="line-clamp-2 text-[9.5px] font-semibold leading-tight text-white">
                          {waste.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controles de captura */}
          {!hasResult && (
            <div className="absolute inset-x-4 bottom-[calc(env(safe-area-inset-bottom,0px)+5.5rem)] z-[58] flex items-end justify-between md:bottom-6 md:inset-x-8 lg:inset-x-8 lg:bottom-6">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-16 flex-col items-center gap-1 text-[10px] font-semibold text-white active:scale-90"
              >
                <span className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/55 backdrop-blur-md">
                  <ImagePlus size={18} />
                </span>
                Galería
              </button>

              <div className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  onClick={cameraActive ? handleCaptureFromLiveView : handleNativeCamera}
                  disabled={isScanning}
                  className="relative flex size-[74px] items-center justify-center rounded-full border-4 border-white p-1 transition-transform active:scale-90 disabled:opacity-50"
                  aria-label="Capturar y clasificar residuo"
                >
                  <span className="block h-full w-full rounded-full bg-white" />
                  {!cameraActive && (
                    <CameraIcon className="absolute size-6 text-zinc-900" strokeWidth={2.2} />
                  )}
                </button>
                <span className="text-[9.5px] font-semibold text-white/70">
                  {cameraActive ? "Capturar" : "Tomar foto"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowSamples((value) => !value)}
                aria-pressed={showSamples}
                className="flex w-16 flex-col items-center gap-1 text-[10px] font-semibold text-white active:scale-90"
              >
                <span
                  className={`flex size-11 items-center justify-center rounded-full border backdrop-blur-md ${
                    showSamples
                      ? "border-emerald-300 bg-emerald-500"
                      : "border-white/20 bg-black/55"
                  }`}
                >
                  <FlaskConical size={18} />
                </span>
                Muestras
              </button>
            </div>
          )}

          {/* Inputs ocultos */}
          <input
            ref={nativeCameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileUpload}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* ── Panel lateral de escritorio ── */}
        <aside className="scanner-aside hidden min-h-0 flex-col overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900 lg:flex">
          {selectedWaste && activeBin ? (
            <ScanResultPanel
              waste={selectedWaste}
              bin={activeBin}
              aiResult={aiResult}
              preview={uploadedPreview}
              onClose={resetScan}
              onOpenGuide={openGuide}
              onRescan={resetScan}
            />
          ) : (
            <div
              data-lenis-prevent
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5"
            >
              <div className="flex items-center gap-2">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <ScanLine size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">
                    Esperando residuo
                  </p>
                  <h2 className="text-[17px] font-extrabold leading-tight">
                    Tu ficha aparecerá aquí
                  </h2>
                </div>
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                Captura una foto o elige una muestra. Verás el bote oficial, cómo preparar el
                residuo y su ficha ambiental, sin salir del escáner.
              </p>

              <div className="mt-4 space-y-1.5">
                {[
                  { n: "1", t: "Captura", d: "Enfoca un solo residuo con buena luz." },
                  { n: "2", t: "Identifica", d: "Gemini Visión con respaldo MobileNet." },
                  { n: "3", t: "Deposita", d: "Sigue la ruta al bote correcto en el mapa." },
                ].map((step) => (
                  <div
                    key={step.n}
                    className="flex items-start gap-2.5 rounded-xl border border-zinc-200 bg-zinc-50/70 p-2.5 dark:border-zinc-800 dark:bg-zinc-800/40"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-[10px] font-black text-white">
                      {step.n}
                    </span>
                    <div>
                      <p className="text-[11.5px] font-bold leading-tight">{step.t}</p>
                      <p className="mt-0.5 text-[10.5px] leading-snug text-zinc-500 dark:text-zinc-400">
                        {step.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                  Prueba con una muestra
                </h3>
                <span className="text-[10px] text-zinc-400">{SAMPLE_ITEMS.length} disponibles</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {SAMPLE_ITEMS.slice(0, 6).map((waste) => (
                  <button
                    key={waste.id}
                    type="button"
                    onClick={() => analyzeItemDirect(waste)}
                    className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-2 text-left transition-colors hover:border-emerald-300 hover:bg-emerald-50/40 dark:border-zinc-800 dark:bg-zinc-950/40 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20"
                  >
                    <WasteVisual id={waste.id} size="sm" />
                    <span className="line-clamp-2 text-[10.5px] font-semibold leading-tight">
                      {waste.name}
                    </span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => openGuide()}
                className="mt-4 flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/70 px-3 py-2.5 text-left transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/40 dark:hover:bg-zinc-800"
              >
                <span className="flex items-center gap-2">
                  <Trash2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[11px] font-bold">Guía completa de contenedores ITM</span>
                </span>
                <BookOpen size={13} className="text-zinc-400" />
              </button>

              <div className="mt-3 flex items-center gap-1.5 text-[10px] text-zinc-400 dark:text-zinc-500">
                <ShieldCheck size={12} className="text-emerald-500" />
                Norma ITMORELIA-IT-AM-007 Rev. 3 · ITM
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ── Resultado móvil: hoja completa, no una tarjeta al fondo de la página ── */}
      <AnimatePresence>
        {selectedWaste && activeBin && (
          <motion.div
            key="scan-result-sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[85] lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={resetScan}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={reduceMotion ? { duration: 0.01 } : { type: "spring", damping: 30, stiffness: 300 }}
              drag="y"
              dragControls={resultDragControls}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.65 }}
              dragMomentum={false}
              dragSnapToOrigin
              onDragEnd={(_, info) => {
                if (info.offset.y > 96 || info.velocity.y > 520) resetScan();
              }}
              className="absolute inset-x-0 bottom-0 h-[calc(100dvh-5rem)] overflow-hidden rounded-t-[2rem] border-t border-white/10 bg-white shadow-[0_-20px_60px_rgba(0,0,0,0.45)] dark:bg-zinc-900"
            >
              <div className="flex h-full min-h-0 flex-col">
                <button
                  type="button"
                  onClick={resetScan}
                  onPointerDown={(event) => resultDragControls.start(event)}
                  aria-label="Cerrar resultado. Desliza la hoja hacia abajo o toca para cerrar."
                  className="flex min-h-[44px] w-full shrink-0 touch-none items-center justify-center gap-2 text-zinc-400 transition-colors hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500 dark:text-zinc-500 dark:hover:text-zinc-200"
                >
                  <span className="h-1.5 w-12 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <ChevronDown size={16} aria-hidden="true" />
                </button>
                <div className="min-h-0 flex-1">
                  <ScanResultPanel
                    waste={selectedWaste}
                    bin={activeBin}
                    aiResult={aiResult}
                    preview={uploadedPreview}
                    onClose={resetScan}
                    onOpenGuide={openGuide}
                    onRescan={resetScan}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ContainerGuide
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
        initialBinId={guideBinId}
      />
    </div>
  );
}
