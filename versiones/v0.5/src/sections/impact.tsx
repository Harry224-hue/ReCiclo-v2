import { Globe } from "lucide-react";

export function Impact() {
  return (
    <section className="py-20 px-6 max-w-5xl mx-auto text-white">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="flex items-center gap-2 mb-4 text-emerald-400">
          <Globe size={18} />
          <span className="text-xs uppercase tracking-[0.2em] font-medium">Impacto Global</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-medium tracking-tight mb-4">
          El resultado de hacerlo <span className="text-emerald-400">simple.</span>
        </h2>
        <p className="text-sm text-zinc-400 max-w-md">
          Pequeñas acciones cotidianas que transforman la gestión de desechos en el campus.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center">
        <div>
          <div className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-2">150,000</div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-1">Objetos clasificados</div>
          <p className="text-xs text-zinc-400">Meta proyectada de residuos guiados</p>
        </div>
        <div className="border-y md:border-y-0 md:border-x border-zinc-800 py-6 md:py-0">
          <div className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-2">25 T</div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-1">Emisiones evitadas</div>
          <p className="text-xs text-zinc-400">Reducción estimada de gases de efecto invernadero</p>
        </div>
        <div>
          <div className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-2">99%</div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-1">Precisión de separación</div>
          <p className="text-xs text-zinc-400">Pureza de material en los contenedores</p>
        </div>
      </div>
    </section>
  );
}
