// ============================================
// DTO: CRIAR CLIENTE
// ============================================
// Dados mínimos para cadastro de cliente
// ============================================

import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateCommonUserDto {
  // ============================================
  // NOME COMPLETO
  // ============================================
  @IsNotEmpty({
    context: {
      message: `missing-name`,
      userMessage: `Nome obrigatório`,
    },
  })
  @IsString({
    context: {
      message: `invalid-name`,
      userMessage: `Nome inválido`,
    },
  })
  name: string;

  // ============================================
  // TELEFONE (COM VALIDAÇÃO BRASIL)
  // ============================================
  @IsNotEmpty({
    context: {
      message: `missing-phone`,
      userMessage: `Telefone obrigatório`,
    },
  })
  @IsString({
    context: {
      message: `invalid-phone`,
      userMessage: `Telefone inválido`,
    },
  })
  @IsPhoneNumber('BR', {
    context: {
      message: `invalid-phone-format`,
      userMessage: `Formato de telefone inválido`,
    },
  })
  phone: string;
}
