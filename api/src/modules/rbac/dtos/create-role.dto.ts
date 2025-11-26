/**
 * ============================================
 * DTO: CRIAR ROLE
 * ============================================
 * Dados necessários para criar um novo role
 *
 * @module RBAC
 * @author Lucas IT Dias
 * @date 2025-11-26
 */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { RoleEnum } from '../enums/role.enum';
import { PermissionEnum } from '../enums/permission.enum';

export class CreateRoleDto {
  /**
   * Nome único do role
   */
  @IsNotEmpty({ message: 'Nome do role é obrigatório' })
  @IsString()
  name: RoleEnum;

  /**
   * Nome de exibição
   */
  @IsNotEmpty({ message: 'Nome de exibição é obrigatório' })
  @IsString()
  display_name: string;

  /**
   * Descrição
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Nível hierárquico (1-10)
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  level?: number;

  /**
   * Role ativo?
   */
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  /**
   * IDs das permissões
   */
  @IsOptional()
  @IsArray()
  permission_ids?: number[];
}
