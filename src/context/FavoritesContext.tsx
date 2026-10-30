
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

type FavoritesContextType = {
  favorites: string[];
  loaded: boolean;
  toggleFavorite: (id: string) => Promise<void>;
};

const FavoritesContext = createContext<
  FavoritesContextType | undefined
>(undefined);

const STORAGE_KEY = "mygallery_favorites";

export function FavoritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Saved favorites load karein
  useEffect(() => {
    async function loadFavorites() {
      try {
        const savedFavorites =
          await AsyncStorage.getItem(STORAGE_KEY);

        if (savedFavorites) {
          const parsed: unknown = JSON.parse(savedFavorites);

          if (
            Array.isArray(parsed) &&
            parsed.every((item) => typeof item === "string")
          ) {
            setFavorites(parsed);
          }
        }
      } catch (error) {
        console.error("Favorites load error:", error);
      } finally {
        setLoaded(true);
      }
    }

    loadFavorites();
  }, []);

  // Favorite add ya remove karein aur storage mein save karein
  async function toggleFavorite(id: string) {
    if (!loaded) return;

    const updatedFavorites = favorites.includes(id)
      ? favorites.filter((favoriteId) => favoriteId !== id)
      : [...favorites, id];

    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedFavorites)
      );

      setFavorites(updatedFavorites);
    } catch (error) {
      console.error("Favorites save error:", error);
      throw error;
    }
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loaded,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites must be used inside FavoritesProvider"
    );
  }

  return context;
}
