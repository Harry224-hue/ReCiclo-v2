import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Navigation2, 
  ShieldCheck, 
  Compass, 
  ArrowUpRight,
  Sparkles,
  Layers,
  Footprints
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { LazyMount } from "../components/PerformanceOptimizer";
import { 
  CAMPUS_CONTAINERS_CATALOG, 
  ITM_DISPOSAL_POINTS, 
  CampusDisposalPoint,
  ContainerId 
} from "../data/wasteData";

export function CampusShowcase() {
  const { accent } = useTheme();
  const [selectedCampus, setSelectedCampus] = useState<"c1" | "c2">("c1");
  const [activeBinId, setActiveBinId] = useState<string>("bin-azul");

  const c1Points = ITM_DISPOSAL_POINTS.filter((p: CampusDisposalPoint) => p.campus.includes("Campus 1"));
  const c2Points = ITM_DISPOSAL_POINTS.filter((p: CampusDisposalPoint) => p.campus.includes("Campus 2"));

  const displayPoints: CampusDisposalPoint[] = selectedCampus === "c1" ? c1Points : c2Points;
  const activeBin = CAMPUS_CONTAINERS_CATALOG.find(b => b.id === activeBinId) || CAMPUS_CONTAINERS_CATALOG[0];

  return (
    <LazyMount minHeight={850}>
      <section id="campus-mapa" className="relative py-24 md:py-32 w-full overflow-hidden transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
          
          {/* Encabezado */}
          <div className="flex flex-col items-center text-center mb-16 md:mb-20">
            <motion.div 
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-4"
              initial={{ y: 15, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <Compass size={14} className="animate-spin-slow" />
              <span>Cartografía Oficial • Norma ITMORELIA-IT-AM-007</span>
            </motion.div>

            <motion.h2 
              className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tighter text-zinc-900 dark:text-white max-w-3xl leading-[1.1] mb-6"
              initial={{ y: 15, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Planos Generales ITM. <br className="hidden sm:block" />
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${accent.gradient}`}>
                Campus 1 y Campus 2.
              </span>
            </motion.h2>

            <motion.p 
              className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed font-normal"
              initial={{ y: 15, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              Ubicación real de las 17 estaciones de botes en Pony Plaza, cafeterías, comedores y edificios con confinamiento perimetral estricto y cálculo de rutas sin pisar áreas verdes.
            </motion.p>

            {/* Selector de Campus */}
            <div className="mt-8 flex items-center p-1.5 rounded-2xl bg-zinc-200/80 dark:bg-zinc-900/80 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-sm">
              <button
                onClick={() => setSelectedCampus("c1")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  selectedCampus === "c1"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <MapPin size={16} className="text-emerald-500" />
                <span>Campus 1 (Av. Tecnológico)</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">12 Estaciones</span>
              </button>
              <button
                onClick={() => setSelectedCampus("c2")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  selectedCampus === "c2"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <MapPin size={16} className="text-emerald-500" />
                <span>Campus 2 (Arboleda)</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">5 Estaciones</span>
              </button>
            </div>
          </div>

          {/* Grid Principal: Estaciones del Plano y Catálogo Oficial de Botes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Columna Izquierda: Puntos clave del Plano General */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  <Layers size={18} className="text-emerald-500" />
                  <span>Estaciones del Plano General Oficial</span>
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {selectedCampus === "c1" ? "Av. Tecnológico #1500" : "Camino de la Arboleda s/n"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[520px] overflow-y-auto pr-1">
                {displayPoints.map((point: CampusDisposalPoint) => (
                  <div
                    key={point.id}
                    className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-black/5 dark:border-white/10 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                          Edif. {point.officialBuildingCode}
                        </span>
                        <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          {point.zoneType}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-white line-clamp-1 mb-1">
                        {point.name}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">
                        {point.buildingRef}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400 dark:text-zinc-500 truncate max-w-[190px]">
                        {point.walkingRoute}
                      </span>
                      <div className="flex items-center gap-1">
                        {point.installedBins.map((binId: ContainerId) => {
                          const bin = CAMPUS_CONTAINERS_CATALOG.find(b => b.id === binId);
                          return (
                            <span 
                              key={binId} 
                              className="size-2.5 rounded-full" 
                              style={{ backgroundColor: bin?.colorHex || '#10b981' }}
                              title={bin?.name}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Badges de características técnicas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                <div className="p-3.5 rounded-xl bg-zinc-100/80 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 flex items-center gap-3">
                  <ShieldCheck size={20} className="text-emerald-500 shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-zinc-900 dark:text-white">Límites Cerrados</p>
                    <p className="text-zinc-500 dark:text-zinc-400">Confinado 100% al ITM</p>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-100/80 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 flex items-center gap-3">
                  <Navigation2 size={20} className="text-emerald-500 shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-zinc-900 dark:text-white">GPS Verificado</p>
                    <p className="text-zinc-500 dark:text-zinc-400">Cálculo desde accesos</p>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-100/80 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 flex items-center gap-3">
                  <Footprints size={20} className="text-emerald-500 shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-zinc-900 dark:text-white">Cero Jardineras</p>
                    <p className="text-zinc-500 dark:text-zinc-400">Rutas por andadores</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Guía de los 4 Contenedores Oficiales */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  <Sparkles size={18} className="text-emerald-500" />
                  <span>Código de Color ITMORELIA-IT-AM-007</span>
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Sec. 4.1</span>
              </div>

              {/* Selector de Contenedores */}
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {CAMPUS_CONTAINERS_CATALOG.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setActiveBinId(b.id)}
                    className={`p-2.5 rounded-xl text-center flex flex-col items-center gap-1.5 transition-all duration-200 border ${
                      activeBinId === b.id
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-transparent shadow-md scale-105"
                        : "bg-white/60 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 border-black/5 dark:border-white/10 hover:border-zinc-300"
                    }`}
                  >
                    <span 
                      className="size-3.5 rounded-full shadow-sm" 
                      style={{ backgroundColor: b.colorHex }}
                    />
                    <span className="text-[11px] font-semibold truncate w-full">{b.colorName}</span>
                  </button>
                ))}
              </div>

              {/* Ficha técnica del Contenedor Activo */}
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${activeBin.badgeBg}`}>
                      {activeBin.name}
                    </span>
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
                      {activeBin.normativeReference.split("&")[0]}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                    {activeBin.shortDescription}
                  </h3>

                  <div className="space-y-3 my-4">
                    <div>
                      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                        Materiales Aceptados:
                      </p>
                      <ul className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1 list-disc list-inside">
                        {activeBin.acceptedMaterials.slice(0, 3).map((mat, i) => (
                          <li key={i} className="truncate">{mat}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-red-500 dark:text-red-400 mb-1">
                        No se acepta en este bote:
                      </p>
                      <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1 list-disc list-inside">
                        {activeBin.rejectedMaterials.slice(0, 2).map((rej, i) => (
                          <li key={i} className="truncate">{rej}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/50 mb-4">
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 italic">
                      "{activeBin.handlingTip}"
                    </p>
                  </div>
                </div>

                <Link
                  to="/mapa"
                  className={`w-full py-3 px-4 rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${accent.btn}`}
                >
                  <span>Abrir Mapa y Encontrar Botes</span>
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </LazyMount>
  );
}
