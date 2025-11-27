// ============================================
// SERVIÇO: PEDIDOS
// ============================================
// Lógica de negócio para criação e gestão de pedidos
// Integrado com geração automática de comprovantes
// ============================================

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { OrderStatusHistory } from '../entities/order-status-history.entity';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';
import { ProductVariant } from '../../product/entities/product-variant.entity';
import { PizzaCrust } from '../../product/entities/pizza-crust.entity';
import { CrustFilling } from '../../product/entities/crust-filling.entity';
import { Address } from '../entities/address.entity';
import { ReceiptService } from '@/modules/receipt/services/receipt.service';

@Injectable()
export class OrderService {
  [x: string]: any;
  constructor(
    // ============================================
    // REPOSITORIES
    // ============================================
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectRepository(OrderStatusHistory)
    private readonly historyRepo: Repository<OrderStatusHistory>,

    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,

    @InjectRepository(PizzaCrust)
    private readonly crustRepo: Repository<PizzaCrust>,

    @InjectRepository(CrustFilling)
    private readonly fillingRepo: Repository<CrustFilling>,

    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,

    // ============================================
    // SERVICES
    // ============================================
    private readonly receiptService: ReceiptService,
  ) {}

  // ============================================
  // CRIAR PEDIDO COMPLETO
  // ============================================
  async create(dto: CreateOrderDto): Promise<Order> {
    const address = await this.addressRepo.findOne({
      where: { id: dto.address_id, deleted_at: null },
    });

    if (!address) {
      throw new BadRequestException(
        `Endereço #${dto.address_id} não encontrado`,
      );
    }

    if (address.common_user_id !== dto.common_user_id) {
      throw new BadRequestException(`Endereço não pertence a este cliente`);
    }

    let subtotal = 0;
    const orderItems = [];

    for (const itemDto of dto.items) {
      const variant = await this.variantRepo.findOne({
        where: { id: itemDto.variant_id },
      });

      if (!variant) {
        throw new BadRequestException(
          `Variação #${itemDto.variant_id} não encontrada`,
        );
      }

      let unitPrice = parseFloat(variant.price.toString());
      let crustPrice = 0;
      let fillingPrice = 0;

      if (itemDto.crust_id) {
        const crust = await this.crustRepo.findOne({
          where: { id: itemDto.crust_id },
        });
        if (crust) {
          crustPrice = parseFloat(crust.price_modifier.toString());
        }
      }

      if (itemDto.filling_id) {
        const filling = await this.fillingRepo.findOne({
          where: { id: itemDto.filling_id },
        });
        if (filling) {
          fillingPrice = parseFloat(filling.price.toString());
        }
      }

      const itemSubtotal =
        itemDto.quantity * (unitPrice + crustPrice + fillingPrice);

      orderItems.push({
        product_id: itemDto.product_id,
        variant_id: itemDto.variant_id,
        crust_id: itemDto.crust_id,
        filling_id: itemDto.filling_id,
        quantity: itemDto.quantity,
        unit_price: unitPrice,
        crust_price: crustPrice,
        filling_price: fillingPrice,
        subtotal: itemSubtotal,
        notes: itemDto.notes,
      });

      subtotal += itemSubtotal;
    }

    const deliveryFee = 5.0;
    const total = subtotal + deliveryFee;

    const order = this.orderRepo.create({
      common_user_id: dto.common_user_id,
      address_id: dto.address_id,
      status: 'pending',
      subtotal,
      delivery_fee: deliveryFee,
      discount: 0,
      total,
      payment_method: dto.payment_method,
      notes: dto.notes,
      estimated_time: 45,
    });

    const savedOrder = await this.orderRepo.save(order);

    const itemsToSave = orderItems.map((item) => ({
      order_id: savedOrder.id,
      ...item,
    }));

    await this.orderItemRepo.insert(itemsToSave);

    await this.historyRepo.save({
      order_id: savedOrder.id,
      status: 'pending',
      notes: 'Pedido criado pelo cliente',
    });

    return this.findOne(savedOrder.id);
  }

  // ============================================
  // BUSCAR PEDIDO POR ID (COM TODOS OS DADOS)
  // ============================================
  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id, deleted_at: null },
      relations: [
        'user',
        'address',
        'items',
        'items.product',
        'items.variant',
        'items.crust',
        'items.filling',
      ],
    });

    if (!order) {
      throw new NotFoundException(`Pedido #${id} não encontrado`);
    }

    return order;
  }

  // ============================================
  // LISTAR PEDIDOS DO CLIENTE
  // ============================================
  async findByUser(userId: number): Promise<Order[]> {
    return this.orderRepo.find({
      where: { common_user_id: userId, deleted_at: null },
      relations: ['address', 'items'],
      order: { created_at: 'DESC' },
    });
  }

  // ============================================
  // LISTAR TODOS OS PEDIDOS (ADMIN)
  // ============================================
  async findAll(): Promise<Order[]> {
    return this.orderRepo.find({
      where: { deleted_at: null },
      relations: ['user', 'address', 'items'],
      order: { created_at: 'DESC' },
    });
  }

  // ============================================
  // ATUALIZAR STATUS DO PEDIDO
  // ============================================
  async updateStatus(
    id: number,
    dto: UpdateOrderStatusDto,
    adminId?: number,
  ): Promise<Order> {
    const order = await this.findOne(id);

    if (!order) {
      throw new NotFoundException(`Pedido #${id} não encontrado`);
    }

    await this.orderRepo.update(
      { id },
      {
        status: dto.status,
        updated_at: new Date(),
      },
    );

    await this.historyRepo.save({
      order_id: id,
      status: dto.status,
      notes: dto.notes || `Status alterado para ${dto.status}`,
      created_by: adminId,
    });

    // ============================================
    // GERAR COMPROVANTE AUTOMATICAMENTE
    // ============================================
    if (dto.status === 'confirmed') {
      try {
        console.log(`Gerando comprovante para pedido #${id}...`);
        const receipt = await this.receiptService.generateReceipt(id);
        console.log(`Comprovante gerado com sucesso!`);
        console.log(`Número: ${receipt.receipt_number}`);
        console.log(`PDF URL: ${receipt.pdf_url}`);
      } catch (error) {
        console.error(`Erro ao gerar comprovante para pedido #${id}:`);
        console.error(error);
      }
    }

    return this.findOne(id);
  }

  // ============================================
  // VALIDAR TOKEN DE ENTREGA
  // ============================================
  async validateDeliveryToken(
    orderId: number,
    token: string,
  ): Promise<boolean> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Pedido #${orderId} não encontrado`);
    }

    if (order.delivery_token !== token) {
      return false;
    }

    await this.updateStatus(orderId, {
      status: 'delivered',
      notes: 'Entrega confirmada com token pelo cliente',
    });

    return true;
  }

  // ============================================
  // CANCELAR PEDIDO
  // ============================================
  async cancel(id: number, reason: string): Promise<Order> {
    return this.updateStatus(id, {
      status: 'cancelled',
      notes: reason || 'Pedido cancelado',
    });
  }
}
