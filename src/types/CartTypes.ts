export type CartItem = {
  id: number;
  name_en: string;
  name_ar: string;
  price: number;
  image_url: string;
  quantity: number;
};

export type CartState = {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};
