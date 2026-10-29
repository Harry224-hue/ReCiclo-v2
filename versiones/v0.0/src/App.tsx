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
          <a href="#acerca" className="hover:text-emerald-600 transition-colors">
            Proyecto
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
            Prototipo v0.0 • Tecnológico de Morelia
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
            ReCiclo: Guía de Separación y Manejo de Residuos
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Plataforma informativa para la identificación y clasificación adecuada de materiales reciclables generados en el campus.
          </p>
          <div className="flex justify-center">
            <a
              href="#acerca"
              className="px-6 py-3 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Conocer el proyecto
            </a>
          </div>
        </section>

        <section id="acerca" className="max-w-4xl mx-auto px-6 py-16 border-t border-slate-200">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Objetivo General</h2>
            <p className="text-slate-600 leading-relaxed text-base mb-6">
              Desarrollar una herramienta accesible orientada a la comunidad estudiantil del Instituto Tecnológico de Morelia para facilitar la correcta disposición de residuos sólidos urbanos, reducir la contaminación cruzada en contenedores y fomentar la cultura del reciclaje.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-sm text-slate-500">
              <div><strong>Sede:</strong> Campus Morelia</div>
              <div><strong>Alcance:</strong> Comunidad Tecnológica</div>
              <div><strong>Enfoque:</strong> Separación en origen</div>
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
