// ============================================
// SERVICE: PRODUTOS
// ============================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

@Injectable()
export class ProductService {
  findAll: any;
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
  ) {}

  // ============================================
  // LISTAR PRODUTOS POR CATEGORIA
  // ============================================
  async findByCategory(categoryId: number): Promise<Product[]> {
    return this.productRepo.find({
      where: {
        category_id: categoryId,
        status: 'active',
        deleted_at: null,
      },
      relations: ['variants', 'category'],
      order: { sort_order: 'ASC', name: 'ASC' },
    });
  }

  // ============================================
  // BUSCAR PRODUTO POR ID (COM VARIAÇÕES)
  // ============================================
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id, deleted_at: null },
      relations: ['variants', 'category'],
    });

    if (!product) {
      throw new NotFoundException(`Produto #${id} não encontrado`);
    }

    return product;
  }

  // ============================================
  // BUSCAR POR SLUG
  // ============================================
  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { slug, deleted_at: null },
      relations: ['variants', 'category'],
    });

    if (!product) {
      throw new NotFoundException(`Produto "${slug}" não encontrado`);
    }

    return product;
  }

  // ============================================
  // CRIAR PRODUTO (COM VARIAÇÕES)
  // ============================================
  async create(dto: CreateProductDto): Promise<Product> {
    // Criar produto base
    const product = this.productRepo.create({
      category_id: dto.category_id,
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      image_url: dto.image_url,
      type: dto.type,
      status: dto.status || 'active',
      sort_order: dto.sort_order || 0,
    });

    const savedProduct = await this.productRepo.save(product);

    // Criar variações (se houver)
    if (dto.variants && dto.variants.length > 0) {
      const variants = dto.variants.map((v, index) =>
        this.variantRepo.create({
          product_id: savedProduct.id,
          size: v.size,
          label: v.label,
          price: v.price,
          servings: v.servings,
          sort_order: index,
          status: 'active',
        }),
      );

      await this.variantRepo.save(variants);
    }

    // Retornar produto completo
    return this.findOne(savedProduct.id);
  }

  // ============================================
  // ATUALIZAR PRODUTO
  // ============================================
  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    await this.productRepo.save(product);
    return this.findOne(id);
  }

  // ============================================
  // DELETAR PRODUTO (SOFT DELETE)
  // ============================================
  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.productRepo.softDelete(id);
  }

  // ============================================
  // LISTAR TODAS AS VARIAÇÕES DE UM PRODUTO
  // ============================================
  async getVariants(productId: number): Promise<ProductVariant[]> {
    return this.variantRepo.find({
      where: { product_id: productId, deleted_at: null },
      order: { sort_order: 'ASC' },
    });
  }
  // ============================================
  // BUSCAR TODOS COM FILTROS OPCIONAIS
  // ============================================
  async findAllWithFilters(filters: {
    status?: string;
    type?: string;
  }): Promise<Product[]> {
    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.deleted_at IS NULL');

    // Filtro de status
    if (filters.status) {
      queryBuilder.andWhere('product.status = :status', {
        status: filters.status,
      });
    }

    // Filtro de tipo
    if (filters.type) {
      queryBuilder.andWhere('product.type = :type', { type: filters.type });
    }

    // Ordenar por categoria e ordem
    queryBuilder.orderBy('category.sort_order', 'ASC');
    queryBuilder.addOrderBy('product.sort_order', 'ASC');

    return await queryBuilder.getMany();
  }
}
