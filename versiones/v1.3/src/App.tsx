import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

import LenisScroll from "./components/lenis-scroll";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { LazySection } from "./components/lazy-section";
import { SectionParallax } from "./components/SectionParallax";

import { Hero } from "./sections/hero";
import { Problem } from "./sections/problem";
import { Impact } from "./sections/impact";
import { Showcase } from "./sections/showcase";
import { ScannerCTA } from "./sections/scanner-cta";

const Escanear = lazy(() => import("./pages/Escanear"));
const Historial = lazy(() => import("./pages/Historial"));
const Impacto = lazy(() => import("./pages/Impacto"));
const ComoFunciona = lazy(() => import("./pages/ComoFunciona"));
const Tecnologias = lazy(() => import("./pages/Tecnologias"));

function Home() {
    return (
        <>
            <Hero />
            <SectionParallax variant="problem">
                <Problem />
            </SectionParallax>
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
                    <Suspense fallback={
                        <div className="h-screen w-full flex items-center justify-center">
                            <div className="size-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    }>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/escanear" element={<Escanear />} />
                            <Route path="/historial" element={<Historial />} />
                            <Route path="/impacto" element={<Impacto />} />
                            <Route path="/como-funciona" element={<ComoFunciona />} />
                            <Route path="/tecnologias" element={<Tecnologias />} />
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </div>
        </ThemeProvider>
    );
}

export default App;
