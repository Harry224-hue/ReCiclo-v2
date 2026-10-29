import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight text-emerald-600 select-none">
          ReCiclo
        </span>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <span className="text-slate-900 cursor-default">Inicio</span>
          <a href="#metricas" className="hover:text-emerald-600 transition-colors">
            Impacto
          </a>
          <a href="#materiales" className="hover:text-emerald-600 transition-colors">
            Guía de Materiales
          </a>
        </nav>
      </div>
    </header>
  );
}

function TeamCredits() {
  const [c1, setC1] = useState(0);
  const [c2, setC2] = useState(0);
  const [c3, setC3] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (c1 >= 6 && c2 >= 6 && c3 >= 7 && !unlocked) {
      setUnlocked(true);
    }
  }, [c1, c2, c3, unlocked]);

  return (
    <div className="text-xs text-slate-500 mt-3 select-none">
      <span>Equipo de desarrollo: </span>
      {!unlocked && (
        <>
          <span
            onClick={() => setC1(c => c + 1)}
            className={`cursor-pointer ${c1 >= 6 ? "text-emerald-700 font-bold" : c1 > 0 ? "text-emerald-600" : "hover:text-slate-900"}`}
          >
            García Montañez Ulises Jasen
          </span>
          <span>, </span>
          <span
            onClick={() => setC2(c => c + 1)}
            className={`cursor-pointer ${c2 >= 6 ? "text-emerald-700 font-bold" : c2 > 0 ? "text-emerald-600" : "hover:text-slate-900"}`}
          >
            Medina Cuamba Juan Pablo
          </span>
          <span>, </span>
        </>
      )}
      <span
        onClick={() => setC3(c => c + 1)}
        className={`cursor-pointer ${unlocked || c3 >= 7 ? "text-emerald-700 font-bold" : c3 > 0 ? "text-emerald-600" : "hover:text-slate-900"}`}
      >
        Solís Calvillo Juan Pablo
      </span>
    </div>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 mb-6">
            Versión 0.3 • Guía Práctica
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
            Apunta. Descubre. Recicla.
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto mb-10 leading-relaxed">
            Aprende a clasificar y separar tus residuos de forma sencilla y eficiente en el campus.
          </p>
          <div className="flex justify-center">
            <a
              href="#materiales"
              className="px-6 py-3 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Ver guía de materiales
            </a>
          </div>
        </section>

        <section id="metricas" className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-200">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              El resultado de hacerlo <span className="text-emerald-600">simple.</span>
            </h2>
            <p className="text-sm text-slate-600">
              Transformando la duda al tirar la basura en un hábito de impacto positivo inmediato.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-4xl font-extrabold text-slate-900 mb-2">150,000</div>
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Objetos clasificados</div>
              <p className="text-xs text-slate-500">Meta proyectada de residuos guiados</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-4xl font-extrabold text-slate-900 mb-2">25 T</div>
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Emisiones reducidas</div>
              <p className="text-xs text-slate-500">Huella de carbono evitada con reciclaje óptimo</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-4xl font-extrabold text-slate-900 mb-2">99%</div>
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Precisión de separación</div>
              <p className="text-xs text-slate-500">Disposición correcta sin contaminación</p>
            </div>
          </div>
        </section>

        <section id="materiales" className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-200">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Guía paso a paso</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-3">Materiales principales</h2>
            <p className="text-sm text-slate-600">
              Consejos básicos de separación para los residuos más comunes del Tecnológico:
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-2xl font-black text-emerald-600 mb-2 block">01</span>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Envases y Plásticos</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Botellas de PET, refrescos y envases de comida. Deben vaciarse completamente, enjuagarse si es posible y aplastarse para ahorrar espacio.
              </p>
              <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded">Contenedor Amarillo</span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-2xl font-black text-emerald-600 mb-2 block">02</span>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Papel y Cartón</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Hojas limpias, libretas usadas y cajas de cartón. Mantener siempre secos y sin grasa ni restos de alimento para permitir su reprocesamiento.
              </p>
              <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded">Contenedor Azul</span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-2xl font-black text-emerald-600 mb-2 block">03</span>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Vidrio y Frascos</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Botellas y frascos de cristal. Retirar tapas metálicas o corchos antes de depositar. El vidrio se recicla infinitas veces.
              </p>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded">Contenedor Verde</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <div>Copyright 2026 ReCiclo. Guía de separación de residuos.</div>
        <TeamCredits />
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
