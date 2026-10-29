import { Leaf, Recycle, CheckCircle2, MapPin, Scan } from "lucide-react";
import { Link } from "react-router-dom";

export function ScannerCTA() {
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto text-center text-white">
      <div className="relative w-full max-w-md mx-auto h-44 mb-10 flex justify-center items-center">
        <div className="absolute w-56 h-32 p-4 rounded-2xl bg-gradient-to-br from-zinc-900 to-black text-white border border-zinc-800 -rotate-12 -translate-x-20 flex flex-col justify-between text-left shadow-xl">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold">
            <span className="flex items-center gap-1"><Leaf size={14} /> Huella Evitada</span>
            <CheckCircle2 size={14} />
          </div>
          <div>
            <div className="text-xl font-bold">-48g CO₂</div>
            <span className="text-[10px] text-zinc-400">Envase PET 100% recuperado</span>
          </div>
          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full w-4/5 rounded-full" />
          </div>
        </div>
        <div className="absolute w-56 h-32 p-4 rounded-2xl bg-gradient-to-br from-zinc-900 to-black text-white border border-zinc-800 rotate-12 translate-x-20 flex flex-col justify-between text-left shadow-xl">
          <div className="flex items-center justify-between text-amber-400 text-xs font-semibold">
            <span className="flex items-center gap-1"><Recycle size={14} /> Contenedor Amarillo</span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">+15 Pts</span>
          </div>
          <div>
            <div className="text-xs font-semibold">Plásticos y Latas</div>
            <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-0.5">
              <MapPin size={11} className="text-amber-400" />
              <span>Punto limpio a 30m</span>
            </div>
          </div>
          <div className="text-[9px] text-zinc-400 font-mono flex items-center justify-between border-t border-zinc-800 pt-1.5">
            <span>Clasificación exacta</span>
            <span className="text-amber-400 font-semibold">Depósito OK</span>
          </div>
        </div>
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold mb-4">¿Tienes una botella o lata a la mano?</h2>
      <p className="text-zinc-400 text-sm max-w-lg mx-auto mb-8">
        Apunta con la cámara y compruébalo tú mismo. Sin registro ni instalaciones previas.
      </p>
      <Link
        to="/escanear"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors"
      >
        <Scan size={18} />
        Probar Escáner Ahora
      </Link>
    </section>
  );
}
