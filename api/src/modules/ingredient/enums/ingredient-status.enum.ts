// ============================================
// ENUM: STATUS DO INGREDIENTE
// ============================================
// Define se o ingrediente está disponível
// para uso no estoque
// Pizzaria Massa Nostra
// Desenvolvedor: @lucasitdias
// ============================================

export enum IngredientStatus {
  ACTIVE = 'active', // Ativo (em uso)
  INACTIVE = 'inactive', // Inativo (não usado mais)
  BLOCKED = 'blocked', // Bloqueado (problema detectado)
}
