import { useRef, useEffect } from "react";
import { WasteVisual } from "./WasteVisual";

interface WasteItemDef {
    id: string;
    visualId: string;
    label: string;
    size: "lg" | "xl";
    homeX: number; // Porcentaje horizontal base (0-100)
    homeY: number; // Porcentaje vertical base (0-100)
    baseRotation: number; // Grados
    depth: number; // Factor de parallax (0.6 - 1.4)
    phase: number;
}

const WASTE_ITEMS: WasteItemDef[] = [
    {
        id: "pet-bottle",
        visualId: "pet-bottle",
        label: "Botella PET",
        size: "xl",
        homeX: 10,
        homeY: 20,
        baseRotation: -12,
        depth: 1.2,
        phase: 0.2,
    },
    {
        id: "alu-can",
        visualId: "aluminum-can",
        label: "Lata Aluminio",
        size: "xl",
        homeX: 86,
        homeY: 22,
        baseRotation: 14,
        depth: 1.3,
        phase: 1.5,
    },
    {
        id: "organic",
        visualId: "organic-food",
        label: "Orgánico",
        size: "xl",
        homeX: 12,
        homeY: 66,
        baseRotation: 18,
        depth: 1.0,
        phase: 2.8,
    },
    {
        id: "paper",
        visualId: "notebook-paper",
        label: "Papel",
        size: "lg",
        homeX: 48,
        homeY: 10,
        baseRotation: 6,
        depth: 0.7,
        phase: 3.4,
    },
    {
        id: "tetra",
        visualId: "tetra-pak",
        label: "Tetra Pak",
        size: "xl",
        homeX: 88,
        homeY: 56,
        baseRotation: -10,
        depth: 1.1,
        phase: 4.2,
    },
    {
        id: "snack",
        visualId: "snack-wrapper",
        label: "Envoltura",
        size: "lg",
        homeX: 15,
        homeY: 44,
        baseRotation: 8,
        depth: 0.85,
        phase: 5.1,
    },
    {
        id: "battery",
        visualId: "battery-alkaline",
        label: "Pila",
        size: "lg",
        homeX: 80,
        homeY: 76,
        baseRotation: -16,
        depth: 0.95,
        phase: 6.0,
    },
];

