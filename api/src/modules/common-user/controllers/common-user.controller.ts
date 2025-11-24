// ============================================
// CONTROLLER: CLIENTES (ADMIN)
// ============================================
// Endpoints administrativos de clientes
// APENAS PARA ADMINISTRADORES
// Pizzaria Massa Nostra
// ============================================

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FindOneCommonUserService } from '../services/find-one-common-user.service';
import { PaginationDto } from '@/common/dtos/pagination.dto';
import { CommonUser } from '../entities/common-user.entity';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('common-user')
export class CommonUserController {
  constructor(private readonly findOneCommonUser: FindOneCommonUserService) {}

  // ============================================
  // LISTAR TODOS OS CLIENTES (ADMIN)
  // ============================================
  // Endpoint protegido por JWT (apenas administradores)
  // Retorna lista paginada de todos os clientes
  @Get('list')
  @UseGuards(JwtAuthGuard)
  async list(@Query() options: PaginationDto<CommonUser>) {
    const { commonUsers, count } = await this.findOneCommonUser.list({
      ...options,
      additionalSelects: ['created_at', 'updated_at'],
    });

    return {
      ok: true,
      commonUsers,
      count,
    };
  }
}
