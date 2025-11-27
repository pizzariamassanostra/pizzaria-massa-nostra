// ============================================
// DTO: REGISTRAR CLIENTE COMPLETO
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
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { validateCPF } from '../../../common/functions/validate-cpf';

/**
 * VALIDADOR CUSTOMIZADO DE CPF
 * Valida CPF real com dígitos verificadores
 */
@ValidatorConstraint({ name: 'cpf', async: false })
export class IsCPFConstraint implements ValidatorConstraintInterface {
  validate(cpf: string) {
    if (!cpf) return true; // CPF opcional
    return validateCPF(cpf);
  }

  defaultMessage() {
    return 'CPF inválido';
  }
}

export class RegisterCustomerDto {
  // ============================================
  // DADOS PESSOAIS
  // ============================================

  @ApiProperty({
    description: 'Nome completo do cliente',
    example: 'João Silva Santos',
  })
  @IsString({ message: 'Nome deve ser um texto' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(255, { message: 'Nome muito longo (máximo 255 caracteres)' })
  name: string;

  @ApiPropertyOptional({
    description: 'CPF do cliente (com ou sem máscara)',
    example: '123.456.789-09',
  })
  @IsOptional()
  @IsString({ message: 'CPF deve ser um texto' })
  @Validate(IsCPFConstraint) // valida CPF real
  cpf?: string;

  @ApiPropertyOptional({
    description: 'Data de nascimento no formato ISO',
    example: '1990-05-20',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de nascimento inválida' })
  birth_date?: string;

  // ============================================
  // CONTATOS
  // ============================================

  @ApiProperty({
    description: 'Telefone principal do cliente',
    example: '38999999999',
  })
  @IsString()
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @Matches(/^\d{10,11}$/, {
    message: 'Telefone inválido (somente números, 10 ou 11 dígitos)',
  })
  phone: string;

  @ApiPropertyOptional({
    description: 'Telefone alternativo do cliente',
    example: '38988887777',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{10,11}$/, {
    message: 'Telefone alternativo inválido',
  })
  phone_alternative?: string;

  @ApiPropertyOptional({
    description: 'Email do cliente',
    example: 'email@provedor.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  // ============================================
  // AUTENTICAÇÃO
  // ============================================

  @ApiProperty({
    description: 'Senha do cliente',
    example: 'SenhaForte123',
  })
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

  @ApiProperty({
    description: 'Confirmação de aceite dos termos e políticas',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty({ message: 'Aceite dos termos é obrigatório' })
  accept_terms: boolean;

  @ApiPropertyOptional({
    description: 'Aceite para receber promoções',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  accept_promotions?: boolean;
}
