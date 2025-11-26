// ===========================================
// MODULE: RBAC
// Sistema de Permissões - Pizzaria Massa Nostra
//
// Módulo de controle de acesso baseado em roles
//
// Referência: PIZZARIA-RBAC-SYSTEM
// Data: 2025-11-26
// Desenvolvedor: @lucasitdias
// Status: ✅ IMPLEMENTADO
// ===========================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { UserRole } from './entities/user-role.entity';
import { RoleService } from './services/role.service';
import { PermissionService } from './services/permission.service';
import { RoleController } from './controllers/role.controller';
import { PermissionController } from './controllers/permission.controller';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, UserRole])],
  controllers: [RoleController, PermissionController],
  providers: [RoleService, PermissionService, RolesGuard, PermissionsGuard],
  exports: [RoleService, PermissionService, RolesGuard, PermissionsGuard],
})
export class RbacModule {}
