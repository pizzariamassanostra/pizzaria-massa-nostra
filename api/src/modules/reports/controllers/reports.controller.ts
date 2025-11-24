// ============================================
// CONTROLLER: RELATÓRIOS
// ============================================
// Endpoints de relatórios gerenciais
// Pizzaria Massa Nostra
// ============================================

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
import {
  ReportFilterDto,
  TopProductsFilterDto,
} from '../dtos/report-filter.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard) // ⭐ Apenas administradores
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // ============================================
  // DASHBOARD - MÉTRICAS GERAIS
  // ============================================
  @Get('dashboard')
  async getDashboard() {
    const stats = await this.reportsService.getDashboardStats();

    return {
      ok: true,
      data: stats,
    };
  }

  // ============================================
  // RELATÓRIO DE VENDAS
  // ============================================
  @Get('sales')
  async getSalesReport(@Query() filter: ReportFilterDto) {
    const report = await this.reportsService.getSalesReport(filter);

    return {
      ok: true,
      data: report,
    };
  }

  // ============================================
  // PRODUTOS MAIS VENDIDOS
  // ============================================
  @Get('top-products')
  async getTopProducts(@Query() filter: TopProductsFilterDto) {
    const report = await this.reportsService.getTopProducts(filter);

    return {
      ok: true,
      data: report,
    };
  }

  // ============================================
  // RELATÓRIO DE CLIENTES
  // ============================================
  @Get('customers')
  async getCustomerReport(@Query() filter: ReportFilterDto) {
    const report = await this.reportsService.getCustomerReport(filter);

    return {
      ok: true,
      data: report,
    };
  }

  // ============================================
  // HORÁRIOS DE PICO
  // ============================================
  @Get('peak-hours')
  async getPeakHours(@Query() filter: ReportFilterDto) {
    const report = await this.reportsService.getPeakHoursReport(filter);

    return {
      ok: true,
      data: report,
    };
  }

  // ============================================
  // EXPORTAR RELATÓRIO CSV
  // ============================================
  @Get('export/sales')
  async exportSalesCSV(@Query() filter: ReportFilterDto) {
    const csv = await this.reportsService.exportSalesCSV(filter);

    return {
      ok: true,
      filename: `vendas_${new Date().toISOString().split('T')[0]}.csv`,
      data: csv,
    };
  }
}
