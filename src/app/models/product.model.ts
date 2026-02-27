export interface Product {
  id: number;
  productName: string;
  category: string;
  brand?: string;
  size?: string;
  quantity: number;
  price: number;
  entryDate: string;
  imageUrl: string;
  description?: string;

  // Bread specific
  breadType?: string;
  sliced?: string;

  // Dairy specific
  fatContent?: string;
  expiryDate?: string;

  // Beverages specific
  flavour?: string;
  volume?: string;

  // Snacks specific
  weight?: string;
  flavourType?: string;

  // Produce specific
  origin?: string;
  organic?: boolean;

  // Grains & Cereals specific
  grainType?: string;
  servingSize?: string;
}