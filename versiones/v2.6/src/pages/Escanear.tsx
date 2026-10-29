import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera as CameraIcon,
  RefreshCw,
  CheckCircle2,
  MapPin,
  Info,
  Leaf,
  Clock,
  ExternalLink,
  UploadCloud,
  Sparkles,
  Trash2,
  Cpu,
  X,
  ImagePlus,
  FlaskConical,
  ShieldCheck,
  Recycle,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  WASTE_DATABASE,
  WasteItem,
  CATEGORY_INFO,
  CAMPUS_CONTAINERS_CATALOG,
} from "../data/wasteData";
import { addScanToHistory } from "../data/historyStorage";
import { WasteVisual } from "../components/WasteVisual";
import { useAuth } from "../context/AuthContext";
import {
  classifyWasteImage,
  loadVisionModel,
  AIClassificationResult,
} from "../services/aiClassifier";
import { classifyWithGemini } from "../services/geminiClassifier";
import { addScan, getUserProgress, updateUserProgress } from "../firebase";

type ResultTab = "deposito" | "preparar" | "ficha";

const TABS: { id: ResultTab; label: string }[] = [
  { id: "deposito", label: "Depósito" },
  { id: "preparar", label: "Preparar" },
  { id: "ficha", label: "Ficha" },
];

function getMatchingBin(w: WasteItem) {
  // Coincidencia por nombre o color en el catálogo oficial
  const direct = CAMPUS_CONTAINERS_CATALOG.find(
      (b) =>
          b.name === w.recommendedBin?.label ||
          w.recommendedBin?.label?.toLowerCase().includes(b.colorName.toLowerCase()) ||
          w.recommendedBin?.color?.toLowerCase().includes(b.colorName.toLowerCase())
  );
  if (direct) return direct;

  return (
      CAMPUS_CONTAINERS_CATALOG.find((b) => {
        // 0. Naranja: Manejo especial (pilas/RAEE) - NOM-052-SEMARNAT
        if (w.category === "manejo_especial") {
          return b.id === "bin-pilas";
        }
        // 1. Verde: Orgánicos (alimentos, madera) - Sec. 4.1
        if (
            w.category === "organicos" ||
            w.material.toLowerCase().includes("orgánico") ||
            w.material.toLowerCase().includes("alimento") ||
            w.material.toLowerCase().includes("madera")
        ) {
          return b.id === "bin-verde";
        }
        // 2. Amarillo: Reciclables (papel, cartón, vidrio y metales) - Sec. 4.1
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
        // 3. Azul: Plásticos, hules y PET - Sec. 4.1
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
        // 4. Negro: No reciclables (envoltorios, celofán, cerámica, sanitarios, pilas, unicel, etc.) - Sec. 4.1
        return b.id === "bin-negro";
      }) || CAMPUS_CONTAINERS_CATALOG[2] // Fallback a Negro (No reciclables)
  );
}

