export const PRODUCT_CATEGORIES = [
  "breakfast",
  "sandwiches",
  "grills",
  "mains",
  "sides",
  "desserts",
  "drinks",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export type Product = {
  id: number;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  price: number;
  image_url: string;
  is_available: boolean;
  category: ProductCategory;
  is_seed: boolean;
  archived_at: string | null;
  created_at: string;
};

export type ProductFormValues = Omit<
  Product,
  "id" | "created_at" | "is_seed" | "archived_at"
>;
