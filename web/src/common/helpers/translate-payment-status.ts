// ============================================
// HELPER: TRADUÇÃO DE STATUS DE PAGAMENTO
// ============================================

import { PaymentStatus } from "../enum/payment-status.enum";

/**
 * Traduz status de pagamento para português
 * @param status - Status do pagamento
 * @returns Texto em português
 */
export function translatePaymentStatus(status: PaymentStatus): string {
  const translations: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: "Aguardando Pagamento",
    [PaymentStatus.APPROVED]: "Pago",
    [PaymentStatus.REJECTED]: "Recusado",
    [PaymentStatus.CANCELLED]: "Cancelado",
    [PaymentStatus.REFUNDED]: "Reembolsado",
  };

  return translations[status] || status;
}

/**
 * Retorna cor do status para badges
 * @param status - Status do pagamento
 * @returns Classe CSS Tailwind
 */
export function getPaymentStatusColor(status: PaymentStatus): string {
  const colors: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: "bg-yellow-100 text-yellow-800",
    [PaymentStatus.APPROVED]: "bg-green-100 text-green-800",
    [PaymentStatus.REJECTED]: "bg-red-100 text-red-800",
    [PaymentStatus.CANCELLED]: "bg-gray-100 text-gray-800",
    [PaymentStatus.REFUNDED]: "bg-blue-100 text-blue-800",
  };

  return colors[status] || "bg-gray-100 text-gray-800";
}
