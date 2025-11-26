// ===========================================
// CONTROLLER: ROLE
// Sistema de Permissões - Pizzaria Massa Nostra
//
// Endpoints para gerenciar roles
//
// Referência: PIZZARIA-RBAC-SYSTEM
// Data: 2025-11-26
// Desenvolvedor: @lucasitdias
// Status: ✅ IMPLEMENTADO
// ===========================================

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { RoleEnum } from '../enums/role.enum';
import { RoleService } from '../services/role.service';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { AssignRoleDto } from '../dtos/assign-role.dto';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * Criar role
   * Apenas SUPER_ADMIN
   */
  @Post()
  @Roles(RoleEnum.SUPER_ADMIN)
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.roleService.create(createRoleDto);
    return {
      ok: true,
      message: 'Role criado com sucesso',
      data: role,
    };
  }

  /**
   * Listar todos os roles
   */
  @Get()
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.MANAGER)
  async findAll() {
    const roles = await this.roleService.findAll();
    return {
      ok: true,
      data: roles,
    };
  }

  /**
   * Buscar role por ID
   */
  @Get(':id')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.MANAGER)
  async findOne(@Param('id') id: string) {
    const role = await this.roleService.findOne(+id);
    return {
      ok: true,
      data: role,
    };
  }

  /**
   * Atualizar role
   * Apenas SUPER_ADMIN
   */
  @Put(':id')
  @Roles(RoleEnum.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const role = await this.roleService.update(+id, updateRoleDto);
    return {
      ok: true,
      message: 'Role atualizado com sucesso',
      data: role,
    };
  }

  /**
   * Deletar role
   * Apenas SUPER_ADMIN
   */
  @Delete(':id')
  @Roles(RoleEnum.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    await this.roleService.remove(+id);
    return {
      ok: true,
      message: 'Role deletado com sucesso',
    };
  }

  /**
   * Atribuir roles a usuário
   */
  @Post('assign')
  // @Roles(RoleEnum.SUPER_ADMIN)
  async assignRoles(@Body() assignRoleDto: AssignRoleDto, @Request() req) {
    const userRoles = await this.roleService.assignRolesToUser(
      assignRoleDto,
      req.user.id,
    );

    return {
      ok: true,
      message: 'Roles atribuídos com sucesso',
      data: userRoles,
    };
  }

  /**
   * Obter roles de um usuário
   */
  @Get('user/:userId')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.MANAGER)
  async getUserRoles(@Param('userId') userId: string) {
    const roles = await this.roleService.getUserRoles(+userId);
    return {
      ok: true,
      data: roles,
    };
  }

  /**
   * Obter permissões de um usuário
   */
  @Get('user/:userId/permissions')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.MANAGER)
  async getUserPermissions(@Param('userId') userId: string) {
    const permissions = await this.roleService.getUserPermissions(+userId);
    return {
      ok: true,
      data: permissions,
    };
  }
}
