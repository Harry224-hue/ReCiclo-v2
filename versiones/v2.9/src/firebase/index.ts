// Firebase — Barrel export
// Importa lo que necesites desde "../firebase" directamente

// Configuración e instancias
export { auth, db, analytics } from "./config";

// Autenticación
export {
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    loginWithGithub,
    logout,
    onAuthChange,
    getUserProfile,
    updateUserProfile,
    setAuthPersistence,
    sendPasswordReset,
    getAuthErrorMessage,
} from "./auth";
export type { ProfileUpdate } from "./auth";

// Firestore (base de datos)
export {
    addScan,
    getUserScans,
    deleteScan,
    getWasteTypes,
    getWasteTypeById,
    getUserProgress,
    updateUserProgress,
    getRecyclingPoints,
    getRecyclingPointById,
    addFavorite,
    getUserFavorites,
    removeFavorite,
    addReport,
    getUserReports,
} from "./firestore";

// Tipos
export type {
    UserProfile,
    Scan,
    WasteType,
    UserProgress,
    RecyclingPoint,
    Favorite,
    Report,
} from "./types";