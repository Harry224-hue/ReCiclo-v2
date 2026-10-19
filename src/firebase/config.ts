import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Configuración de Firebase (usa variables de entorno con fallback directo al proyecto)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBIy6th-hR50TSK211hVgSrdQwkXkx9A7Y",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "reciclo-aae7b.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "reciclo-aae7b",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "reciclo-aae7b.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "130355039529",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:130355039529:web:fe5adb1ff434dc5d227b38",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-GHLL8QQ3ZF",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics (solo en navegador, capturando silenciosamente bloqueos de adblockers)
export const analytics = isSupported()
    .then((supported) => (supported ? getAnalytics(app) : null))
    .catch(() => null);

export default app;
