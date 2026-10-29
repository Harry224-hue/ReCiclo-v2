import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useDragControls, useReducedMotion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Crosshair,
  ExternalLink,
  Footprints,
  Info,
  Layers,
  List,
  Loader2,
  LocateFixed,
  Lock,
  Map as MapIcon,
  MapPin,
  Maximize2,
  Minimize2,
  Navigation,
  RefreshCw,
  Route,
  Satellite,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  CAMPUS_CONTAINERS_CATALOG,
  CampusDisposalPoint,
  ContainerId,
  ITM_DISPOSAL_POINTS,
} from "../data/wasteData";
import { useTheme } from "../context/ThemeContext";
import { ContainerGuide } from "../components/ContainerGuide";
import { ContainerDot, ContainerGlyph, containerTextOn } from "../components/container-ui";
import { triggerHaptic } from "../utils/haptics";
import { APPLE_SPRING_SHEET, projectMomentum } from "../utils/springs";

/* ─────────────────────────────────────────────────────────────
   Configuración geoespacial · Plano General ITM
   ───────────────────────────────────────────────────────────── */

export type CampusKey = "Campus 1 (Principal)" | "Campus 2 (San José de la Huerta)";

interface CampusGeoConfig {
  id: CampusKey;
  shortName: string;
  planoCode: string;
  address: string;
  center: { lat: number; lng: number };
  defaultEntrance: { lat: number; lng: number; name: string };
  zoom: number;
  bounds: [[number, number], [number, number]];
  perimeterPolygon: [number, number][];
}

const CAMPUS_GEO_CONFIG: Record<CampusKey, CampusGeoConfig> = {
  "Campus 1 (Principal)": {
    id: "Campus 1 (Principal)",
    shortName: "Campus 1 · Central",
    planoCode: "Plano General Campus Nº 1",
    address: "Av. Tecnológico #1500, Lomas de Santiaguito, Morelia, Mich.",
    center: { lat: 19.721841, lng: -101.18529 },
    defaultEntrance: {
      lat: 19.7236,
      lng: -101.18665,
      name: "Acceso principal Av. Tecnológico #1500 (Edificio A)",
    },
    zoom: 17,
    bounds: [
      [19.71882, -101.188896],
      [19.724862, -101.181684],
    ],
    perimeterPolygon: [
      [19.724262, -101.188163],
      [19.724199, -101.184021],
      [19.724041, -101.182652],
      [19.720457, -101.182685],
      [19.719451, -101.182284],
      [19.71942, -101.18342],
      [19.719765, -101.184021],
      [19.721086, -101.188296],
      [19.722784, -101.188196],
    ],
  },
  "Campus 2 (San José de la Huerta)": {
    id: "Campus 2 (San José de la Huerta)",
    shortName: "Campus 2 · San José",
    planoCode: "Plano General Campus Nº 2",
    address: "Camino de la Arboleda S/N, Residencial San José de la Huerta, Morelia, Mich.",
    center: { lat: 19.644768, lng: -101.224991 },
    defaultEntrance: {
      lat: 19.6465,
      lng: -101.226,
      name: "Acceso principal Camino de la Arboleda S/N",
    },
    zoom: 17,
    bounds: [
      [19.642624, -101.227073],
      [19.646912, -101.222909],
    ],
    perimeterPolygon: [
      [19.646238, -101.226473],
      [19.646312, -101.223692],
      [19.643545, -101.223509],
      [19.643224, -101.226263],
    ],
  },
};

const CAMPUS_KEYS: CampusKey[] = [
  "Campus 1 (Principal)",
  "Campus 2 (San José de la Huerta)",
];

/* Directorio oficial de construcciones del Plano General ITM */
const PLANO_DIRECTORIO_C1 = [
  { code: "A", name: "Edificio Administrativo (Dirección)", zone: "Entrada Principal" },
  { code: "Pony Plaza", name: "Explanada Cívica Central (Monumento al Pony)", zone: "Plaza Central" },
  { code: "R", name: "Cafetería Principal", zone: "Comedores" },
  { code: "X", name: "Comedor Estudiantil", zone: "Comedores" },
  { code: "S2", name: "Comedor para Trabajadores", zone: "Comedores" },
  { code: "LL", name: "Centro de Cómputo", zone: "Cómputo" },
  { code: "AF", name: "Centro de Información 600 Lectores (Biblioteca)", zone: "Biblioteca" },
  { code: "U", name: "Gimnasio Auditorio Heber Soto Fierro", zone: "Deportiva" },
  { code: "W", name: "Canchas Techadas", zone: "Deportiva" },
  { code: "H", name: "Unidad Deportiva y Tribunas (Estadio de Fútbol)", zone: "Deportiva" },
  { code: "CH, B, C, D", name: "Deptos. e Ingeniería Industrial y Bioquímica", zone: "Ingenierías" },
  { code: "G, T, S3", name: "Laboratorios Ing. Mecánica y Caldera", zone: "Ingenierías" },
  { code: "Q, Y, Z, AA, AB", name: "Deptos. de Ing. Eléctrica y Electrónica", zone: "Ingenierías" },
  { code: "2A a 2K", name: "Unidad Metal Mecánica (Fundición y Aulas)", zone: "Primer Congreso" },
  { code: "3A y 3B", name: "Unidad Posgrado en Eléctrica", zone: "Libramiento Sur" },
];

const PLANO_DIRECTORIO_C2 = [
  { code: "A", name: "Edificio Administrativo y Cafetería C2", zone: "Centro" },
  { code: "B", name: "Salones y Cubículos de Contaduría e Ingeniería", zone: "Plaza Poniente" },
  { code: "C", name: "Centro de Cómputo Educación a Distancia", zone: "Plaza Poniente" },
  { code: "E", name: "Salones Ingeniería", zone: "Plaza Oriente" },
  { code: "D", name: "Contaduría", zone: "Plaza Oriente" },
  { code: "Plazas", name: "2 Plazas Cívicas Semicirculares con Rosetón", zone: "Explanadas" },
  { code: "Canchas & PTAR", name: "Área Deportiva y Planta de Tratamiento", zone: "Poniente" },
  { code: "Acceso", name: "Pórtico y Estacionamiento sobre Camino de la Arboleda", zone: "Norte" },
];

/* ─────────────────────────────────────────────────────────────
   Utilidades geográficas
   ───────────────────────────────────────────────────────────── */

function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  return Math.round(R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))));
}

function formatDistance(meters: number): string {
  return meters < 1000 ? `${meters} m` : `${(meters / 1000).toFixed(1)} km`;
}

function pluralEstaciones(count: number): string {
  return `${count} ${count === 1 ? "estación" : "estaciones"}`;
}

function formatWalk(meters: number): string {
  return `${Math.max(1, Math.ceil(meters / 75))} min`;
}

/** Ray casting sobre el perímetro oficial del plano (más confiable que un radio). */
function pointInPolygon(lat: number, lng: number, polygon: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [latI, lngI] = polygon[i];
    const [latJ, lngJ] = polygon[j];
    const intersects =
      lngI > lng !== lngJ > lng &&
      lat < ((latJ - latI) * (lng - lngI)) / (lngJ - lngI) + latI;
    if (intersects) inside = !inside;
  }
  return inside;
}

function campusAt(lat: number, lng: number): CampusKey | null {
  for (const key of CAMPUS_KEYS) {
    if (pointInPolygon(lat, lng, CAMPUS_GEO_CONFIG[key].perimeterPolygon)) return key;
  }
  // Tolerancia de ~75 m alrededor del rectángulo del plano: un GPS de celular
  // suele oscilar en los accesos y banquetas perimetrales.
  const pad = 0.0007;
  for (const key of CAMPUS_KEYS) {
    const [[south, west], [north, east]] = CAMPUS_GEO_CONFIG[key].bounds;
    if (
      lat >= south - pad &&
      lat <= north + pad &&
      lng >= west - pad &&
      lng <= east + pad
    ) {
      return key;
    }
  }
  return null;
}

