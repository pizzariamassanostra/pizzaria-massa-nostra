// ===========================================
// ENUMERAÇÃO DE ROLES (PAPÉIS)
// Sistema de Permissões - Pizzaria Massa Nostra
//
// Define todos os papéis disponíveis no sistema
// Hierarquia: SUPER_ADMIN > MANAGER > ANALYST > ASSISTANT > AUXILIARY > WAITER/COOK/DELIVERY
//
// Referência: PIZZARIA-RBAC-SYSTEM
// Data: 2025-11-26
// Desenvolvedor: @lucasitdias
// Status: ✅ IMPLEMENTADO
// ===========================================

export enum RoleEnum {
  // Administração
  SUPER_ADMIN = 'super_admin',
  MANAGER = 'manager',

  // Análise
  ANALYST = 'analyst',

  // Assistência
  ASSISTANT = 'assistant',
  AUXILIARY = 'auxiliary',

  // Operacional
  WAITER = 'waiter',
  COOK = 'cook',
  DELIVERY = 'delivery',
}

// ✅ LABELS (NOMES DE EXIBIÇÃO)
export const RoleLabels: Record<RoleEnum, string> = {
  [RoleEnum.SUPER_ADMIN]: 'Super Administrador',
  [RoleEnum.MANAGER]: 'Gerente',
  [RoleEnum.ANALYST]: 'Analista',
  [RoleEnum.ASSISTANT]: 'Assistente',
  [RoleEnum.AUXILIARY]: 'Auxiliar',
  [RoleEnum.WAITER]: 'Garçom',
  [RoleEnum.COOK]: 'Cozinheira',
  [RoleEnum.DELIVERY]: 'Motoboy',
};

// ✅ NÍVEIS HIERÁRQUICOS
export const RoleLevels: Record<RoleEnum, number> = {
  [RoleEnum.SUPER_ADMIN]: 1,
  [RoleEnum.MANAGER]: 2,
  [RoleEnum.ANALYST]: 3,
  [RoleEnum.ASSISTANT]: 4,
  [RoleEnum.AUXILIARY]: 5,
  [RoleEnum.WAITER]: 6,
  [RoleEnum.COOK]: 6,
  [RoleEnum.DELIVERY]: 6,
};
