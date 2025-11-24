// ============================================
// CONTROLLER: CLIENTES (CUSTOMER)
// ============================================
// Endpoints públicos para registro, login e gestão de clientes
// Pizzaria Massa Nostra
// ============================================

import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { RegisterCustomerDto } from '../dtos/register-customer.dto';
import { LoginCustomerDto } from '../dtos/login-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { JwtCustomerAuthGuard } from '@/common/guards/jwt-customer-auth.guard';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // ============================================
  // REGISTRAR NOVO CLIENTE
  // ============================================
  // Endpoint público - não requer autenticação
  @Post('register')
  async register(@Body() dto: RegisterCustomerDto) {
    const user = await this.customerService.register(dto);

    return {
      ok: true,
      message: 'Cadastro realizado com sucesso!',
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        cpf: user.cpf,
        created_at: user.created_at,
      },
    };
  }

  // ============================================
  // LOGIN DE CLIENTE
  // ============================================
  // Endpoint público - não requer autenticação
  // ⭐ AGORA RETORNA TOKEN JWT
  @Post('login')
  async login(@Body() dto: LoginCustomerDto) {
    const { user, access_token } = await this.customerService.login(dto);

    return {
      ok: true,
      message: 'Login realizado com sucesso!',
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        cpf: user.cpf,
      },
      access_token, // ⭐ TOKEN JWT
    };
  }

  // ============================================
  // BUSCAR PERFIL DO CLIENTE
  // ============================================
  // ⭐ PROTEGIDO POR JWT
  @Get('profile')
  @UseGuards(JwtCustomerAuthGuard)
  async getProfile(@Request() req) {
    // ⭐ Agora pega userId do token JWT automaticamente
    const userId = req.user.id;

    const user = await this.customerService.getProfile(userId);

    return {
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        cpf: user.cpf,
        birth_date: user.birth_date,
        phone_alternative: user.phone_alternative,
        accept_promotions: user.accept_promotions,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };
  }

  // ============================================
  // ATUALIZAR PERFIL DO CLIENTE
  // ============================================
  // ⭐ PROTEGIDO POR JWT
  @Put('profile')
  @UseGuards(JwtCustomerAuthGuard)
  async updateProfile(@Request() req, @Body() dto: UpdateCustomerDto) {
    // ⭐ Agora pega userId do token JWT automaticamente
    const userId = req.user.id;

    const user = await this.customerService.updateProfile(userId, dto);

    return {
      ok: true,
      message: 'Perfil atualizado com sucesso!',
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        cpf: user.cpf,
        birth_date: user.birth_date,
        phone_alternative: user.phone_alternative,
        updated_at: user.updated_at,
      },
    };
  }

  // ============================================
  // EXCLUIR CONTA (SOFT DELETE - LGPD)
  // ============================================
  // ⭐ PROTEGIDO POR JWT
  @Delete('account')
  @UseGuards(JwtCustomerAuthGuard)
  async deleteAccount(@Request() req) {
    // ⭐ Agora pega userId do token JWT automaticamente
    const userId = req.user.id;

    await this.customerService.deleteAccount(userId);

    return {
      ok: true,
      message:
        'Conta excluída com sucesso. Seus dados foram mantidos no sistema para fins de histórico (LGPD).',
    };
  }
}
