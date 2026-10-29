import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

export default function LenisScroll() {
    const lenisRef = useRef<Lenis | null>(null);
    const location = useLocation();

    useEffect(() => {
        const lenis = new Lenis({
            duration: 0.5,
            wheelMultiplier: 1,
            smoothWheel: true,
            syncTouch: false,
            anchors: true,
        });

        lenisRef.current = lenis;

        let rafId = 0;

        const raf = (time: number) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };

        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    // Al cambiar de ruta, reiniciamos el scroll inmediatamente en Lenis y en la ventana
    useEffect(() => {
        if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { immediate: true });
        } else {
            window.scrollTo(0, 0);
        }
    }, [location.pathname]);

    return null;
}