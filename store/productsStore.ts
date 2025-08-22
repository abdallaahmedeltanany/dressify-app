import { create } from "zustand";

import {
  getCategories,
  getProducts,
  getProductsByCategory,
  searchProductsApi,
} from "@/lib/api";
import { Product } from "@/type";

interface ProductsState {
  products: Product[];
  filterdProducts: Product[];
  categories: string[];
  selectedCategory: string | null;
  loading: boolean;
  error: string | null;

  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  setCategory: (category: string | null) => Promise<void>;
  searchProductsRealTime: (query: string) => Promise<void>;
  sortProducts: (sortBy: "price-asc" | "price-desc" | "rating") => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  filterdProducts: [],
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const products = await getProducts();
      set({
        products,
        filterdProducts: products,
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchCategories: async () => {
    try {
      set({ loading: true, error: null });
      const categories = await getCategories();
      set({ categories, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  setCategory: async (category) => {
    try {
      set({ selectedCategory: category, loading: true, error: null });
      if (category) {
        const products = await getProductsByCategory(category);
        set({ filterdProducts: products, loading: false });
      } else {
        set({ filterdProducts: get().products, loading: false });
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  searchProductsRealTime: async (query) => {
    try {
      set({ loading: true, error: null });

      if (!query.trim()) {
        set({
          filterdProducts: get().products,
          loading: false,
        });
        return;
      }

      const searchResults = await searchProductsApi(query);
      set({ filterdProducts: searchResults, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  sortProducts: (sortBy) => {
    const { filterdProducts } = get();
    const sorted = [...filterdProducts];

    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
    }

    set({ filterdProducts: sorted });
  },
}));
