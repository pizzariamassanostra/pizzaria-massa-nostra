/**
 * ============================================
 * DTO: ATUALIZAR ROLE
 * ============================================
 *
 * @module RBAC
 * @author Lucas IT Dias
 * @date 2025-11-26
 */

import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
