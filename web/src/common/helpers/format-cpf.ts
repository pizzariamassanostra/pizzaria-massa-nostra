// ============================================
// HELPER: FORMATAÇÃO DE CPF
// ============================================
// Formata e valida CPF
// ============================================

/**
 * Formata CPF para exibição
 * @param cpf - CPF sem formatação (11 dígitos)
 * @returns CPF formatado (000.000.000-00)
 */
export function formatCpf(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, "");

  if (cleaned.length !== 11) {
    return cpf;
  }

  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

/**
 * Remove formatação do CPF
 * @param cpf - CPF formatado
 * @returns CPF sem formatação (apenas números)
 */
export function unformatCpf(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

/**
 * Valida CPF (dígitos verificadores)
 * @param cpf - CPF com ou sem formatação
 * @returns true se válido, false se inválido
 */
export function validateCpf(cpf: string): boolean {
  const cleaned = unformatCpf(cpf);

  if (cleaned.length !== 11) {
    return false;
  }

  // CPFs inválidos conhecidos
  const invalidCpfs = [
    "00000000000",
    "11111111111",
    "22222222222",
    "33333333333",
    "44444444444",
    "55555555555",
    "66666666666",
    "77777777777",
    "88888888888",
    "99999999999",
  ];

  if (invalidCpfs.includes(cleaned)) {
    return false;
  }

  // Validar dígito verificador 1
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let digit1 = 11 - (sum % 11);
  if (digit1 >= 10) digit1 = 0;

  if (digit1 !== parseInt(cleaned.charAt(9))) {
    return false;
  }

  // Validar dígito verificador 2
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  let digit2 = 11 - (sum % 11);
  if (digit2 >= 10) digit2 = 0;

  if (digit2 !== parseInt(cleaned.charAt(10))) {
    return false;
  }

  return true;
}
