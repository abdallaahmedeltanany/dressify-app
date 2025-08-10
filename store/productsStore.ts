import { getCategories, getProducts } from "@/lib/api";
import { Product } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
interface ProductsState {
  products: Product[];
  filterdProducts: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
}

export const useProductsStore = create<ProductsState>()(
  persist(
    ((set, get) => ({
      products: [],
      filterdProducts: [],
      categories: [],
      loading: false,
      error: null,

      fetchProducts: async () => {
        try {
          set({ loading: true, error: null });
          const products = await getProducts();
          set({
            products: products,
            loading: false,
            filterdProducts: products,
          });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      fetchCategories: async () => {
        try {
          set({ loading: true, error: null });
          const categories = await getCategories();
          set({ categories: categories, loading: false, error: null });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
    })) as import("zustand").StateCreator<ProductsState>,
    {
      name: "products-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
