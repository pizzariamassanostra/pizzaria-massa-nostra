// ============================================
// TYPES - EXPORTAÇÕES GLOBAIS
// ============================================
// Centraliza todos os tipos TypeScript
// ============================================

// Exportar interfaces
export type { CommonUser } from "@/common/interfaces/common-users.interface";
export type {
  Product,
  ProductCategory,
  ProductVariant,
  Crust,
  Filling,
} from "@/services/product.service";
export type {
  Order,
  OrderItem,
  CreateOrderDto,
} from "@/services/order.service";
export type { Address, CreateAddressDto } from "@/services/address.service";
export type { CartItem } from "@/contexts/CartContext";

// Exportar enums
export { OrderStatus } from "@/common/enum/order-status.enum";
export { PaymentMethod } from "@/common/enum/payment-method.enum";
export { PaymentStatus } from "@/common/enum/payment-status.enum";
