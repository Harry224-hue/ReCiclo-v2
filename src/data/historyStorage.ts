/**
 * Historial práctico de identificación de residuos
 * Conforme al Punto 7:
 * - Guarda: imagen o icono, nombre del residuo, clasificación, disposición recomendada y fecha.
 * - Sin sistemas de puntos, rachas, mascotas ni recompensas artificiales.
 * - Si el usuario tiene sesión iniciada, sincroniza con Firestore (colección `scans`).
 * - Si no tiene sesión iniciada, se almacena únicamente en este dispositivo.
 */

import { CATEGORY_INFO, WASTE_DATABASE, WasteCategory } from "./wasteData";
import {
  addScan,
  getUserScans,
  getUserProgress,
  updateUserProgress,
  type Scan,
} from "../firebase";

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
  cloudId?: string;
  syncedToCloud?: boolean;
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

export function setScanHistory(entries: ScanHistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 50)));
    window.dispatchEvent(new Event("reciclo-history-updated"));
  } catch (error) {
    console.error("Error al escribir el historial de residuos:", error);
  }
}

export function addScanToHistory(
  entry: Omit<ScanHistoryEntry, "id" | "timestamp">
): ScanHistoryEntry {
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
    window.dispatchEvent(new Event("reciclo-history-updated"));
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

export function markScanEntrySynced(localId: string, cloudId: string): void {
  try {
    const current = getScanHistory();
    const updated = current.map((item) =>
      item.id === localId ? { ...item, cloudId, syncedToCloud: true } : item
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("reciclo-history-updated"));
  } catch (error) {
    console.warn("No se pudo marcar el registro como sincronizado:", error);
  }
}

export function clearScanHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("reciclo-history-updated"));
  } catch (error) {
    console.error("Error al limpiar historial:", error);
  }
}

/** Elimina un único registro del historial. Devuelve el historial actualizado. */
export function removeScanFromHistory(id: string): ScanHistoryEntry[] {
  try {
    const updated = getScanHistory().filter((entry) => entry.id !== id && entry.cloudId !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("reciclo-history-updated"));
    return updated;
  } catch (error) {
    console.error("Error al eliminar el registro del historial:", error);
    return getScanHistory();
  }
}

function normalizeCategory(raw: string): WasteCategory {
  if (
    raw === "organicos" ||
    raw === "reciclables" ||
    raw === "no_reciclables" ||
    raw === "manejo_especial"
  ) {
    return raw;
  }
  return "reciclables";
}

function parseTimestampToIso(fecha: Scan["fecha"]): string {
  if (!fecha) return new Date().toISOString();
  if (fecha instanceof Date) return fecha.toISOString();
  if (typeof fecha === "string") {
    const d = new Date(fecha);
    return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  }
  if (typeof fecha === "object") {
    if (typeof fecha.toDate === "function") {
      return fecha.toDate().toISOString();
    }
    if (typeof fecha.seconds === "number") {
      return new Date(fecha.seconds * 1000).toISOString();
    }
  }
  return new Date().toISOString();
}

export function convertFirestoreScanToEntry(scan: Scan): ScanHistoryEntry {
  const category = normalizeCategory(scan.categoria);
  const catInfo = CATEGORY_INFO[category] || CATEGORY_INFO.reciclables;
  const matchedWaste = WASTE_DATABASE.find(
    (w) =>
      w.id === scan.wasteId ||
      w.name.toLowerCase() === (scan.nombreDetectado || "").toLowerCase() ||
      (scan.nombreDetectado || "").toLowerCase().includes(w.name.toLowerCase())
  );

  return {
    id: `cloud_${scan.id}`,
    cloudId: scan.id,
    syncedToCloud: true,
    wasteId: scan.wasteId || matchedWaste?.id || "pet-bottle",
    wasteName: scan.nombreDetectado || matchedWaste?.name || "Residuo clasificado",
    material: scan.material || matchedWaste?.material || "Material clasificado",
    category,
    categoryLabel: scan.categoryLabel || catInfo.name,
    recommendedBin:
      scan.contenedor ||
      matchedWaste?.recommendedBin.label ||
      "Contenedor oficial del campus",
    timestamp: parseTimestampToIso(scan.fecha),
  };
}

/**
 * Reconcilia los escaneos locales realizados como invitado hacia la cuenta del usuario en Firestore
 * y descarga el historial consolidado de la cuenta.
 */
export async function syncAccountHistoryWithCloud(uid: string): Promise<ScanHistoryEntry[]> {
  const localEntries = getScanHistory();
  const unsyncedEntries = localEntries.filter((e) => !e.syncedToCloud);

  // 1. Subir escaneos locales de invitado que aún no estaban sincronizados
  if (unsyncedEntries.length > 0) {
    let addedRecyclable = 0;
    let addedNonRecyclable = 0;

    for (const entry of unsyncedEntries) {
      try {
        const cloudId = await addScan({
          userId: uid,
          fecha: new Date(entry.timestamp),
          nombreDetectado: entry.wasteName,
          categoria: entry.category,
          material: entry.material,
          contenedor: entry.recommendedBin,
          confianza: 90,
          imagenUrl: "",
          wasteId: entry.wasteId,
          categoryLabel: entry.categoryLabel,
        });
        entry.cloudId = cloudId;
        entry.syncedToCloud = true;
        if (entry.category === "reciclables") addedRecyclable += 1;
        else addedNonRecyclable += 1;
      } catch (err) {
        console.warn("[Historial] No se pudo subir escaneo pendiente a Firestore:", err);
      }
    }

    const totalAdded = addedRecyclable + addedNonRecyclable;
    if (totalAdded > 0) {
      try {
        const currentProg = await getUserProgress(uid);
        if (currentProg) {
          const nextExp = (currentProg.experiencia || 0) + totalAdded * 10;
          await updateUserProgress(uid, {
            totalEscaneos: (currentProg.totalEscaneos || 0) + totalAdded,
            residuosReciclables: (currentProg.residuosReciclables || 0) + addedRecyclable,
            residuosNoReciclables: (currentProg.residuosNoReciclables || 0) + addedNonRecyclable,
            experiencia: nextExp,
            nivel: Math.floor(nextExp / 100) + 1,
          });
        }
      } catch (progErr) {
        console.warn("[Historial] Advertencia al actualizar progreso:", progErr);
      }
    }
  }

  // 2. Descargar el historial de la cuenta desde Firestore
  try {
    const cloudScans = await getUserScans(uid, 50);
    const cloudEntries = cloudScans.map(convertFirestoreScanToEntry);
    const cloudIds = new Set(cloudEntries.map((c) => c.cloudId));

    // Conservar cualquier registro local que no haya podido subirse aún por red intermitente
    const remainingUnsynced = localEntries.filter(
      (e) => !e.syncedToCloud && (!e.cloudId || !cloudIds.has(e.cloudId))
    );

    const merged = [...remainingUnsynced, ...cloudEntries]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50);

    setScanHistory(merged);
    return merged;
  } catch (err) {
    console.warn("[Historial] Usando caché local; no se pudo leer Firestore:", err);
    setScanHistory(localEntries);
    return localEntries;
  }
}
