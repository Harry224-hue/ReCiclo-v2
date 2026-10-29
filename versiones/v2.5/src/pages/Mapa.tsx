import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Navigation,
  Clock,
  CheckCircle2,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  Leaf,
  Recycle,
  Lock,
  LocateFixed,
  SlidersHorizontal,
  AlertTriangle,
  X,
  Footprints,
  Sparkles,
  Building2,
  FileText
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ITM_DISPOSAL_POINTS,
  CampusDisposalPoint,
  CAMPUS_CONTAINERS_CATALOG,
  CampusContainerSpec,
  ContainerId
} from "../data/wasteData";
import { useTheme } from "../context/ThemeContext";

// Configuración geoespacial oficial basada en el PLANO GENERAL DEL ITM
export type CampusKey = "Campus 1 (Principal)" | "Campus 2 (San José de la Huerta)";

interface CampusGeoConfig {
  id: CampusKey;
  name: string;
  shortName: string;
  tag: string;
  planoCode: string;
  address: string;
  center: { lat: number; lng: number };
  defaultEntrance: { lat: number; lng: number; name: string };
  zoom: number;
  minZoom: number;
  bounds: L.LatLngBoundsExpression;
  perimeterPolygon: [number, number][];
}

const CAMPUS_GEO_CONFIG: Record<CampusKey, CampusGeoConfig> = {
  "Campus 1 (Principal)": {
    id: "Campus 1 (Principal)",
    name: "Campus 1 · Central (Av. Tecnológico #1500)",
    shortName: "Campus 1 · Central",
    tag: "Av. Tecnológico",
    planoCode: "PLANO GENERAL CAMPUS Nº 1",
    address: "Av. Tecnológico #1500, Lomas de Santiaguito, C.P. 58120, Morelia, Mich.",
    center: { lat: 19.721841, lng: -101.18529 }, // Centro calculado desde el Plano General Nº 1
    defaultEntrance: { lat: 19.7236, lng: -101.18665, name: "Acceso Principal Av. Tecnológico #1500 (Edificio A)" },
    zoom: 17,
    minZoom: 16,
    bounds: [
      [19.71882, -101.188896], // Suroeste
      [19.724862, -101.181684], // Noreste
    ],
    // Polígono perimetral oficial según el Plano General Nº 1
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
    name: "Campus 2 · San José (Camino de la Arboleda S/N)",
    shortName: "Campus 2 · San José",
    tag: "Camino de la Arboleda",
    planoCode: "PLANO GENERAL CAMPUS Nº 2",
    address: "Camino de la Arboleda S/N, Residencial San José de la Huerta, C.P. 58341, Morelia, Mich.",
    center: { lat: 19.644768, lng: -101.224991 }, // Centro calculado desde el Plano General Nº 2
    defaultEntrance: { lat: 19.64650, lng: -101.22600, name: "Acceso Principal Camino de la Arboleda S/N" },
    zoom: 17,
    minZoom: 16,
    bounds: [
      [19.642624, -101.227073], // Suroeste
      [19.646912, -101.222909], // Noreste
    ],
    // Polígono perimetral oficial según el Plano General Nº 2
    perimeterPolygon: [
      [19.646238, -101.226473],
      [19.646312, -101.223692],
      [19.643545, -101.223509],
      [19.643224, -101.226263],
    ],
  },
};

// Directorio oficial de construcciones del Plano General ITM
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
  { code: "Plazas Cívicas", name: "2 Plazas Cívicas Semicirculares con Rosetón", zone: "Explanadas" },
  { code: "Canchas & PTAR", name: "Área Deportiva y Planta de Tratamiento", zone: "Poniente" },
  { code: "Acceso", name: "Pórtico y Estacionamiento sobre Camino de la Arboleda", zone: "Norte" },
];

// Fórmula Haversine para distancias exactas
function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

type ActiveDrawerTab = "puntos" | "ficha" | "contenedores" | "directorio";

type FilterMode =
    | "todos"
    | "pony_plaza"
    | "cafeterias"
    | "bin-verde"
    | "bin-amarillo"
    | "bin-azul"
    | "bin-negro"
    | "bin-pilas";

