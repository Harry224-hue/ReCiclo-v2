import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { type User } from "firebase/auth";
import { onAuthChange, getUserProfile, type UserProfile } from "../firebase";

// ─── Tipos ─────────────────────────────────────────────────
export type ProfileStatus = "idle" | "loading" | "ready" | "error";

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    isLoggedIn: boolean;
    /** Estado de la lectura de users/{uid}: permite distinguir "no hay datos" de "no se pudo leer". */
    profileStatus: ProfileStatus;
    /** Vuelve a leer el perfil desde Firestore (1 lectura). */
    refreshProfile: () => Promise<void>;
    /** Aplica en memoria un cambio ya guardado en Firestore, sin volver a leer. Navbar, ajustes y perfil se actualizan al instante. */
    patchProfile: (patch: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    isLoggedIn: false,
    profileStatus: "idle",
    refreshProfile: async () => {},
    patchProfile: () => {},
});

// ─── Provider ──────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [profileStatus, setProfileStatus] = useState<ProfileStatus>("idle");
    const [loading, setLoading] = useState(true);

    // uid de la sesión actual: evita que una lectura lenta de otra cuenta pise a la actual
    const uidRef = useRef<string | null>(null);

    const loadProfile = useCallback(async (uid: string) => {
        setProfileStatus("loading");
        try {
            const userProfile = await getUserProfile(uid);
            if (uidRef.current !== uid) return;
            setProfile(userProfile);
            setProfileStatus("ready");
        } catch (err) {
            console.warn("[Auth] No se pudo obtener el perfil de Firestore (posible adblocker o red offline):", err);
            if (uidRef.current !== uid) return;
            setProfile(null);
            setProfileStatus("error");
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthChange(async (firebaseUser) => {
            uidRef.current = firebaseUser?.uid ?? null;
            setUser(firebaseUser);

            if (firebaseUser) {
                await loadProfile(firebaseUser.uid);
            } else {
                setProfile(null);
                setProfileStatus("idle");
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [loadProfile]);

    const refreshProfile = useCallback(async () => {
        const uid = uidRef.current;
        if (uid) await loadProfile(uid);
    }, [loadProfile]);

    const patchProfile = useCallback((patch: Partial<UserProfile>) => {
        const uid = uidRef.current;
        if (!uid) return;
        setProfile((prev) => ({ ...(prev ?? ({ uid } as UserProfile)), ...patch }));
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                loading,
                isLoggedIn: !!user,
                profileStatus,
                refreshProfile,
                patchProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ──────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    return context;
}