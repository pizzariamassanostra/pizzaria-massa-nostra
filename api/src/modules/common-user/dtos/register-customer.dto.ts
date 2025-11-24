// ============================================
// DTO: REGISTRAR CLIENTE COMPLETO
// ============================================
// Cadastro completo de novo cliente
// Validações LGPD e dados obrigatórios
// ============================================

import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsDateString,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class RegisterCustomerDto {
  // ============================================
  // DADOS PESSOAIS
  // ============================================
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(255, { message: 'Nome muito longo' })
  name: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF inválido (formato: 000.000.000-00)',
  })
  cpf?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de nascimento inválida' })
  birth_date?: string; // ISO format: YYYY-MM-DD

  // ============================================
  // CONTATOS
  // ============================================
  @IsString()
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @Matches(/^\d{10,11}$/, {
    message: 'Telefone inválido (formato: 38999999999)',
  })
  phone: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{10,11}$/, {
    message: 'Telefone alternativo inválido',
  })
  phone_alternative?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  // ============================================
  // AUTENTICAÇÃO
  // ============================================
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @MaxLength(100, { message: 'Senha muito longa (máximo 100 caracteres)' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Senha deve conter letras maiúsculas, minúsculas e números',
  })
  password: string;

  // ============================================
  // TERMOS E LGPD
  // ============================================
  @IsBoolean()
  @IsNotEmpty({ message: 'Aceite dos termos é obrigatório' })
  accept_terms: boolean;

  @IsOptional()
  @IsBoolean()
  accept_promotions?: boolean;
}
