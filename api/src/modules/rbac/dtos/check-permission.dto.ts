/**
 * ============================================
 * DTO: VERIFICAR PERMISSÃO
 * ============================================
 */

import { IsNotEmpty, IsString } from 'class-validator';
import { PermissionEnum } from '../enums/permission.enum';

export class CheckPermissionDto {
  /**
   * Nome da permissão a verificar
   */
  @IsNotEmpty()
  @IsString()
  permission: PermissionEnum;
}
