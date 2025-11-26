// ===========================================
// DECORATOR: @RequirePermissions
// Sistema de Permissões - Pizzaria Massa Nostra
//
// Marca rotas que requerem permissões específicas
//
// Uso:
// @RequirePermissions(PermissionEnum.ORDERS_CREATE)
// @Post('create')
// create() { ... }
//
// Referência: PIZZARIA-RBAC-SYSTEM
// Data: 2025-11-26
// Desenvolvedor: @lucasitdias
// Status: ✅ IMPLEMENTADO
// ===========================================

import { SetMetadata } from '@nestjs/common';
import { PermissionEnum } from '../enums/permission.enum';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: PermissionEnum[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
