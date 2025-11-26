/**
 * ============================================
 * DTO: ATRIBUIR ROLE A USUÁRIO
 * ============================================
 */

import { IsNotEmpty, IsInt, IsArray, ArrayMinSize } from 'class-validator';

export class AssignRoleDto {
  /**
   * ID do usuário
   */
  @IsNotEmpty({ message: 'ID do usuário é obrigatório' })
  @IsInt()
  user_id: number;

  /**
   * IDs dos roles a serem atribuídos
   */
  @IsNotEmpty({ message: 'Pelo menos um role deve ser informado' })
  @IsArray()
  @ArrayMinSize(1)
  role_ids: number[];
}
