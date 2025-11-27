// ============================================
// CONTROLLER: AVALIAÇÕES DE PEDIDOS
// ============================================
// Endpoints para gerenciar avaliações de pedidos
// Clientes podem avaliar pedidos entregues
// ============================================

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReviewService } from '../services/review.service';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { JwtCustomerAuthGuard } from '../../../common/guards/jwt-customer-auth.guard';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // ============================================
  // CRIAR AVALIAÇÃO
  // ============================================
  /**
   * Endpoint para cliente criar avaliação
   *
   * AUTENTICAÇÃO:
   * - Requer token JWT de CLIENTE
   * - O ID do cliente é extraído automaticamente do token
   *
   * VALIDAÇÕES:
   * - Pedido deve existir
   * - Pedido deve pertencer ao cliente logado
   * - Pedido deve estar com status "delivered"
   * - Não pode avaliar o mesmo pedido duas vezes
   *
   * @param orderId - ID do pedido a ser avaliado
   * @param dto - Dados da avaliação (notas + comentário)
   * @param req - Request com dados do usuário logado (JWT)
   * @returns Avaliação criada
   */
  @Post('order/:orderId')
  @UseGuards(JwtCustomerAuthGuard)
  async createReview(
    @Param('orderId') orderId: string,
    @Body() dto: CreateReviewDto,
    @Request() req,
  ) {
    // Extrair ID do cliente do token JWT
    const customerId = req.user.id;

    console.log('=== CRIAR AVALIAÇÃO ===');
    console.log('Order ID:', orderId);
    console.log('Customer ID (do JWT):', customerId);
    console.log('Dados da avaliação:', dto);

    const review = await this.reviewService.createReview(
      Number(orderId),
      Number(customerId),
      dto,
    );

    return {
      ok: true,
      message: 'Avaliação registrada com sucesso!',
      review,
    };
  }

  // ============================================
  // BUSCAR AVALIAÇÃO DO PEDIDO
  // ============================================
  /**
   * Busca a avaliação de um pedido específico
   *
   * PÚBLICO: Não requer autenticação
   *
   * @param orderId - ID do pedido
   * @returns Avaliação do pedido
   */
  @Get('order/:orderId')
  async getReviewByOrder(@Param('orderId') orderId: string) {
    const review = await this.reviewService.getReviewByOrder(Number(orderId));

    return {
      ok: true,
      review,
    };
  }

  // ============================================
  // LISTAR AVALIAÇÕES DO CLIENTE
  // ============================================
  /**
   * Lista todas as avaliações de um cliente
   *
   * PROTEGIDO: Requer autenticação de cliente
   * Cliente só pode ver suas próprias avaliações
   *
   * @param customerId - ID do cliente
   * @param req - Request com dados do usuário logado
   * @returns Lista de avaliações do cliente
   */
  @Get('customer/:customerId')
  @UseGuards(JwtCustomerAuthGuard)
  async getCustomerReviews(
    @Param('customerId') customerId: string,
    @Request() req,
  ) {
    // Validar se está consultando suas próprias avaliações
    const loggedCustomerId = req.user.id;

    if (Number(customerId) !== loggedCustomerId) {
      throw new Error('Você só pode ver suas próprias avaliações');
    }

    const reviews = await this.reviewService.getCustomerReviews(
      Number(customerId),
    );

    return {
      ok: true,
      reviews,
    };
  }

  // ============================================
  // LISTAR TODAS (ADMIN)
  // ============================================
  /**
   * Lista todas as avaliações (paginado)
   *
   * PÚBLICO: Qualquer pessoa pode ver as avaliações
   * (pode adicionar @UseGuards para restringir a admin se necessário)
   *
   * @param page - Página atual (padrão: 1)
   * @param limit - Itens por página (padrão: 20)
   * @returns Lista paginada de avaliações
   */
  @Get()
  async getAllReviews(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const { reviews, total } = await this.reviewService.getAllReviews(
      Number(page),
      Number(limit),
    );

    return {
      ok: true,
      reviews,
      total,
      page: Number(page),
      limit: Number(limit),
    };
  }

  // ============================================
  // MÉDIA DE AVALIAÇÕES (ESTATÍSTICAS)
  // ============================================
  /**
   * Retorna estatísticas gerais de avaliações
   *
   * PÚBLICO: Qualquer pessoa pode ver
   *
   * Retorna:
   * - Média de nota geral
   * - Média de qualidade da comida
   * - Média de tempo de entrega
   * - Média de embalagem
   * - Total de avaliações
   *
   * @returns Estatísticas de avaliações
   */
  @Get('stats/average')
  async getAverageRating() {
    const stats = await this.reviewService.getAverageRating();

    return {
      ok: true,
      stats,
    };
  }
}
