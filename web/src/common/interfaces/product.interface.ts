// ============================================
// INTERFACE: PRODUTO
// ============================================
// Define a estrutura de um produto (pizza, bebida, etc)
// Sincronizado com a API NestJS
// ============================================

export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  type: "pizza" | "bebida" | "sobremesa";
  status: "active" | "inactive";
  sort_order: number;
  created_at: string;
  updated_at: string;

  // Relações
  category?: ProductCategory;
  variants?: ProductVariant[];
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  status: "active" | "inactive";
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  size: "small" | "medium" | "large" | null;
  label: string;
  price: string; // Decimal como string (ex: "2500.00" = R$ 25,00)
  servings: number;
  sort_order: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface Crust {
  id: number;
  name: string;
  slug: string;
  description: string;
  price_modifier: string; // Decimal como string (ex: "800.00" = R$ 8,00)
  status: "active" | "inactive";
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Filling {
  id: number;
  name: string;
  slug: string;
  description: string;
  price_modifier: string; // Decimal como string (ex: "500.00" = R$ 5,00)
  status: "active" | "inactive";
  sort_order: number;
  created_at: string;
  updated_at: string;
}
