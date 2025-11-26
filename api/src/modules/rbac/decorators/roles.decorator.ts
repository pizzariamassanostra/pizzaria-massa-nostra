// ===========================================
// DECORATOR: @Roles
// Sistema de Permissões - Pizzaria Massa Nostra
//
// Marca rotas que requerem roles específicos
//
// Uso:
// @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.MANAGER)
// @Get('admin-only')
// adminOnly() { ...  }
//
// Referência: PIZZARIA-RBAC-SYSTEM
// Data: 2025-11-26
// Desenvolvedor: @lucasitdias
// Status: ✅ IMPLEMENTADO
// ===========================================

import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
