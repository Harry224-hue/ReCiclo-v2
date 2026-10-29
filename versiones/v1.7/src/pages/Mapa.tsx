import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Navigation, Filter, Building2 } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "../context/ThemeContext";

type CampusKey = "campus1" | "campus2";

interface StationPoint {
    id: string;
    campus: CampusKey;
    name: string;
    building: string;
    description: string;
    lat: number;
    lng: number;
    category: "azul" | "verde" | "amarillo" | "rojo";
    categoryLabel: string;
    binLabel: string;
    badgeColor: string;
}

const STATIONS: StationPoint[] = [
    // Campus 1
    {
        id: "c1-edif-a",
        campus: "campus1",
        name: "Edificio A (Dirección)",
        building: "Edificio A",
        description: "Contenedor de pilas alcalinas y punto de acopio para botellas PET.",
        lat: 19.7224,
        lng: -101.1856,
        category: "rojo",
        categoryLabel: "Pilas y RAEE",
        binLabel: "Rojo (Pilas)",
        badgeColor: "bg-red-500",
    },
    {
        id: "c1-cafeteria-pet",
        campus: "campus1",
        name: "Cafetería Central (Estación PET)",
        building: "Cafetería",
        description: "Contenedores cilíndricos para botellas de plástico y refrescos.",
        lat: 19.7218,
        lng: -101.1862,
        category: "azul",
        categoryLabel: "Plásticos y PET",
        binLabel: "Azul (PET)",
        badgeColor: "bg-blue-500",
    },
    {
        id: "c1-cafeteria-org",
        campus: "campus1",
        name: "Cafetería Central (Orgánicos)",
        building: "Cafetería",
        description: "Bote verde para restos de comida, frutas y residuos compostables.",
        lat: 19.7217,
        lng: -101.1863,
        category: "verde",
        categoryLabel: "Orgánicos",
        binLabel: "Verde (Orgánicos)",
        badgeColor: "bg-emerald-500",
    },
    {
        id: "c1-biblioteca",
        campus: "campus1",
        name: "Biblioteca Central Ing. Antonio Sandoval",
        building: "Biblioteca",
        description: "Contenedores amarillos para papel bond, hojas de libreta y cartón limpio.",
        lat: 19.7229,
        lng: -101.1868,
        category: "amarillo",
        categoryLabel: "Inorgánicos Reciclables",
        binLabel: "Amarillo (Inorgánicos)",
        badgeColor: "bg-amber-500",
    },
    {
        id: "c1-gimnasio",
        campus: "campus1",
        name: "Gimnasio Auditorio Heber Soto Fierro",
        building: "Gimnasio",
        description: "Contenedores de alta capacidad para envases plásticos y latas.",
        lat: 19.7235,
        lng: -101.1851,
        category: "azul",
        categoryLabel: "Plásticos y PET",
        binLabel: "Azul (PET)",
        badgeColor: "bg-blue-500",
    },
    // Campus 2
    {
        id: "c2-edif-principal",
        campus: "campus2",
        name: "Edificio de Docencia Campus 2",
        building: "Docencia C2",
        description: "Batería de separación ecológica en la entrada de laboratorios.",
        lat: 19.6758,
        lng: -101.2335,
        category: "azul",
        categoryLabel: "Plásticos y PET",
        binLabel: "Azul (PET)",
        badgeColor: "bg-blue-500",
    },
    {
        id: "c2-cafeteria",
        campus: "campus2",
        name: "Cafetería Campus 2",
        building: "Cafetería C2",
        description: "Puntos de separación de orgánicos y latas de aluminio.",
        lat: 19.6762,
        lng: -101.2341,
        category: "verde",
        categoryLabel: "Orgánicos",
        binLabel: "Verde (Orgánicos)",
        badgeColor: "bg-emerald-500",
    },
];

const CAMPUS_CONFIG = {
    campus1: {
        name: "Campus 1 (Principal)",
        coords: [19.7224, -101.1858] as [number, number],
        zoom: 17,
    },
    campus2: {
        name: "Campus 2 (San José de la Huerta)",
        coords: [19.676, -101.2338] as [number, number],
        zoom: 16,
    },
};

