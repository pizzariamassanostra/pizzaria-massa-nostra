// ============================================
// SERVICE: PRODUTOS
// ============================================
// Serviço de listagem de produtos, categorias, bordas e recheios
// ============================================

import api from "./api.service";

// ============================================
// INTERFACES
// ============================================

interface Product {
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
  category?: ProductCategory;
  variants?: ProductVariant[];
}

interface ProductCategory {
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

interface ProductVariant {
  id: number;
  product_id: number;
  size: "small" | "medium" | "large" | null;
  label: string;
  price: string;
  servings: number;
  sort_order: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

interface Crust {
  id: number;
  name: string;
  slug: string;
  description: string;
  price_modifier: string;
  status: "active" | "inactive";
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface Filling {
  id: number;
  name: string;
  slug: string;
  description: string;
  price_modifier: string;
  status: "active" | "inactive";
  sort_order: number;
  created_at: string;
  updated_at: string;
}

class ProductService {
  // ============================================
  // LISTAR TODOS OS PRODUTOS
  // ============================================
  // Retorna todos os produtos ativos (pizzas, bebidas, sobremesas)
  async getAll(): Promise<{ ok: boolean; data: Product[] }> {
    const response = await api.get("/product");
    return response.data;
  }

  // ============================================
  // BUSCAR PRODUTO POR ID
  // ============================================
  // Retorna um produto específico com suas variações
  async getById(id: number): Promise<{ ok: boolean; data: Product }> {
    const response = await api.get(`/product/${id}`);
    return response.data;
  }

  // ============================================
  // BUSCAR PRODUTO POR SLUG
  // ============================================
  // Retorna um produto específico pelo slug (URL amigável)
  async getBySlug(slug: string): Promise<{ ok: boolean; data: Product }> {
    const response = await api.get(`/product/slug/${slug}`);
    return response.data;
  }

  // ============================================
  // LISTAR CATEGORIAS ATIVAS
  // ============================================
  // Retorna todas as categorias ativas (Pizzas, Bebidas, etc)
  async getCategories(): Promise<{ ok: boolean; data: ProductCategory[] }> {
    const response = await api.get("/product-category/active");
    return response.data;
  }

  // ============================================
  // LISTAR BORDAS
  // ============================================
  // Retorna todas as bordas disponíveis para pizzas
  async getCrusts(): Promise<{ ok: boolean; data: Crust[] }> {
    const response = await api.get("/product/pizza/crusts");
    return response.data;
  }

  // ============================================
  // LISTAR RECHEIOS
  // ============================================
  // Retorna todos os recheios disponíveis para bordas
  async getFillings(): Promise<{ ok: boolean; data: Filling[] }> {
    const response = await api.get("/product/pizza/fillings");
    return response.data;
  }
}

export const productService = new ProductService();
export type { Product, ProductCategory, ProductVariant, Crust, Filling };
