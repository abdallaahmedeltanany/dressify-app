import { Product } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartItem {
  product: Product;
  quantity: number;
}
interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalCount: () => number;
}
export const useCartStore = create<CartStore>()(
  persist(
    ((set, get) => ({
      items: [],
      addItem: (product: Product, quantity: number = 1) => {
        set((state) => {
          const existedItem = state.items.find(
            (item) => item.product.id === product.id
          );
          if (existedItem) {
            return {
              items: state.items.map((item) => {
                return item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item;
              }),
            };
          } else {
            return {
              items: [...state.items, { product, quantity }],
            };
          }
        });
      },
      removeItem: (productId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },
      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => {
        set({ items: [] });
      },
      getTotalCount: () => {
        return get().items.length;
      },
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    })) as import("zustand").StateCreator<CartStore>,
    {
      name: "cart-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
