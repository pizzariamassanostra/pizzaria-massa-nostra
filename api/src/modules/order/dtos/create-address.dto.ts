// ============================================
// DTO: CRIAR ENDEREÇO
// ============================================

import { IsString, IsOptional, IsBoolean, Length, Matches } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  street: string;

  @IsString()
  number: string;

  @IsOptional()
  @IsString()
  complement?: string;

  @IsString()
  neighborhood: string;

  @IsString()
  city: string;

  @IsString()
  @Length(2, 2)
  state: string; // UF (ex: MG, SP)

  @IsString()
  @Matches(/^\d{5}-?\d{3}$/)
  zip_code: string; // CEP (xxxxx-xxx ou xxxxxxxx)

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}