export function WasteParallaxScene() {
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        // Estado de sensores amortiguados
        let targetTiltX = 0;
        let targetTiltY = 0;
        let currentTiltX = 0;
        let currentTiltY = 0;

        // Estado de agitación (Shake) suave con decaimiento
        let shakeEnergy = 0;
        let lastShakeTime = 0;
        let lastAccX = 0;
        let lastAccY = 0;
        let lastAccZ = 0;
        let lastMotionTime = 0;

        // 1. Mouse en Desktop
        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            const normX = (e.clientX / innerWidth - 0.5) * 2; // -1 a 1
            const normY = (e.clientY / innerHeight - 0.5) * 2; // -1 a 1
            targetTiltX = normX * 18; // Máximo ±18px
            targetTiltY = normY * 18;
        };

        // 2. Giroscopio en Móvil (rango acotado y estable)
        const handleOrientation = (e: DeviceOrientationEvent) => {
            if (e.gamma !== null && e.beta !== null) {
                // Inclinación horizontal: gamma suele estar entre -45 y 45 deg
                const clampedGamma = Math.max(-40, Math.min(40, e.gamma));
                // Inclinación vertical: beta ergonómica típica ~40 deg
                const clampedBeta = Math.max(-40, Math.min(40, e.beta - 40));

                targetTiltX = (clampedGamma / 40) * 16; // Máximo ±16px
                targetTiltY = (clampedBeta / 40) * 16;
            }
        };

        // 3. Detección de agitación (Shake) con cooldown y filtrado estricto
        const handleMotion = (e: DeviceMotionEvent) => {
            const acc = e.acceleration; // Sin gravedad para evitar falsos positivos
            if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

            const now = performance.now();
            if (now - lastMotionTime > 80) {
                const dt = (now - lastMotionTime) / 1000;
                lastMotionTime = now;

                const dx = Math.abs(acc.x - lastAccX);
                const dy = Math.abs(acc.y - lastAccY);
                const dz = Math.abs(acc.z - lastAccZ);

                lastAccX = acc.x;
                lastAccY = acc.y;
                lastAccZ = acc.z;

                const jerk = (dx + dy + dz) / dt;

                // Solo si la aceleración real supera el umbral de agitación deliberada
                if (jerk > 65 && now - lastShakeTime > 1200) {
                    lastShakeTime = now;
                    shakeEnergy = 1.0; // Inicia vibración elástica suave
                }
            }
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        window.addEventListener("deviceorientation", handleOrientation, { passive: true });
        window.addEventListener("devicemotion", handleMotion, { passive: true });

        // Loop de renderizado directo al DOM a 60fps (sin re-renders de React)
        let rafId: number;

        const animate = (time: number) => {
            // Amortiguación exponencial del tilt
            currentTiltX += (targetTiltX - currentTiltX) * 0.05;
            currentTiltY += (targetTiltY - currentTiltY) * 0.05;

            // Decaimiento natural de la energía de agitación
            if (shakeEnergy > 0.01) {
                shakeEnergy *= 0.94;
            } else {
                shakeEnergy = 0;
            }

            const t = time * 0.001; // segundos

            for (let i = 0; i < WASTE_ITEMS.length; i++) {
                const el = itemRefs.current[i];
                if (!el) continue;

                const item = WASTE_ITEMS[i];

                // Flotación armónica continua muy suave y relajada
                const floatX = Math.sin(t * 0.9 + item.phase) * 6 * item.depth;
                const floatY = Math.cos(t * 0.7 + item.phase) * 8 * item.depth;
                const swayRot = Math.sin(t * 0.8 + item.phase) * 2.5;

                // Desplazamiento por inclinación del dispositivo (estable y acotado)
                const tiltX = currentTiltX * item.depth;
                const tiltY = currentTiltY * item.depth;

                // Impulso de agitación: vibración armónica suave, nunca brincos descontrolados
                const shakeOffsetX = shakeEnergy * Math.sin(t * 18 + i) * 10 * item.depth;
                const shakeOffsetY = shakeEnergy * Math.cos(t * 22 + i) * 10 * item.depth;
                const shakeRot = shakeEnergy * Math.sin(t * 20 + i) * 6;

                const totalX = floatX + tiltX + shakeOffsetX;
                const totalY = floatY + tiltY + shakeOffsetY;
                const totalRot = item.baseRotation + swayRot + shakeRot;

                // Aplicar transformación acelerada por hardware (GPU translate3d)
                el.style.transform = `translate3d(calc(-50% + ${totalX.toFixed(1)}px), calc(-50% + ${totalY.toFixed(1)}px), 0) rotate(${totalRot.toFixed(2)}deg)`;
            }

            rafId = requestAnimationFrame(animate);
        };

        rafId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("deviceorientation", handleOrientation);
            window.removeEventListener("devicemotion", handleMotion);
        };
    }, []);

    return (
        <div
            className="absolute inset-0 overflow-hidden pointer-events-none select-none z-10"
            aria-hidden="true"
        >
            {/* Trama sutil de partículas de fondo */}
            <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.14] bg-[radial-gradient(#10b981_1.5px,transparent_1.5px)] [background-size:28px_28px]" />

            {/* Residuos posicionados con elegancia, flotación suave y cero saltos */}
            {WASTE_ITEMS.map((item, index) => (
                <div
                    key={item.id}
                    ref={(el) => {
                        itemRefs.current[index] = el;
                    }}
                    style={{
                        position: "absolute",
                        left: `${item.homeX}%`,
                        top: `${item.homeY}%`,
                        transform: `translate3d(-50%, -50%, 0) rotate(${item.baseRotation}deg)`,
                        willChange: "transform",
                    }}
                    className="flex flex-col items-center justify-center filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)] pointer-events-none"
                >
                    <WasteVisual
                        id={item.visualId}
                        size={item.size}
                        forceSvg
                        className="bg-transparent border-0 !p-0 shadow-none filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
                    />

                    <div className="mt-1 whitespace-nowrap opacity-80">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight bg-black/75 text-white border border-white/20 shadow-md backdrop-blur-md">
                            {item.label}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
