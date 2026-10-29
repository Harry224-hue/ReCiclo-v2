import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

// Componentes globales
import LenisScroll from "./components/lenis-scroll";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";

// Secciones de Inicio:
// Hero -> Cómo funciona -> Campus ITM -> Marco en Pestañas -> CTA
import { Hero } from "./sections/hero";
import { HowItWorks } from "./sections/how-it-works";
import { CampusShowcase } from "./sections/campus-showcase";
import { ScannerCTA } from "./sections/scanner-cta";
import { ProjectFrameworkTabs } from "./components/ProjectFrameworkTabs";
import { MuseumTeaser } from "./sections/museum-teaser";

// Páginas diferidas con React.lazy para reducir el bundle inicial:
const Escanear = lazy(() => import("./pages/Escanear"));
const Mapa = lazy(() => import("./pages/Mapa"));
const Historial = lazy(() => import("./pages/Historial"));
const Perfil = lazy(() => import("./pages/Perfil"));
const Museo = lazy(() => import("./pages/Museo"));

// Páginas de apoyo y autenticación diferidas
const Impacto = lazy(() => import("./pages/Impacto"));
const ComoFunciona = lazy(() => import("./pages/ComoFunciona"));
const Tecnologias = lazy(() => import("./pages/Tecnologias"));
const Login = lazy(() => import("./pages/Login"));
const Registro = lazy(() => import("./pages/Registro"));

import { SectionParallax } from "./components/SectionParallax";

function Home() {
    return (
        <>
            {/* 1. Hero: Acceso directo a Escanear y Mapa con escena interactiva */}
            <Hero />

            {/* 2. Cómo funciona: Flujo ágil de 3 pasos (Identificación, 4V y Depósito) */}
            <SectionParallax variant="how">
                <HowItWorks />
            </SectionParallax>

            {/* 3. Cartografía Oficial ITM (Campus 1 y 2) y Código de Botes */}
            <SectionParallax variant="campus">
                <CampusShowcase />
            </SectionParallax>

            {/* 4. Marco del Proyecto y Sustento Ambiental (Pestañas interactivas y colapsables) */}
            <ProjectFrameworkTabs />

            {/* 5. Museo de versiones: evidencias de la v1.0 a la v1.9 */}
            <MuseumTeaser />

            {/* 6. Llamado a la acción: Acceso directo al Escáner y Mapa */}
            <SectionParallax variant="cta">
                <ScannerCTA />
            </SectionParallax>

            <Footer />
        </>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
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
                                {/* Rutas Principales */}
                                <Route path="/" element={<Home />} />
                                <Route path="/escanear" element={<Escanear />} />
                                <Route path="/mapa" element={<Mapa />} />
                                <Route path="/historial" element={<Historial />} />
                                <Route path="/perfil" element={<Perfil />} />
                                <Route path="/museo" element={<Museo />} />

                                {/* Rutas Auxiliares */}
                                <Route path="/impacto" element={<Impacto />} />
                                <Route path="/como-funciona" element={<ComoFunciona />} />
                                <Route path="/tecnologias" element={<Tecnologias />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/registro" element={<Registro />} />
                            </Routes>
                        </Suspense>
                    </BrowserRouter>
                </div>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
