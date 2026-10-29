import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { Hero } from "./sections/hero";
import { Impact } from "./sections/impact";
import { Showcase } from "./sections/showcase";
import { ScannerCTA } from "./sections/scanner-cta";
import { LazySection } from "./components/lazy-section";
import Escanear from "./pages/Escanear";

function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <LazySection minHeight="min-h-[500px]">
          <Impact />
        </LazySection>
        <LazySection minHeight="min-h-[600px]">
          <Showcase />
        </LazySection>
        <LazySection minHeight="min-h-[500px]">
          <ScannerCTA />
        </LazySection>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white transition-colors duration-500">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/escanear" element={<><Navbar /><Escanear /><Footer /></>} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}
