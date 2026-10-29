import { useEffect, useRef, type MouseEvent } from "react";
import { X } from "lucide-react";
import {
    MUSEUM_CAPTURE_WIDTH,
    formatMuseumDate,
    museumShotUrl,
    type MuseumVersion,
} from "../../data/museum";

interface VersionDialogProps {
    version: MuseumVersion | null;
    onClose: () => void;
}

/**
 * Ficha ampliada de una versión con captura en alta resolución.
 * Utiliza el elemento <dialog> nativo con accesibilidad completa y tema adaptativo.
 */
export function VersionDialog({ version, onClose }: VersionDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (version && !dialog.open) {
            dialog.showModal();
        } else if (!version && dialog.open) {
            dialog.close();
        }
    }, [version]);

    useEffect(() => {
        if (!version) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [version]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleNativeClose = () => onClose();
        dialog.addEventListener("close", handleNativeClose);
        return () => dialog.removeEventListener("close", handleNativeClose);
    }, [onClose]);

    const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
        if (event.target === event.currentTarget) onClose();
    };

    const date = version ? formatMuseumDate(version.date) : "";

    return (
        <dialog
            ref={dialogRef}
            className="museum-dialog m-auto"
            aria-labelledby="museum-dialog-title"
            onClick={handleBackdropClick}
        >
            {version ? (
                <div className="flex max-h-[92dvh] flex-col overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0d1015] text-zinc-900 dark:text-zinc-100 shadow-2xl transition-colors">
                    <header className="flex items-start justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 px-6 py-4">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span
                                    className="rounded border px-2 py-0.5 text-xs font-bold"
                                    style={{
                                        color: "var(--accent-color)",
                                        borderColor: "color-mix(in srgb, var(--accent-color) 35%, transparent)",
                                        backgroundColor: "color-mix(in srgb, var(--accent-color) 15%, transparent)",
                                    }}
                                >
                                    {version.id}
                                </span>
                                <span className="text-xs text-zinc-500 dark:text-zinc-400 tabular-nums font-medium">
                                    {date}
                                </span>
                            </div>
                            <h2
                                id="museum-dialog-title"
                                className="mt-1 text-lg font-bold tracking-tight text-zinc-900 dark:text-white md:text-xl"
                            >
                                {version.title}
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Cerrar vista ampliada"
                            className="shrink-0 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 shadow-sm"
                        >
                            <X size={18} aria-hidden="true" />
                        </button>
                    </header>

                    <div className="min-h-0 overflow-y-auto overscroll-contain bg-zinc-950/80 p-2 md:p-4">
                        <img
                            src={museumShotUrl(version.screenshot)}
                            alt={`Captura completa de ReCiclo ${version.id}, ${date}`}
                            width={MUSEUM_CAPTURE_WIDTH}
                            height={version.height}
                            decoding="async"
                            className="block h-auto w-full rounded-lg border border-zinc-800 shadow-lg"
                        />
                    </div>

                    <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 px-6 py-3 text-xs text-zinc-500 dark:text-zinc-400">
                        <span>Desplázate hacia abajo para ver el recorrido completo de la interfaz.</span>
                        <span className="tabular-nums font-medium">
                            {version.added.length} adiciones · {version.removed.length} ajustes
                        </span>
                    </footer>
                </div>
            ) : null}
        </dialog>
    );
}
