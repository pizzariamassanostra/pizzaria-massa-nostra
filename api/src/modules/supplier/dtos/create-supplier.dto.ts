// ============================================
// DTO: CRIAR FORNECEDOR
// ============================================
import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsInt,
  // IsDecimal,   Verificar regra***
  IsEnum,
  Length,
  Min,
  Max,
  IsNumber,
} from 'class-validator';
import { SupplierStatus } from '../enums/supplier-status.enum';

export class CreateSupplierDto {
  @IsString()
  @Length(3, 200)
  razao_social: string;

  @IsString()
  @IsOptional()
  @Length(3, 200)
  nome_fantasia?: string;

  @IsString()
  @Length(14, 18)
  cnpj: string;

  @IsString()
  @IsOptional()
  @Length(5, 20)
  inscricao_estadual?: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(10, 20)
  telefone_principal: string;

  @IsBoolean()
  @IsOptional()
  whatsapp_disponivel?: boolean;

  @IsString()
  @IsOptional()
  @Length(10, 20)
  telefone_alternativo?: string;

  @IsString()
  @IsOptional()
  @Length(10, 255)
  site?: string;

  @IsString()
  @Length(8, 10)
  cep: string;

  @IsString()
  @Length(3, 255)
  rua: string;

  @IsString()
  @Length(1, 10)
  numero: string;

  @IsString()
  @IsOptional()
  @Length(1, 100)
  complemento?: string;

  @IsString()
  @Length(3, 100)
  bairro: string;

  @IsString()
  @Length(3, 100)
  cidade: string;

  @IsString()
  @Length(2, 2)
  estado: string;

  @IsString()
  @IsOptional()
  ponto_referencia?: string;

  @IsString()
  @IsOptional()
  @Length(3, 100)
  banco?: string;

  @IsString()
  @IsOptional()
  @Length(1, 10)
  agencia?: string;

  @IsString()
  @IsOptional()
  @Length(1, 20)
  conta?: string;

  @IsString()
  @IsOptional()
  tipo_conta?: string;

  @IsString()
  @IsOptional()
  @Length(5, 100)
  pix?: string;

  @IsString()
  @IsOptional()
  produtos_servicos?: string;

  @IsString()
  @IsOptional()
  condicoes_comerciais?: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(365)
  prazo_entrega_dias?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(365)
  prazo_pagamento_dias?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  desconto_padrao?: number;

  @IsEnum(SupplierStatus)
  @IsOptional()
  status?: SupplierStatus;

  @IsString()
  @IsOptional()
  observacoes?: string;

  @IsString()
  @IsOptional()
  observacoes_internas?: string;
}
