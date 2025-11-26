/**
 * ============================================
 * DTO: VERIFICAR PERMISSÃO
 * ============================================
 *
 * @module RBAC
 * @author Lucas IT Dias
 * @date 2025-11-26
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