export default function Escanear() {
  const [selectedWaste, setSelectedWaste] = useState<WasteItem | null>(null);
  const [aiResult, setAiResult] = useState<AIClassificationResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [tab, setTab] = useState<ResultTab>("deposito");
  const [showSamples, setShowSamples] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const { user } = useAuth();

  const mountedRef = useRef(true);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadVisionModel().catch((err) => console.log("[ReCiclo AI] Precalentando modelo:", err));
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Cámara en vivo: MediaDevices.getUserMedia (WebRTC). Se inicia sola al entrar.
  const startLiveCamera = async (targetFacing: "environment" | "user" = facingMode) => {
    setCameraError(null);
    setIsCameraStarting(true);
    stopCamera();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsCameraStarting(false);
      setCameraError("Tu navegador no permite cámara en vivo (se requiere HTTPS). Usa «Foto» para abrir la cámara del teléfono.");
      return;
    }

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: targetFacing }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
      } catch {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: targetFacing }, audio: false });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }
      }

      if (!mountedRef.current) {
        stream.getTracks().forEach((t) => t.stop());
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
          video.onloadedmetadata = () => video.play().then(() => resolve()).catch(() => resolve());
          video.play().then(() => resolve()).catch(() => resolve());
          setTimeout(resolve, 800);
        });
      }
      setCameraActive(true);
    } catch (err: unknown) {
      console.warn("[ReCiclo Cámara]", err);
      const errName = (err as { name?: string } | null | undefined)?.name;
      let msg = "No se pudo acceder a la cámara en vivo.";
      if (errName === "NotAllowedError" || errName === "PermissionDeniedError") {
        msg = "Permiso de cámara denegado. Actívalo en el candado del navegador o usa «Foto».";
      } else if (errName === "NotReadableError" || errName === "TrackStartError") {
        msg = "La cámara está ocupada por otra app. Ciérrala e inténtalo de nuevo.";
      }
      setCameraError(msg);
      setCameraActive(false);
    } finally {
      setIsCameraStarting(false);
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
            residuosNoReciclables: (currentProg.residuosNoReciclables || 0) + (!isRecyclable ? 1 : 0),
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
    setTab("deposito");
    setSheetExpanded(false);
    setSelectedWaste(waste);
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

  // Cámara nativa / captura desde explorador móvil
  const handleNativeCamera = async () => {
    setCameraError(null);
    nativeCameraInputRef.current?.click();
  };

  const handleCaptureFromLiveView = () => {
    const video = videoRef.current;
    if (!video) return;
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (facingMode === "user") {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, w, h);
    processImageSrc(canvas.toDataURL("image/jpeg", 0.92));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) processImageSrc(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const analyzeItemDirect = (waste: WasteItem) => {
    stopCamera();
    setUploadedPreview(null);
    setIsScanning(true);
    setSelectedWaste(null);
    setAiResult(null);
    setShowSamples(false);
    setTimeout(() => {
      setIsScanning(false);
      showResult(waste);
      saveScanRecord(waste);
    }, 350);
  };

  const resetScan = () => {
    setSelectedWaste(null);
    setAiResult(null);
    setUploadedPreview(null);
    startLiveCamera(facingMode);
  };

  /* ───────────── Tarjeta de resultado (bottom sheet en móvil / panel en PC) ───────────── */
  const renderResult = (waste: WasteItem) => {
    const bin = getMatchingBin(waste);
    return (
        <div className="flex flex-col flex-1 min-h-0 h-full">
          {/* Cabecera siempre visible */}
          <div className="flex items-center gap-3 px-4 pt-1 pb-3">
            <div className="shrink-0 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 shadow-sm">
              <WasteVisual id={waste.id} size="sm" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${CATEGORY_INFO[waste.category].colorBadge}`}>
                {waste.categoryLabel}
              </span>
                {waste.brand && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700">
                  {waste.brand}
                </span>
                )}
                {aiResult && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-black bg-emerald-600 text-white">
                  {Math.round(aiResult.confidence * 100)}%
                </span>
                )}
              </div>
              <h2 className="text-base font-bold leading-tight text-zinc-900 dark:text-zinc-100 line-clamp-2">{waste.name}</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 break-words">
                {waste.material}
                {aiResult ? ` · ${aiResult.engine === "gemini" ? "Gemini Visión" : "IA local"}: “${aiResult.rawLabel}”` : ""}
              </p>
            </div>
            <button
                onClick={resetScan}
                className="shrink-0 size-11 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center active:scale-90 cursor-pointer"
                aria-label="Nuevo escaneo"
            >
              <X size={16} />
            </button>
          </div>

          {/* Pestañas */}
          <div className="px-4">
            <div className="grid grid-cols-3 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold">
              {TABS.map((t) => (
                  <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`py-2.5 min-h-[44px] rounded-lg text-sm transition-all cursor-pointer touch-manipulation ${
                          tab === t.id
                              ? "bg-white dark:bg-zinc-950 text-emerald-700 dark:text-emerald-400 shadow-sm"
                              : "text-zinc-500 dark:text-zinc-400"
                      }`}
                  >
                    {t.label}
                  </button>
              ))}
            </div>
          </div>

          {/* Contenido de pestaña */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {tab === "deposito" && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div
                        className="size-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                        style={{ backgroundColor: bin.colorHex }}
                    >
                      <Trash2 size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="size-3" />
                        <span>Contenedor en el ITM</span>
                      </div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{bin.name}</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-snug">{waste.recommendedBin.description}</p>
                    </div>
                  </div>
                  {aiResult?.geminiTip && (
                      <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-900 dark:text-indigo-200 text-xs leading-snug">
                        <div className="flex items-center gap-1 font-bold mb-0.5">
                          <Sparkles className="size-3 text-indigo-600 dark:text-indigo-400" />
                          <span>Gemini identificó este residuo:</span>
                        </div>
                        {aiResult.geminiTip}
                      </div>
                  )}
                  {waste.categoryReason && (
                      <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300 text-xs leading-snug">
                        <strong className="block text-zinc-900 dark:text-zinc-100 mb-0.5">¿Por qué en este contenedor?</strong>
                        {waste.categoryReason}
                      </div>
                  )}
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs leading-snug">
                    <strong>Consejo del campus:</strong> {bin.handlingTip}
                  </div>
                  <Link
                      to="/mapa"
                      className="flex items-center justify-center gap-1.5 w-full min-h-[48px] py-3 rounded-xl text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] transition-all"
                  >
                    <MapPin className="size-3.5" />
                    <span>Ver contenedor en el mapa</span>
                    <ExternalLink className="size-3" />
                  </Link>
                </div>
            )}

            {tab === "preparar" && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
                    <Info className="size-3.5 text-blue-500" />
                    <span>Antes de depositar</span>
                  </h4>
                  <ul className="space-y-2">
                    {waste.handlingInstructions.slice(0, 4).map((ins, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                    <span className="size-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-[11px] font-bold shrink-0">
                      {idx + 1}
                    </span>
                          <span className="leading-snug">{ins}</span>
                        </li>
                    ))}
                  </ul>
                </div>
            )}

            {tab === "ficha" && (
                <div className="space-y-2.5">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-snug">{waste.categoryReason}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/70 dark:border-zinc-800">
                      <div className="flex items-center gap-1 text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                        <Clock className="size-3.5 text-amber-500" />
                        <span>Degradación</span>
                      </div>
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{waste.degradationTime.estimate}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/70 dark:border-zinc-800">
                      <div className="flex items-center gap-1 text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                        <Leaf className="size-3.5 text-emerald-500" />
                        <span>3R · Reducir</span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-snug line-clamp-4">
                        {waste.recommendations3R.reducir}
                      </p>
                    </div>
                  </div>

                  {/* Marco Institucional ITMORELIA-IT-AM-007 Rev. 3 */}
                  <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 text-xs text-emerald-950 dark:text-emerald-200">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-300 mb-1">
                      <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Marco Institucional · ITMORELIA-IT-AM-007 Rev. 3</span>
                    </div>
                    <p className="leading-snug text-xs text-emerald-900/90 dark:text-emerald-200/90 mb-1.5">
                      Procedimiento oficial del ITM para la gestión integral de RSU. Cumple con la política de <strong>100% libres de plásticos de un solo uso</strong> y Análisis de Ciclo de Vida (ACV).
                    </p>
                    <div className="flex flex-wrap gap-1 text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50">NMX-AA-015</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50">NMX-AA-019</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50">NMX-AA-22</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50">NMX-AA-61</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50">ISO 14001:2015</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-500 dark:text-zinc-500">
                    Alineado con el Sistema de Gestión Ambiental (SGI) del Instituto Tecnológico de Morelia.
                  </p>
                </div>
            )}
          </div>
        </div>
    );
  };

  const hasResult = !!selectedWaste;

  return (
      <div className="pt-[4.5rem] pb-24 md:pt-28 md:pb-12 px-0 md:px-8 max-w-7xl mx-auto">
        {/* Encabezado solo en escritorio */}
        <div className="hidden md:block mb-6 px-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border mb-2 border-emerald-300/60 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40">
            <Cpu className="size-3.5" />
            <span>Visión artificial · MobileNet v2</span>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Escáner de Residuos</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
          {/* ───────── ESCENARIO DE CÁMARA ───────── */}
          <div className="lg:col-span-7 px-3 md:px-0">
            <div className="relative h-[calc(100dvh-10.5rem)] md:h-[calc(100dvh-15rem)] min-h-[420px] lg:min-h-[520px] max-h-[820px] rounded-[1.75rem] overflow-hidden bg-zinc-950 shadow-2xl ring-1 ring-black/10">
              {/* Video siempre montado */}
              <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                      cameraActive ? "opacity-100" : "opacity-0"
                  }`}
              />

              {/* Foto capturada / subida */}
              {uploadedPreview && !cameraActive && (
                  <img src={uploadedPreview} alt="Residuo capturado" className="absolute inset-0 w-full h-full object-cover" />
              )}

              {/* Degradado para legibilidad */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none" />

              {/* Barra superior */}
              <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-3 pointer-events-none [&>*]:pointer-events-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-black/55 backdrop-blur-md text-white border border-white/15">
                <Cpu className="size-3 text-emerald-400" />
                {cameraActive ? (
                    <>
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>IA en vivo</span>
                    </>
                ) : (
                    <span>Escáner IA</span>
                )}
              </span>
                {cameraActive && (
                    <button
                        onClick={toggleCameraFacing}
                        className="size-11 rounded-full bg-black/55 backdrop-blur-md text-white border border-white/15 flex items-center justify-center active:scale-90 cursor-pointer"
                        aria-label="Cambiar cámara"
                    >
                      <RefreshCw size={16} />
                    </button>
                )}
              </div>

              {/* Retícula */}
              {cameraActive && !hasResult && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="relative w-56 h-56 sm:w-64 sm:h-64">
                      <span className="absolute top-0 left-0 size-8 border-t-[3px] border-l-[3px] border-emerald-400 rounded-tl-2xl" />
                      <span className="absolute top-0 right-0 size-8 border-t-[3px] border-r-[3px] border-emerald-400 rounded-tr-2xl" />
                      <span className="absolute bottom-0 left-0 size-8 border-b-[3px] border-l-[3px] border-emerald-400 rounded-bl-2xl" />
                      <span className="absolute bottom-0 right-0 size-8 border-b-[3px] border-r-[3px] border-emerald-400 rounded-br-2xl" />
                    </div>
                  </div>
              )}

              {/* Estado sin cámara */}
              {!cameraActive && !uploadedPreview && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pt-16 pb-32 overflow-y-auto text-white">
                    {isCameraStarting ? (
                        <>
                          <RefreshCw className="size-9 text-emerald-400 animate-spin mb-3" />
                          <p className="text-sm font-semibold">Iniciando cámara…</p>
                        </>
                    ) : (
                        <>
                          <div className="p-5 rounded-full bg-white/10 border border-white/10 mb-4">
                            <CameraIcon className="size-12 stroke-[1.5]" />
                          </div>
                          <p className="text-lg font-bold">Apunta al residuo</p>
                          <p className="text-xs text-zinc-300 mt-1 max-w-xs">
                            Activa la cámara para que la IA identifique el material y te diga dónde depositarlo.
                          </p>
                          <button
                              onClick={() => startLiveCamera(facingMode)}
                              className="mt-4 px-6 min-h-[48px] rounded-full bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold active:scale-95 transition-all cursor-pointer"
                          >
                            Activar cámara
                          </button>
                          <button
                              onClick={handleNativeCamera}
                              className="mt-2.5 px-4 min-h-[44px] rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold border border-white/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <UploadCloud size={14} />
                            Tomar foto con el teléfono
                          </button>
                        </>
                    )}
                    {cameraError && (
                        <p className="mt-4 text-xs text-amber-200 bg-amber-500/20 border border-amber-400/30 rounded-xl px-3 py-2 max-w-xs">
                          {cameraError}
                        </p>
                    )}
                  </div>
              )}

              {/* Controles inferiores estilo app de cámara */}
              {!hasResult && (
                  <div className="absolute bottom-0 inset-x-0 z-20 px-6 pb-5 pt-3 flex items-center justify-between pointer-events-none [&>button]:pointer-events-auto">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center gap-1 text-white text-[11px] font-semibold cursor-pointer active:scale-90"
                    >
                  <span className="size-11 rounded-full bg-black/55 backdrop-blur-md border border-white/15 flex items-center justify-center">
                    <ImagePlus size={18} />
                  </span>
                      Galería
                    </button>

                    <button
                        onClick={cameraActive ? handleCaptureFromLiveView : handleNativeCamera}
                        disabled={isScanning}
                        className="size-[72px] rounded-full border-4 border-white p-1 touch-manipulation active:scale-90 transition-transform cursor-pointer disabled:opacity-50"
                        aria-label="Capturar y clasificar"
                    >
                      <span className="block w-full h-full rounded-full bg-white" />
                    </button>

                    <button
                        onClick={() => setShowSamples((s) => !s)}
                        className="flex flex-col items-center gap-1 text-white text-[11px] font-semibold cursor-pointer active:scale-90"
                    >
                  <span
                      className={`size-11 rounded-full backdrop-blur-md border flex items-center justify-center ${
                          showSamples ? "bg-emerald-500 border-emerald-300" : "bg-black/55 border-white/15"
                      }`}
                  >
                    <FlaskConical size={18} />
                  </span>
                      Muestras
                    </button>
                  </div>
              )}

              {/* Muestras compactas: chips horizontales sobre el visor */}
              <AnimatePresence>
                {showSamples && !hasResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-[108px] inset-x-0 z-30 px-3"
                    >
                      <div className="rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 p-2.5">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 px-1 mb-1.5">
                          Muestras de prueba
                        </p>
                        <div className="flex gap-2 overflow-x-auto pb-1 snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                          {WASTE_DATABASE.map((w) => (
                              <button
                                  key={w.id}
                                  onClick={() => analyzeItemDirect(w)}
                                  className="snap-start shrink-0 flex flex-col items-center gap-1 w-[88px] min-h-[88px] p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
                              >
                                <WasteVisual id={w.id} size="sm" />
                                <span className="text-[11px] text-white font-semibold leading-tight text-center line-clamp-2">
                            {w.name}
                          </span>
                              </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                )}
              </AnimatePresence>

              {/* Análisis */}
              {isScanning && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-40">
                    <RefreshCw className="size-9 text-emerald-400 animate-spin mb-2.5" />
                    <p className="text-sm font-bold text-white">Analizando con Gemini…</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Respaldo local con MobileNet si no hay conexión</p>
                  </div>
              )}

              {/* Resultado: bottom sheet (solo móvil / tablet) */}
              <AnimatePresence>
                {hasResult && selectedWaste && (
                    <motion.div
                        key={selectedWaste.id}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 260 }}
                        className={`lg:hidden absolute bottom-0 inset-x-0 z-40 flex flex-col ${sheetExpanded ? "h-[94%]" : "h-[66%]"} transition-[height] duration-300 bg-white dark:bg-zinc-900 rounded-t-[1.75rem] shadow-[0_-12px_40px_rgba(0,0,0,0.35)]`}
                    >
                      <button
                          type="button"
                          onClick={() => setSheetExpanded((v) => !v)}
                          aria-label={sheetExpanded ? "Reducir resultado" : "Ampliar resultado"}
                          className="shrink-0 w-full flex justify-center pt-3 pb-3 touch-manipulation cursor-pointer"
                      >
                        <span className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                      </button>
                      {renderResult(selectedWaste)}
                    </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Inputs ocultos */}
            <input
                ref={nativeCameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileUpload}
            />
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </div>

          {/* ───────── PANEL DE RESULTADO EN ESCRITORIO ───────── */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg pt-4 min-h-[420px] h-[520px] overflow-hidden">
              {selectedWaste ? (
                  renderResult(selectedWaste)
              ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="p-4 rounded-full bg-emerald-100/60 dark:bg-emerald-950/50 mb-3">
                      <Leaf className="size-9 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">Esperando residuo</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mt-1 leading-relaxed">
                      Captura una foto o elige una muestra de prueba para ver aquí el contenedor, la preparación y la ficha ambiental.
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      <Sparkles className="size-3" />
                      <span>Prueba con una botella PET o una lata</span>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Guía de contenedores del ITM */}
        <div className="mt-6 px-3 md:px-0">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Trash2 size={15} className="text-emerald-600 dark:text-emerald-400" />
              Contenedores del ITM
            </h3>
            <Link to="/mapa" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              Mapa <ExternalLink size={11} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {CAMPUS_CONTAINERS_CATALOG.map((bin) => (
                <div
                    key={bin.id}
                    className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex items-start gap-3"
                >
                  <div
                      className="size-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs text-white"
                      style={{ backgroundColor: bin.colorHex }}
                  >
                    {bin.id === "bin-verde" && <Leaf size={18} className="text-white stroke-[2.2]" />}
                    {bin.id === "bin-amarillo" && <Recycle size={18} className="text-zinc-950 stroke-[2.2]" />}
                    {bin.id === "bin-negro" && <Trash2 size={18} className="text-white stroke-[2.2]" />}
                    {bin.id === "bin-azul" && <Recycle size={18} className="text-white stroke-[2.2]" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">
                      {bin.name}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-snug mt-1">
                      {bin.shortDescription}
                    </p>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
}