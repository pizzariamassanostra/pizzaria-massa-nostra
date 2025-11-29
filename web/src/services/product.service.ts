import api from "./api.service";

// Interface para estrutura de Produto
export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  type: string;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category?: ProductCategory;
  variants?: ProductVariant[];
}

// Interface para Categoria de Produto
export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  sort_order: number;
  status: string;
  created_at: string;
  updated_at: string;
}

// Interface para Variante de Produto (tamanhos e preços)
export interface ProductVariant {
  id: number;
  product_id: number;
  size: string;
  label: string;
  price: string;
  servings: number;
  sort_order: number;
  status: string;
  created_at: string;
  updated_at: string;
}

// Interface para Tipo de Massa de Pizza
export interface PizzaCrust {
  id: number;
  name: string;
  slug: string;
  description: string;
  price_modifier: string;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Interface para Recheios de Pizza
export interface CrustFilling {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Serviço responsável por requisições relacionadas a produtos
class ProductService {
  // Busca todos os produtos com paginação e filtros
  async getAll(): Promise<{ ok: boolean; products: Product[] }> {
    try {
      const response = await api.get("/product");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Erro ao buscar produtos"
      );
    }
  }

  // Busca produto específico pelo ID
  async getById(id: number): Promise<{ ok: boolean; product: Product }> {
    try {
      const response = await api.get("/product/" + id);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Erro ao buscar produto"
      );
    }
  }

  // Busca produto pelo slug (URL)
  async getBySlug(slug: string): Promise<{ ok: boolean; product: Product }> {
    try {
      const response = await api.get("/product/slug/" + slug);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Erro ao buscar produto"
      );
    }
  }

  // Busca todas as categorias de produtos
  async getCategories(): Promise<{
    ok: boolean;
    categories: ProductCategory[];
  }> {
    try {
      const response = await api.get("/product-category");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Erro ao buscar categorias"
      );
    }
  }

  // Busca tipos de massa de pizza
  async getCrusts(): Promise<{
    data(data: any): unknown;
    ok: boolean;
    crusts: PizzaCrust[];
  }> {
    try {
      const response = await api.get("/product/pizza/crusts");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao buscar bordas");
    }
  }

  // Busca recheios disponíveis para pizzas
  async getFillings(): Promise<{
    data(data: any): unknown;
    ok: boolean;
    fillings: CrustFilling[];
  }> {
    try {
      const response = await api.get("/product/pizza/fillings");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Erro ao buscar recheios"
      );
    }
  }
}

export const productService = new ProductService();
