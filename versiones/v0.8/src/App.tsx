import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { Hero } from "./sections/hero";
import { Impact } from "./sections/impact";
import { Showcase } from "./sections/showcase";
import { ScannerCTA } from "./sections/scanner-cta";
import LenisScroll from "./components/lenis-scroll";
import Escanear from "./pages/Escanear";

function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero videoSrc="/video-hero.mp4" />
        <Impact />
        <Showcase />
        <ScannerCTA />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white transition-colors duration-500">
        <LenisScroll />
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
