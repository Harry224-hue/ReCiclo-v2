/**
 * Historial práctico de identificación de residuos
 * Conforme al Punto 7:
 * - Guarda: imagen o icono, nombre del residuo, clasificación, disposición recomendada y fecha.
 * - Sin sistemas de puntos, rachas, mascotas ni recompensas artificiales.
 */

import { WasteCategory } from "./wasteData";

export interface ScanHistoryEntry {
  id: string;
  wasteId: string;
  wasteName: string;
  material: string;
  category: WasteCategory;
  categoryLabel: string;
  recommendedBin: string;
  timestamp: string; // ISO string
  notes?: string;
}

const STORAGE_KEY = "reciclo_scan_history_v1";

export function getScanHistory(): ScanHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error al leer el historial de residuos:", error);
    return [];
  }
}

export function addScanToHistory(entry: Omit<ScanHistoryEntry, "id" | "timestamp">): ScanHistoryEntry {
  try {
    const current = getScanHistory();
    const newEntry: ScanHistoryEntry = {
      ...entry,
      id: `scan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };

    // Mantener los últimos 50 registros para optimizar memoria
    const updated = [newEntry, ...current].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newEntry;
  } catch (error) {
    console.error("Error al guardar en el historial:", error);
    return {
      ...entry,
      id: `fallback_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
  }
}

export function clearScanHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error al limpiar historial:", error);
  }
}

/** Elimina un único registro del historial. Devuelve el historial actualizado. */
export function removeScanFromHistory(id: string): ScanHistoryEntry[] {
  try {
    const updated = getScanHistory().filter((entry) => entry.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error("Error al eliminar el registro del historial:", error);
    return getScanHistory();
  }
}