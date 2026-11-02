import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    type DocumentData,
    type QueryConstraint,
} from "firebase/firestore";
import { db } from "./config";
import type {
    Scan,
    WasteType,
    UserProgress,
    RecyclingPoint,
    Favorite,
    Report,
} from "./types";

// ═══════════════════════════════════════════════════════════
//  SCANS (Historial de escaneos)
// ═══════════════════════════════════════════════════════════

function parseFirestoreDateMs(fecha: unknown): number {
    if (!fecha) return 0;
    if (fecha instanceof Date) return fecha.getTime();
    if (typeof fecha === "string" || typeof fecha === "number") {
        const d = new Date(fecha).getTime();
        return Number.isNaN(d) ? 0 : d;
    }
    if (typeof fecha === "object" && fecha !== null) {
        const maybeTs = fecha as { toDate?: () => Date; seconds?: number };
        if (typeof maybeTs.toDate === "function") {
            return maybeTs.toDate().getTime();
        }
        if (typeof maybeTs.seconds === "number") {
            return maybeTs.seconds * 1000;
        }
    }
    return 0;
}

export async function addScan(data: Omit<Scan, "id">): Promise<string> {
    const ref = await addDoc(collection(db, "scans"), {
        ...data,
        fecha: serverTimestamp(),
    });
    return ref.id;
}

export async function getUserScans(userId: string, maxResults = 50): Promise<Scan[]> {
    try {
        const q = query(
            collection(db, "scans"),
            where("userId", "==", userId),
            orderBy("fecha", "desc"),
            limit(maxResults)
        );
        const snap = await getDocs(q);
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Scan);
    } catch {
        // Fallback si el proyecto de Firebase aún no tiene el índice compuesto (userId + fecha)
        const qFallback = query(
            collection(db, "scans"),
            where("userId", "==", userId),
            limit(maxResults * 2)
        );
        const snap = await getDocs(qFallback);
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Scan);
        docs.sort((a, b) => parseFirestoreDateMs(b.fecha) - parseFirestoreDateMs(a.fecha));
        return docs.slice(0, maxResults);
    }
}

export async function deleteScan(scanId: string): Promise<void> {
    await deleteDoc(doc(db, "scans", scanId));
}

export async function clearUserScans(userId: string): Promise<void> {
    const q = query(collection(db, "scans"), where("userId", "==", userId));
    const snap = await getDocs(q);
    await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, "scans", d.id))));
}

// ═══════════════════════════════════════════════════════════
//  WASTE TYPES (Catálogo de residuos)
// ═══════════════════════════════════════════════════════════

export async function getWasteTypes(): Promise<WasteType[]> {
    const snap = await getDocs(collection(db, "wasteTypes"));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as WasteType);
}

export async function getWasteTypeById(id: string): Promise<WasteType | null> {
    const snap = await getDoc(doc(db, "wasteTypes", id));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as WasteType) : null;
}

// ═══════════════════════════════════════════════════════════
//  PROGRESS (Progreso del usuario)
// ═══════════════════════════════════════════════════════════

export async function getUserProgress(userId: string): Promise<UserProgress | null> {
    const snap = await getDoc(doc(db, "progress", userId));
    return snap.exists() ? (snap.data() as UserProgress) : null;
}

export async function updateUserProgress(
    userId: string,
    data: Partial<UserProgress>
): Promise<void> {
    await updateDoc(doc(db, "progress", userId), data as DocumentData);
}

// ═══════════════════════════════════════════════════════════
//  RECYCLING POINTS (Puntos de reciclaje)
// ═══════════════════════════════════════════════════════════

export async function getRecyclingPoints(
    ...constraints: QueryConstraint[]
): Promise<RecyclingPoint[]> {
    const q = constraints.length
        ? query(collection(db, "recyclingPoints"), ...constraints)
        : query(collection(db, "recyclingPoints"), where("activo", "==", true));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as RecyclingPoint);
}

export async function getRecyclingPointById(id: string): Promise<RecyclingPoint | null> {
    const snap = await getDoc(doc(db, "recyclingPoints", id));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as RecyclingPoint) : null;
}

// ═══════════════════════════════════════════════════════════
//  FAVORITES (Favoritos del usuario)
// ═══════════════════════════════════════════════════════════

export async function addFavorite(userId: string, recyclingPointId: string): Promise<string> {
    const ref = await addDoc(collection(db, "favorites"), {
        userId,
        recyclingPointId,
        fecha: serverTimestamp(),
    });
    return ref.id;
}

export async function getUserFavorites(userId: string): Promise<Favorite[]> {
    const q = query(collection(db, "favorites"), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...d.data() }) as Favorite);
}

export async function removeFavorite(userId: string, recyclingPointId: string): Promise<void> {
    const q = query(
        collection(db, "favorites"),
        where("userId", "==", userId),
        where("recyclingPointId", "==", recyclingPointId)
    );
    const snap = await getDocs(q);
    for (const d of snap.docs) {
        await deleteDoc(d.ref);
    }
}

// ═══════════════════════════════════════════════════════════
//  REPORTS (Reportes)
// ═══════════════════════════════════════════════════════════

export async function addReport(data: Omit<Report, "id" | "fecha" | "estado">): Promise<string> {
    const ref = await addDoc(collection(db, "reports"), {
        ...data,
        fecha: serverTimestamp(),
        estado: "pendiente",
    });
    return ref.id;
}

export async function getUserReports(userId: string): Promise<Report[]> {
    const q = query(
        collection(db, "reports"),
        where("userId", "==", userId),
        orderBy("fecha", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Report);
}
