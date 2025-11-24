// ============================================
// DTO: ATUALIZAR CLIENTE
// ============================================
// Dados opcionais para atualização de perfil
// Pizzaria Massa Nostra
// ============================================

import {
  IsEmail,
  IsOptional,
  IsString,
  IsDateString,
  MinLength,
} from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsDateString()
  birth_date?: string;

  @IsOptional()
  @IsString()
  phone_alternative?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  new_password?: string;
}
