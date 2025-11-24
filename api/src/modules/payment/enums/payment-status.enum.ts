// ============================================
// ENUM: STATUS DE PAGAMENTO
// ============================================
// Possíveis status de um pagamento
// Pizzaria Massa Nostra
// ============================================

export enum PaymentStatus {
  PENDING = 'PENDING', // Aguardando pagamento
  SUCCESS = 'SUCCESS', // Pagamento confirmado
  FAILED = 'FAILED', // Pagamento falhou/recusado
}
