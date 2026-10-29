import { useState, useEffect, useRef, ReactNode } from "react";
import { motion } from "framer-motion";

interface LazySectionProps {
    children: ReactNode;
    minHeight?: string; // Evita que la página salte al calcular el scroll
}

export function LazySection({ children, minHeight = "min-h-[50vh]" }: LazySectionProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentRef = sectionRef.current;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsLoaded(true);
                    observer.disconnect(); // Una vez cargado, dejamos de observar para ahorrar memoria
                }
            },
            {
                rootMargin: "300px", // Carga el contenido 300px antes de que entre a la pantalla
                threshold: 0
            }
        );

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) observer.disconnect();
        };
    }, []);

    return (
        <div ref={sectionRef} className={!isLoaded ? minHeight : ""}>
            {isLoaded ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {children}
                </motion.div>
            ) : null}
        </div>
    );
}