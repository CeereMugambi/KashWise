export type ProductCategory =
  | "bread"
  | "dairy_products"
  | "beverages"
  | "fresh_produce"
  | "cereals";

// Base — shared by all products
export interface Product {
  id: number;
  productName: string;
  category: ProductCategory;
  brand: string;
  size: string;
  quantity: number;
  price: number;
  entryDate: string;
  imageUrl: string;
  description?: string;
  expiryDate?: string;
}

// Bread
export interface BreadProduct extends Product {
  category: "bread";
  breadType: "white" | "brown" | "wholegrain" | "sourdough" | "other";
  sliced: boolean;
}

// Dairy
export interface DairyProduct extends Product {
  category: "dairy_products";
  dairyType: "milk" | "yoghurt" | "cheese" | "butter" | "cream" | "other";
  fatContent: "full_fat" | "low_fat" | "skimmed";
}

// Beverages
export interface BeverageProduct extends Product {
  category: "beverages";
  beverageType: "water" | "juice" | "soda" | "energy_drink" | "tea" | "coffee" | "other";
  flavour?: string;
  volume: string;
}

// Fresh Produce
export interface FreshProduceProduct extends Product {
  category: "fresh_produce";
  produceType: "vegetables" | "fruits" | "herbs" | "other";
  organic: boolean;
  origin?: string;
}

// Cereals
export interface CerealProduct extends Product {
  category: "cereals";
  cerealType: "breakfast_cereal" | "oats" | "muesli" | "granola" | "other";
  grainType: "wheat" | "maize" | "oats" | "rice" | "mixed" | "other";
}