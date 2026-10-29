/**
 * Catálogo del museo de versiones.
 *
 * Una entrada por versión, de v0.0 a v1.9. Cada cédula responde a tres
 * preguntas cortas: qué se agregó, qué se quitó y por qué. Los textos se
 * extraen del historial académico del proyecto (HISTORIAL_VERSIONES.md y
 * BITACORA_RECICLO.md), resumidos para una placa de museo.
 */

export const MUSEUM_CAPTURE_WIDTH = 1200;

export interface MuseumVersion {
    id: string;
    slug: string;
    phase: "v0" | "v1" | "v2";
    date: string;
    title: string;
    why: string;
    added: string[];
    removed: string[];
    screenshot: string;
    screenshotMobile: string;
    height: number;
    runPath: string;
    badge?: string;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
});

export function formatMuseumDate(isoDate: string): string {
    return DATE_FORMATTER.format(new Date(`${isoDate}T12:00:00`));
}

export function museumShotUrl(screenshot: string, isMobile = false): string {
    const base = import.meta.env.BASE_URL === "./" ? "/museo/" : `${import.meta.env.BASE_URL}museo/`;
    if (isMobile) {
        const id = screenshot.replace(/\.(webp|png|jpg)$/, "");
        return `${base}${id}-mobile.png`;
    }
    return `${base}${screenshot}`;
}

export function museumAnchor(id: string): string {
    return `version-${id.replace(/\./g, "-")}`;
}

/** Ruta servida del bundle para "probar" la versión dentro del emulador. */
export function museumRunUrl(id: string): string {
    const base = import.meta.env.BASE_URL === "./" ? "/emulador/" : `${import.meta.env.BASE_URL}emulador/`;
    return `${base}${id}/index.html`;
}

function v(
    id: string,
    phase: "v0" | "v1" | "v2",
    date: string,
    title: string,
    why: string,
    added: string[],
    removed: string[],
    height: number,
    badge?: string
): MuseumVersion {
    return {
        id,
        slug: museumAnchor(id),
        phase,
        date,
        title,
        why,
        added,
        removed,
        screenshot: `${id}.webp`,
        screenshotMobile: `${id}-mobile.png`,
        height,
        runPath: `versiones/${id}/`,
        badge,
    };
}