export default function Mapa() {
    const { getThemeClasses } = useTheme();
    const glassCard = getThemeClasses("dropdown");
    const [searchParams] = useSearchParams();

    const initialBin = searchParams.get("bin");
    const [selectedCampus, setSelectedCampus] = useState<CampusKey>("campus1");
    const [filterCategory, setFilterCategory] = useState<string>(initialBin || "todos");

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersLayerRef = useRef<L.LayerGroup | null>(null);

    const [selectedPoint, setSelectedPoint] = useState<StationPoint>(STATIONS[0]);

    // Filtrar estaciones por campus y categoría
    const filteredStations = STATIONS.filter((s) => {
        if (s.campus !== selectedCampus) return false;
        if (filterCategory !== "todos" && s.category !== filterCategory) return false;
        return true;
    });

    // Inicializar mapa Leaflet
    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) return;

        const map = L.map(mapContainerRef.current, {
            center: CAMPUS_CONFIG.campus1.coords,
            zoom: CAMPUS_CONFIG.campus1.zoom,
            zoomControl: false,
        });

        L.control.zoom({ position: "bottomright" }).addTo(map);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        markersLayerRef.current = markersLayer;
        mapInstanceRef.current = map;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
            markersLayerRef.current = null;
        };
    }, []);

    // Actualizar marcadores al cambiar campus o filtro
    useEffect(() => {
        if (!mapInstanceRef.current || !markersLayerRef.current) return;

        const map = mapInstanceRef.current;
        const layer = markersLayerRef.current;
        layer.clearLayers();

        const cfg = CAMPUS_CONFIG[selectedCampus];
        map.flyTo(cfg.coords, cfg.zoom, { duration: 0.8 });

        filteredStations.forEach((pt) => {
            const marker = L.marker([pt.lat, pt.lng], {
                title: pt.name,
            });

            const popupContent = `
                <div style="font-family: system-ui, sans-serif; font-size: 13px; line-height: 1.4;">
                    <strong style="color: #059669;">${pt.name}</strong><br/>
                    <span style="color: #6b7280;">${pt.description}</span><br/>
                    <div style="margin-top: 6px; font-size: 11px; font-weight: 600; color: #1e40af;">
                        Contenedor: ${pt.binLabel}
                    </div>
                </div>
            `;
            marker.bindPopup(popupContent);
            marker.on("click", () => {
                setSelectedPoint(pt);
            });

            marker.addTo(layer);
        });

        if (filteredStations.length > 0) {
            setSelectedPoint(filteredStations[0]);
        }
    }, [selectedCampus, filterCategory]);

    const handleFocus = (pt: StationPoint) => {
        setSelectedPoint(pt);
        if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([pt.lat, pt.lng], 18, { duration: 0.8 });
        }
    };

    return (
        <section className="min-h-[100dvh] w-full flex flex-col pt-24 pb-32 md:pt-32 md:pb-10 px-4 md:px-8 max-w-7xl mx-auto">
            {/* Cabecera */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-3">
                    <MapPin size={13} />
                    <span>Cartografía con Filtros y Campus 1 y 2 (v1.7)</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-semibold text-zinc-800 dark:text-zinc-100">
                    Plano de Contenedores ITM
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm md:text-base max-w-xl">
                    Localiza los contenedores reglamentarios en ambos campus con filtrado por color y tipo de residuo.
                </p>
            </motion.div>

            {/* Selector de Campus y Chips de Filtro */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                {/* Selector de Campus */}
                <div className="inline-flex p-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 self-start">
                    <button
                        onClick={() => setSelectedCampus("campus1")}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            selectedCampus === "campus1"
                                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow"
                                : "text-zinc-600 dark:text-zinc-400"
                        }`}
                    >
                        Campus 1 (Principal)
                    </button>
                    <button
                        onClick={() => setSelectedCampus("campus2")}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            selectedCampus === "campus2"
                                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow"
                                : "text-zinc-600 dark:text-zinc-400"
                        }`}
                    >
                        Campus 2 (San José)
                    </button>
                </div>

                {/* Filtros por Contenedor */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-zinc-400 flex items-center gap-1 mr-1">
                        <Filter size={12} /> Filtrar:
                    </span>
                    {[
                        { key: "todos", label: "Todos" },
                        { key: "azul", label: "Azul (PET)" },
                        { key: "verde", label: "Verde (Orgánico)" },
                        { key: "amarillo", label: "Amarillo (Inorgánico)" },
                        { key: "rojo", label: "Rojo (Pilas)" },
                    ].map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setFilterCategory(f.key)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                                filterCategory === f.key
                                    ? "bg-emerald-600 text-white font-semibold shadow-sm"
                                    : "bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 hover:bg-black/10"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Visor y Panel Lateral */}
            <div className="flex-1 w-full flex flex-col lg:flex-row gap-6 min-h-[520px]">
                <div className="flex-1 w-full rounded-[2.5rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 relative shadow-xl min-h-[420px] lg:min-h-0">
                    <div ref={mapContainerRef} className="w-full h-full min-h-[420px]" />
                </div>

                {/* Panel de detalles */}
                <div className="w-full lg:w-96 flex flex-col gap-3">
                    <div className={`p-4 rounded-2xl border ${glassCard}`}>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 uppercase tracking-wider">
                                {CAMPUS_CONFIG[selectedCampus].name}
                            </span>
                            <span className="text-xs text-zinc-400">{filteredStations.length} disponibles</span>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Puntos de acopio filtrados según la selección actual:
                        </p>
                    </div>

                    <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[420px] pr-1">
                        {filteredStations.map((pt) => {
                            const isSelected = selectedPoint.id === pt.id;
                            return (
                                <button
                                    key={pt.id}
                                    onClick={() => handleFocus(pt)}
                                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                                        isSelected
                                            ? "border-emerald-500/50 bg-emerald-500/10 shadow-sm"
                                            : `${glassCard} hover:border-zinc-300 dark:hover:border-zinc-700`
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                                            <Building2 size={12} /> {pt.building}
                                        </span>
                                        <Navigation size={13} className={isSelected ? "text-emerald-500" : "text-zinc-400"} />
                                    </div>
                                    <h4 className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{pt.name}</h4>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{pt.description}</p>
                                    <div className="mt-1 flex items-center gap-1.5">
                                        <span className={`w-2.5 h-2.5 rounded-full ${pt.badgeColor}`}></span>
                                        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                            {pt.binLabel}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
