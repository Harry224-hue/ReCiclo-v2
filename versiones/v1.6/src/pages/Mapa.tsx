import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Info } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "../context/ThemeContext";

interface CampusPoint {
    id: string;
    name: string;
    building: string;
    description: string;
    lat: number;
    lng: number;
    bins: string[];
}

const CAMPUS_1_POINTS: CampusPoint[] = [
    {
        id: "edif-a",
        name: "Edificio A (Dirección y Gobierno)",
        building: "Edificio A",
        description: "Contenedor de pilas alcalinas y punto de acopio para botellas de plástico PET.",
        lat: 19.7224,
        lng: -101.1856,
        bins: ["Azul (PET)", "Rojo (Pilas y RAEE)"],
    },
    {
        id: "cafeteria",
        name: "Cafetería Central de Alumnos",
        building: "Cafetería",
        description: "Batería completa de 4 contenedores para la comunidad estudiantil del ITM.",
        lat: 19.7218,
        lng: -101.1862,
        bins: ["Verde (Orgánicos)", "Azul (PET)", "Amarillo (Inorgánicos)", "Gris (General)"],
    },
    {
        id: "biblioteca",
        name: "Biblioteca Central Ing. Antonio Sandoval",
        building: "Biblioteca",
        description: "Depósitos especializados para hojas de apuntes, libros en desuso y cartón seco.",
        lat: 19.7229,
        lng: -101.1868,
        bins: ["Amarillo (Papel y Cartón)"],
    },
    {
        id: "gimnasio",
        name: "Gimnasio Auditorio Heber Soto Fierro",
        building: "Gimnasio",
        description: "Estación de alta capacidad para envases de bebidas isotónicas y botellas de agua.",
        lat: 19.7235,
        lng: -101.1851,
        bins: ["Azul (Plásticos y PET)", "Amarillo (Latas)"],
    },
];

export default function Mapa() {
    const { getThemeClasses } = useTheme();
    const glassCard = getThemeClasses("dropdown");
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<{ [key: string]: L.Marker }>({});
    const [selectedPoint, setSelectedPoint] = useState<CampusPoint>(CAMPUS_1_POINTS[0]);

    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) return;

        // Centrado en Campus 1 IT Morelia (Morelia, Michoacán)
        const map = L.map(mapContainerRef.current, {
            center: [19.7224, -101.1858],
            zoom: 17,
            zoomControl: false,
        });

        L.control.zoom({ position: "bottomright" }).addTo(map);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(map);

        // Crear pines sencillos
        CAMPUS_1_POINTS.forEach((pt) => {
            const marker = L.marker([pt.lat, pt.lng], {
                title: pt.name,
            }).addTo(map);

            const popupContent = `
                <div style="font-family: system-ui, sans-serif; font-size: 13px; line-height: 1.4;">
                    <strong style="color: #059669;">${pt.name}</strong><br/>
                    <span style="color: #6b7280;">${pt.description}</span><br/>
                    <div style="margin-top: 6px; font-size: 11px; font-weight: 600; color: #374151;">
                        Contenedores: ${pt.bins.join(", ")}
                    </div>
                </div>
            `;
            marker.bindPopup(popupContent);
            marker.on("click", () => {
                setSelectedPoint(pt);
            });

            markersRef.current[pt.id] = marker;
        });

        mapInstanceRef.current = map;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    const focusPoint = (pt: CampusPoint) => {
        setSelectedPoint(pt);
        if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([pt.lat, pt.lng], 18, { duration: 1 });
            const m = markersRef.current[pt.id];
            if (m) m.openPopup();
        }
    };

    return (
        <section className="min-h-[100dvh] w-full flex flex-col pt-24 pb-32 md:pt-32 md:pb-10 px-4 md:px-8 max-w-7xl mx-auto">
            {/* Cabecera */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-500 border border-sky-500/20 mb-3">
                    <MapPin size={13} />
                    <span>Plano Preliminar Campus 1 (v1.6)</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-semibold text-zinc-800 dark:text-zinc-100">
                    Mapa de Contenedores ITM
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm md:text-base max-w-xl">
                    Primera versión del mapa geoespacial con Leaflet. Mapeo inicial de 4 estaciones clave en Campus 1.
                </p>
            </motion.div>

            {/* Banner de fase v1.6 */}
            <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-700 dark:text-sky-300 text-xs md:text-sm mb-4 flex items-center gap-3">
                <Info size={18} className="shrink-0" />
                <span>
                    Prototipo cartográfico v1.6. En la versión 1.7 se agregarán el selector para Campus 2 y filtros por color de contenedor.
                </span>
            </div>

            {/* Contenedor del mapa y panel lateral */}
            <div className="flex-1 w-full flex flex-col lg:flex-row gap-6 min-h-[520px]">
                {/* Visor Leaflet */}
                <div className="flex-1 w-full rounded-[2.5rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 relative shadow-xl min-h-[420px] lg:min-h-0">
                    <div ref={mapContainerRef} className="w-full h-full min-h-[420px]" />
                </div>

                {/* Lista lateral de estaciones */}
                <div className="w-full lg:w-96 flex flex-col gap-3">
                    <div className={`p-4 rounded-2xl border ${glassCard}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 uppercase tracking-wider">
                                Estaciones Campus 1
                            </span>
                            <span className="text-xs text-zinc-400">{CAMPUS_1_POINTS.length} registradas</span>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Haz clic en cualquier estación para enfocarla en el plano:
                        </p>
                    </div>

                    <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[420px] pr-1">
                        {CAMPUS_1_POINTS.map((pt) => {
                            const isSelected = selectedPoint.id === pt.id;
                            return (
                                <button
                                    key={pt.id}
                                    onClick={() => focusPoint(pt)}
                                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                                        isSelected
                                            ? "border-sky-500/50 bg-sky-500/10 shadow-sm"
                                            : `${glassCard} hover:border-zinc-300 dark:hover:border-zinc-700`
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-sky-500">{pt.building}</span>
                                        <Navigation size={13} className={isSelected ? "text-sky-500" : "text-zinc-400"} />
                                    </div>
                                    <h4 className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{pt.name}</h4>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{pt.description}</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {pt.bins.map((b) => (
                                            <span
                                                key={b}
                                                className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 font-medium"
                                            >
                                                {b}
                                            </span>
                                        ))}
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
