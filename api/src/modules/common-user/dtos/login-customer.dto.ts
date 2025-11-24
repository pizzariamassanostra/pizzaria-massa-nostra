// ============================================
// DTO: LOGIN DE CLIENTE
// ============================================

import { IsString, IsNotEmpty } from 'class-validator';

export class LoginCustomerDto {
  @IsString()
  @IsNotEmpty({ message: 'Email ou telefone é obrigatório' })
  username: string; // Pode ser email ou telefone

  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password: string;
}


