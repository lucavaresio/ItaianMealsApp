// context/AuthContext.tsx
// Login globale: usa MOCK_USERS/validateLogin da services/auth.ts (gia' presente
// nel progetto) ed espone l'utente loggato a tutta l'app tramite Context,
// sullo stesso pattern di FavoritesContext (lab 17).
import React from "react";
import { validateLogin } from "../services/auth";

export interface AuthUser {
  email: string;
  name: string;
  avatarUri: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);

  function login(email: string, password: string): boolean {
    const match = validateLogin(email, password);
    if (!match) return false;
    // Non teniamo la password nello stato: solo i dati da mostrare nel profilo
    setUser({
      email: match.email,
      name: match.name,
      avatarUri: match.avatarUri,
    });
    return true;
  }

  function logout() {
    setUser(null);
  }

  const value: AuthContextValue = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve essere usato dentro un AuthProvider");
  }
  return ctx;
}
