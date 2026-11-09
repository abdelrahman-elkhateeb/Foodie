import type { CartState } from "@/types/CartTypes";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// place_order rejects any line above this.
export const MAX_ITEM_QUANTITY = 50;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product, quantity = 1) => {
        const cart = get().cart;
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.id === product.id
                ? {
                    ...item,
                    quantity: Math.min(
                      item.quantity + quantity,
                      MAX_ITEM_QUANTITY
                    ),
                  }
                : item
            ),
          });

          return;
        }

        set({
          cart: [...cart, { ...product, quantity }],
        });
      },

      removeFromCart: (productId) => {
        set({
          cart: get().cart.filter((item) => item.id !== productId),
        });
      },

      increaseQuantity: (productId) => {
        set({
          cart: get().cart.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        });
      },

      decreaseQuantity: (productId) => {
        set({
          cart: get()
            .cart.map((item) =>
              item.id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        });
      },

      clearCart: () => {
        set({ cart: [] });
      },

      getTotalItems: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart",
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
