// context/FavoritesContext.tsx
// Lab 17 - Stato globale per i preferiti (Context + Provider)
//
// Centralizza i favoriteIds (gia' salvati in lab 16 con AsyncStorage) cosi'
// HomeScreen, DetailScreen e FavoritesScreen leggono e aggiornano gli stessi
// dati senza prop drilling.
import React from "react";
import { loadFavoriteIds, saveFavoriteIds } from "../services/storage";

interface FavoritesContextValue {
  favoriteIds: string[];
  isLoading: boolean;
  isFavorite: (idMeal: string) => boolean;
  toggleFavorite: (idMeal: string) => void;
}

const FavoritesContext = React.createContext<FavoritesContextValue | undefined>(
  undefined,
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Load al mount del Provider
  React.useEffect(() => {
    loadFavoriteIds()
      .then(setFavoriteIds)
      .finally(() => setIsLoading(false));
  }, []);

  function isFavorite(idMeal: string) {
    return favoriteIds.includes(idMeal);
  }

  // Aggiorna lo stato e persiste in AsyncStorage (services/storage.ts)
  function toggleFavorite(idMeal: string) {
    setFavoriteIds((current) => {
      const next = current.includes(idMeal)
        ? current.filter((id) => id !== idMeal)
        : [...current, idMeal];
      void saveFavoriteIds(next);
      return next;
    });
  }

  const value: FavoritesContextValue = {
    favoriteIds,
    isLoading,
    isFavorite,
    toggleFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = React.useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites deve essere usato dentro un FavoritesProvider");
  }
  return ctx;
}