export default function Mapa() {
  const [selectedCampus, setSelectedCampus] = useState<CampusKey>("Campus 1 (Principal)");
  const [activeFilter, setActiveFilter] = useState<FilterMode>("todos");
  const [activePoint, setActivePoint] = useState<CampusDisposalPoint>(ITM_DISPOSAL_POINTS[0]);
  const [selectedContainer, setSelectedContainer] = useState<CampusContainerSpec>(CAMPUS_CONTAINERS_CATALOG[0]);
  const [activeTab, setActiveTab] = useState<ActiveDrawerTab>("puntos");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocationCampus, setUserLocationCampus] = useState<CampusKey | null>(null);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "info" | "warning" } | null>(null);
  const [showPlanoModal, setShowPlanoModal] = useState<boolean>(false);
  const [baseLayer, setBaseLayer] = useState<"calles" | "satelite">("satelite");
  const [outsideCampusNotice, setOutsideCampusNotice] = useState<{
    distC1Km: string;
    distC2Km: string;
    nearestCampus: CampusKey;
  } | null>(null);

  const { isDarkMode, accent } = useTheme();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const polygonLayerRef = useRef<L.Polygon | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const showToast = (text: string, type: "success" | "info" | "warning" = "info", duration = 3800) => {
    setToastMsg({ text, type });
    setTimeout(() => {
      setToastMsg((prev) => (prev?.text === text ? null : prev));
    }, duration);
  };

  const filterOptions: { id: FilterMode; label: string; icon: string }[] = [
    { id: "todos", label: "Todos los botes", icon: "🌐" },
    { id: "pony_plaza", label: "Pony Plaza & Explanadas", icon: "🐎" },
    { id: "cafeterias", label: "Cafeterías & Comedores", icon: "☕" },
    { id: "bin-verde", label: "Bote Verde (Orgánicos)", icon: "🟢" },
    { id: "bin-amarillo", label: "Bote Amarillo (Reciclables)", icon: "🟡" },
    { id: "bin-azul", label: "Bote Azul (PET/Plásticos)", icon: "🔵" },
    { id: "bin-negro", label: "Bote Negro (No reciclables)", icon: "⚫" },
    { id: "bin-pilas", label: "Pilas y RAEE", icon: "🔋" },
  ];

  // Puntos filtrados según el campus y filtro
  const filteredPoints = useMemo(() => {
    return ITM_DISPOSAL_POINTS.filter((point) => {
      if (point.campus !== selectedCampus) return false;

      if (activeFilter === "todos") return true;
      if (activeFilter === "pony_plaza") return point.zoneType === "Pony Plaza / Explanada";
      if (activeFilter === "cafeterias") return point.zoneType === "Cafetería y Alimentos";
      if (activeFilter.startsWith("bin-")) {
        return point.installedBins.includes(activeFilter as ContainerId);
      }
      return true;
    });
  }, [selectedCampus, activeFilter]);

  // Si cambia el campus o filtro, garantizar un punto activo visible
  useEffect(() => {
    if (filteredPoints.length > 0) {
      const stillVisible = filteredPoints.some((p) => p.id === activePoint.id);
      if (!stillVisible) {
        setActivePoint(filteredPoints[0]);
      }
    }
  }, [filteredPoints, activePoint.id]);

  // 1. Inicializar Leaflet con confinamiento estricto
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialCfg = CAMPUS_GEO_CONFIG["Campus 1 (Principal)"];

    const map = L.map(mapContainerRef.current, {
      center: [initialCfg.center.lat, initialCfg.center.lng],
      zoom: initialCfg.zoom,
      minZoom: initialCfg.minZoom,
      maxZoom: 19,
      maxBounds: initialCfg.bounds,
      maxBoundsViscosity: 1.0, // Impide 100% que el mapa se arrastre fuera del perímetro oficial
      zoomControl: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Mapa base SIN API key: OpenStreetMap (calles) o Esri World Imagery (satélite)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    if (baseLayer === "satelite") {
      tileLayerRef.current = L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            maxZoom: 19,
            maxNativeZoom: 19,
            attribution: "Imágenes &copy; Esri, Maxar, Earthstar Geographics · IT Morelia",
          }
      ).addTo(map);
    } else {
      tileLayerRef.current = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        maxNativeZoom: 19,
        className: isDarkMode ? "itm-tiles-dark" : "",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · IT Morelia',
      }).addTo(map);
    }
  }, [isDarkMode, baseLayer]);

  // 3. Ajustar límites al campus seleccionado
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const currentCfg = CAMPUS_GEO_CONFIG[selectedCampus];

    map.setMaxBounds(currentCfg.bounds);
    map.setMinZoom(currentCfg.minZoom);
    map.setMaxZoom(19);

    if (polygonLayerRef.current) {
      polygonLayerRef.current.remove();
      polygonLayerRef.current = null;
    }

    polygonLayerRef.current = L.polygon(currentCfg.perimeterPolygon, {
      color: baseLayer === "satelite" || isDarkMode ? "#34d399" : "#059669",
      weight: 2.5,
      dashArray: "6, 8",
      fillColor: isDarkMode ? "#10b981" : "#10b981",
      fillOpacity: isDarkMode ? 0.08 : 0.07,
    }).bindTooltip(`Perímetro oficial: ${currentCfg.planoCode}`, { sticky: true }).addTo(map);

    map.flyTo([currentCfg.center.lat, currentCfg.center.lng], currentCfg.zoom, {
      duration: 1.1,
      easeLinearity: 0.25,
    });
  }, [selectedCampus, isDarkMode, baseLayer]);

  // 4. Marcadores interactivos basados en el Plano General
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    filteredPoints.forEach((point) => {
      const isSelected = activePoint.id === point.id;

      let zoneEmoji = "📍";
      if (point.zoneType === "Pony Plaza / Explanada") zoneEmoji = "🐎";
      else if (point.zoneType === "Cafetería y Alimentos") zoneEmoji = "☕";
      else if (point.zoneType === "Biblioteca e Información") zoneEmoji = "📚";
      else if (point.installedBins.includes("bin-pilas")) zoneEmoji = "🔋";
      else if (point.zoneType === "Deportiva") zoneEmoji = "⚽";

      const binColorDots = point.installedBins.map((binId) => {
        if (binId === "bin-verde") return "#16a34a";
        if (binId === "bin-amarillo") return "#eab308";
        if (binId === "bin-negro") return "#27272a";
        if (binId === "bin-azul") return "#2563eb";
        return "#ea580c";
      });

      const iconHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 44px; height: 52px; cursor: pointer;">
          ${isSelected ? `
            <div style="position: absolute; width: 42px; height: 42px; border-radius: 9999px; background: ${isDarkMode ? '#34d399' : '#10b981'}; opacity: 0.45; animation: itm-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          ` : ""}
          <div style="
            width: ${isSelected ? "36px" : "30px"};
            height: ${isSelected ? "36px" : "30px"};
            border-radius: 12px;
            background: ${isSelected ? (isDarkMode ? "#064e3b" : "#047857") : (isDarkMode ? "#18181b" : "#ffffff")};
            border: 2px solid ${isSelected ? (isDarkMode ? "#34d399" : "#10b981") : (isDarkMode ? "#3f3f46" : "#cbd5e1")};
            box-shadow: 0 4px 14px rgba(0,0,0, ${isDarkMode ? "0.7" : "0.25"});
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isSelected ? "17px" : "14px"};
            transition: all 0.2s ease;
          ">
            <span>${zoneEmoji}</span>
          </div>
          <!-- Clave del Plano General en badge miniatura -->
          <div style="display: flex; gap: 2px; margin-top: 3px; background: rgba(0,0,0,0.85); padding: 1.5px 4px; border-radius: 9999px; box-shadow: 0 1px 4px rgba(0,0,0,0.4);">
            ${binColorDots.map((c) => `<span style="width: 5px; height: 5px; border-radius: 50%; background-color: ${c}; display: inline-block;"></span>`).join("")}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: "custom-itm-station-marker",
        html: iconHtml,
        iconSize: [44, 52],
        iconAnchor: [22, 26],
        popupAnchor: [0, -28],
      });

      const marker = L.marker([point.coordinates.lat, point.coordinates.lng], { icon: customIcon }).addTo(map);

      const popupHtml = `
        <div style="min-width: 200px; padding: 4px 2px; font-family: system-ui, sans-serif;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 2px;">
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #10b981;">
              ${point.zoneType}
            </span>
            <span style="font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 4px; background: #e0e7ff; color: #3730a3;">
              ${point.officialBuildingCode}
            </span>
          </div>
          <div style="font-size: 13px; font-weight: 800; line-height: 1.25; margin-bottom: 4px;">
            ${point.name}
          </div>
          <div style="font-size: 11px; opacity: 0.85; margin-bottom: 6px;">
            ${point.buildingRef}
          </div>
          <div style="font-size: 10px; font-weight: 700; margin-bottom: 4px;">
            Botes oficiales disponibles:
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 3px;">
            ${point.installedBins.map((b) => {
        const spec = CAMPUS_CONTAINERS_CATALOG.find((c) => c.id === b);
        return `<span style="font-size: 9px; font-weight: 700; padding: 1.5px 6px; border-radius: 4px; background: ${spec?.colorHex || '#52525b'}; color: #ffffff;">${spec?.colorName || b}</span>`;
      }).join("")}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        maxWidth: 240,
        minWidth: 190,
        autoPanPaddingTopLeft: [12, 64],
        autoPanPaddingBottomRight: [12, 72],
      });

      marker.on("click", () => {
        focusOnPoint(point, false);
      });

      markersRef.current[point.id] = marker;
    });

    // Trazo de ruta peatonal
    if (activePoint) {
      const originCoords = (userCoords && userLocationCampus === selectedCampus)
          ? [userCoords.lat, userCoords.lng]
          : [CAMPUS_GEO_CONFIG[selectedCampus].defaultEntrance.lat, CAMPUS_GEO_CONFIG[selectedCampus].defaultEntrance.lng];

      const routeCoords: [number, number][] = [
        [originCoords[0], originCoords[1]],
        [(originCoords[0] + activePoint.coordinates.lat) / 2, (originCoords[1] + activePoint.coordinates.lng) / 2],
        [activePoint.coordinates.lat, activePoint.coordinates.lng],
      ];

      routeLineRef.current = L.polyline(routeCoords, {
        color: isDarkMode ? "#34d399" : "#059669",
        weight: 3.5,
        opacity: 0.9,
        dashArray: "5, 8",
      }).addTo(map);

      if (markersRef.current[activePoint.id]) {
        markersRef.current[activePoint.id].openPopup();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredPoints, activePoint, userCoords, userLocationCampus, selectedCampus, isDarkMode]);

  // Centrar y enfocar un punto
  const focusOnPoint = (point: CampusDisposalPoint, switchTab = true) => {
    setActivePoint(point);
    if (switchTab) setActiveTab("ficha");

    if (point.campus !== selectedCampus) {
      setSelectedCampus(point.campus);
    }

    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([point.coordinates.lat, point.coordinates.lng], 18, {
        duration: 1.0,
        easeLinearity: 0.25,
      });
      if (markersRef.current[point.id]) {
        markersRef.current[point.id].openPopup();
      }
    }
  };

  // 5. Verificación estricta de GPS: Comprobar presencia física real en el ITM
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showToast("Geolocalización no soportada en este navegador.", "warning");
      return;
    }

    showToast("Verificando si te encuentras dentro del Instituto Tecnológico de Morelia...", "info", 2000);

    navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;

          const c1Cfg = CAMPUS_GEO_CONFIG["Campus 1 (Principal)"];
          const c2Cfg = CAMPUS_GEO_CONFIG["Campus 2 (San José de la Huerta)"];

          const distToC1 = calculateDistanceMeters(latitude, longitude, c1Cfg.center.lat, c1Cfg.center.lng);
          const distToC2 = calculateDistanceMeters(latitude, longitude, c2Cfg.center.lat, c2Cfg.center.lng);

          const isInsideCampus1 = distToC1 <= 600;
          const isInsideCampus2 = distToC2 <= 350;

          // Caso 1: Sí está en Campus 1
          if (isInsideCampus1) {
            setUserCoords({ lat: latitude, lng: longitude });
            setUserLocationCampus("Campus 1 (Principal)");
            if (selectedCampus !== "Campus 1 (Principal)") {
              setSelectedCampus("Campus 1 (Principal)");
            }
            renderUserMarker(latitude, longitude, "Campus 1 · Central");
            showToast("📍 Estás en Campus 1. Trazando ruta al bote más cercano.", "success");
            findAndSelectNearestPoint(latitude, longitude, "Campus 1 (Principal)");
            return;
          }

          // Caso 2: Sí está en Campus 2
          if (isInsideCampus2) {
            setUserCoords({ lat: latitude, lng: longitude });
            setUserLocationCampus("Campus 2 (San José de la Huerta)");
            if (selectedCampus !== "Campus 2 (San José de la Huerta)") {
              setSelectedCampus("Campus 2 (San José de la Huerta)");
            }
            renderUserMarker(latitude, longitude, "Campus 2 · San José");
            showToast("📍 Estás en Campus 2. Trazando ruta al bote más cercano.", "success");
            findAndSelectNearestPoint(latitude, longitude, "Campus 2 (San José de la Huerta)");
            return;
          }

          // Caso 3: Está fuera de ambos campus
          const nearestCampus: CampusKey = distToC1 <= distToC2 ? "Campus 1 (Principal)" : "Campus 2 (San José de la Huerta)";
          setOutsideCampusNotice({
            distC1Km: (distToC1 / 1000).toFixed(1),
            distC2Km: (distToC2 / 1000).toFixed(1),
            nearestCampus,
          });
        },
        (err) => {
          console.warn("[GPS]", err);
          showToast("No se pudo obtener el GPS. Verifica los permisos de ubicación.", "warning");
        },
        { enableHighAccuracy: true, timeout: 9000 }
    );
  };

  const findAndSelectNearestPoint = (lat: number, lng: number, campus: CampusKey) => {
    const campusPoints = ITM_DISPOSAL_POINTS.filter((p) => p.campus === campus);
    if (campusPoints.length === 0) return;

    let nearest = campusPoints[0];
    let minDistance = calculateDistanceMeters(lat, lng, nearest.coordinates.lat, nearest.coordinates.lng);

    campusPoints.forEach((p) => {
      const dist = calculateDistanceMeters(lat, lng, p.coordinates.lat, p.coordinates.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = p;
      }
    });

    focusOnPoint(nearest, true);
  };

  const renderUserMarker = (lat: number, lng: number, label: string) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) userMarkerRef.current.remove();

    const userIcon = L.divIcon({
      className: "user-loc-marker",
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
          <div style="position: absolute; inset: -4px; border-radius: 9999px; background: #3b82f6; opacity: 0.45; animation: itm-ping 1.2s infinite;"></div>
          <div style="width: 18px; height: 18px; border-radius: 9999px; background: #2563eb; border: 2.5px solid #ffffff; box-shadow: 0 2px 10px rgba(0,0,0,0.5);"></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    userMarkerRef.current = L.marker([lat, lng], { icon: userIcon })
        .bindPopup(`<div style="font-weight: 700; font-size: 12px; color: #18181b;">📍 Tu posición en ${label}</div>`)
        .addTo(map);

    map.flyTo([lat, lng], 18, { duration: 1.1 });
  };

  // Simular posición en lugares auténticos del Plano General
  const handleSimulatePosition = (lat: number, lng: number, name: string, campus: CampusKey) => {
    setSelectedCampus(campus);
    setUserCoords({ lat, lng });
    setUserLocationCampus(campus);
    setOutsideCampusNotice(null);
    renderUserMarker(lat, lng, name);
    showToast(`📍 Posición fijada en: ${name}. Calculando rutas peatonales.`, "success");
    findAndSelectNearestPoint(lat, lng, campus);
  };

  const recenterCampus = () => {
    const cfg = CAMPUS_GEO_CONFIG[selectedCampus];
    mapInstanceRef.current?.flyTo([cfg.center.lat, cfg.center.lng], cfg.zoom, { duration: 1 });
  };

  const zoomIn = () => mapInstanceRef.current?.zoomIn();
  const zoomOut = () => mapInstanceRef.current?.zoomOut();

  const walkingInfo = useMemo(() => {
    const origin = (userCoords && userLocationCampus === selectedCampus)
        ? userCoords
        : CAMPUS_GEO_CONFIG[selectedCampus].defaultEntrance;

    const meters = calculateDistanceMeters(
        origin.lat,
        origin.lng,
        activePoint.coordinates.lat,
        activePoint.coordinates.lng
    );

    const minutes = Math.max(1, Math.ceil(meters / 75));
    const isFromUser = !!(userCoords && userLocationCampus === selectedCampus);

    return { meters, minutes, isFromUser };
  }, [userCoords, userLocationCampus, selectedCampus, activePoint]);

  return (
      <div className="pt-20 pb-20 md:pt-24 md:pb-12 px-3 sm:px-6 max-w-7xl mx-auto">
        <style>{`
        .itm-tiles-dark{filter:invert(1) hue-rotate(180deg) brightness(.9) contrast(.9);}
        @keyframes itm-ping{75%,100%{transform:scale(2);opacity:0}}
        .custom-itm-station-marker,.user-loc-marker{touch-action:manipulation;-webkit-tap-highlight-color:transparent;}
        .leaflet-popup-content{margin:10px 12px !important;}
        .leaflet-popup-close-button{width:36px !important;height:36px !important;font-size:24px !important;line-height:34px !important;}
        .leaflet-container{touch-action:pan-x pan-y;}
      `}</style>

        {/* ─── ENCABEZADO OFICIAL PLANO GENERAL ITM ─── */}
        <div className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold mb-1.5 ${accent.badge}`}>
              <Building2 size={13} />
              <span>{CAMPUS_GEO_CONFIG[selectedCampus].planoCode}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Estaciones de Residuos Oficiales ITM
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 max-w-2xl mt-0.5">
              Ubicadas según el Plano General oficial: aulas, canchas, cafetería y comedor de ambos campus.
            </p>
          </div>

          {/* Botón para abrir directorio del Plano General y badge de bloqueo */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
                onClick={() => setShowPlanoModal(true)}
                className="flex items-center gap-1.5 px-3 min-h-[44px] rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700 shadow-xs"
            >
              <FileText size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span>Directorio del Plano General</span>
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 shadow-xs">
              <Lock size={12} className="text-emerald-600 dark:text-emerald-400" />
              <span>Zona ITM bloqueada</span>
            </div>
          </div>
        </div>

        {/* ─── WORKSTATION DE MAPA INTERACTIVO ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

          {/* ───────── MAPA HERO ───────── */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="relative w-full h-[64dvh] min-h-[400px] max-h-[600px] sm:h-[530px] sm:max-h-none lg:h-[630px] rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl bg-zinc-950">

              {/* Lienzo Leaflet (CartoDB Dark Matter nativo - Alto contraste) */}
              <div ref={mapContainerRef} className="w-full h-full z-10" />

              {/* BARRA SUPERIOR: selector de campus (izq.) + herramientas en columna (der.) */}
              <div className="absolute top-2.5 inset-x-2.5 z-20 flex items-start justify-between gap-2 pointer-events-none">
                <div className="flex items-center p-1 rounded-2xl bg-zinc-950/90 backdrop-blur-md border border-white/20 shadow-xl pointer-events-auto">
                  {(["Campus 1 (Principal)", "Campus 2 (San José de la Huerta)"] as CampusKey[]).map((key, i) => (
                      <button
                          key={key}
                          onClick={() => setSelectedCampus(key)}
                          className={`min-h-[40px] px-3 rounded-xl text-xs font-bold transition-all cursor-pointer touch-manipulation ${
                              selectedCampus === key
                                  ? "bg-emerald-500 text-white shadow-md ring-1 ring-emerald-300/50"
                                  : "text-zinc-300 hover:text-white"
                          }`}
                      >
                        <span className="sm:hidden">Campus {i + 1}</span>
                        <span className="hidden sm:inline">{i === 0 ? "Campus 1 · Central" : "Campus 2 · San José"}</span>
                      </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-1 bg-zinc-950/90 backdrop-blur-md p-1 rounded-2xl border border-white/20 shadow-xl pointer-events-auto">
                  <button
                      onClick={() => setBaseLayer((b) => (b === "satelite" ? "calles" : "satelite"))}
                      aria-label="Cambiar capa del mapa"
                      title={baseLayer === "satelite" ? "Ver mapa de calles" : "Ver satélite"}
                      className="min-h-[40px] min-w-[40px] px-2 rounded-xl text-xs font-bold text-zinc-200 hover:text-white hover:bg-white/15 flex items-center justify-center gap-1 transition-colors cursor-pointer touch-manipulation"
                  >
                    <span>{baseLayer === "satelite" ? "🗺️" : "🛰️"}</span>
                    <span className="hidden sm:inline">{baseLayer === "satelite" ? "Calles" : "Satélite"}</span>
                  </button>
                  <button
                      onClick={handleGetLocation}
                      aria-label="Comprobar si estoy en el Tec"
                      title="Comprobar mi GPS en el Tec"
                      className="size-10 rounded-xl text-zinc-200 hover:text-white hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer touch-manipulation"
                  >
                    <LocateFixed size={18} className="text-emerald-400" />
                  </button>
                  <button
                      onClick={recenterCampus}
                      aria-label="Centrar campus"
                      title="Centrar vista"
                      className="size-10 rounded-xl text-zinc-200 hover:text-white hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer touch-manipulation"
                  >
                    <Maximize2 size={17} />
                  </button>
                  <button
                      onClick={zoomIn}
                      aria-label="Acercar"
                      className="hidden sm:flex size-10 rounded-xl text-zinc-200 hover:text-white hover:bg-white/15 items-center justify-center transition-colors cursor-pointer"
                  >
                    <ZoomIn size={18} />
                  </button>
                  <button
                      onClick={zoomOut}
                      aria-label="Alejar"
                      className="hidden sm:flex size-10 rounded-xl text-zinc-200 hover:text-white hover:bg-white/15 items-center justify-center transition-colors cursor-pointer"
                  >
                    <ZoomOut size={18} />
                  </button>
                </div>
              </div>

              {/* Toast flotante */}
              <AnimatePresence>
                {toastMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-[68px] sm:bottom-auto sm:top-16 inset-x-0 mx-auto w-fit max-w-[88%] z-30 px-3.5 py-2 rounded-2xl pointer-events-none bg-zinc-950/90 backdrop-blur-md text-white text-xs font-semibold border border-white/20 shadow-xl flex items-center gap-2"
                    >
                      {toastMsg.type === "success" && <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />}
                      {toastMsg.type === "warning" && <AlertTriangle size={13} className="text-amber-400 shrink-0" />}
                      {toastMsg.type === "info" && <Navigation size={13} className="text-sky-400 animate-pulse shrink-0" />}
                      <span className="leading-snug text-left">{toastMsg.text}</span>
                    </motion.div>
                )}
              </AnimatePresence>

              {/* BARRA INFERIOR: FILTROS DIRECTOS POR BOTE / ZONA */}
              <div className="absolute bottom-2.5 inset-x-2.5 z-20 flex items-center gap-1.5 overflow-x-auto overscroll-x-contain snap-x pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pointer-events-auto">
              <span className="hidden sm:flex shrink-0 size-8 rounded-full bg-zinc-950/80 backdrop-blur-md text-emerald-400 border border-white/20 items-center justify-center">
                <SlidersHorizontal size={13} />
              </span>
                {filterOptions.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => setActiveFilter(opt.id)}
                        className={`snap-start shrink-0 px-3.5 min-h-[40px] rounded-full text-xs font-bold backdrop-blur-md border transition-all cursor-pointer touch-manipulation flex items-center gap-1.5 ${
                            activeFilter === opt.id
                                ? "bg-emerald-600 text-white border-emerald-400 shadow-md ring-1 ring-emerald-300/40"
                                : "bg-zinc-950/80 text-zinc-300 hover:text-white border-white/20"
                        }`}
                    >
                      <span>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                ))}
              </div>

              {/* Badge de Dirección oficial */}
              <div className="hidden sm:flex absolute bottom-12 left-3 z-20 items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md border border-white/15 text-[10px] text-zinc-300">
                <MapPin size={10} className="text-emerald-400" />
                <span>{CAMPUS_GEO_CONFIG[selectedCampus].address}</span>
              </div>

            </div>
            <p className="mt-1.5 px-2 text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">
              {baseLayer === "satelite" ? (
                  <>Imágenes © Esri, Maxar, Earthstar Geographics</>
              ) : (
                  <>
                    © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline">OpenStreetMap</a> contributors
                  </>
              )}{" "}
              · <a href="https://leafletjs.com" target="_blank" rel="noreferrer" className="underline">Leaflet</a>
            </p>
          </div>

          {/* ───────── CONSOLA MULTIMODAL INTEGRADA ───────── */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="h-[75dvh] min-h-[440px] max-h-[640px] sm:h-[530px] sm:max-h-none lg:h-[630px] rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl flex flex-col overflow-hidden">

              {/* Header de Pestañas con Iconografía y Conteo */}
              <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80">
                <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-zinc-200/80 dark:bg-zinc-800 text-xs font-bold">
                  <button
                      onClick={() => setActiveTab("puntos")}
                      className={`py-2.5 min-h-[44px] px-1 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer touch-manipulation ${
                          activeTab === "puntos"
                              ? "bg-white dark:bg-zinc-950 text-emerald-700 dark:text-emerald-400 shadow-sm"
                              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                      }`}
                  >
                    <MapPin size={13} />
                    <span>Botes ({filteredPoints.length})</span>
                  </button>
                  <button
                      onClick={() => setActiveTab("ficha")}
                      className={`py-2.5 min-h-[44px] px-1 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer touch-manipulation ${
                          activeTab === "ficha"
                              ? "bg-white dark:bg-zinc-950 text-emerald-700 dark:text-emerald-400 shadow-sm"
                              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                      }`}
                  >
                    <Footprints size={13} />
                    <span><span className="sm:hidden">Ruta</span><span className="hidden sm:inline">Ficha & Ruta</span></span>
                  </button>
                  <button
                      onClick={() => setActiveTab("contenedores")}
                      className={`py-2.5 min-h-[44px] px-1 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer touch-manipulation ${
                          activeTab === "contenedores"
                              ? "bg-white dark:bg-zinc-950 text-emerald-700 dark:text-emerald-400 shadow-sm"
                              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                      }`}
                  >
                    <Trash2 size={13} />
                    <span><span className="sm:hidden">Catálogo</span><span className="hidden sm:inline">Catálogo ITM</span></span>
                  </button>
                </div>
              </div>

              {/* Contenido con Scroll Propio */}
              <div className="flex-1 min-h-0 overflow-y-auto p-3.5 space-y-3">

                {/* ─── PESTAÑA 1: LISTADO OFICIAL DE BOTES ─── */}
                {activeTab === "puntos" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 px-1 font-semibold">
                        <span>{CAMPUS_GEO_CONFIG[selectedCampus].shortName}</span>
                        <span>Toca para ver botes</span>
                      </div>

                      {filteredPoints.length === 0 ? (
                          <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
                            No hay estaciones con este filtro en este campus.
                            <button
                                onClick={() => setActiveFilter("todos")}
                                className="block mx-auto mt-2 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                            >
                              Ver todos los botes
                            </button>
                          </div>
                      ) : (
                          filteredPoints.map((point) => {
                            const isSelected = activePoint.id === point.id;
                            return (
                                <div
                                    key={point.id}
                                    onClick={() => focusOnPoint(point, false)}
                                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                                        isSelected
                                            ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600 shadow-sm ring-1 ring-emerald-500/30"
                                            : "bg-zinc-50/70 dark:bg-zinc-800/40 border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
                                    }`}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                  {point.zoneType}
                                </span>
                                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                                  {point.officialBuildingCode}
                                </span>
                                      </div>
                                      <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight mt-0.5">
                                        {point.name}
                                      </h4>
                                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                                        {point.buildingRef}
                                      </p>
                                    </div>
                                    <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200">
                              {point.campus.includes("Campus 2") ? "C2" : "C1"}
                            </span>
                                  </div>

                                  {/* Botes Físicos de la Estación */}
                                  <div className="mt-2.5 pt-2 border-t border-zinc-200/50 dark:border-zinc-700/50 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">Botes:</span>
                                      {point.installedBins.map((binId) => {
                                        const spec = CAMPUS_CONTAINERS_CATALOG.find((c) => c.id === binId);
                                        return (
                                            <span
                                                key={binId}
                                                className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white shadow-xs"
                                                style={{ backgroundColor: spec?.colorHex || "#3f3f46" }}
                                                title={spec?.name}
                                            >
                                    {spec?.colorName}
                                  </span>
                                        );
                                      })}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          focusOnPoint(point, true);
                                        }}
                                        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 shrink-0 min-h-[40px] px-3 -mr-2 touch-manipulation"
                                    >
                                      <span>Ruta</span>
                                      <ChevronRight size={11} />
                                    </button>
                                  </div>
                                </div>
                            );
                          })
                      )}
                    </div>
                )}

                {/* ─── PESTAÑA 2: FICHA DETALLADA Y RUTA ─── */}
                {activeTab === "ficha" && (
                    <div className="space-y-3">

                      {/* Encabezado */}
                      <div className="pb-2 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                        {activePoint.zoneType}
                      </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {activePoint.officialBuildingCode}
                      </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight mt-1">
                          {activePoint.name}
                        </h3>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                          {activePoint.buildingRef}
                        </p>
                      </div>

                      {/* Trayecto a pie */}
                      <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                        <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <Footprints size={14} className="text-emerald-600 dark:text-emerald-400" />
                        <span>Trayecto a pie</span>
                      </span>
                          <span className="font-extrabold text-emerald-700 dark:text-emerald-300">
                        ~{walkingInfo.minutes} min ({walkingInfo.meters} metros)
                      </span>
                        </div>
                        <p className="text-[11px] text-emerald-900/80 dark:text-emerald-200/80 leading-relaxed">
                          {walkingInfo.isFromUser
                              ? "Calculado en tiempo real desde tu posición física en el campus."
                              : `Ruta calculada desde el ${CAMPUS_GEO_CONFIG[selectedCampus].defaultEntrance.name}.`}
                        </p>
                      </div>

                      {/* Botes físicos disponibles */}
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                          <Trash2 size={12} className="text-emerald-600 dark:text-emerald-400" />
                          <span>Botes disponibles en esta estación (toca para ver detalles):</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-1.5">
                          {activePoint.installedBins.map((binId) => {
                            const spec = CAMPUS_CONTAINERS_CATALOG.find((c) => c.id === binId);
                            if (!spec) return null;
                            const isSelectedBin = selectedContainer.id === spec.id;
                            return (
                                <button
                                    key={binId}
                                    onClick={() => {
                                      setSelectedContainer(spec);
                                      setActiveTab("contenedores");
                                    }}
                                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2 ${
                                        isSelectedBin
                                            ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-600 ring-1 ring-emerald-500"
                                            : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                    }`}
                                >
                            <span
                                className="size-3.5 rounded-full shrink-0 shadow-xs"
                                style={{ backgroundColor: spec.colorHex }}
                            />
                                  <div className="min-w-0 flex-1">
                                    <div className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 truncate">
                                      {spec.name.split("—")[0].trim()}
                                    </div>
                                    <div className="text-[9px] text-zinc-500 dark:text-zinc-400 truncate">
                                      {spec.name.split("—")[1]?.trim() || "Residuos"}
                                    </div>
                                  </div>
                                  <ChevronRight size={12} className="text-zinc-400 shrink-0" />
                                </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Horario y Andador oficial */}
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80">
                          <div className="flex items-center gap-1 font-bold text-zinc-800 dark:text-zinc-200 mb-0.5 text-[11px]">
                            <Clock size={12} className="text-amber-500" />
                            <span>Horario de servicio</span>
                          </div>
                          <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                            {activePoint.schedule}
                          </p>
                        </div>

                        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                            <Navigation size={13} />
                            <span>Andador peatonal del Plano General</span>
                          </div>
                          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                            {activePoint.walkingRoute}
                          </p>
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 italic">
                            * Recuerda respetar el césped y caminar solo por andadores (ITM Sec. 6).
                          </p>
                        </div>
                      </div>

                    </div>
                )}

                {/* ─── PESTAÑA 3: CATÁLOGO OFICIAL DE BOTES ITM ─── */}
                {activeTab === "contenedores" && (
                    <div className="space-y-2.5">
                      <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 px-1">
                        Norma ITMORELIA-IT-AM-007 Sec. 4.1 y Guía de Separación
                      </div>

                      {CAMPUS_CONTAINERS_CATALOG.map((bin) => {
                        const isSelected = selectedContainer.id === bin.id;
                        const getIcon = () => {
                          if (bin.id === "bin-verde") return <Leaf size={16} className="text-white" />;
                          if (bin.id === "bin-amarillo") return <Recycle size={16} className="text-zinc-950" />;
                          if (bin.id === "bin-negro") return <Trash2 size={16} className="text-white" />;
                          if (bin.id === "bin-pilas") return <Sparkles size={16} className="text-white" />;
                          return <Recycle size={16} className="text-white" />;
                        };

                        return (
                            <div
                                key={bin.id}
                                onClick={() => setSelectedContainer(bin)}
                                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                                    isSelected
                                        ? "bg-zinc-100/90 dark:bg-zinc-800/90 border-zinc-300 dark:border-zinc-600 shadow-sm ring-1 ring-emerald-500"
                                        : "bg-zinc-50/70 dark:bg-zinc-800/30 border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/70"
                                }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <div
                                    className="size-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                                    style={{ backgroundColor: bin.colorHex }}
                                >
                                  {getIcon()}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                                    {bin.name}
                                  </h4>
                                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 leading-snug">
                                    {bin.shortDescription}
                                  </p>
                                </div>
                              </div>

                              {isSelected && (
                                  <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      className="mt-2.5 pt-2.5 border-t border-zinc-200/70 dark:border-zinc-700/70 space-y-2 text-[11px]"
                                  >
                                    <div>
                                      <strong className="text-emerald-700 dark:text-emerald-400 block mb-1">
                                        ✓ Qué SÍ depositar aquí:
                                      </strong>
                                      <ul className="list-disc pl-4 space-y-0.5 text-zinc-700 dark:text-zinc-300">
                                        {bin.acceptedMaterials.slice(0, 4).map((mat, i) => (
                                            <li key={i}>{mat}</li>
                                        ))}
                                      </ul>
                                    </div>

                                    <div>
                                      <strong className="text-rose-600 dark:text-rose-400 block mb-1">
                                        ✕ Qué NO depositar:
                                      </strong>
                                      <ul className="list-disc pl-4 space-y-0.5 text-zinc-700 dark:text-zinc-300">
                                        {bin.rejectedMaterials.slice(0, 3).map((noMat, i) => (
                                            <li key={i}>{noMat}</li>
                                        ))}
                                      </ul>
                                    </div>

                                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-900 dark:text-amber-200 text-[10.5px] leading-snug">
                                      <strong>Regla ITM:</strong> {bin.handlingTip}
                                    </div>
                                  </motion.div>
                              )}
                            </div>
                        );
                      })}
                    </div>
                )}

              </div>

              {/* Footer de la Consola */}
              <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 text-[11px] text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
                <span className="truncate min-w-0 flex-1 pr-2">{activePoint.name}</span>
                <button
                    onClick={() => focusOnPoint(activePoint, true)}
                    className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer min-h-[40px] px-2 -mr-2 text-xs shrink-0"
                >
                  <span>Ver en mapa</span>
                  <ChevronRight size={12} />
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* ─── MODAL DEL PLANO GENERAL ARQUITECTÓNICO OFICIAL ─── */}
        <AnimatePresence>
          {showPlanoModal && (
              <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="w-full max-w-2xl max-h-[88dvh] rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden text-zinc-900 dark:text-zinc-100"
                >
                  {/* Header Modal */}
                  <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/90 dark:bg-zinc-900/90">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold leading-tight">
                          Directorio del Plano General Oficial ITM
                        </h3>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          Claves y distribución arquitectónica oficial de Campus 1 y Campus 2
                        </p>
                      </div>
                    </div>
                    <button
                        onClick={() => setShowPlanoModal(false)}
                        className="size-11 shrink-0 rounded-full text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center justify-center cursor-pointer touch-manipulation"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Contenido Modal */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                    {/* Selector de Campus para el Directorio */}
                    <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 w-fit">
                      <button
                          onClick={() => setSelectedCampus("Campus 1 (Principal)")}
                          className={`px-3 min-h-[40px] rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                              selectedCampus === "Campus 1 (Principal)"
                                  ? "bg-white dark:bg-zinc-950 text-emerald-600 dark:text-emerald-400 shadow-xs"
                                  : "text-zinc-600 dark:text-zinc-400"
                          }`}
                      >
                        Campus Nº 1 (Central)
                      </button>
                      <button
                          onClick={() => setSelectedCampus("Campus 2 (San José de la Huerta)")}
                          className={`px-3 min-h-[40px] rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                              selectedCampus === "Campus 2 (San José de la Huerta)"
                                  ? "bg-white dark:bg-zinc-950 text-emerald-600 dark:text-emerald-400 shadow-xs"
                                  : "text-zinc-600 dark:text-zinc-400"
                          }`}
                      >
                        Campus Nº 2 (San José)
                      </button>
                    </div>

                    {/* Lista de Edificios */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(selectedCampus === "Campus 1 (Principal)" ? PLANO_DIRECTORIO_C1 : PLANO_DIRECTORIO_C2).map((item, idx) => (
                          <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 flex items-start gap-2.5"
                          >
                      <span className="shrink-0 px-2 py-0.5 rounded-md bg-emerald-600 text-white font-mono font-bold text-[11px]">
                        {item.code}
                      </span>
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                                {item.zone}
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-200">
                      <strong>💡 Conexión con los botes:</strong> Cada estación de reciclaje en el mapa está vinculada directamente al edificio oficial correspondiente del plano para facilitar la separación limpia de residuos en origen.
                    </div>
                  </div>

                  {/* Footer Modal */}
                  <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex justify-end">
                    <button
                        onClick={() => setShowPlanoModal(false)}
                        className="px-5 min-h-[44px] rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                    >
                      Entendido, volver al mapa
                    </button>
                  </div>
                </motion.div>
              </div>
          )}
        </AnimatePresence>

        {/* ─── MODAL: COMPROBACIÓN SI ESTÁ FUERA DEL TEC ─── */}
        <AnimatePresence>
          {outsideCampusNotice && (
              <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-5 text-zinc-900 dark:text-zinc-100"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="size-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <AlertTriangle size={18} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-zinc-900 dark:text-white leading-tight">
                          Estás fuera del Instituto
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Comprobación física de GPS en el Tec
                        </p>
                      </div>
                    </div>
                    <button
                        onClick={() => setOutsideCampusNotice(null)}
                        className="size-11 shrink-0 rounded-full text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center justify-center cursor-pointer touch-manipulation"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                    <p>
                      Tu ubicación satelital se encuentra fuera de las instalaciones del ITM:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-center font-bold">
                      <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                        <span className="block text-[11px] text-zinc-500">Campus 1 (Central)</span>
                        <span className="text-sm text-emerald-600 dark:text-emerald-400">{outsideCampusNotice.distC1Km} km</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                        <span className="block text-[11px] text-zinc-500">Campus 2 (San José)</span>
                        <span className="text-sm text-emerald-600 dark:text-emerald-400">{outsideCampusNotice.distC2Km} km</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Para mantener la fidelidad cartográfica y que no te salgas del mapa, el visor permanece delimitado dentro de los perímetros del ITM.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <button
                        onClick={() => handleSimulatePosition(19.722985, -101.185838, "Edificio A (Entrada principal)", "Campus 1 (Principal)")}
                        className="w-full min-h-[48px] py-2.5 px-3 rounded-xl text-xs font-bold text-center leading-tight bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Navigation size={14} />
                      <span>Probar ruta desde Edificio A (Campus 1)</span>
                    </button>

                    <button
                        onClick={() => handleSimulatePosition(19.72135, -101.185391, "Cafetería Principal (Edificio R)", "Campus 1 (Principal)")}
                        className="w-full min-h-[48px] py-2.5 px-3 rounded-xl text-xs font-bold text-center leading-tight bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Navigation size={14} />
                      <span>Probar ruta desde Cafetería Edificio R (Campus 1)</span>
                    </button>

                    <button
                        onClick={() => handleSimulatePosition(19.644721, -101.225224, "Edificio Administrativo A (Campus 2)", "Campus 2 (San José de la Huerta)")}
                        className="w-full min-h-[48px] py-2.5 px-3 rounded-xl text-xs font-bold text-center leading-tight bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Navigation size={14} />
                      <span>Probar ruta desde Edificio A (Campus 2)</span>
                    </button>

                    <button
                        onClick={() => setOutsideCampusNotice(null)}
                        className="w-full min-h-[44px] text-center text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer"
                    >
                      Cerrar y navegar el mapa
                    </button>
                  </div>
                </motion.div>
              </div>
          )}
        </AnimatePresence>

      </div>
  );
}