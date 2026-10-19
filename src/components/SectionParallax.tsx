import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Leaf, Sparkles, Recycle, Droplets, Compass } from "lucide-react";

interface SectionParallaxProps {
  children: React.ReactNode;
  className?: string;
  variant?: "problem" | "dimensions" | "proposal" | "how" | "campus" | "sdg" | "cta";
}

export function SectionParallax({ children, className = "", variant = "problem" }: SectionParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax offsets at varied depths
  const yBackdrop = useTransform(scrollYProgress, [0, 1], [-70, 70]);
  const yLayer1 = useTransform(scrollYProgress, [0, 1], [-110, 110]);
  const yLayer2 = useTransform(scrollYProgress, [0, 1], [90, -90]);
  const yLayer3 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [-20, 30]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [25, -35]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* ─── CAPA DE PARALLAX AMBIENTAL EN EL FONDO ─── */}
      <motion.div
        style={{ y: yBackdrop }}
        className="absolute inset-0 pointer-events-none -z-10 overflow-hidden"
        aria-hidden="true"
      >
        {/* Halo de luz ambiental */}
        <div
          className={`absolute w-[420px] h-[420px] rounded-full blur-[70px] opacity-20 dark:opacity-15 transition-colors duration-500 will-change-transform ${
            variant === "problem"
              ? "top-1/4 -left-40 bg-rose-500"
              : variant === "dimensions"
              ? "top-1/3 -right-40 bg-emerald-500"
              : variant === "proposal"
              ? "bottom-10 left-1/4 bg-blue-500"
              : variant === "how"
              ? "top-10 right-1/4 bg-amber-500"
              : variant === "campus"
              ? "top-1/4 -right-20 bg-emerald-500"
              : variant === "sdg"
              ? "top-1/3 left-10 bg-teal-500"
              : "bottom-0 right-10 bg-emerald-500"
          }`}
        />
      </motion.div>

      {/* Partícula flotante Parallax 1 (Esquina superior derecha) */}
      <motion.div
        style={{ y: yLayer1, rotate: rotate1 }}
        animate={{ y: [0, -10, 0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-4 sm:right-16 pointer-events-none -z-10 opacity-35 dark:opacity-25"
        aria-hidden="true"
      >
        <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-lg">
          {variant === "problem" ? (
            <Droplets className="size-7 sm:size-8 text-rose-500" />
          ) : variant === "dimensions" ? (
            <Recycle className="size-7 sm:size-8 text-emerald-500" />
          ) : variant === "proposal" ? (
            <Sparkles className="size-7 sm:size-8 text-blue-500" />
          ) : (
            <Leaf className="size-7 sm:size-8 text-emerald-500" />
          )}
        </div>
      </motion.div>

      {/* Partícula flotante Parallax 2 (Esquina inferior izquierda) */}
      <motion.div
        style={{ y: yLayer2, rotate: rotate2 }}
        animate={{ y: [0, 12, 0, -12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-14 left-4 sm:left-14 pointer-events-none -z-10 opacity-30 dark:opacity-20"
        aria-hidden="true"
      >
        <div className="p-3 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-lg">
          {variant === "sdg" ? (
            <Sparkles className="size-6 text-teal-500" />
          ) : variant === "how" ? (
            <Compass className="size-6 text-amber-500" />
          ) : (
            <Leaf className="size-6 text-emerald-600" />
          )}
        </div>
      </motion.div>

      {/* Partícula flotante Parallax 3 (Flotante lateral medio) */}
      <motion.div
        style={{ y: yLayer3 }}
        className="absolute top-1/2 right-2 sm:right-8 pointer-events-none -z-10 opacity-20 dark:opacity-15"
        aria-hidden="true"
      >
        <div className="p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/5 dark:border-white/5">
          <Leaf className="size-4 text-emerald-500" />
        </div>
      </motion.div>

      {/* Contenido real de la sección */}
      {children}
    </div>
  );
}
