import { createContext, useContext, ReactNode } from "react";

interface AuthContextType {
    user: null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    loginWithEmail: (e: string, p: string) => Promise<void>;
    registerWithEmail: (e: string, p: string, n: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: false,
    loginWithGoogle: async () => {},
    loginWithEmail: async () => {},
    registerWithEmail: async () => {},
    logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
    return (
        <AuthContext.Provider value={{
            user: null,
            loading: false,
            loginWithGoogle: async () => {},
            loginWithEmail: async () => {},
            registerWithEmail: async () => {},
            logout: async () => {},
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