function nearestPointTo(lat: number, lng: number, campus: CampusKey): CampusDisposalPoint | null {
  const points = ITM_DISPOSAL_POINTS.filter((point) => point.campus === campus);
  if (points.length === 0) return null;
  return points.reduce((nearest, point) => {
    const current = calculateDistanceMeters(lat, lng, point.coordinates.lat, point.coordinates.lng);
    const best = calculateDistanceMeters(lat, lng, nearest.coordinates.lat, nearest.coordinates.lng);
    return current < best ? point : nearest;
  }, points[0]);
}

type FilterMode = "todos" | ContainerId;
type ZoneFilter = "todas" | CampusDisposalPoint["zoneType"];
type PanelView = "list" | "detail";

interface GpsState {
  lat: number;
  lng: number;
  accuracy: number;
  campus: CampusKey;
}

interface OutsideState {
  distC1: number;
  distC2: number;
  nearestCampus: CampusKey;
}

const BIN_FILTERS: { id: FilterMode; label: string; color?: string; textClass: string }[] = [
  { id: "todos", label: "Todos", textClass: "text-zinc-600 dark:text-zinc-300" },
  { id: "bin-verde", label: "Verde", color: "#16a34a", textClass: "text-emerald-600 dark:text-emerald-400" },
  { id: "bin-amarillo", label: "Amarillo", color: "#eab308", textClass: "text-amber-600 dark:text-amber-400" },
  { id: "bin-azul", label: "Azul", color: "#2563eb", textClass: "text-sky-600 dark:text-sky-400" },
  { id: "bin-negro", label: "Negro", color: "#3f3f46", textClass: "text-zinc-600 dark:text-zinc-300" },
  { id: "bin-pilas", label: "Pilas", color: "#ea580c", textClass: "text-orange-600 dark:text-orange-400" },
];

const ZONE_FILTERS: { id: ZoneFilter; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "Pony Plaza / Explanada", label: "Plazas" },
  { id: "Cafetería y Alimentos", label: "Cafeterías" },
  { id: "Aulas e Ingenierías", label: "Aulas" },
  { id: "Deportiva", label: "Deportes" },
  { id: "Acceso", label: "Acceso" },
  { id: "Biblioteca e Información", label: "Biblioteca" },
];

const ZONE_ICON: Record<CampusDisposalPoint["zoneType"], string> = {
  "Pony Plaza / Explanada": "🏛️",
  "Cafetería y Alimentos": "☕",
  "Aulas e Ingenierías": "🏫",
  "Biblioteca e Información": "📚",
  Deportiva: "⚽",
  Acceso: "🚪",
};

const BIN_COLOR: Record<ContainerId, string> = {
  "bin-verde": "#16a34a",
  "bin-amarillo": "#eab308",
  "bin-azul": "#2563eb",
  "bin-negro": "#3f3f46",
  "bin-pilas": "#ea580c",
};

function buildStationIcon(point: CampusDisposalPoint, selected: boolean, dark: boolean): L.DivIcon {
  const bg = selected ? (dark ? "#10b981" : "#047857") : dark ? "#111113" : "#ffffff";
  const fg = selected ? "#ffffff" : dark ? "#e4e4e7" : "#065f46";
  const border = selected ? "#6ee7b7" : dark ? "#52525b" : "#a7f3d0";
  const dots = point.installedBins
    .map((id) => `<span class="itm-station-marker__bin" style="background:${BIN_COLOR[id]}"></span>`)
    .join("");

  return L.divIcon({
    className: `itm-station-marker${selected ? " is-selected" : ""}`,
    html: `
      <div class="itm-station-marker__wrap">
        <div class="itm-station-marker__pin" style="--pin-bg:${bg};--pin-border:${border};--pin-fg:${fg};">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          <span class="itm-station-marker__bins">${dots}</span>
        </div>
      </div>
    `,
    iconSize: [44, 56],
    iconAnchor: [22, 53],
    tooltipAnchor: [0, -49],
  });
}

