import { useRef, type PointerEvent, type ReactNode } from "react";
import "./museum-motion.css";

export type DeviceKind = "laptop" | "phone";

interface DeviceMockupProps {
    kind: DeviceKind;
    children: ReactNode;
    /** Activa la inclinación 3D que sigue al cursor. */
    tilt?: boolean;
    className?: string;
}

/**
 * Marco de dispositivo (laptop o teléfono) para presentar capturas y emulaciones
 * como si se ejecutaran en un equipo real. El contenido ocupa toda la pantalla.
 */
export function DeviceMockup({ kind, children, tilt = true, className = "" }: DeviceMockupProps) {
    const ref = useRef<HTMLDivElement>(null);

    const handleMove = (event: PointerEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!tilt || !el || event.pointerType === "touch") return;
        const rect = el.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        el.dataset.active = "true";
        el.style.setProperty("--ry", `${(px * 6).toFixed(2)}deg`);
        el.style.setProperty("--rx", `${(-py * 5).toFixed(2)}deg`);
    };

    const handleLeave = () => {
        const el = ref.current;
        if (!el) return;
        el.dataset.active = "false";
        el.style.setProperty("--ry", "0deg");
        el.style.setProperty("--rx", "0deg");
    };

    return (
        <div className={`group/device relative ${className}`}>
            {/* Resplandor bajo el dispositivo con el acento del proyecto */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-[8%] -bottom-4 h-10 rounded-full opacity-70 blur-2xl transition-opacity duration-500 group-hover/device:opacity-100"
                style={{ backgroundColor: "var(--accent-glow)" }}
            />

            <div
                ref={ref}
                data-active="false"
                onPointerMove={handleMove}
                onPointerLeave={handleLeave}
                className="device-tilt relative"
            >
                {kind === "laptop" ? <Laptop>{children}</Laptop> : <Phone>{children}</Phone>}
            </div>
        </div>
    );
}

function Laptop({ children }: { children: ReactNode }) {
    return (
        <div className="device-float">
            {/* Tapa */}
            <div className="rounded-t-[14px] border border-zinc-600/70 bg-gradient-to-b from-zinc-700 to-zinc-900 p-[7px] pt-[9px] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.55)]">
                <div className="relative">
                    <span
                        aria-hidden="true"
                        className="absolute left-1/2 -top-[6px] z-20 size-[4px] -translate-x-1/2 rounded-full bg-zinc-500"
                    />
                    <div className="device-glare relative aspect-[16/10] overflow-hidden rounded-[6px] bg-zinc-950 ring-1 ring-black/60">
                        {children}
                    </div>
                </div>
            </div>
            {/* Base */}
            <div className="relative mx-auto h-[11px] w-[104%] -translate-x-[2%] rounded-b-[14px] rounded-t-[2px] bg-gradient-to-b from-zinc-300 to-zinc-500 shadow-[0_10px_24px_-8px_rgba(0,0,0,0.6)] dark:from-zinc-600 dark:to-zinc-800">
                <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-0 h-[4px] w-[16%] -translate-x-1/2 rounded-b-md bg-black/25"
                />
            </div>
        </div>
    );
}

function Phone({ children }: { children: ReactNode }) {
    return (
        <div className="device-float mx-auto w-full max-w-[290px]">
            <div className="relative rounded-[2.6rem] border border-zinc-600/70 bg-gradient-to-b from-zinc-700 to-zinc-900 p-[9px] shadow-[0_28px_60px_-12px_rgba(0,0,0,0.6)]">
                {/* Botones laterales */}
                <span aria-hidden="true" className="absolute -left-[3px] top-24 h-10 w-[3px] rounded-l bg-zinc-600" />
                <span aria-hidden="true" className="absolute -left-[3px] top-36 h-10 w-[3px] rounded-l bg-zinc-600" />
                <span aria-hidden="true" className="absolute -right-[3px] top-32 h-16 w-[3px] rounded-r bg-zinc-600" />

                <div className="device-glare relative aspect-[9/19] overflow-hidden rounded-[2rem] bg-zinc-950 ring-1 ring-black/60">
                    {/* Isla dinámica */}
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-1/2 top-2 z-20 h-[18px] w-[72px] -translate-x-1/2 rounded-full bg-black"
                    />
                    {children}
                </div>
            </div>
        </div>
    );
}