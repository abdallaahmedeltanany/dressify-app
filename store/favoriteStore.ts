import { Product } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FavoriteState {
  favoriteItems: Product[];
  addToFavorite: (product: Product) => void;
  removeFromFavorite: (productId: number) => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
  resetFavorite: () => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favoriteItems: [],
      addToFavorite: (product: Product) => {
        set((state) => {
          return {
            favoriteItems: [...state.favoriteItems, product],
          };
        });
      },
      removeFromFavorite: (productId: number) => {
        set((state) => {
          return {
            favoriteItems: state.favoriteItems.filter(
              (item) => item.id !== productId
            ),
          };
        });
      },
      toggleFavorite: (product: Product) => {
        const isFav = get().isFavorite(product.id);
        if (isFav) {
          get().removeFromFavorite(product.id);
        } else {
          get().addToFavorite(product);
        }
      },

      isFavorite: (productId: number) => {
        return get().favoriteItems.some((item) => item.id === productId);
      },
      resetFavorite: () => {
        set({ favoriteItems: [] });
      },
    }),
    {
      name: "favorite-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
