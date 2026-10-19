// Tipos de datos para Firebase/Firestore — ReCiclo

// ─── Usuario ───────────────────────────────────────────────
export interface UserProfile {
    uid: string;
    nombre: string;
    correo: string;
    fotoPerfil: string;
    fechaRegistro: Date;
    // Campos editables desde la página de perfil (opcionales: los usuarios antiguos no los tienen)
    carrera?: string;
    semestre?: string;
    numeroControl?: string;
    bio?: string;
    campus?: string;
    preferencias: {
        notificaciones: boolean;
        temaOscuro: boolean;
    };
}

// ─── Escaneo ───────────────────────────────────────────────
export interface Scan {
    id: string;
    userId: string;
    fecha: Date;
    nombreDetectado: string;
    categoria: string;
    material: string;
    contenedor: string;
    confianza: number; // 0-100
    imagenUrl: string;
}

// ─── Catálogo de residuos ──────────────────────────────────
export interface WasteType {
    id: string;
    nombre: string;
    categoria: string;
    material: string;
    contenedor: string;
    reciclable: boolean;
    instrucciones: string;
    tiempoDescomposicion: string;
    imagen: string;
}

// ─── Progreso del usuario ──────────────────────────────────
export interface UserProgress {
    userId: string;
    nivel: number;
    experiencia: number;
    totalEscaneos: number;
    residuosReciclables: number;
    residuosNoReciclables: number;
}

// ─── Punto de reciclaje ────────────────────────────────────
export interface RecyclingPoint {
    id: string;
    nombre: string;
    direccion: string;
    latitud: number;
    longitud: number;
    materialesAceptados: string[];
    horario: string;
    telefono: string;
    imagen: string;
    activo: boolean;
}

// ─── Favorito ──────────────────────────────────────────────
export interface Favorite {
    userId: string;
    recyclingPointId: string;
    fecha: Date;
}

// ─── Reporte ───────────────────────────────────────────────
export interface Report {
    id: string;
    userId: string;
    recyclingPointId: string;
    tipo: "no_existe" | "materiales_incorrectos" | "horario_incorrecto" | "otro";
    descripcion: string;
    fecha: Date;
    estado: "pendiente" | "revisado" | "resuelto";
}