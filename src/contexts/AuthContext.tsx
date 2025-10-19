import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, googleProvider, isFirebaseConfigured } from "../services/firebase";
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut, User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      return;
    } catch (err: any) {
      // Errores comunes: cierre del popup, popup bloqueado, dominio no autorizado
      const code = err?.code || "unknown";
      let msg = "No se pudo iniciar sesión.";
      if (code === "auth/popup-blocked") {
        // Fallback a redirect si el popup fue bloqueado
        await signInWithRedirect(auth, googleProvider);
        return;
      } else if (code === "auth/popup-closed-by-user") {
        msg = "El popup de Google se cerró antes de completar el inicio de sesión.";
      } else if (code === "auth/cancelled-popup-request") {
        msg = "Se canceló el inicio de sesión anterior. Intenta nuevamente.";
      } else if (code === "auth/popup-blocked") {
        msg = "El navegador bloqueó el popup. Permite ventanas emergentes para este sitio e inténtalo otra vez.";
      } else if (code === "auth/unauthorized-domain") {
        msg = "Dominio no autorizado en Firebase. Agrega localhost en Firebase Console > Authentication > Settings.";
      }
      if (!isFirebaseConfigured) {
        msg += " También verifica tus variables VITE_FIREBASE_* en .env.local.";
      }
      throw new Error(msg);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = useMemo<AuthContextType>(() => ({ user, loading, signInWithGoogle, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
