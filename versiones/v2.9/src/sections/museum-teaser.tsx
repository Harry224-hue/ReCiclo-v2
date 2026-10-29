import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { MUSEUM_COUNT, MUSEUM_VERSIONS, museumShotUrl, type MuseumVersion } from "../data/museum";

const PICKS = ["v0.0", "v1.0", "v1.9"]
    .map((id) => MUSEUM_VERSIONS.find((version) => version.id === id))
    .filter((version): version is MuseumVersion => Boolean(version));

const FRAME_POSITIONS = [
    "left-0 bottom-4 w-[45%] -rotate-[4deg]",
    "left-1/2 top-0 w-[51%] -translate-x-1/2 rotate-[1.5deg]",
    "right-0 bottom-8 w-[45%] rotate-[4deg]",
];

export function MuseumTeaser() {
    const { isDarkMode } = useTheme();

    return (
        <section
            id="museo"
            aria-labelledby="museo-teaser-title"
            className="group relative overflow-hidden border-y border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-[#090b0e] py-16 md:py-24 text-zinc-900 dark:text-zinc-100 transition-colors duration-300"
        >
            {/* Trama sutil de puntos de fondo que se adapta al modo claro y oscuro */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-40 transition-opacity"
                style={{
                    backgroundImage: isDarkMode
                        ? "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)"
                        : "radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)",
                    backgroundSize: "10px 10px",
                }}
            />

            <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 md:grid-cols-[1fr_1.05fr] md:gap-14 md:px-8">
                {/* Lado izquierdo: Textos y Botón interactivo */}
                <div>
                    <div className="inline-flex items-center gap-1.5">
                        <Sparkles size={13} style={{ color: "var(--accent-color)" }} aria-hidden="true" />
                        <p
                            className="text-xs font-bold uppercase tracking-widest transition-colors duration-300"
                            style={{ color: "var(--accent-color)" }}
                        >
                            Memoria Técnica
                        </p>
                    </div>

                    <h2
                        id="museo-teaser-title"
                        className="mt-3 text-3xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-white md:text-5xl"
                    >
                        Archivo de versiones.
                        <br />
                        Del primer trazo a la entrega.
                    </h2>

                    <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base">
                        Veinte entregas documentadas paso a paso. Recórrelas verticalmente y
                        prueba interactivamente cada versión como corría en su momento.
                    </p>

                    {/* Botón dinámico, con brillo, hover reactivo y acento global */}
                    <div className="mt-8 flex flex-col items-start gap-3">
                        <Link
                            to="/museo"
                            className="group relative inline-flex min-h-[50px] items-center gap-3 overflow-hidden rounded-2xl px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                            style={{
                                backgroundColor: "var(--accent-color)",
                                boxShadow: "0 8px 28px var(--accent-glow)",
                            }}
                        >
                            {/* Reflejo de brillo que barre en hover */}
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
                            />

                            <span className="relative z-10 tracking-wide font-semibold">
                                Explorar archivo completo
                            </span>
                            <ArrowRight
                                size={18}
                                aria-hidden="true"
                                className="relative z-10 transition-transform duration-300 group-hover:translate-x-1.5"
                            />
                        </Link>

                        <p className="text-xs tabular-nums text-zinc-500 dark:text-zinc-400 font-medium">
                            v0.0 a v1.9 · {MUSEUM_COUNT} versiones interactivas
                        </p>
                    </div>
                </div>

                {/* Lado derecho: Cuadros sobrios en abanico (como antes) con soporte responsive */}
                <div aria-hidden="true" className="relative h-[280px] sm:h-[320px] md:h-[360px]">
                    {PICKS.map((version, index) => (
                        <figure
                            key={version.id}
                            className={`absolute transition-transform duration-300 ease-out motion-reduce:transition-none ${FRAME_POSITIONS[index]} ${
                                index === 0
                                    ? "group-hover:-translate-x-1.5"
                                    : index === 2
                                      ? "group-hover:translate-x-1.5"
                                      : ""
                            }`}
                        >
                            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#10131a] p-1.5 shadow-2xl transition-colors">
                                <picture>
                                    <source
                                        media="(max-width: 640px)"
                                        srcSet={museumShotUrl(version.screenshot, true)}
                                    />
                                    <img
                                        src={museumShotUrl(version.screenshot)}
                                        alt=""
                                        width={1200}
                                        height={version.height}
                                        loading="lazy"
                                        decoding="async"
                                        className="h-[160px] w-full rounded-lg bg-black object-cover object-top sm:h-[200px]"
                                    />
                                </picture>
                            </div>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}