export const MUSEUM_VERSIONS: MuseumVersion[] = [
    // ─── Fase 0 · De la semilla al prototipo ────────────────────────────
    v("v0.0", "v0", "2026-09-04", "El primer trazo", "Nace la idea de ReCiclo: una página sencilla con la identidad y el lema ambiental del proyecto.", ["Portada principal con diseño oscuro", "Logotipo y nombre oficial de ReCiclo", "Lema ambiental del proyecto"], [], 878),
    v("v0.1", "v0", "2026-09-05", "Explicando el propósito", "Se añade la primera explicación clara de por qué es importante separar los residuos dentro del campus.", ["Menú superior con enlace de Inicio", "Sección introductoria «¿Por qué ReCiclo?»", "Mensajes de concientización estudiantil"], [], 1005),
    v("v0.2", "v0", "2026-09-07", "Primeros datos de impacto", "Se muestran las primeras cifras para que los estudiantes comprendan el volumen de residuos generados.", ["Sección de impacto ambiental", "Cifras destacadas de reciclaje", "Diseño visual más ordenado"], [], 1368),
    v("v0.3", "v0", "2026-09-09", "Guía de materiales", "Aparece la primera guía práctica para que los alumnos identifiquen qué materiales se pueden reciclar.", ["Eslogan principal del proyecto", "Tarjetas didácticas de materiales reciclables", "Consejos para no mezclar residuos"], [], 1303),
    v("v0.4", "v0", "2026-09-11", "Llega el escáner de residuos", "Se integra la herramienta principal: una pantalla donde los estudiantes pueden clasificar sus residuos.", ["Pantalla interactiva para clasificar residuos", "Botón directo para abrir el escáner", "Pie de página con enlaces e información"], [], 2270),
    v("v0.5", "v0", "2026-09-12", "Personalización de colores", "Se le permite a cada usuario elegir entre modo claro u oscuro y seleccionar su color favorito.", ["Modo claro y modo oscuro", "Selector de colores para la interfaz", "Recuerdo de tus preferencias al volver a entrar"], [], 2270),
    v("v0.6", "v0", "2026-09-14", "Navegación más ágil", "Se optimiza la página para que abra rápido en el campus sin gastar los datos móviles de los estudiantes.", ["Carga rápida e instantánea de la página", "Apertura fluida de imágenes y contenidos"], [], 2270),
    v("v0.7", "v0", "2026-09-15", "Barra de navegación moderna", "La barra superior se transforma en un menú flotante más cómodo y las cifras de reciclaje ahora son interactivas.", ["Menú de navegación flotante y cómodo", "Menú desplegable para teléfonos celulares", "Animación dinámica en las cifras de impacto"], ["Barra superior rígida tradicional"], 3076),
    v("v0.8", "v0", "2026-09-17", "Portada visual y ajustes", "La portada gana un video ambientado del campus y se crea un menú dedicado para personalizar toda la experiencia.", ["Video de bienvenida en la portada", "Ventana para ajustar la apariencia a tu gusto", "Desplazamiento suave entre secciones"], [], 3226),
    v("v0.9", "v0", "2026-09-18", "Consolidación del prototipo", "Se afina toda la configuración y se prepara la plataforma antes de dar el salto a la versión oficial del campus.", ["Panel completo para cambiar colores y temas", "Modo claro y oscuro más simple y directo", "Navegación más veloz entre páginas"], ["Configuraciones automáticas confusas"], 3226),

    // ─── Fase 1 · Del lanzamiento a la entrega final (19 Sep – 08 Oct) ──
    v("v1.0", "v1", "2026-09-19", "Lanzamiento oficial en el campus", "Primera versión oficial de ReCiclo, consolidando la portada informativa y la demostración del escáner.", ["Portada oficial de bienvenida", "Secciones de impacto ambiental e información del campus", "Demostración guiada del escáner de residuos"], [], 3468),
    v("v1.1", "v1", "2026-09-20", "Información ecológica a fondo", "Se integran páginas completas de lectura para quienes desean conocer a fondo cómo funciona el reciclaje.", ["Página dedicada al impacto ambiental", "Guía explicativa de cómo funciona la separación", "Información sobre las herramientas utilizadas"], [], 3468),
    v("v1.2", "v1", "2026-09-21", "Diagnóstico en el Tecnológico", "Se expone el problema real de la basura en el IT Morelia y se crea la bitácora de avances del proyecto.", ["Diagnóstico del manejo de basura en el campus", "Bitácora para consultar la historia y avances de la iniciativa"], [], 4378),
    v("v1.3", "v1", "2026-09-23", "Tus registros no se pierden", "Ahora los residuos clasificados se guardan automáticamente en tu dispositivo y puedes previsualizar fotos.", ["Historial que se conserva al cerrar la ventana", "Selector para subir fotos con vista previa antes de clasificar"], ["Pérdida de datos al salir de la página"], 4378),
    v("v1.4", "v1", "2026-09-25", "Guía para preparar residuos", "Se enseña a vaciar, enjuagar y aplastar botellas y envases antes de depositarlos en el contenedor correcto.", ["Guía paso a paso para preparar botellas y empaques", "Catálogo detallado de los 4 tipos de residuos del campus", "Compromiso con el cuidado del medio ambiente"], [], 5235),
    v("v1.5", "v1", "2026-09-28", "Mayor velocidad sin consumir datos", "Se reemplaza el video de portada por un diseño ultraligero que abre al instante en el campus y ayuda a identificar materiales.", ["Portada rápida que cuida tus datos móviles", "Recomendación sugerida de material al subir una imagen"], ["Video pesado de fondo que tardaba en cargar"], 5235),
    v("v1.6", "v1", "2026-10-02", "Mapa del Campus 1", "Llega el mapa oficial con la ubicación exacta de las estaciones de reciclaje en la Pony Plaza y andadores principales.", ["Mapa interactivo del Campus 1 con ubicación de contenedores", "Resumen de las áreas con mayor necesidad de reciclaje"], [], 6440),
    v("v1.7", "v1", "2026-10-04", "Mapa del Campus 2 y filtros", "El mapa se extiende al Campus 2 y ahora es posible filtrar los contenedores según el tipo de residuo que quieras tirar.", ["Mapa extendido al Campus 2", "Filtros para ubicar botes de plástico, papel y orgánicos", "Atajos para encontrar el bote más cercano"], [], 8135),
    v("v1.8", "v1", "2026-10-07", "Cámara en vivo y cuenta de estudiante", "Permite usar la cámara de tu celular para apuntar a un residuo y acceder con tu número de control del IT Morelia.", ["Uso de la cámara del celular en tiempo real", "Acceso para estudiantes con número de control", "Galería fotográfica de botes reales del campus"], [], 8479),
    v("v1.9", "v1", "2026-10-08", "La entrega final", "Entrega integral presentada en Oxigena tus Ideas: inicio ágil en pestañas, perfil con medallas y reconocimiento visual.", ["Inicio organizado en pestañas para encontrar todo en un clic", "Perfil de estudiante con racha de reciclaje y medallas de logro", "Reconocimiento visual instantáneo de botellas y latas"], ["Páginas largas y dispersas (ahora unificadas en pestañas)"], 5107, "Entrega final"),

    // ─── Fase 2 · Web pura y evolución en producción (18 Oct – 28 Oct) ──
    v("v2.0", "v2", "2026-10-18", "Arquitectura Web Pura", "Se elimina la dependencia de Android y Windows para operar 100% en navegadores web con integración continua.", ["Eliminación de contenedores Electron y Capacitor", "Integración Continua con GitHub Actions", "Insignia visual oficial v2.0 en navbar"], ["Empaquetados nativos pesados (.apk, .exe)"], 8041, "Web Pura"),
    v("v2.1", "v2", "2026-10-18", "Nube y Funciones Serverless", "Se despliega la plataforma en Vercel con endpoints seguros para proteger las credenciales de inteligencia artificial.", ["Despliegue optimizado en Vercel", "Función serverless para la API de Gemini", "Enrutamiento SPA con rewrites limpios"], [], 8041),
    v("v2.2", "v2", "2026-10-21", "Seguridad y Validación Estudiantil", "Se refuerza el control de acceso verificando que los estudiantes ingresen con su matrícula oficial del IT Morelia.", ["Validación de matrícula institucional", "Protección y control de sesión con Firebase", "Mensajes claros de error en autenticación"], [], 8041),
    v("v2.3", "v2", "2026-10-21", "Isla Dinámica e Interfaz Adaptativa", "Se crea un componente flotante de estado superior y se refinan los controles de accesibilidad y contraste.", ["Isla flotante superior interactiva (NotchIsland)", "Modo claro y oscuro con contraste reforzado", "Controles de navegación ágiles"], [], 8041),
    v("v2.4", "v2", "2026-10-21", "Modularización de Ajustes y Perfil", "Se reorganiza el código de ajustes y perfil en submódulos especializados para acelerar la navegación.", ["Submódulos dedicados para el perfil de usuario", "Pestañas secundarias de configuración organizadas", "Mayor fluidez en transiciones de pantalla"], [], 8041),
    v("v2.5", "v2", "2026-10-21", "Fundamentación Ambiental y Guía Operativa", "Se reestructuran las páginas informativas con datos verificables sobre el impacto de los residuos en el campus.", ["Página renovada de Cómo Funciona", "Métricas sustentables y fundamentación de impacto", "Guía paso a paso de acondicionamiento de envases"], [], 8041),
    v("v2.6", "v2", "2026-10-22", "Catálogo de Tecnologías Institucionales", "Se estructura el inventario completo de herramientas, bibliotecas y normativas que dan sustento a ReCiclo.", ["Catálogo estructurado en 6 capas tecnológicas", "Fichas técnicas con licencias y propósito de cada librería", "Alineación explícita con normas ambientales mexicanas"], [], 8041),
    v("v2.7", "v2", "2026-10-22", "Historial Estudiantil y Métricas de Logro", "Se enriquece el perfil con estadísticas detalladas de residuos evitados, medallas y sincronización en la nube.", ["Panel avanzado de estadísticas de reciclaje", "Medallas de logro y constancia estudiantil", "Sincronización automática con Cloud Firestore"], [], 8041),
    v("v2.8", "v2", "2026-10-28", "El Museo de la Evolución", "Llega el museo histórico interactivo que permite emular y recorrer visualmente las 20 versiones previas del proyecto.", ["Museo interactivo con emuladores integrados", "Cédulas históricas con adiciones y retiros", "Pestañas del marco institucional en portada"], [], 5146, "Museo v1"),
    v("v2.9", "v2", "2026-10-28", "Consolidación de Producción y Resiliencia", "Se blinda la aplicación contra bloqueadores de red y se integra la suite completa de 30 versiones históricas.", ["Resiliencia ante bloqueadores de anuncios (GTM/Firebase)", "Suite completa de 30 versiones históricas catalogadas", "Rendimiento optimizado para conexiones del campus"], [], 5146, "Versión 2 Consolidada"),
];

export const MUSEUM_COUNT = MUSEUM_VERSIONS.length;
