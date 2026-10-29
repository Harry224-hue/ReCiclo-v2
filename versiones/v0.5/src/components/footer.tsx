import { useState } from "react";
import { Link } from "react-router-dom";

function TeamCredits() {
  const [c1, setC1] = useState(0);
  const [c2, setC2] = useState(0);
  const [c3, setC3] = useState(0);
  const [step, setStep] = useState(1);
  const [failed, setFailed] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const h1 = () => {
    if (unlocked || failed) return;
    if (step === 1 && c1 < 6) {
      const next = c1 + 1;
      setC1(next);
      if (next === 6) setStep(2);
    } else {
      setFailed(true);
    }
  };

  const h2 = () => {
    if (unlocked || failed) return;
    if (step === 2 && c2 < 6) {
      const next = c2 + 1;
      setC2(next);
      if (next === 6) setStep(3);
    } else {
      setFailed(true);
    }
  };

  const h3 = () => {
    if (unlocked) {
      setShowExplanation(prev => !prev);
      return;
    }
    if (failed) return;
    if (step === 3 && c3 < 7) {
      const next = c3 + 1;
      setC3(next);
      if (next === 7) setUnlocked(true);
    } else {
      setFailed(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 text-xs text-zinc-400 mt-4 select-none border-t border-zinc-800/60 pt-4 w-full">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className={unlocked ? "text-emerald-400 font-semibold" : "text-zinc-500"}>
          {unlocked ? "Creador del proyecto:" : "Desarrollo del proyecto:"}
        </span>
        {!unlocked && (
          <>
            <span
              onClick={h1}
              className={`cursor-pointer ${!failed && c1 >= 6 ? "text-emerald-400 font-bold" : !failed && c1 > 0 ? "text-zinc-200" : "hover:text-zinc-300"}`}
            >
              García Montañez Ulises Jasen
            </span>
            <span className="text-zinc-600">•</span>
            <span
              onClick={h2}
              className={`cursor-pointer ${!failed && c2 >= 6 ? "text-emerald-400 font-bold" : !failed && c2 > 0 ? "text-zinc-200" : "hover:text-zinc-300"}`}
            >
              Medina Cuamba Juan Pablo
            </span>
            <span className="text-zinc-600">•</span>
          </>
        )}
        <span
          onClick={h3}
          className={`cursor-pointer ${unlocked || (!failed && c3 >= 7) ? "text-emerald-400 font-bold" : !failed && c3 > 0 ? "text-zinc-200" : "hover:text-emerald-400"}`}
        >
          Solís Calvillo Juan Pablo
        </span>
      </div>
      {unlocked && showExplanation && (
        <div className="w-full max-w-xl mt-3 p-4 rounded-xl bg-zinc-900 border border-emerald-500/30 text-zinc-300 text-xs text-left shadow-lg space-y-2 leading-relaxed">
          <p>
            Aunque el equipo se registró inicialmente con varios integrantes para cumplir con los requisitos de la convocatoria escolar, el proyecto ReCiclo fue desarrollado íntegramente por mí. Me encargué de la investigación, la planificación, el diseño de la interfaz, la arquitectura del sistema y toda la programación necesaria para su funcionamiento. Los demás integrantes únicamente aparecieron en el registro inicial del equipo y no participaron en el desarrollo ni en la ejecución del proyecto.
          </p>
          <p>
            Quiero aclarar que esto no se debió a ninguna mala intención ni a desacuerdos con ellos. Simplemente me siento más cómodo trabajando de manera independiente y es la forma en la que he desarrollado la mayoría de mis proyectos a lo largo del tiempo. Estoy acostumbrado a asumir todas las etapas del proceso por mi cuenta, desde la concepción de una idea hasta su implementación final.
          </p>
          <p className="text-emerald-400 font-medium italic pt-1">
            When I was young, I prayed for lightning.
          </p>
        </div>
      )}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8 px-6 border-t border-zinc-800 text-center text-xs text-zinc-500">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <Link to="/" className="text-xl font-bold tracking-tight text-white mb-2">ReCiclo</Link>
        <p className="text-zinc-400 text-sm max-w-md mb-6">Plataforma para la separación y clasificación guiada de residuos en el campus.</p>
        <TeamCredits />
        <p className="mt-6 text-zinc-600">Copyright 2026 ReCiclo. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
