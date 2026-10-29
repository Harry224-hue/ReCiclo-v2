import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

// Componentes globales
import LenisScroll from "./components/lenis-scroll";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { LazySection } from "./components/lazy-section";

// Secciones del Inicio
import { Hero } from "./sections/hero";
import { Impact } from "./sections/impact";
import { Showcase } from "./sections/showcase";
import { ScannerCTA } from "./sections/scanner-cta";

// Páginas (Carga diferida para que el inicio cargue al instante)
const Escanear = lazy(() => import("./pages/Escanear"));

function Home() {
    return (
        <>
            {/* El Hero carga de inmediato porque es lo primero que ve el usuario */}
            <Hero />

            {/* Las demás secciones esperan a que el usuario haga scroll */}
            <LazySection minHeight="min-h-[40vh]">
                <Impact />
            </LazySection>

            <LazySection minHeight="min-h-[80vh]">
                <Showcase />
            </LazySection>

            <LazySection minHeight="min-h-[40vh]">
                <ScannerCTA />
            </LazySection>

            <Footer />
        </>
    );
}

function App() {
    return (
        <ThemeProvider>
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-500">
                <BrowserRouter>
                    <LenisScroll />
                    <Navbar />

                    {/* Suspense muestra un estado de carga mientras baja el código de la ruta "Escanear" */}
                    <Suspense fallback={
                                   <div className="h-screen w-full flex items-center justify-center">
                                      <div className="size-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                              }>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/escanear" element={<Escanear />} />
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </div>
        </ThemeProvider>
    );
}

export default App;