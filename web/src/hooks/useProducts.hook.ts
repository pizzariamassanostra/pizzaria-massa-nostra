// ============================================
// HOOK: USE PRODUCTS
// ============================================
// Hook para carregar produtos com React Query
// Cache automático e revalidação
// ============================================

import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";

// ============================================
// HOOK: LISTAR TODOS OS PRODUTOS
// ============================================
export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => productService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// ============================================
// HOOK: BUSCAR PRODUTO POR ID
// ============================================
export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// HOOK: LISTAR CATEGORIAS
// ============================================
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => productService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// ============================================
// HOOK: LISTAR BORDAS
// ============================================
export const useCrusts = () => {
  return useQuery({
    queryKey: ["crusts"],
    queryFn: () => productService.getCrusts(),
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// HOOK: LISTAR RECHEIOS
// ============================================
export const useFillings = () => {
  return useQuery({
    queryKey: ["fillings"],
    queryFn: () => productService.getFillings(),
    staleTime: 10 * 60 * 1000,
  });
};
