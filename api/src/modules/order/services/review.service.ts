// ============================================
// SERVIÇO: AVALIAÇÕES DE PEDIDOS
// ============================================
// Lógica de negócio para avaliações de pedidos
// Permite clientes avaliarem pedidos entregues
// ============================================

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderReview } from '../entities/review.entity';
import { Order } from '../entities/order.entity';
import { CreateReviewDto } from '../dtos/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(OrderReview)
    private readonly reviewRepository: Repository<OrderReview>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // ============================================
  // CRIAR AVALIAÇÃO
  // ============================================
  /**
   * Cria uma avaliação para um pedido
   *
   * REGRAS DE NEGÓCIO:
   * - Pedido deve existir
   * - Pedido deve pertencer ao cliente
   * - Pedido deve estar com status "delivered"
   * - Cliente não pode avaliar o mesmo pedido duas vezes
   *
   * @param orderId - ID do pedido
   * @param customerId - ID do cliente logado
   * @param dto - Dados da avaliação
   * @returns Avaliação criada
   */
  async createReview(
    orderId: number,
    customerId: number,
    dto: CreateReviewDto,
  ): Promise<OrderReview> {
    // ============================================
    // VALIDAÇÃO 1: Pedido existe?
    // ============================================
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user'], // Carregar relação com usuário
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    // ============================================
    // VALIDAÇÃO 2: Pedido pertence ao cliente?  (CORRIGIDO)
    // ============================================
    // Verificar se o pedido pertence ao cliente logado
    if (order.common_user_id !== customerId) {
      throw new BadRequestException(
        `Este pedido não pertence a você.  Pedido pertence ao usuário ${order.common_user_id}, você é ${customerId}`,
      );
    }

    // ============================================
    // VALIDAÇÃO 3: Pedido foi entregue?
    // ============================================
    if (order.status !== 'delivered') {
      throw new BadRequestException(
        `Só é possível avaliar pedidos entregues. Status atual: ${order.status}`,
      );
    }

    // ============================================
    // VALIDAÇÃO 4: Já existe avaliação?
    // ============================================
    const existingReview = await this.reviewRepository.findOne({
      where: { order_id: orderId, customer_id: customerId },
    });

    if (existingReview) {
      throw new BadRequestException('Você já avaliou este pedido');
    }

    // ============================================
    // CRIAR AVALIAÇÃO
    // ============================================
    const review = this.reviewRepository.create({
      order_id: orderId,
      customer_id: customerId,
      overall_rating: dto.overall_rating,
      food_quality: dto.food_quality || dto.overall_rating,
      delivery_time: dto.delivery_time || dto.overall_rating,
      packaging: dto.packaging || dto.overall_rating,
      comment: dto.comment,
    });

    return this.reviewRepository.save(review);
  }

  // ============================================
  // BUSCAR AVALIAÇÃO DO PEDIDO
  // ============================================
  /**
   * Busca a avaliação de um pedido específico
   *
   * @param orderId - ID do pedido
   * @returns Avaliação encontrada
   * @throws NotFoundException se não houver avaliação
   */
  async getReviewByOrder(orderId: number): Promise<OrderReview> {
    const review = await this.reviewRepository.findOne({
      where: { order_id: orderId },
      relations: ['customer'],
    });

    if (!review) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    return review;
  }

  // ============================================
  // LISTAR AVALIAÇÕES DO CLIENTE
  // ============================================
  /**
   * Lista todas as avaliações feitas por um cliente
   *
   * @param customerId - ID do cliente
   * @returns Lista de avaliações do cliente
   */
  async getCustomerReviews(customerId: number): Promise<OrderReview[]> {
    return this.reviewRepository.find({
      where: { customer_id: customerId },
      relations: ['order'],
      order: { created_at: 'DESC' },
    });
  }

  // ============================================
  // LISTAR TODAS AS AVALIAÇÕES (ADMIN)
  // ============================================
  /**
   * Lista todas as avaliações com paginação
   * Endpoint protegido para administradores
   *
   * @param page - Página atual (padrão: 1)
   * @param limit - Itens por página (padrão: 20)
   * @returns Lista paginada de avaliações
   */
  async getAllReviews(
    page: number = 1,
    limit: number = 20,
  ): Promise<{ reviews: OrderReview[]; total: number }> {
    const [reviews, total] = await this.reviewRepository.findAndCount({
      relations: ['customer', 'order'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { reviews, total };
  }

  // ============================================
  // MÉDIA DE AVALIAÇÕES (ESTATÍSTICAS)
  // ============================================
  /**
   * Calcula a média geral de todas as avaliações
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
  async getAverageRating(): Promise<{
    overall: number;
    food_quality: number;
    delivery_time: number;
    packaging: number;
    total_reviews: number;
  }> {
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.overall_rating)', 'overall')
      .addSelect('AVG(review.food_quality)', 'food_quality')
      .addSelect('AVG(review.delivery_time)', 'delivery_time')
      .addSelect('AVG(review.packaging)', 'packaging')
      .addSelect('COUNT(review.id)', 'total_reviews')
      .getRawOne();

    return {
      overall: parseFloat(result.overall) || 0,
      food_quality: parseFloat(result.food_quality) || 0,
      delivery_time: parseFloat(result.delivery_time) || 0,
      packaging: parseFloat(result.packaging) || 0,
      total_reviews: parseInt(result.total_reviews) || 0,
    };
  }
}
