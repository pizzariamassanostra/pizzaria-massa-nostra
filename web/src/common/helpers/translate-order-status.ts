// traduz status do pedido
import { OrderStatus } from "../enum/order-status.enum";

// retorna o texto em português
export function translateOrderStatus(status: OrderStatus): string {
  const translations: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: "Aguardando Confirmação",
    [OrderStatus.CONFIRMED]: "Confirmado",
    [OrderStatus.PREPARING]: "Em Preparação",
    [OrderStatus.ON_DELIVERY]: "Saiu para Entrega",
    [OrderStatus.DELIVERED]: "Entregue",
    [OrderStatus.CANCELLED]: "Cancelado",
  };

  return translations[status] || status;
}

// retorna cor do badge
export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-800",
    [OrderStatus.CONFIRMED]: "bg-blue-100 text-blue-800",
    [OrderStatus.PREPARING]: "bg-purple-100 text-purple-800",
    [OrderStatus.ON_DELIVERY]: "bg-orange-100 text-orange-800",
    [OrderStatus.DELIVERED]: "bg-green-100 text-green-800",
    [OrderStatus.CANCELLED]: "bg-red-100 text-red-800",
  };

  return colors[status] || "bg-gray-100 text-gray-800";
}
