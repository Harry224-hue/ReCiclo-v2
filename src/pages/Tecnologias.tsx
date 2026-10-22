import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Layers,
  Search,
  CheckCircle2,
  Filter,
  ExternalLink,
  Wrench,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import {
  TECH_CATEGORIES,
  TOTAL_TECH_RESOURCES,
  type TechSection,
} from "../data/techCategories";

export { TOTAL_TECH_RESOURCES };

export default function Tecnologias() {
  const { accent } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredSections = useMemo(() => {
    return TECH_CATEGORIES.map((section) => {
      if (selectedFilter !== "all" && section.id !== selectedFilter) {
        return null;
      }

      const query = searchQuery.trim().toLowerCase();
      if (!query) {
        return section;
      }

      const matchingItems = section.items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.usedFor.toLowerCase().includes(query) ||
          item.badge.toLowerCase().includes(query) ||
          item.urlLabel.toLowerCase().includes(query)
      );

      if (matchingItems.length === 0) {
        return null;
      }

      return {
        ...section,
        items: matchingItems,
      };
    }).filter(Boolean) as TechSection[];
  }, [selectedFilter, searchQuery]);

  return (
    <div className="min-h-screen pt-24 pb-28 md:pt-28 md:pb-16 px-4 md:px-8 max-w-5xl mx-auto transition-colors duration-300">
      {/* Encabezado */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-8"
      >
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border mb-3 ${accent.badge}`}
        >
          <Layers className="size-3.5" aria-hidden="true" />
          <span>Ficha Técnica y Documentación Oficial</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Tecnologías, APIs y Recursos Oficiales
        </h1>
        <p className="mt-2 text-sm md:text-base text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed max-w-3xl">
          Inventario detallado de las {TOTAL_TECH_RESOURCES} herramientas, bibliotecas, modelos de inteligencia artificial, servicios en la nube y normativas ambientales utilizados en <strong className="text-zinc-900 dark:text-zinc-200">ReCiclo</strong>, indicando su función exacta dentro del código y su enlace oficial de referencia.
        </p>

        {/* Barra de Filtros y Búsqueda Interactiva */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar Vite, React, Gemini, Leaflet, norma o archivo donde se usó..."
              className="w-full pl-10 pr-16 py-2 text-xs sm:text-sm rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-zinc-500 dark:text-zinc-400 shrink-0 px-1">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className={`size-3.5 ${accent.text}`} />
              <span>
                {filteredSections.reduce((acc, s) => acc + s.items.length, 0)} de {TOTAL_TECH_RESOURCES} recursos
              </span>
            </span>
          </div>
        </div>

        {/* Chips de Categorías */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedFilter("all")}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
              selectedFilter === "all"
                ? `${accent.badge} font-bold shadow-xs`
                : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Todas ({TOTAL_TECH_RESOURCES})
          </button>

          {TECH_CATEGORIES.map((cat) => {
            const isSelected = selectedFilter === cat.id;
            const Icon = cat.icon;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => setSelectedFilter(cat.id)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? `${accent.badge} font-bold shadow-xs`
                    : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{cat.shortTitle}</span>
                <span className="text-[10px] opacity-75">({cat.items.length})</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Secciones de Recursos */}
      {filteredSections.length === 0 ? (
        <div className="text-center py-16 px-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <Filter className="size-8 mx-auto text-zinc-400 mb-2 opacity-50" />
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            No encontramos ninguna coincidencia con tu búsqueda
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            Intenta con otra palabra o selecciona &quot;Todas&quot; en los botones superiores.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedFilter("all");
              setSearchQuery("");
            }}
            className={`mt-4 px-4 py-2 text-xs rounded-xl font-bold text-white transition-colors cursor-pointer ${accent.btn}`}
          >
            Ver todas las tecnologías
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {filteredSections.map((section, sIdx) => {
            const Icon = section.icon;
            return (
              <motion.section
                key={section.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: sIdx * 0.04 }}
                className="p-5 sm:p-7 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs"
              >
                {/* Encabezado de la categoría */}
                <div className="flex items-start gap-3.5 mb-2">
                  <div className={`p-2.5 rounded-2xl ${accent.badge} shrink-0`}>
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                        {section.title}
                      </h2>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {section.items.length} {section.items.length === 1 ? "recurso" : "recursos"}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                      {section.description}
                    </p>
                  </div>
                </div>

                {/* Grid de Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {section.items.map((item) => (
                    <article
                      key={item.name}
                      className="p-5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/80 flex flex-col justify-between gap-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                    >
                      <div className="space-y-3">
                        {/* Cabecera: Nombre, Categoría y Badge */}
                        <div className="space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                              {item.name}
                            </h3>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${accent.badge}`}
                            >
                              {item.badge}
                            </span>
                          </div>

                          <div>
                            <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md bg-zinc-200/70 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        {/* Qué es */}
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Para qué fue utilizada en el proyecto */}
                        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/90 space-y-1">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-900 dark:text-zinc-100">
                            <Wrench className={`size-3.5 ${accent.text} shrink-0`} />
                            <span>Para qué se utilizó en ReCiclo</span>
                          </div>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            {item.usedFor}
                          </p>
                        </div>
                      </div>

                      {/* Pie de tarjeta con link oficial */}
                      <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/80 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                          Documentación / Fuente oficial
                        </span>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 text-xs font-bold ${accent.text} hover:underline`}
                        >
                          <span>{item.urlLabel}</span>
                          <ExternalLink className="size-3.5 shrink-0" />
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>
      )}

      {/* Nota sobre requerimientos de conexión y rigor técnico */}
      <div className="mt-10 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">
          <ShieldCheck className={`size-4.5 ${accent.text} shrink-0`} />
          <span>Nota Técnica sobre Conectividad y Operación Real</span>
        </div>
        <p>
          ReCiclo opera como una aplicación web conectada: requiere acceso a internet para cargar la interfaz desde el servidor, visualizar las teselas cartográficas (OpenStreetMap / ArcGIS) y consultar tanto la API de Gemini 2.5 Flash como los pesos de respaldo de MobileNet v2. El almacenamiento local (<code className="text-zinc-800 dark:text-zinc-200 font-mono">localStorage</code>) se utiliza para conservar tus preferencias de tema y tu historial de escaneos en el navegador sin obligarte a crear una cuenta.
        </p>
      </div>
    </div>
  );
}
