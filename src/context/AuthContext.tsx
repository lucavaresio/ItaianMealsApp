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

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem("auth_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  function login(email: string, password: string): boolean {
    const match = validateLogin(email, password);
    if (!match) return false;
    
    const loggedInUser: AuthUser = {
      email: match.email,
      name: match.name,
      avatarUri: match.avatarUri,
    };
    
    localStorage.setItem("auth_user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return true;
  }

  function logout() {
    localStorage.removeItem("auth_user");
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