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
          <a href="#por-que" className="hover:text-emerald-600 transition-colors">
            ¿Por qué ReCiclo?
          </a>
          <a href="#metricas" className="hover:text-emerald-600 transition-colors">
            Métricas
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
            Versión 0.2 • Métricas Preliminares
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
            ReCiclo: Guía de Separación y Manejo de Residuos
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Plataforma para clasificar y depositar correctamente los materiales reciclables generados en el campus.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#metricas"
              className="px-6 py-3 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Ver métricas estimadas
            </a>
          </div>
        </section>

        <section id="por-que" className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">¿Por qué ReCiclo?</h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Dos retos inmediatos detectados en las áreas comunes del campus:
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-4">
                01
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Clasificación accesible</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Dudas frecuentes al separar envases compuestos hacen que muchos materiales reciclables terminen en el bote equivocado.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-4">
                02
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Reducción de residuos contaminados</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Evitar que líquidos o restos orgánicos inutilicen lotes enteros de botellas PET o cartón depositados en los contenedores.
              </p>
            </div>
          </div>
        </section>

        <section id="metricas" className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-200">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Estimación preliminar</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 mb-3">Métricas de impacto proyectadas</h2>
              <p className="text-sm text-slate-600">
                Cálculo inicial considerando la separación activa de residuos en el campus:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-4xl font-extrabold text-slate-900 mb-2">150,000</div>
                <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Objetos a clasificar</div>
                <p className="text-xs text-slate-500">Volumen potencial anual de clasificación guiada</p>
              </div>
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-4xl font-extrabold text-slate-900 mb-2">25 T</div>
                <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Emisiones evitadas</div>
                <p className="text-xs text-slate-500">Estimación de CO₂ reducido con reciclaje efectivo</p>
              </div>
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-4xl font-extrabold text-slate-900 mb-2">99%</div>
                <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Precisión esperada</div>
                <p className="text-xs text-slate-500">Destino correcto en los botes asignados</p>
              </div>
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
