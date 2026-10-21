import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    updateProfile,
    browserLocalPersistence,
    browserSessionPersistence,
    setPersistence,
    sendPasswordResetEmail,
    type User,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";
import type { UserProfile } from "./types";

// ─── Proveedores ───────────────────────────────────────────
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// ─── Registro con email/contraseña ─────────────────────────
export async function registerWithEmail(
    email: string,
    password: string,
    nombre: string
): Promise<User> {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: nombre });

    // Crear perfil en Firestore de forma segura (sin bloquear el registro si fallan las reglas de Firestore)
    try {
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            nombre,
            correo: email,
            fotoPerfil: "",
            fechaRegistro: serverTimestamp(),
            preferencias: {
                notificaciones: true,
                temaOscuro: false,
            },
        } satisfies Omit<UserProfile, "fechaRegistro"> & { fechaRegistro: ReturnType<typeof serverTimestamp> });

        // Crear progreso inicial
        await setDoc(doc(db, "progress", user.uid), {
            userId: user.uid,
            nivel: 1,
            experiencia: 0,
            totalEscaneos: 0,
            residuosReciclables: 0,
            residuosNoReciclables: 0,
        });
    } catch (firestoreError) {
        console.warn("[Firestore] Advertencia al crear perfil inicial (verificar reglas en Firebase Console):", firestoreError);
    }

    return user;
}

// ─── Login con email/contraseña ────────────────────────────
export async function loginWithEmail(email: string, password: string): Promise<User> {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
}

// ─── Login con Google (Pop-up en Web) ──────────────────────
export async function loginWithGoogle(): Promise<User> {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Verificar si ya existe el perfil de forma segura
    try {
        const profileRef = doc(db, "users", user.uid);
        const profileSnap = await getDoc(profileRef);

        if (!profileSnap.exists()) {
            await setDoc(profileRef, {
                uid: user.uid,
                nombre: user.displayName || "Usuario",
                correo: user.email || "",
                fotoPerfil: user.photoURL || "",
                fechaRegistro: serverTimestamp(),
                preferencias: {
                    notificaciones: true,
                    temaOscuro: false,
                },
            });

            await setDoc(doc(db, "progress", user.uid), {
                userId: user.uid,
                nivel: 1,
                experiencia: 0,
                totalEscaneos: 0,
                residuosReciclables: 0,
                residuosNoReciclables: 0,
            });
        }
    } catch (firestoreError) {
        console.warn("[Firestore] Advertencia al sincronizar perfil con Google:", firestoreError);
    }

    return user;
}

// ─── Login con GitHub ──────────────────────────────────────
export async function loginWithGithub(): Promise<User> {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;

    try {
        const profileRef = doc(db, "users", user.uid);
        const profileSnap = await getDoc(profileRef);

        if (!profileSnap.exists()) {
            await setDoc(profileRef, {
                uid: user.uid,
                nombre: user.displayName || "Usuario GitHub",
                correo: user.email || "",
                fotoPerfil: user.photoURL || "",
                fechaRegistro: serverTimestamp(),
                preferencias: {
                    notificaciones: true,
                    temaOscuro: false,
                },
            });

            await setDoc(doc(db, "progress", user.uid), {
                userId: user.uid,
                nivel: 1,
                experiencia: 0,
                totalEscaneos: 0,
                residuosReciclables: 0,
                residuosNoReciclables: 0,
            });
        }
    } catch (firestoreError) {
        console.warn("[Firestore] Advertencia al sincronizar perfil con GitHub:", firestoreError);
    }

    return user;
}

// ─── Cerrar sesión ─────────────────────────────────────────
export async function logout(): Promise<void> {
    await signOut(auth);
}

// ─── Persistencia de sesión ("Recordarme") ─────────────────
// true  -> la sesión sobrevive al cierre del navegador (browserLocalPersistence).
// false -> la sesión se cierra al cerrar la pestaña (browserSessionPersistence).
export async function setAuthPersistence(persistent: boolean): Promise<void> {
    await setPersistence(
        auth,
        persistent ? browserLocalPersistence : browserSessionPersistence
    );
}

// ─── Recuperación de contraseña ────────────────────────────
export async function sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email.trim());
}

// ─── Observador de estado de autenticación ─────────────────
export function onAuthChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}

// ─── Obtener perfil de usuario ─────────────────────────────
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? (snap.data() as UserProfile) : null;
}

// ─── Actualizar perfil editable ────────────────────────────
export type ProfileUpdate = Partial<
    Pick<UserProfile, "nombre" | "fotoPerfil" | "carrera" | "semestre" | "numeroControl" | "bio" | "campus">
>;

/**
 * Guarda cambios del perfil en users/{uid} (1 escritura).
 * Usa merge para no pisar otros campos y para crear el documento si no existía.
 * La foto NO se manda a Firebase Auth (photoURL tiene un límite de ~2 KB); solo el nombre.
 */
export async function updateUserProfile(uid: string, patch: ProfileUpdate): Promise<void> {
    await setDoc(doc(db, "users", uid), { uid, ...patch }, { merge: true });

    if (patch.nombre && auth.currentUser?.uid === uid) {
        try {
            await updateProfile(auth.currentUser, { displayName: patch.nombre });
        } catch (e) {
            console.warn("[Auth] No se pudo actualizar displayName:", e);
        }
    }
}

// ─── Traducción amigable de errores de Firebase Auth ───────
export function getAuthErrorMessage(err: unknown, defaultMessage = "Ocurrió un error al procesar la solicitud."): string {
    const code = (err as { code?: string })?.code || "";

    switch (code) {
        case "auth/unauthorized-domain": {
            const currentHost = typeof window !== "undefined" ? window.location.hostname : "tu dominio";
            return `Dominio no autorizado (${currentHost}). Agrégalo en Firebase Console > Authentication > Settings > Dominios autorizados.`;
        }
        case "auth/popup-closed-by-user":
            return "Se cerró la ventana emergente antes de completar el inicio de sesión.";
        case "auth/cancelled-popup-request":
            return "Operación cancelada debido a otra solicitud de acceso concurrente.";
        case "auth/popup-blocked":
            return "El navegador bloqueó la ventana emergente de inicio de sesión. Permite ventanas emergentes para continuar.";
        case "auth/account-exists-with-different-credential":
            return "Ya existe una cuenta vinculada a este correo con otro método de acceso.";
        case "auth/user-not-found":
            return "No existe una cuenta registrada con este correo.";
        case "auth/wrong-password":
        case "auth/invalid-credential":
            return "Credenciales incorrectas. Verifica tus datos e intenta nuevamente.";
        case "auth/invalid-email":
            return "El formato del correo electrónico no es válido.";
        case "auth/email-already-in-use":
            return "Este correo ya está registrado en ReCiclo.";
        case "auth/weak-password":
        case "auth/password-does-not-meet-requirements":
            return "La contraseña no cumple con los requisitos mínimos de seguridad.";
        case "auth/network-request-failed":
            return "Error de red. Verifica tu conexión a internet.";
        case "auth/too-many-requests":
            return "Demasiados intentos fallidos. Por seguridad, espera un momento antes de reintentar.";
        case "auth/operation-not-allowed":
            return "Este método de inicio de sesión no está habilitado en Firebase Console.";
        default:
            if (err instanceof Error && err.message && !err.message.startsWith("Firebase:")) {
                return err.message;
            }
            return defaultMessage;
    }
}