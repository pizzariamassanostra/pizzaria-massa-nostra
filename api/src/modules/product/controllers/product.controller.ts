// ============================================
// CONTROLLER: PRODUTOS
// ============================================
// Endpoints públicos e administrativos de produtos
// ============================================

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CrustService } from '../services/crust.service';
import { FillingService } from '../services/filling.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly crustService: CrustService,
    private readonly fillingService: FillingService,
  ) {}

  // ============================================
  // LISTAR TODOS OS PRODUTOS (PÚBLICO)
  // ============================================
  // Query params opcionais:
  // - category_id: filtrar por categoria
  // - status: filtrar por status (active/inactive)
  // - type: filtrar por tipo (pizza/bebida/sobremesa)
  // ============================================
  @Get()
  async findAll(
    @Query('category_id') categoryId?: string,
    @Query('status') status?: string,
    @Query('type') type?: string,
  ) {
    // Se tem category_id, buscar por categoria
    if (categoryId) {
      const products = await this.productService.findByCategory(
        parseInt(categoryId),
      );
      return {
        ok: true,
        products,
        total: products.length,
      };
    }

    // Senão, buscar todos (com filtros opcionais)
    const products = await this.productService.findAllWithFilters({
      status,
      type,
    });

    return {
      ok: true,
      products,
      total: products.length,
    };
  }

  // ============================================
  // BUSCAR PRODUTO POR ID (PÚBLICO)
  // ============================================
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productService.findOne(id);
    return {
      ok: true,
      product,
    };
  }

  // ============================================
  // BUSCAR POR SLUG (PÚBLICO)
  // ============================================
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const product = await this.productService.findBySlug(slug);
    return {
      ok: true,
      product,
    };
  }

  // ============================================
  // CRIAR PRODUTO (ADMIN)
  // ============================================
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateProductDto) {
    const product = await this.productService.create(dto);
    return {
      ok: true,
      message: 'Produto criado com sucesso',
      product,
    };
  }

  // ============================================
  // ATUALIZAR PRODUTO (ADMIN)
  // ============================================
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    const product = await this.productService.update(id, dto);
    return {
      ok: true,
      message: 'Produto atualizado com sucesso',
      product,
    };
  }

  // ============================================
  // DELETAR PRODUTO (ADMIN)
  // ============================================
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productService.remove(id);
    return {
      ok: true,
      message: 'Produto removido com sucesso',
    };
  }

  // ============================================
  // LISTAR VARIAÇÕES DO PRODUTO (PÚBLICO)
  // ============================================
  @Get(':id/variants')
  async getVariants(@Param('id', ParseIntPipe) id: number) {
    const variants = await this.productService.getVariants(id);
    return {
      ok: true,
      variants,
    };
  }

  // ============================================
  // LISTAR BORDAS (PÚBLICO)
  // ============================================
  @Get('pizza/crusts')
  async getCrusts() {
    const crusts = await this.crustService.findAll();
    return {
      ok: true,
      crusts,
    };
  }

  // ============================================
  // LISTAR RECHEIOS DE BORDA (PÚBLICO)
  // ============================================
  @Get('pizza/fillings')
  async getFillings() {
    const fillings = await this.fillingService.findAll();
    return {
      ok: true,
      fillings,
    };
  }
}
