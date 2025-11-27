// ============================================
// HELPER: FORMATAÇÃO DE TELEFONE
// ============================================
// Formata telefone brasileiro
// ============================================

/**
 * Formata telefone para exibição
 * @param phone - Telefone sem formatação (10 ou 11 dígitos)
 * @returns Telefone formatado (00) 00000-0000
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 11) {
    // Celular: (00) 00000-0000
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (cleaned.length === 10) {
    // Fixo: (00) 0000-0000
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  return phone;
}

/**
 * Remove formatação do telefone
 * @param phone - Telefone formatado
 * @returns Telefone sem formatação (apenas números)
 */
export function unformatPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}