function buildUserIcon(): L.DivIcon {
  return L.divIcon({
    className: "itm-user-marker",
    html: `<div class="itm-user-marker__wrap"><span class="itm-user-marker__dot"></span></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function RailButton({
  label,
  onClick,
  active = false,
  toggle = false,
  loading = false,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  toggle?: boolean;
  loading?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={toggle ? active : undefined}
      disabled={loading}
      className={`relative flex size-11 touch-manipulation items-center justify-center rounded-full transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-70 dark:focus-visible:ring-offset-zinc-950 ${
        active
          ? "bg-emerald-700 text-white shadow-md"
          : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-200 dark:hover:bg-white/10 dark:hover:text-white"
      }`}
    >
      {loading ? <Loader2 size={18} className="animate-spin text-emerald-600 dark:text-emerald-400" /> : children}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   Página
   ───────────────────────────────────────────────────────────── */

export default function Mapa() {
  const { isDarkMode } = useTheme();
  const reduceMotion = useReducedMotion();
  const [searchParams] = useSearchParams();

  const binParam = searchParams.get("bin");
  const initialBin =
    binParam && CAMPUS_CONTAINERS_CATALOG.some((bin) => bin.id === binParam)
      ? (binParam as ContainerId)
      : null;
  const pointParam = searchParams.get("punto");
  const initialPoint = ITM_DISPOSAL_POINTS.find((point) => point.id === pointParam) ?? null;

  const [campus, setCampus] = useState<CampusKey>(() => {
    if (initialPoint) return initialPoint.campus;
    const explicit = searchParams.get("campus");
    if (explicit === "c2") return "Campus 2 (San José de la Huerta)";
    if (explicit === "c1") return "Campus 1 (Principal)";
    if (initialBin) {
      const c1Has = ITM_DISPOSAL_POINTS.some(
        (point) =>
          point.campus === "Campus 1 (Principal)" && point.installedBins.includes(initialBin)
      );
      const c2Has = ITM_DISPOSAL_POINTS.some(
        (point) =>
          point.campus === "Campus 2 (San José de la Huerta)" &&
          point.installedBins.includes(initialBin)
      );
      if (!c1Has && c2Has) return "Campus 2 (San José de la Huerta)";
    }
    return "Campus 1 (Principal)";
  });
  const [filter, setFilter] = useState<FilterMode>(initialBin ?? "todos");
  const [zoneFilter, setZoneFilter] = useState<ZoneFilter>("todas");
  const [selectedPoint, setSelectedPoint] = useState<CampusDisposalPoint | null>(initialPoint);
  const [panelView, setPanelView] = useState<PanelView>(initialPoint ? "detail" : "list");
  const [panelOpen, setPanelOpen] = useState<boolean>(() => {
    if (initialPoint || initialBin) return true;
    return typeof window !== "undefined" && window.innerWidth >= 1024;
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [baseLayer, setBaseLayer] = useState<"satelite" | "calles">("satelite");
  const [expanded, setExpanded] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideBinId, setGuideBinId] = useState<string | null>(null);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [gps, setGps] = useState<GpsState | null>(null);
  const [locating, setLocating] = useState(false);
  const [outside, setOutside] = useState<OutsideState | null>(null);
  const [notice, setNotice] = useState<{ text: string; type: "success" | "warning" | "info" } | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const polygonRef = useRef<L.Polygon | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const routeRef = useRef<L.LayerGroup | null>(null);
  const userLayerRef = useRef<L.LayerGroup | null>(null);
  const panelOpenRef = useRef(panelOpen);
  panelOpenRef.current = panelOpen;
  const panelDragControls = useDragControls();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setFiltersOpen(false);
      setToolsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const notify = useCallback((text: string, type: "success" | "warning" | "info" = "info") => {
    setNotice({ text, type });
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 4400);
    return () => window.clearTimeout(timer);
  }, [notice]);

  /* Respuesta a enlaces profundos: /mapa?bin=bin-azul&punto=itm-c1-cafeteria-r */
  const searchKey = searchParams.toString();
  useEffect(() => {
    const bin = searchParams.get("bin");
    const pointId = searchParams.get("punto");
    if (bin && CAMPUS_CONTAINERS_CATALOG.some((item) => item.id === bin)) {
      setFilter(bin as ContainerId);
      setPanelOpen(true);
    }
    if (pointId) {
      const point = ITM_DISPOSAL_POINTS.find((item) => item.id === pointId);
      if (point) {
        setCampus(point.campus);
        setSelectedPoint(point);
        setPanelView("detail");
        setPanelOpen(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey]);

  /* ── Inicialización del mapa ── */
  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) return;
    const cfg = CAMPUS_GEO_CONFIG["Campus 1 (Principal)"];
    const map = L.map(mapElementRef.current, {
      center: [cfg.center.lat, cfg.center.lng],
      zoom: cfg.zoom,
      minZoom: 15,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: false,
      preferCanvas: true,
      zoomSnap: 0.25,
      wheelPxPerZoomLevel: 80,
      maxBoundsViscosity: 0.9,
    });
    mapRef.current = map;
    setMapReady(true);

    const observer = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    observer.observe(mapElementRef.current);
    requestAnimationFrame(() => map.invalidateSize({ pan: false }));

    return () => {
      observer.disconnect();
      Object.values(markersRef.current).forEach((marker) => marker.remove());
      markersRef.current = {};
      routeRef.current?.remove();
      userLayerRef.current?.remove();
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  /* ── Capa base ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    tileRef.current?.remove();

    if (baseLayer === "satelite") {
      tileRef.current = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19, maxNativeZoom: 19 }
      ).addTo(map);
    } else {
      tileRef.current = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        maxNativeZoom: 19,
        className: isDarkMode ? "itm-tiles-dark" : "",
      }).addTo(map);
    }
  }, [baseLayer, isDarkMode, mapReady]);

  /* ── Perímetro y encuadre del campus ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const cfg = CAMPUS_GEO_CONFIG[campus];
    const bounds = L.latLngBounds(cfg.bounds);

    map.setMaxBounds(bounds.pad(0.35));
    map.setMinZoom(15);

    polygonRef.current?.remove();
    polygonRef.current = L.polygon(cfg.perimeterPolygon, {
      color: isDarkMode ? "#34d399" : "#059669",
      weight: 2,
      opacity: 0.9,
      dashArray: "5 7",
      fillColor: "#10b981",
      fillOpacity: isDarkMode ? 0.07 : 0.05,
      interactive: false,
    }).addTo(map);
  }, [campus, isDarkMode, mapReady]);

  /* ── Marcadores, ruta y origen ── */
  const filteredPoints = useMemo(
    () =>
      ITM_DISPOSAL_POINTS.filter((point) => {
        if (point.campus !== campus) return false;
        if (filter !== "todos" && !point.installedBins.includes(filter)) return false;
        if (zoneFilter !== "todas" && point.zoneType !== zoneFilter) return false;
        return true;
      }),
    [campus, filter, zoneFilter]
  );

  /* ── Encuadre: prioriza las estaciones sobre el perímetro ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const isDesktop = window.innerWidth >= 1024;
    const target =
      filteredPoints.length > 0
        ? L.latLngBounds(
            filteredPoints.map((point) => [point.coordinates.lat, point.coordinates.lng])
          )
        : L.latLngBounds(CAMPUS_GEO_CONFIG[campus].bounds);
    const panelPad = isDesktop && panelOpenRef.current ? 414 : 0;

    map.flyToBounds(target, {
      paddingTopLeft: [isDesktop ? 24 : 44, isDesktop ? 150 : 156],
      paddingBottomRight: [isDesktop ? 24 + panelPad : 80, isDesktop ? 120 : 205],
      maxZoom: isDesktop ? 17.7 : 18,
      duration: 0.8,
    });
  }, [filteredPoints, campus, mapReady]);

  const origin = useMemo(() => {
    if (gps && gps.campus === campus) return { lat: gps.lat, lng: gps.lng, fromGps: true };
    const entrance = CAMPUS_GEO_CONFIG[campus].defaultEntrance;
    return { lat: entrance.lat, lng: entrance.lng, fromGps: false };
  }, [gps, campus]);

  const visiblePoints = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = filteredPoints.filter((point) => {
      if (!q) return true;
      return `${point.name} ${point.buildingRef} ${point.officialBuildingCode} ${point.zoneType}`
        .toLowerCase()
        .includes(q);
    });
    return [...base].sort(
      (a, b) =>
        calculateDistanceMeters(origin.lat, origin.lng, a.coordinates.lat, a.coordinates.lng) -
        calculateDistanceMeters(origin.lat, origin.lng, b.coordinates.lat, b.coordinates.lng)
    );
  }, [filteredPoints, query, origin]);

  /* ── Si el bote no existe en este campus, guiamos al campus que sí lo tiene ── */
  const filterNoticeRef = useRef<string>("");
  useEffect(() => {
    if (filter === "todos" || filteredPoints.length > 0) return;
    const other = CAMPUS_KEYS.find((key) => key !== campus);
    if (!other) return;
    const hasOther = ITM_DISPOSAL_POINTS.some(
      (point) => point.campus === other && point.installedBins.includes(filter)
    );
    if (!hasOther) return;
    const key = `${campus}-${filter}`;
    if (filterNoticeRef.current === key) return;
    filterNoticeRef.current = key;
    setPanelOpen(true);
    setPanelView("list");
    notify(
      `${CAMPUS_CONTAINERS_CATALOG.find((bin) => bin.id === filter)?.name ?? "Ese bote"} solo está disponible en ${CAMPUS_GEO_CONFIG[other].shortName}.`,
      "info"
    );
  }, [filter, filteredPoints.length, campus, notify]);

  /* ── Selección y encuadre con offset para el panel ── */
  const flyToPoint = useCallback(
    (point: CampusDisposalPoint, options?: { forcePanel?: boolean }) => {
      const map = mapRef.current;
      if (!map) return;
      const isDesktop = window.innerWidth >= 1024;
      const withPanel = options?.forcePanel ?? panelOpenRef.current;
      const targetZoom = Math.max(map.getZoom(), 17.5);
      const offsetX = isDesktop && withPanel ? 190 : 0;
      const offsetY = !isDesktop && withPanel ? 190 : 0;
      const projected = map
        .project([point.coordinates.lat, point.coordinates.lng], targetZoom)
        .add([offsetX, offsetY]);
      const target = map.unproject(projected, targetZoom);
      map.flyTo(target, targetZoom, { duration: 0.9, easeLinearity: 0.25 });
    },
    []
  );

  const getWalkInfo = useCallback(
    (point: CampusDisposalPoint) => {
      const meters = calculateDistanceMeters(
        origin.lat,
        origin.lng,
        point.coordinates.lat,
        point.coordinates.lng
      );
      return { meters, minutes: Math.max(1, Math.ceil(meters / 75)), fromGps: origin.fromGps };
    },
    [origin]
  );

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    filteredPoints.forEach((point) => {
      const isSelected = selectedPoint?.id === point.id;
      const marker = L.marker([point.coordinates.lat, point.coordinates.lng], {
        icon: buildStationIcon(point, isSelected, isDarkMode),
        title: point.name,
        riseOnHover: true,
        keyboard: true,
        zIndexOffset: isSelected ? 1000 : 0,
        bubblingMouseEvents: false,
      }).addTo(map);

      marker.bindTooltip(point.name, {
        direction: "top",
        offset: [0, -49],
        opacity: 1,
        className: "itm-map-tooltip",
      });

      marker.on("click", () => {
        setSelectedPoint(point);
        setPanelOpen(true);
        setPanelView("detail");
        window.setTimeout(() => flyToPoint(point, { forcePanel: true }), 30);
      });

      markersRef.current[point.id] = marker;
    });

    routeRef.current?.remove();
    routeRef.current = null;

    if (selectedPoint && filteredPoints.some((point) => point.id === selectedPoint.id)) {
      const routeGroup = L.layerGroup().addTo(map);
      const entry = origin;
      L.polyline(
        [
          [entry.lat, entry.lng],
          [selectedPoint.coordinates.lat, selectedPoint.coordinates.lng],
        ],
        {
          color: isDarkMode ? "#5eead4" : "#0f766e",
          weight: 3,
          opacity: 0.9,
          dashArray: "1 9",
          lineCap: "round",
        }
      ).addTo(routeGroup);
      L.circleMarker([entry.lat, entry.lng], {
        radius: 5,
        color: "#ffffff",
        weight: 2,
        fillColor: "#0ea5e9",
        fillOpacity: 1,
      }).addTo(routeGroup);
      routeRef.current = routeGroup;
    }
    // flyToPoint se define abajo y solo usa refs/estado estable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredPoints, selectedPoint, isDarkMode, mapReady, origin]);

  /* ── Marcador de ubicación real + círculo de precisión ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    userLayerRef.current?.remove();
    userLayerRef.current = null;
    if (!gps || gps.campus !== campus) return;

    const group = L.layerGroup().addTo(map);
    L.circle([gps.lat, gps.lng], {
      radius: Math.min(Math.max(gps.accuracy, 8), 120),
      color: "#0ea5e9",
      weight: 1,
      opacity: 0.7,
      fillColor: "#0ea5e9",
      fillOpacity: 0.12,
      interactive: false,
    }).addTo(group);
    L.marker([gps.lat, gps.lng], {
      icon: buildUserIcon(),
      interactive: false,
      zIndexOffset: 900,
    }).addTo(group);
    userLayerRef.current = group;
  }, [gps, campus, mapReady]);

  /* ── GPS: verificación por perímetro real del plano ── */
  const handleLocate = () => {
    if (!navigator.geolocation) {
      notify("Este navegador no permite geolocalización.", "warning");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const inside = campusAt(latitude, longitude);
        setLocating(false);

        if (inside) {
          const nearest = nearestPointTo(latitude, longitude, inside);
          setGps({ lat: latitude, lng: longitude, accuracy, campus: inside });
          setOutside(null);
          setCampus(inside);
          if (nearest) {
            setSelectedPoint(nearest);
            setPanelOpen(true);
            setPanelView("detail");
                window.setTimeout(() => flyToPoint(nearest, { forcePanel: true }), 420);
            const distance = calculateDistanceMeters(
              latitude,
              longitude,
              nearest.coordinates.lat,
              nearest.coordinates.lng
            );
            notify(
              `Estás en ${CAMPUS_GEO_CONFIG[inside].shortName}. El bote más cercano está a ${formatDistance(distance)} (±${Math.round(accuracy)} m).`,
              "success"
            );
          }
          return;
        }

        const cfg1 = CAMPUS_GEO_CONFIG["Campus 1 (Principal)"];
        const cfg2 = CAMPUS_GEO_CONFIG["Campus 2 (San José de la Huerta)"];
        const distC1 = calculateDistanceMeters(latitude, longitude, cfg1.center.lat, cfg1.center.lng);
        const distC2 = calculateDistanceMeters(latitude, longitude, cfg2.center.lat, cfg2.center.lng);
        setGps(null);
        setOutside({
          distC1,
          distC2,
          nearestCampus: distC1 <= distC2 ? cfg1.id : cfg2.id,
        });
        setPanelOpen(true);
        setPanelView("list");
        notify("Estás fuera del ITM. Consulta la distancia a cada campus.", "warning");
      },
      (error) => {
        setLocating(false);
        console.warn("[GPS]", error);
        notify("No se pudo obtener tu ubicación. Revisa los permisos del navegador.", "warning");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  };

  const applyReferenceLocation = (key: CampusKey) => {
    const cfg = CAMPUS_GEO_CONFIG[key];
    const nearest = nearestPointTo(cfg.defaultEntrance.lat, cfg.defaultEntrance.lng, key);
    setGps({
      lat: cfg.defaultEntrance.lat,
      lng: cfg.defaultEntrance.lng,
      accuracy: 25,
      campus: key,
    });
    setOutside(null);
    setCampus(key);
    if (nearest) {
      setSelectedPoint(nearest);
      setPanelView("detail");
      setPanelOpen(true);
      window.setTimeout(() => flyToPoint(nearest, { forcePanel: true }), 420);
    }
    notify(`Ubicación de referencia: ${cfg.defaultEntrance.name}.`, "info");
  };

  /* ── Pantalla completa real (CSS, por encima de la navbar) ── */
  useEffect(() => {
    if (!expanded) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const first = window.setTimeout(() => map.invalidateSize({ pan: false }), 60);
    const second = window.setTimeout(() => map.invalidateSize({ pan: false }), 380);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(second);
    };
  }, [expanded]);

  /* ── Si el campus cambia, la ficha seleccionada debe pertenecer a él ── */
  useEffect(() => {
    if (selectedPoint && selectedPoint.campus !== campus) {
      setSelectedPoint(null);
      setPanelView("list");
    }
  }, [campus, selectedPoint]);

  /* ── Si el filtro deja fuera la ficha activa, volvemos al listado ── */
  useEffect(() => {
    if (selectedPoint && !filteredPoints.some((point) => point.id === selectedPoint.id)) {
      setSelectedPoint(null);
      setPanelView("list");
    }
  }, [filteredPoints, selectedPoint]);

  const closePanel = () => {
    setPanelOpen(false);
    setSelectedPoint(null);
    setPanelView("list");
  };

  const toggleExpanded = () => {
    if (!expanded) {
      // Pantalla completa real: el mapa ocupa todo y el panel se abre a demanda.
      setPanelOpen(false);
      setSelectedPoint(null);
      setPanelView("list");
      }
    setExpanded((value) => !value);
  };

  const openGuide = (binId: string) => {
    setGuideBinId(binId);
    setGuideOpen(true);
  };

  const filterLabel =
    filter === "todos" ? "todos los botes" : CAMPUS_CONTAINERS_CATALOG.find((bin) => bin.id === filter)?.name;
  const otherCampus = CAMPUS_KEYS.find((key) => key !== campus) ?? "Campus 2 (San José de la Huerta)";
  const otherCampusHasFilter =
    filter !== "todos" && ITM_DISPOSAL_POINTS.some((point) => point.campus === otherCampus && point.installedBins.includes(filter));
  const activeCfg = CAMPUS_GEO_CONFIG[campus];

  const topInset = expanded
    ? "top-[max(0.75rem,calc(env(safe-area-inset-top,0px)+0.5rem))]"
    : "top-[calc(env(safe-area-inset-top,0px)+5rem)] md:top-[7rem]";
  const bottomInset = expanded
    ? "bottom-[max(0.75rem,calc(env(safe-area-inset-bottom,0px)+0.5rem))]"
    : "bottom-[calc(env(safe-area-inset-bottom,0px)+5.25rem)] md:bottom-4";
  const mobilePopoverInset = expanded
    ? "bottom-[calc(env(safe-area-inset-bottom,0px)+4.75rem)]"
    : "bottom-[calc(env(safe-area-inset-bottom,0px)+9rem)]";

  return (
    <div
      className={
        expanded
          ? "fixed inset-0 z-[80] h-[100dvh] w-full overflow-hidden bg-zinc-950"
          : "relative h-[100dvh] w-full overflow-hidden bg-zinc-950"
      }
    >
      {/* Lienzo Leaflet */}
      <h1 className="sr-only">Mapa de estaciones de residuos del ITM</h1>
      <div
        ref={mapElementRef}
        data-lenis-prevent
        className="absolute inset-0 z-0"
        role="region"
        aria-label="Mapa interactivo de estaciones de residuos del ITM"
      />

      {/* Viñeta sutil para legibilidad de controles */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-black/45 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-48 bg-gradient-to-t from-black/55 to-transparent" />

      {/* ── Encabezado flotante: campus + resumen ── */}
      <div className={`pointer-events-none absolute left-3 right-3 z-40 flex max-w-[calc(100vw-1.5rem)] flex-col gap-2 md:right-auto md:left-4 md:max-w-[calc(100vw-5.5rem)] ${topInset}`}>
        <div className="pointer-events-auto flex items-center gap-2.5 rounded-2xl border border-black/5 bg-white/95 px-2.5 py-2 shadow-xl backdrop-blur-xl dark:border-white/15 dark:bg-zinc-950/85">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
            <MapPin size={17} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
              {activeCfg.planoCode}
            </p>
            <p className="truncate text-[13px] font-extrabold leading-tight text-zinc-900 dark:text-zinc-50">
              {pluralEstaciones(filteredPoints.length)}
              <span className="hidden sm:inline"> · {activeCfg.shortName}</span>
              <span className="sm:hidden">
                {" "}
                · {campus === "Campus 1 (Principal)" ? "C1" : "C2"}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (panelOpen) {
                setPanelOpen(false);
                return;
              }
              setPanelView("list");
              setSelectedPoint(null);
              setPanelOpen(true);
              setFiltersOpen(false);
              setToolsOpen(false);
            }}
            aria-label={panelOpen ? "Ocultar panel de estaciones" : "Abrir panel de estaciones"}
            aria-pressed={panelOpen}
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
              panelOpen
                ? "bg-emerald-700 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            <List size={16} />
          </button>
        </div>

        <div className="pointer-events-auto flex w-fit items-center gap-1 rounded-full border border-black/5 bg-white/95 p-1 shadow-lg backdrop-blur-xl dark:border-white/15 dark:bg-zinc-950/85">
          {CAMPUS_KEYS.map((key) => {
            const isActive = campus === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setCampus(key);
                  setFilter("todos");
                  setZoneFilter("todas");
                }}
                aria-pressed={isActive}
                className={`min-h-[44px] rounded-full px-3 py-1.5 text-[11px] font-bold transition-all ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
                }`}
              >
                <span className="sm:hidden">Campus {key.includes("Campus 2") ? "2" : "1"}</span>
                <span className="hidden sm:inline">{CAMPUS_GEO_CONFIG[key].shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Riel de controles ── */}
      <div className={`pointer-events-none absolute right-3 z-40 hidden flex-col items-center gap-1 rounded-full border border-black/5 bg-white/95 p-1 shadow-xl backdrop-blur-xl dark:border-white/15 dark:bg-zinc-950/85 md:flex ${panelOpen ? "md:right-[418px]" : "md:right-4"} ${topInset}`}>
        <div className="pointer-events-auto flex flex-col items-center gap-0.5">
          <RailButton
            label={baseLayer === "satelite" ? "Ver mapa de calles" : "Ver imagen satelital"}
            onClick={() => setBaseLayer((layer) => (layer === "satelite" ? "calles" : "satelite"))}
            active={baseLayer === "satelite"}
            toggle
          >
            {baseLayer === "satelite" ? <MapIcon size={17} /> : <Satellite size={17} />}
          </RailButton>
          <RailButton
            label="Usar mi ubicación real"
            onClick={handleLocate}
            loading={locating}
            active={Boolean(gps)}
            toggle
          >
            <LocateFixed size={18} className="text-emerald-600 dark:text-emerald-400" />
          </RailButton>
          <RailButton
            label={expanded ? "Salir de pantalla completa" : "Expandir mapa a pantalla completa"}
            onClick={toggleExpanded}
            active={expanded}
            toggle
          >
            {expanded ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          </RailButton>
          <div className="hidden flex-col items-center gap-0.5 sm:flex">
            <span className="my-0.5 h-px w-6 bg-zinc-200 dark:bg-white/15" />
            <RailButton
              label="Acercar"
              onClick={() => mapRef.current?.zoomIn(0.5)}
            >
              <ZoomIn size={17} />
            </RailButton>
            <RailButton
              label="Alejar"
              onClick={() => mapRef.current?.zoomOut(0.5)}
            >
              <ZoomOut size={17} />
            </RailButton>
          </div>
          <span className="my-0.5 h-px w-6 bg-zinc-200 dark:bg-white/15" />
          <RailButton
            label="Guía de contenedores"
            onClick={() => {
              setGuideBinId(null);
              setGuideOpen(true);
            }}
          >
            <Trash2 size={17} className="text-emerald-600 dark:text-emerald-400" />
          </RailButton>
        </div>
      </div>

      {/* ── Aviso flotante ── */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.2, ease: [0.23, 1, 0.32, 1] }}
            className={`pointer-events-none absolute left-1/2 z-[59] w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-2xl border px-3.5 py-2.5 text-[11.5px] font-semibold leading-snug shadow-xl backdrop-blur-xl ${
              expanded
                ? "top-20"
                : "top-[calc(env(safe-area-inset-top,0px)+11rem)] md:top-[12rem]"
            } ${
              notice.type === "success"
                ? "border-emerald-400/40 bg-emerald-950/90 text-emerald-50"
                : notice.type === "warning"
                ? "border-amber-400/40 bg-amber-950/90 text-amber-50"
                : "border-sky-400/40 bg-sky-950/90 text-sky-50"
            }`}
          >
            <span className="flex items-center gap-2">
              {notice.type === "success" && <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />}
              {notice.type === "warning" && <AlertTriangle size={14} className="shrink-0 text-amber-400" />}
              {notice.type === "info" && <Info size={14} className="shrink-0 text-sky-400" />}
              {notice.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Móvil: un solo acceso compacto a filtros y herramientas ── */}
      <div className={`pointer-events-none absolute left-1/2 z-[58] -translate-x-1/2 md:hidden ${bottomInset}`}>
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-black/5 bg-white/95 p-1 shadow-xl backdrop-blur-xl dark:border-white/15 dark:bg-zinc-950/90">
          <button
            type="button"
            onClick={() => {
              setFiltersOpen((open) => !open);
              setToolsOpen(false);
            }}
            aria-expanded={filtersOpen}
            aria-controls="map-filter-popover"
            className={`flex min-h-[44px] items-center gap-1.5 rounded-full px-3 text-[11.5px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              filter !== "todos"
                ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-100"
                : "text-zinc-700 dark:text-zinc-200"
            }`}
          >
            <SlidersHorizontal size={14} aria-hidden="true" />
            <span>Filtros</span>
            {filter !== "todos" && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold">
                <ContainerDot id={filter} size={7} />
                {CAMPUS_CONTAINERS_CATALOG.find((bin) => bin.id === filter)?.colorName}
              </span>
            )}
          </button>
          <span className="h-5 w-px bg-zinc-200 dark:bg-white/15" aria-hidden="true" />
          <button
            type="button"
            onClick={() => {
              setToolsOpen((open) => !open);
              setFiltersOpen(false);
            }}
            aria-expanded={toolsOpen}
            aria-controls="map-tools-popover"
            className={`flex min-h-[44px] items-center gap-1.5 rounded-full px-3 text-[11.5px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              toolsOpen
                ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-100"
                : "text-zinc-700 dark:text-zinc-200"
            }`}
          >
            <Layers size={14} aria-hidden="true" />
            <span>Opciones</span>
          </button>
        </div>
      </div>

      {(filtersOpen || toolsOpen) && (
        <div
          className="fixed inset-0 z-[57] md:hidden"
          onClick={() => {
            setFiltersOpen(false);
            setToolsOpen(false);
          }}
          aria-hidden="true"
        />
      )}

      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            id="map-filter-popover"
            role="group"
            aria-label="Filtrar estaciones por tipo de bote"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.18, ease: [0.23, 1, 0.32, 1] }}
            className={`absolute left-1/2 z-[59] w-[calc(100%-1.5rem)] max-w-[22rem] -translate-x-1/2 md:hidden ${mobilePopoverInset}`}
          >
            <div className="rounded-[1.5rem] border border-black/5 bg-white/97 p-3 text-zinc-900 shadow-2xl backdrop-blur-xl dark:border-white/15 dark:bg-zinc-950/95 dark:text-zinc-50">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[9.5px] font-black uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
                    Filtros del mapa
                  </p>
                  <p className="mt-0.5 text-[13px] font-bold">¿Qué bote buscas?</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Cerrar filtros"
                  className="flex size-11 shrink-0 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:hover:bg-zinc-800 dark:hover:text-white"
                >
                  <X size={17} />
                </button>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {BIN_FILTERS.map((option) => {
                  const isActive = filter === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setFilter(option.id);
                        setSelectedPoint(null);
                        setPanelView("list");
                        setFiltersOpen(false);
                      }}
                      aria-pressed={isActive}
                      className={`flex min-h-[44px] items-center gap-2 rounded-xl border px-2.5 text-[11.5px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                        isActive
                          ? "border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-400/50 dark:bg-emerald-500/15 dark:text-emerald-100"
                          : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {option.color ? <ContainerDot id={option.id} size={8} /> : <Layers size={13} />}
                      <span className="truncate">{option.label}</span>
                      {isActive && <CheckCircle2 size={14} className="ml-auto shrink-0 text-emerald-700 dark:text-emerald-300" />}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-zinc-200/80 pt-2.5 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setFilter("todos");
                    setZoneFilter("todas");
                    setFiltersOpen(false);
                  }}
                  className="min-h-[44px] rounded-lg px-1 text-[10.5px] font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
                >
                  Quitar filtros
                </button>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  {pluralEstaciones(filteredPoints.length)}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {toolsOpen && (
          <motion.div
            id="map-tools-popover"
            role="group"
            aria-label="Herramientas del mapa"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.18, ease: [0.23, 1, 0.32, 1] }}
            className={`absolute left-1/2 z-[59] w-[calc(100%-1.5rem)] max-w-[22rem] -translate-x-1/2 md:hidden ${mobilePopoverInset}`}
          >
            <div className="rounded-[1.5rem] border border-black/5 bg-white/97 p-3 text-zinc-900 shadow-2xl backdrop-blur-xl dark:border-white/15 dark:bg-zinc-950/95 dark:text-zinc-50">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[9.5px] font-black uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
                    Herramientas
                  </p>
                  <p className="mt-0.5 text-[13px] font-bold">Controla el mapa</p>
                </div>
                <button
                  type="button"
                  onClick={() => setToolsOpen(false)}
                  aria-label="Cerrar herramientas"
                  className="flex size-11 shrink-0 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:hover:bg-zinc-800 dark:hover:text-white"
                >
                  <X size={17} />
                </button>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setBaseLayer((layer) => (layer === "satelite" ? "calles" : "satelite"))}
                  aria-pressed={baseLayer === "satelite"}
                  className={`flex min-h-[48px] items-center gap-2 rounded-xl border px-2.5 text-left text-[10.5px] font-semibold leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    baseLayer === "satelite"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-400/50 dark:bg-emerald-500/15 dark:text-emerald-100"
                      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  {baseLayer === "satelite" ? <MapIcon size={15} /> : <Satellite size={15} />}
                  {baseLayer === "satelite" ? "Calles" : "Satélite"}
                </button>
                <button
                  type="button"
                  onClick={handleLocate}
                  disabled={locating}
                  className="flex min-h-[48px] items-center gap-2 rounded-xl border border-zinc-200 bg-white px-2.5 text-left text-[10.5px] font-semibold leading-tight text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  {locating ? <Loader2 size={15} className="animate-spin text-emerald-600" /> : <LocateFixed size={15} className="text-emerald-600 dark:text-emerald-400" />}
                  Mi ubicación
                </button>
                <button
                  type="button"
                  onClick={() => mapRef.current?.zoomIn(0.5)}
                  className="flex min-h-[48px] items-center gap-2 rounded-xl border border-zinc-200 bg-white px-2.5 text-left text-[10.5px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <ZoomIn size={15} /> Acercar
                </button>
                <button
                  type="button"
                  onClick={() => mapRef.current?.zoomOut(0.5)}
                  className="flex min-h-[48px] items-center gap-2 rounded-xl border border-zinc-200 bg-white px-2.5 text-left text-[10.5px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <ZoomOut size={15} /> Alejar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setToolsOpen(false);
                    toggleExpanded();
                  }}
                  aria-pressed={expanded}
                  className={`flex min-h-[48px] items-center gap-2 rounded-xl border px-2.5 text-left text-[10.5px] font-semibold leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    expanded
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-400/50 dark:bg-emerald-500/15 dark:text-emerald-100"
                      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  {expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                  {expanded ? "Salir" : "Pantalla completa"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setToolsOpen(false);
                    setGuideBinId(null);
                    setGuideOpen(true);
                  }}
                  className="flex min-h-[48px] items-center gap-2 rounded-xl border border-zinc-200 bg-white px-2.5 text-left text-[10.5px] font-semibold leading-tight text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <Trash2 size={15} className="text-emerald-600 dark:text-emerald-400" /> Guía de botes
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Filtros por bote (escritorio) ── */}
      <div className={`pointer-events-none absolute left-1/2 z-[58] hidden w-[calc(100%-1.5rem)] max-w-[26rem] -translate-x-1/2 items-end justify-center gap-2 md:inset-x-4 md:flex md:w-auto md:max-w-none md:translate-x-0 ${bottomInset}`}>
        <div className="pointer-events-auto flex min-w-0 items-center justify-center gap-1 rounded-2xl border border-black/5 bg-white/95 p-1 shadow-xl backdrop-blur-xl dark:border-white/15 dark:bg-zinc-950/85">
          <span className="hidden size-8 shrink-0 items-center justify-center text-zinc-400 sm:flex">
            <SlidersHorizontal size={14} />
          </span>
          <div className="no-scrollbar flex min-w-0 items-center gap-0.5 overflow-x-auto overscroll-x-contain sm:gap-1">
            {BIN_FILTERS.map((option) => {
              const isActive = filter === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setFilter(option.id)}
                  aria-pressed={isActive}
                  className={`flex min-h-[44px] shrink-0 items-center gap-1 rounded-xl px-1.5 text-[10.5px] font-bold transition-all active:scale-[0.97] sm:gap-1.5 sm:px-2.5 sm:text-[11px] ${
                    isActive
                      ? "text-white shadow-md"
                      : `${option.textClass} hover:bg-zinc-100 dark:hover:bg-white/10`
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor:
                            option.id === "todos" ? "#047857" : option.color,
                          color:
                            option.id === "todos"
                              ? "#ffffff"
                              : containerTextOn(option.color || "#047857"),
                        }
                      : undefined
                  }
                >
                  {option.color && (
                    <span className="hidden sm:inline-flex">
                      <ContainerDot id={option.id} size={8} />
                    </span>
                  )}
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
        {(filter !== "todos" || zoneFilter !== "todas") && (
          <button
            type="button"
            onClick={() => {
              setFilter("todos");
              setZoneFilter("todas");
            }}
            className="pointer-events-auto hidden min-h-[46px] shrink-0 items-center gap-1.5 rounded-2xl border border-black/5 bg-white/95 px-3 text-[11px] font-bold text-zinc-600 shadow-xl backdrop-blur-xl hover:text-zinc-950 dark:border-white/15 dark:bg-zinc-950/85 dark:text-zinc-300 dark:hover:text-white sm:flex"
          >
            <RefreshCw size={13} />
            Limpiar
          </button>
        )}
      </div>

      {/* Atribución cartográfica */}
      <div
        className={`pointer-events-none absolute z-30 text-[9px] font-medium text-white/75 ${
          expanded
            ? "bottom-[calc(env(safe-area-inset-bottom,0px)+7rem)] left-1/2 -translate-x-1/2 md:bottom-[3.75rem]"
            : "bottom-[calc(env(safe-area-inset-bottom,0px)+12rem)] left-1/2 -translate-x-1/2 md:bottom-[5.5rem]"
        }`}
      >
        <span className="rounded-full bg-black/45 px-2 py-0.5 backdrop-blur-sm">
          {baseLayer === "satelite" ? (
            <>
              Imágenes ©{" "}
              <a
                href="https://www.esri.com"
                target="_blank"
                rel="noreferrer"
                className="pointer-events-auto underline decoration-white/40"
              >
                Esri
              </a>{" "}
              · Maxar · Earthstar
            </>
          ) : (
            <>
              ©{" "}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noreferrer"
                className="pointer-events-auto underline decoration-white/40"
              >
                OpenStreetMap
              </a>
            </>
          )}{" "}
          ·{" "}
          <a
            href="https://leafletjs.com"
            target="_blank"
            rel="noreferrer"
            className="pointer-events-auto underline decoration-white/40"
          >
            Leaflet
          </a>
        </span>
      </div>

      {/* ── Panel de estaciones ── */}
      <AnimatePresence>
        {panelOpen && (
          <motion.aside
            key="map-panel"
            initial={{ y: 42, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 42, opacity: 0 }}
            transition={reduceMotion ? { duration: 0.01 } : APPLE_SPRING_SHEET}
            drag="y"
            dragControls={panelDragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.55 }}
            dragMomentum={false}
            dragSnapToOrigin
            onDragEnd={(_, info) => {
              const projectedY = info.offset.y + projectMomentum(info.velocity.y, 0.992);
              if (projectedY > 120 || info.velocity.y > 350) {
                triggerHaptic("light");
                closePanel();
              }
            }}
            className={`fixed inset-x-0 bottom-0 z-[70] lg:absolute lg:inset-x-auto lg:right-4 lg:w-[390px] ${
              expanded ? "lg:top-4 lg:bottom-4" : "lg:top-[7rem] lg:bottom-4"
            }`}
          >
            <div
              className="flex h-[68dvh] flex-col overflow-hidden rounded-t-[1.75rem] border border-zinc-200/80 bg-white/97 text-zinc-900 shadow-[0_-20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/95 dark:text-zinc-50 lg:h-full lg:rounded-[1.5rem] lg:border-white/10"
            >
              {/* Asa móvil: desliza hacia abajo o toca para cerrar */}
              <button
                type="button"
                onClick={closePanel}
                onPointerDown={(event) => panelDragControls.start(event)}
                aria-label="Cerrar panel de estaciones. Desliza hacia abajo o toca para cerrar."
                className="flex min-h-[44px] w-full shrink-0 touch-none items-center justify-center gap-2 text-zinc-400 transition-colors hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500 dark:text-zinc-500 dark:hover:text-zinc-200 lg:hidden"
              >
                <span className="h-1.5 w-11 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <ChevronDown size={15} aria-hidden="true" />
              </button>

              {/* Cabecera del panel */}
              <div className="flex shrink-0 items-center gap-2 border-b border-zinc-100 px-3 pb-2.5 pt-1 dark:border-zinc-800/80 lg:pt-3">
                {panelView === "detail" && (
                  <button
                    type="button"
                    onClick={() => {
                      setPanelView("list");
                      setSelectedPoint(null);
                    }}
                    aria-label="Volver al listado de estaciones"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                  >
                    <ArrowLeft size={17} />
                  </button>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[9.5px] font-black uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
                    {panelView === "detail"
                      ? activeCfg.planoCode
                      : pluralEstaciones(filteredPoints.length)}
                  </p>
                  <h2 className="truncate text-[15px] font-extrabold leading-tight">
                    {panelView === "detail" && selectedPoint
                      ? selectedPoint.name
                      : `Botes del ${activeCfg.shortName}`}
                  </h2>
                  {panelView === "list" && filter !== "todos" && (
                    <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-zinc-100 px-1.5 py-0.5 text-[9px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      <ContainerDot id={filter} size={6} />
                      Filtro:{" "}
                      {CAMPUS_CONTAINERS_CATALOG.find((bin) => bin.id === filter)?.colorName}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setDirectoryOpen(true)}
                  aria-label="Directorio de edificios del plano"
                  title="Directorio de edificios"
                  className="flex size-11 shrink-0 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                >
                  <Building2 size={16} />
                </button>
                <button
                  type="button"
                  onClick={closePanel}
                  aria-label="Cerrar panel"
                  className="flex size-11 shrink-0 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Contenido */}
              {panelView === "list" ? (
                <>
                  <div className="shrink-0 space-y-2 px-3 pb-2 pt-2.5">
                    <div className="relative">
                      <Search
                        size={15}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                      />
                      <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Buscar edificio, zona o estación…"
                        className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-[16px] font-medium text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 sm:text-[12.5px]"
                      />
                    </div>

                    <div className="relative">
                      <div className="no-scrollbar flex gap-1.5 overflow-x-auto overscroll-x-contain pb-0.5 pr-5">
                        {ZONE_FILTERS.map((zone) => {
                        const isActive = zoneFilter === zone.id;
                        return (
                          <button
                            key={zone.id}
                            type="button"
                            onClick={() => setZoneFilter(zone.id)}
                            aria-pressed={isActive}
                            className={`min-h-[44px] shrink-0 rounded-full border px-3 py-1 text-[10.5px] font-bold transition-colors ${
                              isActive
                                ? "border-emerald-600 bg-emerald-700 text-white"
                                : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            }`}
                          >
                            {zone.label}
                          </button>
                        );
                        })}
                      </div>
                      <span className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent dark:from-zinc-950" />
                    </div>

                    {outside && (
                      <div className="rounded-2xl border border-amber-500/35 bg-amber-500/10 p-2.5">
                        <div className="flex items-start gap-2">
                          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-500" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11.5px] font-bold text-amber-900 dark:text-amber-200">
                              Estás fuera del ITM
                            </p>
                            <p className="mt-0.5 text-[10.5px] leading-snug text-amber-800/90 dark:text-amber-200/80">
                              Campus 1 a {formatDistance(outside.distC1)} · Campus 2 a{" "}
                              {formatDistance(outside.distC2)}. El más cercano es{" "}
                              {CAMPUS_GEO_CONFIG[outside.nearestCampus].shortName}.
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setCampus(outside.nearestCampus);
                                  setOutside(null);
                                }}
                                className="rounded-lg bg-amber-600 px-2.5 py-1 text-[10.5px] font-bold text-white hover:bg-amber-500"
                              >
                                Ver campus más cercano
                              </button>
                              <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${CAMPUS_GEO_CONFIG[outside.nearestCampus].defaultEntrance.lat},${CAMPUS_GEO_CONFIG[outside.nearestCampus].defaultEntrance.lng}&travelmode=walking`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 rounded-lg border border-amber-600/40 px-2.5 py-1 text-[10.5px] font-bold text-amber-800 hover:bg-amber-500/10 dark:text-amber-200"
                              >
                                Cómo llegar <ExternalLink size={10} />
                              </a>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setOutside(null)}
                            aria-label="Descartar aviso"
                            className="flex size-7 shrink-0 items-center justify-center rounded-full text-amber-700 hover:bg-amber-500/15 dark:text-amber-200"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    data-lenis-prevent
                    className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3"
                  >
                    {visiblePoints.length === 0 ? (
                      <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 p-5 text-center dark:border-zinc-700">
                        <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800">
                          <Trash2 size={17} />
                        </div>
                        <p className="text-[12.5px] font-bold">Sin estaciones con este filtro</p>
                        <p className="mt-1 text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">
                          {filterLabel} en {activeCfg.shortName}
                          {query ? ` para “${query}”` : ""}.
                        </p>
                        {otherCampusHasFilter && (
                          <button
                            type="button"
                            onClick={() => {
                              setCampus(otherCampus);
                              setZoneFilter("todas");
                            }}
                            className="mt-2.5 inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-600"
                          >
                            Ver en {CAMPUS_GEO_CONFIG[otherCampus].shortName} <ChevronRight size={12} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setFilter("todos");
                            setZoneFilter("todas");
                            setQuery("");
                          }}
                          className="mt-2 block w-full text-[11px] font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
                        >
                          Quitar filtros
                        </button>
                      </div>
                    ) : (
                      <ul className="space-y-1.5">
                        {visiblePoints.map((point) => {
                          const walk = getWalkInfo(point);
                          const isSelected = selectedPoint?.id === point.id;
                          return (
                            <li key={point.id}>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedPoint(point);
                                  setPanelView("detail");
                                  window.setTimeout(
                                    () => flyToPoint(point, { forcePanel: true }),
                                    30
                                  );
                                }}
                                className={`group flex w-full items-start gap-2.5 rounded-2xl border p-2.5 text-left transition-all active:scale-[0.995] ${
                                  isSelected
                                    ? "border-emerald-500 bg-emerald-50/80 ring-1 ring-emerald-500/30 dark:border-emerald-500 dark:bg-emerald-950/30"
                                    : "border-zinc-200/80 bg-white hover:border-emerald-300 hover:bg-emerald-50/40 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20"
                                }`}
                              >
                                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-[15px] dark:bg-zinc-800">
                                  {ZONE_ICON[point.zoneType]}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="flex items-center gap-1.5">
                                    <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                      {point.zoneType}
                                    </span>
                                    <span className="rounded bg-indigo-100 px-1.5 py-px text-[8.5px] font-bold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
                                      {point.officialBuildingCode}
                                    </span>
                                  </span>
                                  <span className="mt-0.5 block truncate text-[12.5px] font-bold leading-tight text-zinc-900 dark:text-zinc-50">
                                    {point.name}
                                  </span>
                                  <span className="mt-0.5 block truncate text-[10.5px] text-zinc-500 dark:text-zinc-400">
                                    {point.buildingRef}
                                  </span>
                                  <span className="mt-1.5 flex items-center justify-between gap-2">
                                    <span className="flex items-center gap-1">
                                      {point.installedBins.map((id) => (
                                        <ContainerDot key={id} id={id} size={7} />
                                      ))}
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                                      <Footprints size={10} className="text-emerald-600 dark:text-emerald-400" />~
                                      {formatDistance(walk.meters)} · {walk.minutes} min
                                    </span>
                                  </span>
                                </span>
                                <ChevronRight
                                  size={15}
                                  className="mt-2 shrink-0 text-zinc-300 transition-transform group-hover:translate-x-0.5 dark:text-zinc-600"
                                />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    <div className="mt-3 flex flex-col gap-1.5 border-t border-zinc-100 pt-2.5 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => applyReferenceLocation(campus)}
                        className="flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[10.5px] font-semibold text-zinc-500 hover:text-emerald-700 dark:text-zinc-400 dark:hover:text-emerald-400"
                      >
                        <Navigation size={11} />
                        Probar desde el acceso principal
                      </button>
                      <p className="text-center text-[9.5px] leading-snug text-zinc-400 dark:text-zinc-500">
                        Ubicaciones referenciadas al Plano General. La precisión GPS se muestra al
                        usar tu ubicación.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                selectedPoint && (
                  <>
                    <div
                      data-lenis-prevent
                      className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3.5 pb-3 pt-2.5"
                    >
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full bg-emerald-700 px-2 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-white">
                          {selectedPoint.zoneType}
                        </span>
                        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[9.5px] font-bold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
                          {selectedPoint.officialBuildingCode}
                        </span>
                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9.5px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                          <CheckCircle2 size={10} />
                          {selectedPoint.status.split(" ")[0]}
                        </span>
                      </div>

                      <h3 className="mt-2 text-[17px] font-extrabold leading-tight">
                        {selectedPoint.name}
                      </h3>
                      <p className="mt-0.5 text-[11.5px] leading-snug text-zinc-500 dark:text-zinc-400">
                        {selectedPoint.buildingRef}
                      </p>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/70 p-2.5 dark:border-emerald-900/70 dark:bg-emerald-950/30">
                          <div className="flex items-center gap-1 text-[9.5px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                            <Footprints size={11} />
                            Trayecto aprox.
                          </div>
                          <p className="mt-1 text-[15px] font-extrabold text-emerald-900 dark:text-emerald-100">
                            {formatWalk(getWalkInfo(selectedPoint).meters)} ·{" "}
                            {formatDistance(getWalkInfo(selectedPoint).meters)}
                          </p>
                          <p className="mt-0.5 text-[9.5px] leading-snug text-emerald-800/70 dark:text-emerald-200/70">
                            {getWalkInfo(selectedPoint).fromGps
                              ? "Desde tu ubicación GPS"
                              : "Desde el acceso principal"}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-2.5 dark:border-zinc-700/80 dark:bg-zinc-800/40">
                          <div className="flex items-center gap-1 text-[9.5px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            <Clock size={11} className="text-amber-500" />
                            Horario
                          </div>
                          <p className="mt-1 text-[11px] font-bold leading-snug text-zinc-800 dark:text-zinc-200">
                            {selectedPoint.schedule}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="mb-1.5 flex items-center justify-between">
                          <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Botes oficiales disponibles
                          </h4>
                          <span className="flex items-center gap-1">
                            {selectedPoint.installedBins.map((id) => (
                              <ContainerDot key={id} id={id} size={7} />
                            ))}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {selectedPoint.installedBins.map((id) => {
                            const spec = CAMPUS_CONTAINERS_CATALOG.find((bin) => bin.id === id);
                            if (!spec) return null;
                            return (
                              <button
                                key={id}
                                type="button"
                                onClick={() => openGuide(id)}
                                className="flex min-h-[42px] items-center gap-2 rounded-xl border px-2 py-1.5 text-left transition-transform active:scale-[0.97]"
                                style={{
                                  borderColor: `${spec.colorHex}66`,
                                  backgroundColor: `${spec.colorHex}14`,
                                }}
                              >
                                <span
                                  className="flex size-7 shrink-0 items-center justify-center rounded-lg shadow-sm"
                                  style={{
                                    backgroundColor: spec.colorHex,
                                    color: containerTextOn(spec.colorHex),
                                  }}
                                >
                                  <ContainerGlyph id={spec.id} size={14} />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block text-[11px] font-bold leading-tight text-zinc-900 dark:text-zinc-50">
                                    {spec.colorName}
                                  </span>
                                  <span className="block truncate text-[9.5px] text-zinc-500 dark:text-zinc-400">
                                    {spec.name.split("—")[1]?.trim() ?? "Residuos"}
                                  </span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3 dark:border-zinc-700/80 dark:bg-zinc-800/40">
                        <div className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                          <Route size={12} />
                          Andador del Plano General
                        </div>
                        <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                          {selectedPoint.walkingRoute}
                        </p>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between rounded-xl bg-zinc-100/80 px-2.5 py-1.5 text-[9.5px] text-zinc-500 dark:bg-zinc-800/60 dark:text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Crosshair size={10} />
                          {selectedPoint.coordinates.lat.toFixed(6)},{" "}
                          {selectedPoint.coordinates.lng.toFixed(6)}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                          <Lock size={9} />
                          Zona ITM
                        </span>
                      </div>
                      <p className="mt-2 text-[9.5px] leading-relaxed text-zinc-400 dark:text-zinc-500">
                        Las coordenadas están ancladas al Plano General oficial. La precisión de tu
                        ubicación depende del GPS del dispositivo
                        {gps && gps.campus === campus ? ` (±${Math.round(gps.accuracy)} m)` : ""}.
                      </p>
                    </div>

                    <div className="shrink-0 border-t border-zinc-100 bg-white/95 p-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] dark:border-zinc-800 dark:bg-zinc-950/95">
                      <div className="flex gap-2">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPoint.coordinates.lat},${selectedPoint.coordinates.lng}&travelmode=walking`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-3 text-[12px] font-bold text-white transition-colors hover:bg-emerald-600"
                        >
                          <Navigation size={14} />
                          Cómo llegar
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                                                flyToPoint(selectedPoint, { forcePanel: true });
                          }}
                          className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-zinc-200 px-3 text-[12px] font-bold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                        >
                          <LocateFixed size={14} />
                          Centrar
                        </button>
                      </div>
                    </div>
                  </>
                )
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Directorio del Plano General ── */}
      <AnimatePresence>
        {directoryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-end justify-center bg-zinc-950/70 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={() => setDirectoryOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
              className="flex max-h-[88dvh] w-full flex-col overflow-hidden rounded-t-[2rem] border border-zinc-200 bg-white text-zinc-900 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 sm:max-w-2xl sm:rounded-[2rem]"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-zinc-200/80 px-4 py-3 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <Building2 size={17} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold leading-tight">
                      Directorio del Plano General
                    </h3>
                    <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400">
                      {activeCfg.shortName} · {activeCfg.address}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDirectoryOpen(false)}
                  aria-label="Cerrar directorio"
                  className="flex size-9 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <X size={16} />
                </button>
              </div>
              <div
                data-lenis-prevent
                className="min-h-0 flex-1 overflow-y-auto p-3"
              >
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {(campus === "Campus 1 (Principal)"
                    ? PLANO_DIRECTORIO_C1
                    : PLANO_DIRECTORIO_C2
                  ).map((item) => (
                    <div
                      key={`${item.code}-${item.name}`}
                      className="flex items-start gap-2 rounded-xl border border-zinc-200 bg-zinc-50/70 p-2.5 dark:border-zinc-700/80 dark:bg-zinc-800/40"
                    >
                      <span className="shrink-0 rounded-md bg-emerald-700 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                        {item.code}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11.5px] font-bold leading-tight">{item.name}</p>
                        <p className="mt-0.5 text-[9.5px] text-zinc-500 dark:text-zinc-400">
                          {item.zone}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="shrink-0 border-t border-zinc-200/80 p-3 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setDirectoryOpen(false)}
                  className="w-full rounded-xl bg-emerald-700 py-2.5 text-sm font-bold text-white hover:bg-emerald-600"
                >
                  Volver al mapa
                </button>
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
