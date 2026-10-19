import { Link } from "react-router-dom";
import { Leaf, School, MapPin, History, Camera } from "lucide-react";
import { LOGO_DARK } from "../constants/assets";

export function Footer() {
    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="bg-zinc-950 text-white pt-20 pb-10 px-5 md:px-12 lg:px-20 xl:px-28 w-full overflow-hidden border-t border-white/5 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16">

                    {/* Columna Izquierda: Identidad Institucional y Propósito */}
                    <div className="lg:col-span-5 flex flex-col items-start gap-5">
                        <Link
                            to="/"
                            onClick={handleScrollTop}
                            className="flex items-center gap-3 select-none text-white hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl"
                            aria-label="ReCiclo - Ir al inicio"
                        >
                            <img
                                src={LOGO_DARK}
                                alt="ReCiclo"
                                className="h-8 w-auto object-contain"
                            />
                        </Link>

                        <p className="text-zinc-400 text-sm/relaxed max-w-sm font-light">
                            Proyecto de <strong className="text-zinc-200 font-medium">Desarrollo Sustentable</strong> enfocado en mejorar la separación y disposición de residuos en el <strong className="text-zinc-200 font-medium">Instituto Tecnológico de Morelia, Michoacán</strong>. La tecnología como medio para una cultura ambiental responsable.
                        </p>

                        <div className="flex flex-wrap gap-2 pt-1">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <Leaf size={12} />
                                ODS 12: Consumo Responsable
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                                <School size={12} />
                                IT Morelia
                            </span>
                        </div>
                    </div>

                    {/* Columnas Derechas: Enlaces de la Herramienta y Categorías */}
                    <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {/* Secciones de la Herramienta */}
                        <div className="flex flex-col gap-3.5">
                            <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
                                Herramienta
                            </span>
                            <div className="flex flex-col gap-2.5 text-sm text-zinc-400">
                                <Link to="/escanear" className="hover:text-emerald-400 transition-colors duration-200 flex items-center gap-1.5">
                                    <Camera size={14} />
                                    <span>Escáner</span>
                                </Link>
                                <Link to="/mapa" className="hover:text-emerald-400 transition-colors duration-200 flex items-center gap-1.5">
                                    <MapPin size={14} />
                                    <span>Puntos en Campus</span>
                                </Link>
                                <Link to="/historial" className="hover:text-emerald-400 transition-colors duration-200 flex items-center gap-1.5">
                                    <History size={14} />
                                    <span>Historial</span>
                                </Link>
                                <Link to="/perfil" className="hover:text-emerald-400 transition-colors duration-200">
                                    Perfil e Historial
                                </Link>
                                <Link to="/tecnologias" className="hover:text-emerald-400 transition-colors duration-200 text-emerald-400/90 font-medium">
                                    Tecnologías y Recursos
                                </Link>
                            </div>
                        </div>

                        {/* Categorías Normativas Oficiales */}
                        <div className="flex flex-col gap-3.5">
                            <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
                                Clasificación (SEMARNAT)
                            </span>
                            <div className="flex flex-col gap-2.5 text-xs text-zinc-400">
                                <span className="flex items-center gap-2 text-zinc-300">
                                    <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                                    Residuos Orgánicos
                                </span>
                                <span className="flex items-center gap-2 text-zinc-300">
                                    <span className="size-2 rounded-full bg-blue-500 shrink-0" />
                                    Inorgánicos Reciclables
                                </span>
                                <span className="flex items-center gap-2 text-zinc-300">
                                    <span className="size-2 rounded-full bg-zinc-500 shrink-0" />
                                    Inorgánicos No Reciclables
                                </span>
                                <span className="flex items-center gap-2 text-zinc-300">
                                    <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                                    Manejo Especial (Pilas/RAEE)
                                </span>
                            </div>
                        </div>

                        {/* Marco Académico */}
                        <div className="flex flex-col gap-3.5 col-span-2 sm:col-span-1">
                            <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
                                Contexto
                            </span>
                            <div className="flex flex-col gap-2.5 text-xs text-zinc-400 leading-relaxed">
                                <p>
                                    Iniciativa académica desarrollada en el contexto del <strong className="text-zinc-200">Instituto Tecnológico de Morelia</strong>.
                                </p>
                                <p className="text-[11px] text-zinc-500 mt-1">
                                    Propuesta adaptable a otros espacios educativos y comunitarios de Michoacán.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="w-full h-px bg-white/10" />

                {/* Barra Inferior */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 text-xs text-zinc-500 font-light">
                    <div className="flex items-center gap-2">
                        <span>ReCiclo · Proyecto de Desarrollo Sustentable · IT Morelia</span>
                    </div>

                    <div className="flex items-center gap-6 text-zinc-400">
                        <button
                            onClick={handleScrollTop}
                            className="hover:text-white transition-colors duration-200 cursor-pointer"
                        >
                            Volver arriba ↑
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
