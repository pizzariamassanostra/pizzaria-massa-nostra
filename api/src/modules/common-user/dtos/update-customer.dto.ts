import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
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
import { Transform } from 'class-transformer';

// Validador customizado que valida CPF com dígitos verificadores
@ValidatorConstraint({ name: 'cpf', async: false })
export class IsCPFConstraint implements ValidatorConstraintInterface {
  validate(cpf: string) {
    if (!cpf) return true;
    return validateCPF(cpf);
  }

  defaultMessage() {
    return 'CPF inválido';
  }
}

// Transforma data de DD/MM/YYYY ou ISO para formato ISO (YYYY-MM-DD)
function transformDate(value: any): string | null {
  if (!value) return null;

  // Se já está em ISO, retorna como está
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  // Converte DD/MM/YYYY para ISO (YYYY-MM-DD)
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [day, month, year] = value.split('/');
    return `${year}-${month}-${day}`;
  }

  // Tenta converter string de data genérica
  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }

  return null;
}

// DTO para atualizar dados do perfil (todos os campos opcionais)
export class UpdateCustomerDto {
  // Nome opcional com mesmas validações de registro
  @ApiPropertyOptional({
    description: 'Nome completo',
    example: 'João Silva Santos',
  })
  @IsOptional()
  @IsString({ message: 'Nome deve ser um texto' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(255, { message: 'Nome muito longo' })
  @Transform(({ value }) => value?.trim())
  name?: string;

  // CPF opcional com validação de dígitos verificadores (aceita com/sem máscara)
  @ApiPropertyOptional({
    description: 'CPF do cliente (com ou sem máscara)',
    example: '123.456.789-09 ou 12345678909',
  })
  @IsOptional()
  @IsString({ message: 'CPF deve ser um texto' })
  @Validate(IsCPFConstraint)
  @Transform(({ value }) => value?.trim())
  cpf?: string;

  // Data de nascimento opcional (aceita DD/MM/YYYY ou YYYY-MM-DD, converte para ISO)
  @ApiPropertyOptional({
    description: 'Data de nascimento (DD/MM/YYYY ou YYYY-MM-DD)',
    example: '20/05/1990',
  })
  @IsOptional()
  @Transform(({ value }) => transformDate(value))
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data deve estar no formato DD/MM/YYYY ou YYYY-MM-DD',
  })
  birth_date?: string;

  // Telefone obrigatório (10 ou 11 dígitos, remove caracteres não numéricos)
  @ApiProperty({
    description: 'Telefone principal (10 ou 11 dígitos)',
    example: '38999999999',
  })
  @IsString({ message: 'Telefone deve ser um texto' })
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @Matches(/^\d{10,11}$/, {
    message: 'Telefone inválido (somente números, 10 ou 11 dígitos)',
  })
  @Transform(({ value }) => value?.replace(/\D/g, ''))
  phone: string;

  // Telefone alternativo opcional (10 ou 11 dígitos)
  @ApiPropertyOptional({
    description: 'Telefone alternativo (10 ou 11 dígitos)',
    example: '38988887777',
  })
  @IsOptional()
  @IsString({ message: 'Telefone alternativo deve ser um texto' })
  @Matches(/^\d{10,11}$/, {
    message: 'Telefone alternativo inválido (10 ou 11 dígitos)',
  })
  @Transform(({ value }) => value?.replace(/\D/g, ''))
  phone_alternative?: string;

  // Email opcional com validação de formato (converte para lowercase)
  @ApiPropertyOptional({
    description: 'Email do cliente',
    example: 'joao@email.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email?: string;

  // Senha obrigatória com requisitos de complexidade (maiúscula, minúscula, número, 8+ caracteres)
  @ApiProperty({
    description: 'Senha (mín. 8 caracteres, com maiúscula, minúscula e número)',
    example: 'SenhaForte123',
  })
  @IsString({ message: 'Senha deve ser um texto' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @MaxLength(100, { message: 'Senha muito longa (máximo 100 caracteres)' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Senha deve conter letras maiúsculas, minúsculas e números',
  })
  password: string;

  // Aceite de termos obrigatório (requerido por LGPD)
  @ApiProperty({
    description: 'Confirmação de aceite dos termos',
    example: true,
  })
  @IsBoolean({ message: 'Aceite dos termos deve ser sim ou não' })
  @IsNotEmpty({ message: 'Aceite dos termos é obrigatório' })
  accept_terms: boolean;

  // Aceite de promoções opcional (padrão: false)
  @ApiPropertyOptional({
    description: 'Aceite para receber promoções',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Aceite de promoções deve ser sim ou não' })
  accept_promotions?: boolean;
}
