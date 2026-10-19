import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

// Componentes globales
import LenisScroll from "./components/lenis-scroll";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";

// Secciones de Inicio:
// Problema → dimensiones sustentables → propuesta → cómo funciona → ODS
import { Hero } from "./sections/hero";
import { Problem } from "./sections/problem";
import { Dimensions } from "./sections/dimensions";
import { Proposal } from "./sections/proposal";
import { HowItWorks } from "./sections/how-it-works";
import { CampusShowcase } from "./sections/campus-showcase";
import { SDG } from "./sections/sdg";
import { ScannerCTA } from "./sections/scanner-cta";

// Páginas diferidas con React.lazy para reducir el bundle inicial: TensorFlow/Firebase
// (Escanear), Leaflet (Mapa) y el resto se descargan solo cuando se navega a ellas.
const Escanear = lazy(() => import("./pages/Escanear"));
const Mapa = lazy(() => import("./pages/Mapa"));
const Historial = lazy(() => import("./pages/Historial"));
const Perfil = lazy(() => import("./pages/Perfil"));

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
            {/* 1. Hero: Introducción a la iniciativa y 3 preguntas clave (IT Morelia) */}
            <Hero />

            {/* 2. El Problema */}
            <SectionParallax variant="problem">
                <Problem />
            </SectionParallax>

            {/* 3. Tres Dimensiones de la Sustentabilidad */}
            <SectionParallax variant="dimensions">
                <Dimensions />
            </SectionParallax>

            {/* 4. Qué propone ReCiclo */}
            <SectionParallax variant="proposal">
                <Proposal />
            </SectionParallax>

            {/* 5. Cómo funciona */}
            <SectionParallax variant="how">
                <HowItWorks />
            </SectionParallax>

            {/* 6. Cartografía Oficial ITM (Campus 1 y 2) y Código de Botes */}
            <SectionParallax variant="campus">
                <CampusShowcase />
            </SectionParallax>

            {/* 7. Impacto esperado (ODS) */}
            <SectionParallax variant="sdg">
                <SDG />
            </SectionParallax>

            {/* 8. Llamado a la acción: Acceso directo al Escáner y Mapa */}
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

                        {/* Suspense muestra un estado de carga mientras baja el código de la ruta */}
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