// ============================================
// TYPE: OPÇÕES DE BUSCA ÚNICA
// ============================================
// Tipagem para buscar um único recurso
// Pizzaria Massa Nostra
// ============================================

export type FindOneOptions<T> = {
  // Condições WHERE (obrigatório)
  where: Array<{ [K in keyof Partial<T>]: T[keyof T] }>;

  // Relacionamentos (joins)
  relations?: string[];

  // Incluir hash de senha (apenas para login)
  with_password_hash?: boolean;

  // Campos adicionais para SELECT
  additionalSelects?: string[];
};
