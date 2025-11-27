// ============================================
// FUNÇÃO: VALIDAÇÃO DE CPF
// ============================================
// Valida CPF brasileiro com dígitos verificadores
// Remove máscaras automaticamente
// ============================================

/**
 * Valida um CPF brasileiro
 *
 * REGRAS:
 * - Remove pontos e traços automaticamente
 * - CPF deve ter 11 dígitos
 * - Não aceita CPFs com todos os dígitos iguais (ex: 111.111.111-11)
 * - Valida os dois dígitos verificadores
 *
 * @param cpf - CPF com ou sem máscara (xxx.xxx.xxx-xx ou xxxxxxxxxxx)
 * @returns true se CPF é válido, false se inválido
 *
 * @example
 * validateCPF('123.456.789-09') // true
 * validateCPF('12345678909') // true
 * validateCPF('111.111.111-11') // false (todos iguais)
 * validateCPF('123.456.789-00') // false (dígito verificador inválido)
 */
export function validateCPF(cpf: string): boolean {
  // ============================================
  // PASSO 1: Remover máscara (pontos e traços)
  // ============================================
  const cleanCPF = cpf.replace(/[^\d]/g, '');

  // ============================================
  // PASSO 2: Verificar se tem 11 dígitos
  // ============================================
  if (cleanCPF.length !== 11) {
    return false;
  }

  // ============================================
  // PASSO 3: Verificar se todos os dígitos são iguais
  // ============================================
  // CPFs inválidos: 000.000.000-00, 111.111.111-11, etc
  const allSameDigits = /^(\d)\1{10}$/.test(cleanCPF);
  if (allSameDigits) {
    return false;
  }

  // ============================================
  // PASSO 4: Validar PRIMEIRO dígito verificador
  // ============================================
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cleanCPF.charAt(9))) {
    return false;
  }

  // ============================================
  // PASSO 5: Validar SEGUNDO dígito verificador
  // ============================================
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cleanCPF.charAt(10))) {
    return false;
  }

  // ============================================
  // CPF VÁLIDO!
  // ============================================
  return true;
}

/**
 * Formata CPF com máscara
 *
 * @param cpf - CPF sem máscara (11 dígitos)
 * @returns CPF formatado (xxx.xxx.xxx-xx)
 *
 * @example
 * formatCPF('12345678909') // '123.456.789-09'
 */
export function formatCPF(cpf: string): string {
  const cleanCPF = cpf.replace(/[^\d]/g, '');

  if (cleanCPF.length !== 11) {
    throw new Error('CPF deve ter 11 dígitos');
  }

  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
