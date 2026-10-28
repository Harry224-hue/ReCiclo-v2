import { useEffect } from "react";

type Snapshot = Map<string, string>;

function take(storage: Storage): Snapshot {
    const snap: Snapshot = new Map();
    for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key === null) continue;
        const value = storage.getItem(key);
        if (value !== null) snap.set(key, value);
    }
    return snap;
}

/** Devuelve el almacenamiento exactamente a como estaba en la foto. */
function restore(storage: Storage, snap: Snapshot) {
    const current: string[] = [];
    for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key !== null) current.push(key);
    }
    for (const key of current) {
        if (!snap.has(key)) storage.removeItem(key);
    }
    for (const [key, value] of snap) {
        if (storage.getItem(key) !== value) storage.setItem(key, value);
    }
}

/**
 * Red de seguridad del lado del proyecto: mientras `active` sea true, cualquier cambio que una
 * versión archivada haga en localStorage/sessionStorage reales (tema, color de acento, modo
 * oscuro, rendimiento...) se revierte al instante, al cerrar el emulador y al salir de la página.
 * Complementa a museum-sandbox.js, que evita la escritura desde dentro del iframe.
 */
export function useStorageGuard(active: boolean) {
    useEffect(() => {
        if (!active) return;

        let local: Snapshot;
        let session: Snapshot;
        try {
            local = take(window.localStorage);
            session = take(window.sessionStorage);
        } catch {
            return; // almacenamiento no disponible: nada que proteger
        }

        let restoring = false;
        const revert = () => {
            if (restoring) return;
            restoring = true;
            try {
                restore(window.localStorage, local);
                restore(window.sessionStorage, session);
            } catch {
                /* almacenamiento bloqueado */
            } finally {
                restoring = false;
            }
        };

        // Un documento recibe "storage" cuando OTRO documento del mismo origen (el iframe)
        // escribe; así se detecta y se deshace al momento.
        window.addEventListener("storage", revert);
        window.addEventListener("pagehide", revert);
        return () => {
            window.removeEventListener("storage", revert);
            window.removeEventListener("pagehide", revert);
            revert();
        };
    }, [active]);
}