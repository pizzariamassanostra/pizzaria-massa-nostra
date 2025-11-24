// ============================================
// SERVICE: RELATÓRIOS
// ============================================
// Lógica de negócio para geração de relatórios
// Pizzaria Massa Nostra
// ============================================

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { Order } from '@/modules/order/entities/order.entity';
import { OrderItem } from '@/modules/order/entities/order-item.entity';
import { CommonUser } from '@/modules/common-user/entities/common-user.entity';
import {
  SalesReport,
  TopProductsReport,
  DashboardStats,
  CustomerReport,
  PeakHoursReport,
} from '../interfaces/report-interfaces';
import {
  ReportFilterDto,
  TopProductsFilterDto,
} from '../dtos/report-filter.dto';

@Injectable()
export class ReportsService {
  // ============================================
  // CONSTRUCTOR
  // ============================================
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectRepository(CommonUser)
    private readonly userRepo: Repository<CommonUser>,
  ) {}

  // ============================================
  // CALCULAR DATAS DO PERÍODO
  // ============================================
  private getDateRange(filter: ReportFilterDto): {
    start_date: Date;
    end_date: Date;
  } {
    const now = new Date();
    let start_date: Date;
    let end_date: Date = now;

    if (filter.period === 'today') {
      start_date = new Date(now.setHours(0, 0, 0, 0));
      end_date = new Date(now.setHours(23, 59, 59, 999));
    } else if (filter.period === 'week') {
      start_date = new Date(now.setDate(now.getDate() - 7));
    } else if (filter.period === 'month') {
      start_date = new Date(now.setMonth(now.getMonth() - 1));
    } else if (filter.period === 'year') {
      start_date = new Date(now.setFullYear(now.getFullYear() - 1));
    } else if (filter.start_date && filter.end_date) {
      start_date = new Date(filter.start_date);
      end_date = new Date(filter.end_date);
    } else {
      // Padrão: últimos 30 dias
      start_date = new Date(now.setDate(now.getDate() - 30));
      end_date = new Date();
    }

    return { start_date, end_date };
  }

  // ============================================
  // RELATÓRIO DE VENDAS
  // ============================================
  async getSalesReport(filter: ReportFilterDto): Promise<SalesReport> {
    const { start_date, end_date } = this.getDateRange(filter);

    // Buscar pedidos do período
    const queryBuilder = this.orderRepo
      .createQueryBuilder('order')
      .where('order.created_at BETWEEN :start AND :end', {
        start: start_date,
        end: end_date,
      })
      .andWhere('order.deleted_at IS NULL');

    if (filter.status && filter.status !== 'all') {
      queryBuilder.andWhere('order.status = :status', {
        status: filter.status,
      });
    }

    const orders = await queryBuilder.getMany();

    // Calcular totais
    const total_orders = orders.length;
    const total_revenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + parseFloat(o.total.toString()), 0);

    const cancelled_orders = orders.filter(
      (o) => o.status === 'cancelled',
    ).length;
    const cancelled_revenue = orders
      .filter((o) => o.status === 'cancelled')
      .reduce((sum, o) => sum + parseFloat(o.total.toString()), 0);

    const average_ticket = total_orders > 0 ? total_revenue / total_orders : 0;

    // Buscar itens vendidos
    const items = await this.orderItemRepo
      .createQueryBuilder('item')
      .leftJoin('item.order', 'order')
      .where('order.created_at BETWEEN :start AND :end', {
        start: start_date,
        end: end_date,
      })
      .andWhere('order.status != :status', { status: 'cancelled' })
      .getMany();

    const total_items_sold = items.reduce((sum, i) => sum + i.quantity, 0);

    // Agrupar por forma de pagamento
    const by_payment_method = orders.reduce((acc, order) => {
      if (order.status === 'cancelled') return acc;

      const existing = acc.find((i) => i.method === order.payment_method);
      const total = parseFloat(order.total.toString());

      if (existing) {
        existing.count++;
        existing.total += total;
      } else {
        acc.push({
          method: order.payment_method,
          count: 1,
          total,
          percentage: 0,
        });
      }

      return acc;
    }, []);

    // Calcular percentuais
    by_payment_method.forEach((item) => {
      item.percentage = (item.total / total_revenue) * 100;
    });

    // Agrupar por status
    const by_status = orders.reduce((acc, order) => {
      const existing = acc.find((i) => i.status === order.status);
      const total = parseFloat(order.total.toString());

      if (existing) {
        existing.count++;
        existing.total += total;
      } else {
        acc.push({
          status: order.status,
          count: 1,
          total,
        });
      }

      return acc;
    }, []);

    // Quebra diária
    const daily_breakdown = [];
    const dateMap = new Map();

    orders.forEach((order) => {
      if (order.status === 'cancelled') return;

      const date = order.created_at.toISOString().split('T')[0];
      const total = parseFloat(order.total.toString());

      if (dateMap.has(date)) {
        const day = dateMap.get(date);
        day.orders++;
        day.revenue += total;
      } else {
        dateMap.set(date, { date, orders: 1, revenue: total });
      }
    });

    dateMap.forEach((value) => daily_breakdown.push(value));
    daily_breakdown.sort((a, b) => a.date.localeCompare(b.date));

    return {
      period: {
        start_date: start_date.toISOString(),
        end_date: end_date.toISOString(),
      },
      summary: {
        total_orders,
        total_revenue,
        total_items_sold,
        average_ticket,
        cancelled_orders,
        cancelled_revenue,
      },
      by_payment_method,
      by_status,
      daily_breakdown,
    };
  }

  // ============================================
  // PRODUTOS MAIS VENDIDOS
  // ============================================
  async getTopProducts(
    filter: TopProductsFilterDto,
  ): Promise<TopProductsReport> {
    const { start_date, end_date } = this.getDateRange(filter);
    const limit = filter.limit || 10;

    const items = await this.orderItemRepo
      .createQueryBuilder('item')
      .leftJoin('item.order', 'order')
      .leftJoin('item.product', 'product')
      .leftJoin('product.category', 'category')
      .select('product.id', 'product_id')
      .addSelect('product.name', 'product_name')
      .addSelect('category.name', 'category')
      .addSelect('SUM(item.quantity)', 'quantity_sold')
      .addSelect('SUM(item.subtotal)', 'total_revenue')
      .addSelect('AVG(item.unit_price)', 'average_price')
      .where('order.created_at BETWEEN :start AND :end', {
        start: start_date,
        end: end_date,
      })
      .andWhere('order.status != :status', { status: 'cancelled' })
      .groupBy('product.id')
      .addGroupBy('product.name')
      .addGroupBy('category.name')
      .orderBy('quantity_sold', 'DESC')
      .limit(limit)
      .getRawMany();

    const total_revenue = items.reduce(
      (sum, i) => sum + parseFloat(i.total_revenue),
      0,
    );

    const products = items.map((item) => ({
      product_id: item.product_id,
      product_name: item.product_name,
      category: item.category || 'Sem categoria',
      quantity_sold: parseInt(item.quantity_sold),
      total_revenue: parseFloat(item.total_revenue),
      percentage_of_sales:
        (parseFloat(item.total_revenue) / total_revenue) * 100,
      average_price: parseFloat(item.average_price),
    }));

    return {
      period: {
        start_date: start_date.toISOString(),
        end_date: end_date.toISOString(),
      },
      products,
    };
  }

  // ============================================
  // DASHBOARD - MÉTRICAS GERAIS
  // ============================================
  async getDashboardStats(): Promise<DashboardStats> {
    const now = new Date();
    const today_start = new Date(now.setHours(0, 0, 0, 0));
    const week_start = new Date(now.setDate(now.getDate() - 7));
    const month_start = new Date(now.setMonth(now.getMonth() - 1));

    // Hoje
    const today_orders = await this.orderRepo.count({
      where: {
        created_at: MoreThanOrEqual(today_start),
        deleted_at: null,
      },
    });

    const today_revenue_data = await this.orderRepo
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where('order.created_at >= :start', { start: today_start })
      .andWhere('order.status != :status', { status: 'cancelled' })
      .getRawOne();

    const today_revenue = parseFloat(today_revenue_data?.total || '0');
    const today_average_ticket =
      today_orders > 0 ? today_revenue / today_orders : 0;

    // Semana
    const week_orders = await this.orderRepo.count({
      where: {
        created_at: MoreThanOrEqual(week_start),
        deleted_at: null,
      },
    });

    const week_revenue_data = await this.orderRepo
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where('order.created_at >= :start', { start: week_start })
      .andWhere('order.status != :status', { status: 'cancelled' })
      .getRawOne();

    const week_revenue = parseFloat(week_revenue_data?.total || '0');
    const week_average_ticket =
      week_orders > 0 ? week_revenue / week_orders : 0;

    // Mês
    const month_orders = await this.orderRepo.count({
      where: {
        created_at: MoreThanOrEqual(month_start),
        deleted_at: null,
      },
    });

    const month_revenue_data = await this.orderRepo
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where('order.created_at >= :start', { start: month_start })
      .andWhere('order.status != :status', { status: 'cancelled' })
      .getRawOne();

    const month_revenue = parseFloat(month_revenue_data?.total || '0');
    const month_average_ticket =
      month_orders > 0 ? month_revenue / month_orders : 0;

    // Top produtos (semana)
    const top_products_data = await this.orderItemRepo
      .createQueryBuilder('item')
      .leftJoin('item.order', 'order')
      .leftJoin('item.product', 'product')
      .select('product.name', 'name')
      .addSelect('SUM(item.quantity)', 'quantity')
      .where('order.created_at >= :start', { start: week_start })
      .groupBy('product.name')
      .orderBy('quantity', 'DESC')
      .limit(5)
      .getRawMany();

    const top_products = top_products_data.map((p) => ({
      name: p.name,
      quantity: parseInt(p.quantity),
    }));

    // Pedidos recentes
    const recent_orders = await this.orderRepo.find({
      relations: ['user'],
      order: { created_at: 'DESC' },
      take: 10,
    });

    return {
      today: {
        orders: today_orders,
        revenue: today_revenue,
        average_ticket: today_average_ticket,
      },
      week: {
        orders: week_orders,
        revenue: week_revenue,
        average_ticket: week_average_ticket,
        growth_percentage: 0,
      },
      month: {
        orders: month_orders,
        revenue: month_revenue,
        average_ticket: month_average_ticket,
        growth_percentage: 0,
      },
      top_products,
      recent_orders: recent_orders.map((o) => ({
        id: o.id,
        customer_name: o.user?.name || 'Cliente',
        total: parseFloat(o.total.toString()),
        status: o.status,
        created_at: o.created_at,
      })),
    };
  }

  // ============================================
  // RELATÓRIO DE CLIENTES
  // ============================================
  async getCustomerReport(filter: ReportFilterDto): Promise<CustomerReport> {
    const { start_date, end_date } = this.getDateRange(filter);

    // Total de clientes
    const total_customers = await this.userRepo.count({
      where: { deleted_at: null },
    });

    // Novos clientes no período
    const new_customers = await this.userRepo.count({
      where: {
        created_at: Between(start_date, end_date),
        deleted_at: null,
      },
    });

    // Clientes ativos (fizeram pedido no período)
    const active_customers_data = await this.orderRepo
      .createQueryBuilder('order')
      .select('DISTINCT order.common_user_id')
      .where('order.created_at BETWEEN :start AND :end', {
        start: start_date,
        end: end_date,
      })
      .andWhere('order.status != :status', { status: 'cancelled' })
      .getRawMany();

    const active_customers = active_customers_data.length;

    // Total de pedidos no período
    const total_orders = await this.orderRepo.count({
      where: {
        created_at: Between(start_date, end_date),
        deleted_at: null,
      },
    });

    // Top clientes
    const top_customers_data = await this.orderRepo
      .createQueryBuilder('order')
      .leftJoin('order.user', 'user')
      .select('user.id', 'customer_id')
      .addSelect('user.name', 'customer_name')
      .addSelect('COUNT(order.id)', 'total_orders')
      .addSelect('SUM(order.total)', 'total_spent')
      .addSelect('AVG(order.total)', 'average_ticket')
      .addSelect('MAX(order.created_at)', 'last_order_date')
      .where('order.created_at BETWEEN :start AND :end', {
        start: start_date,
        end: end_date,
      })
      .andWhere('order.status != :status', { status: 'cancelled' })
      .groupBy('user.id')
      .addGroupBy('user.name')
      .orderBy('total_spent', 'DESC')
      .limit(20)
      .getRawMany();

    const top_customers = top_customers_data.map((c) => ({
      customer_id: c.customer_id,
      customer_name: c.customer_name,
      total_orders: parseInt(c.total_orders),
      total_spent: parseFloat(c.total_spent),
      average_ticket: parseFloat(c.average_ticket),
      last_order_date: new Date(c.last_order_date),
    }));

    return {
      period: {
        start_date: start_date.toISOString(),
        end_date: end_date.toISOString(),
      },
      summary: {
        total_customers,
        new_customers,
        active_customers,
        total_orders,
      },
      top_customers,
    };
  }

  // ============================================
  // HORÁRIOS DE PICO
  // ============================================
  async getPeakHoursReport(filter: ReportFilterDto): Promise<PeakHoursReport> {
    const { start_date, end_date } = this.getDateRange(filter);

    // Agrupar por hora
    const by_hour_data = await this.orderRepo
      .createQueryBuilder('order')
      .select('EXTRACT(HOUR FROM order.created_at)', 'hour')
      .addSelect('COUNT(order.id)', 'orders')
      .addSelect('SUM(order.total)', 'revenue')
      .where('order.created_at BETWEEN :start AND :end', {
        start: start_date,
        end: end_date,
      })
      .andWhere('order.status != :status', { status: 'cancelled' })
      .groupBy('hour')
      .orderBy('hour', 'ASC')
      .getRawMany();

    const by_hour = by_hour_data.map((h) => ({
      hour: parseInt(h.hour),
      orders: parseInt(h.orders),
      revenue: parseFloat(h.revenue),
    }));

    // Agrupar por dia da semana
    const by_day_data = await this.orderRepo
      .createQueryBuilder('order')
      .select("TO_CHAR(order.created_at, 'Day')", 'day')
      .addSelect('COUNT(order.id)', 'orders')
      .addSelect('SUM(order.total)', 'revenue')
      .where('order.created_at BETWEEN :start AND :end', {
        start: start_date,
        end: end_date,
      })
      .andWhere('order.status != :status', { status: 'cancelled' })
      .groupBy('day')
      .getRawMany();

    const by_day_of_week = by_day_data.map((d) => ({
      day: d.day.trim(),
      orders: parseInt(d.orders),
      revenue: parseFloat(d.revenue),
    }));

    return {
      by_hour,
      by_day_of_week,
    };
  }

  // ============================================
  // EXPORTAR VENDAS EM CSV
  // ============================================
  async exportSalesCSV(filter: ReportFilterDto): Promise<string> {
    const { start_date, end_date } = this.getDateRange(filter);

    const orders = await this.orderRepo
      .createQueryBuilder('order')
      .leftJoin('order.user', 'user')
      .select([
        'order.id',
        'order.created_at',
        'user.name',
        'order.total',
        'order.status',
        'order.payment_method',
      ])
      .where('order.created_at BETWEEN :start AND :end', {
        start: start_date,
        end: end_date,
      })
      .orderBy('order.created_at', 'DESC')
      .getMany();

    // Criar cabeçalho CSV
    let csv = 'ID,Data,Cliente,Total,Status,Pagamento\n';

    // Adicionar linhas
    orders.forEach((order) => {
      const date = order.created_at.toISOString().split('T')[0];
      const customer = order.user?.name || 'Cliente';
      const total = parseFloat(order.total.toString()).toFixed(2);

      csv += `${order.id},"${date}","${customer}",${total},${order.status},${order.payment_method}\n`;
    });

    return csv;
  }
}
