// ============================================
// CONTROLLER: AVALIAÇÕES DE PEDIDOS
// ============================================

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ReviewService } from '../services/review.service';
import { CreateReviewDto } from '../dtos/create-review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // ============================================
  // CRIAR AVALIAÇÃO
  // ============================================
  @Post('order/:orderId')
  async createReview(
    @Param('orderId') orderId: string,
    @Body() dto: CreateReviewDto,
    @Query('customerId') customerId: string, // Temporário
  ) {
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
  @Get('customer/:customerId')
  async getCustomerReviews(@Param('customerId') customerId: string) {
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
  @Get('stats/average')
  async getAverageRating() {
    const stats = await this.reviewService.getAverageRating();

    return {
      ok: true,
      stats,
    };
  }
}


