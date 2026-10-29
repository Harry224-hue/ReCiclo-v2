export function Showcase() {
  return (
    <section className="py-20 px-6 max-w-5xl mx-auto text-white">
      <div className="text-center mb-12">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Guía de Separación</span>
        <h2 className="text-3xl font-bold mt-2 mb-3">Materiales principales</h2>
        <p className="text-sm text-zinc-400">Recomendaciones para el depósito en los contenedores del campus:</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-2xl font-black text-amber-400 mb-2 block">01</span>
          <h3 className="font-bold text-lg mb-2">Envases y Plásticos</h3>
          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            Botellas de PET, jugos y refrescos. Vaciar el líquido, aplastar y depositar con la tapa enroscada.
          </p>
          <span className="text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20">Contenedor Amarillo</span>
        </div>
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-2xl font-black text-blue-400 mb-2 block">02</span>
          <h3 className="font-bold text-lg mb-2">Papel y Cartón</h3>
          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            Hojas, cuadernos y cajas limpias. No incluir papel con residuos de grasa o servilletas usadas.
          </p>
          <span className="text-xs font-medium text-blue-400 bg-blue-400/10 px-2 py-1 rounded border border-blue-400/20">Contenedor Azul</span>
        </div>
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-2xl font-black text-emerald-400 mb-2 block">03</span>
          <h3 className="font-bold text-lg mb-2">Vidrio y Botellas</h3>
          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            Envases de cristal y botellas. Enjuagar rápidamente y retirar las tapas de metal antes de tirar.
          </p>
          <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">Contenedor Verde</span>
        </div>
      </div>
    </section>
  );
}
